import io
import re
from typing import Optional, List
import pandas as pd
import pdfplumber
from .base import identify_columns, standardize_dataframe, detect_currency, RawParsedData
from ..utils.privacy import extract_and_mask_account

HEADER_CANDIDATE_KEYWORDS = ["date", "narration", "description", "particulars", "withdrawal", "deposit", "balance", "amount"]

def parse_pdf_stream(file_bytes: bytes, filename: str = "statement.pdf") -> RawParsedData:
    """Parse PDF bank statement in memory using pdfplumber with table and regex fallback."""
    stream = io.BytesIO(file_bytes)
    
    extracted_rows: List[List[str]] = []
    metadata_lines: List[str] = []
    full_text_sample = ""

    with pdfplumber.open(stream) as pdf:
        if not pdf.pages:
            raise ValueError("The uploaded PDF has no pages.")
        
        # 1. Inspect first page for metadata & account number
        first_page_text = pdf.pages[0].extract_text() or ""
        full_text_sample += first_page_text
        for line in first_page_text.splitlines()[:25]:
            if line.strip():
                metadata_lines.append(line.strip())

        account_number = extract_and_mask_account(metadata_lines)

        # 2. Extract tables across pages
        for page_idx, page in enumerate(pdf.pages):
            tables = page.extract_tables()
            if tables:
                for table in tables:
                    for row in table:
                        # Clean cell text (replace newlines with spaces)
                        cleaned_row = [re.sub(r'\s+', ' ', str(cell or "")).strip() for cell in row]
                        if any(cleaned_row):
                            extracted_rows.append(cleaned_row)

    currency = detect_currency(full_text_sample[:3000])

    # If tabular extraction succeeded and found rows
    if extracted_rows and len(extracted_rows) > 3:
        # Locate header row among first 20 rows
        header_idx = 0
        max_matches = 0
        for i in range(min(20, len(extracted_rows))):
            row_text = " ".join(extracted_rows[i]).lower()
            matches = sum(1 for kw in HEADER_CANDIDATE_KEYWORDS if kw in row_text)
            if matches > max_matches and matches >= 2:
                max_matches = matches
                header_idx = i

        headers = extracted_rows[header_idx]
        data_rows = extracted_rows[header_idx + 1:]

        # Filter out rows that repeat the header on subsequent pages
        clean_rows = []
        for r in data_rows:
            # Check if this row is a header repeat or footer summary
            if len(r) == len(headers):
                r_text = " ".join(r).lower()
                if "closing balance" in r_text and "opening balance" in r_text:
                    continue
                if sum(1 for kw in HEADER_CANDIDATE_KEYWORDS if kw in r_text) >= 3:
                    continue
                clean_rows.append(r)

        if clean_rows:
            df = pd.DataFrame(clean_rows, columns=headers)
            col_map = identify_columns(list(df.columns))
            if col_map.get("date") and (col_map.get("debit") or col_map.get("credit") or col_map.get("amount")):
                clean_df = standardize_dataframe(df, col_map)
                if not clean_df.empty:
                    return RawParsedData(
                        df=clean_df,
                        currency=currency,
                        account_number=account_number,
                        header_metadata=metadata_lines
                    )

    # Strategy B: Line-by-line regex parser for statements without clear table borders
    lines_parsed = _parse_pdf_text_fallback(file_bytes)
    if not lines_parsed.empty:
        return RawParsedData(
            df=lines_parsed,
            currency=currency,
            account_number=account_number,
            header_metadata=metadata_lines
        )

    raise ValueError(
        "Could not automatically parse transactions from this PDF. "
        "Please ensure it is an official bank statement and not a scanned image, or try uploading in CSV/Excel format."
    )

def _parse_pdf_text_fallback(file_bytes: bytes) -> pd.DataFrame:
    """Regex fallback for text-based statements."""
    stream = io.BytesIO(file_bytes)
    transactions = []
    
    # Common date regex at start of line: DD/MM/YYYY, DD-MM-YYYY, DD-Mon-YYYY
    date_regex = re.compile(r'^(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}-[A-Za-z]{3}-\d{2,4})\s+(.+)$')
    # Amount match: digits with optional commas and decimals
    amount_regex = re.compile(r'(\b\d{1,3}(?:,\d{2,3})*(?:\.\d{2})\b|\b\d+\.\d{2}\b)')

    with pdfplumber.open(stream) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
            for line in text.splitlines():
                line = line.strip()
                match = date_regex.match(line)
                if match:
                    date_str = match.group(1)
                    rest = match.group(2)
                    amounts = amount_regex.findall(rest)
                    if amounts:
                        # Typical format has debit/credit and balance at end
                        desc = rest
                        for amt in amounts:
                            desc = desc.replace(amt, "")
                        desc = re.sub(r'\s+', ' ', desc).strip()
                        
                        debit, credit, balance = 0.0, 0.0, 0.0
                        if len(amounts) >= 2:
                            val1 = float(amounts[0].replace(",", ""))
                            bal = float(amounts[-1].replace(",", ""))
                            if "cr" in rest.lower() or "deposit" in rest.lower():
                                credit = val1
                            else:
                                debit = val1
                            balance = bal
                        elif len(amounts) == 1:
                            val = float(amounts[0].replace(",", ""))
                            if "cr" in rest.lower() or "salary" in rest.lower() or "deposit" in rest.lower():
                                credit = val
                            else:
                                debit = val
                        
                        transactions.append({
                            "date": date_str,
                            "description": desc or "Bank Transaction",
                            "debit": debit,
                            "credit": credit,
                            "balance": balance
                        })

    if not transactions:
        return pd.DataFrame()

    df = pd.DataFrame(transactions)
    col_map = {"date": "date", "desc": "description", "debit": "debit", "credit": "credit", "balance": "balance"}
    return standardize_dataframe(df, col_map)
