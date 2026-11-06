import io
from typing import Optional, List
import pandas as pd
from .base import identify_columns, standardize_dataframe, detect_currency, RawParsedData
from ..utils.privacy import extract_and_mask_account

HEADER_CANDIDATE_KEYWORDS = ["date", "narration", "description", "particulars", "withdrawal", "deposit", "balance", "amount"]

def parse_excel_stream(file_bytes: bytes, filename: str = "statement.xlsx") -> RawParsedData:
    """Parse Excel statement (.xlsx, .xls) completely in memory."""
    stream = io.BytesIO(file_bytes)
    
    # Read entire first sheet raw to discover header position
    try:
        raw_df = pd.read_excel(stream, header=None, dtype=str)
    except Exception as e:
        raise ValueError(f"Failed to read Excel workbook: {str(e)}")

    if raw_df.empty:
        raise ValueError("The uploaded Excel workbook is empty.")

    # Find row with maximum keyword matches
    header_idx = 0
    max_matches = 0
    metadata_lines = []

    for i in range(min(40, len(raw_df))):
        row_values = raw_df.iloc[i].dropna().astype(str).tolist()
        row_text = " ".join(row_values).lower()
        matches = sum(1 for kw in HEADER_CANDIDATE_KEYWORDS if kw in row_text)
        if matches > max_matches and matches >= 2:
            max_matches = matches
            header_idx = i

    for i in range(header_idx):
        row_str = " ".join(raw_df.iloc[i].dropna().astype(str).tolist())
        if row_str.strip():
            metadata_lines.append(row_str)

    account_number = extract_and_mask_account(metadata_lines)

    # Use detected header row
    stream.seek(0)
    df = pd.read_excel(stream, skiprows=header_idx, dtype=str)
    # Drop rows that are entirely NaN
    df = df.dropna(how='all')

    if df.empty or len(df.columns) < 2:
        raise ValueError("No table data found in the Excel statement.")

    # Detect currency
    sample_text = " ".join(metadata_lines) + " " + " ".join(df.columns.astype(str))
    currency = detect_currency(sample_text)

    col_map = identify_columns(list(df.columns))
    if not col_map.get("date") or not (col_map.get("debit") or col_map.get("credit") or col_map.get("amount")):
        raise ValueError(
            "Missing required transaction columns (Date and Amount/Debit/Credit). "
            f"Detected columns: {list(df.columns)}"
        )

    clean_df = standardize_dataframe(df, col_map)
    if clean_df.empty:
        raise ValueError("No valid transaction rows found in the Excel statement.")

    return RawParsedData(
        df=clean_df,
        currency=currency,
        account_number=account_number,
        header_metadata=metadata_lines
    )
