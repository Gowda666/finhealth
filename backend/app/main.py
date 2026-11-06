import os
import uuid
from typing import Dict, Any
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .models.schemas import AnalysisResponse, Transaction
from .parsers.csv_parser import parse_csv_stream
from .parsers.excel_parser import parse_excel_stream
from .parsers.pdf_parser import parse_pdf_stream
from .services.categorizer import categorizer
from .services.anomaly import detect_anomalies
from .services.analytics import compute_analytics
from .services.scoring import compute_financial_health_score
from .services.recommender import generate_recommendations
from .services.sample_generator import generate_sample_statement_df
from .utils.privacy import mask_sensitive_text

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _process_statement_df(clean_df, currency: str, filename: str, account_masked: str = None) -> Dict[str, Any]:
    """Execute the complete analytics, categorization, scoring, and recommendation pipeline on DataFrame."""
    # 1. Mask sensitive PII in descriptions & auto-categorize
    categories = []
    sanitized_descriptions = []
    for _, row in clean_df.iterrows():
        raw_desc = str(row["description"])
        sanitized = mask_sensitive_text(raw_desc)
        sanitized_descriptions.append(sanitized)
        cat = categorizer.categorize(sanitized, float(row["debit"]), float(row["credit"]))
        categories.append(cat)

    clean_df["raw_description"] = clean_df["description"]
    clean_df["description"] = sanitized_descriptions
    clean_df["category"] = categories

    # 2. Detect anomalies
    clean_df, anomalies = detect_anomalies(clean_df, currency=currency)

    # 3. Compute aggregations and metrics
    analytics_data = compute_analytics(clean_df, currency=currency)
    summary = analytics_data["summary"]

    # 4. Financial Health Score (0-100)
    health_score = compute_financial_health_score(summary, clean_df)

    # 5. Personalized Recommendations
    recommendations = generate_recommendations(
        summary=summary,
        categories=analytics_data["categories"],
        monthly_trends=analytics_data["monthly_trends"],
        recurring=analytics_data["recurring_payments"],
        df=clean_df,
        currency=currency
    )

    # 6. Format transaction list for response (latest first)
    transaction_records = []
    for idx, row in clean_df.iloc[::-1].iterrows():
        transaction_records.append({
            "id": f"txn-{idx}",
            "date": str(row["date_str"]),
            "description": str(row["description"]),
            "raw_description": str(row["raw_description"]),
            "category": str(row["category"]),
            "debit": float(row["debit"]),
            "credit": float(row["credit"]),
            "balance": float(row["balance"]),
            "is_anomaly": bool(row["is_anomaly"]),
            "anomaly_reason": row["anomaly_reason"]
        })

    return {
        "status": "success",
        "filename": filename,
        "account_number_masked": account_masked or "XXXX-XXXX-8921",
        "currency": currency,
        "summary": summary,
        "health_score": health_score,
        "monthly_trends": analytics_data["monthly_trends"],
        "categories": analytics_data["categories"],
        "merchants": analytics_data["merchants"],
        "recurring_payments": analytics_data["recurring_payments"],
        "anomalies": anomalies,
        "recommendations": recommendations,
        "transactions": transaction_records
    }

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Liveness probe for deployment."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "privacy": "Zero persistent storage: strictly in-memory processing"
    }

@app.post("/api/upload", response_model=AnalysisResponse, tags=["Analysis"])
async def upload_statement(file: UploadFile = File(...)):
    """
    Accept PDF, CSV, or Excel bank statement.
    Parse entirely in memory, mask PII, compute financial health score, and return analytics.
    Uploaded files are never saved to disk or persistent storage.
    """
    # 1. Validate file extension
    ext = os.path.splitext(file.filename.lower())[1]
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Supported formats: PDF, CSV, XLSX, XLS."
        )

    # 2. Read bytes in memory and validate file size
    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty."
        )
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024*1024)} MB."
        )

    # 3. Parse in memory depending on file extension
    try:
        if ext == ".csv":
            parsed_data = parse_csv_stream(file_bytes, filename=file.filename)
        elif ext in [".xlsx", ".xls"]:
            parsed_data = parse_excel_stream(file_bytes, filename=file.filename)
        elif ext == ".pdf":
            parsed_data = parse_pdf_stream(file_bytes, filename=file.filename)
        else:
            raise ValueError("Unsupported file format.")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse statement: {str(e)}"
        )

    # 4. Run analysis pipeline
    try:
        response_data = _process_statement_df(
            clean_df=parsed_data.df,
            currency=parsed_data.currency,
            filename=file.filename,
            account_masked=parsed_data.account_number
        )
        return response_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing statement: {str(e)}"
        )

@app.get("/api/sample", response_model=AnalysisResponse, tags=["Analysis"])
async def get_sample_analysis(currency: str = "₹"):
    """
    Return comprehensive analysis for a pre-generated realistic 6-month bank statement.
    Allows users to test all features of the application immediately without uploading files.
    """
    sample_df = generate_sample_statement_df(months=6, currency=currency)
    response_data = _process_statement_df(
        clean_df=sample_df,
        currency=currency,
        filename=f"Sample_6Month_BankStatement_{'INR' if currency == '₹' else 'USD'}.csv",
        account_masked="XXXX-XXXX-4589"
    )
    return response_data

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": str(exc)}
    )
