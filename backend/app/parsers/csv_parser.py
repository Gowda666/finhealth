import io
import re
from typing import Optional, List
import pandas as pd
from .base import identify_columns, standardize_dataframe, detect_currency, RawParsedData
from ..utils.privacy import extract_and_mask_account

HEADER_CANDIDATE_KEYWORDS = ["date", "narration", "description", "particulars", "withdrawal", "deposit", "balance", "amount"]

def parse_csv_stream(file_bytes: bytes, filename: str = "statement.csv") -> RawParsedData:
    """Parse CSV in memory with automatic header discovery and bank metadata extraction."""
    # Attempt multiple encodings
    text_content = ""
    for enc in ["utf-8-sig", "utf-8", "latin1", "cp1252"]:
        try:
            text_content = file_bytes.decode(enc)
            break
        except UnicodeDecodeError:
            continue

    if not text_content:
        raise ValueError("Could not decode CSV statement. Ensure file is a valid text or CSV format.")

    lines = text_content.splitlines()
    if not lines:
        raise ValueError("The uploaded CSV file is empty.")

    # 1. Detect header row by finding the row containing the most candidate keywords
    header_idx = 0
    max_matches = 0
    metadata_lines = []

    for i in range(min(35, len(lines))):
        line = lines[i]
        line_lower = line.lower()
        matches = sum(1 for kw in HEADER_CANDIDATE_KEYWORDS if kw in line_lower)
        if matches > max_matches and matches >= 2:
            max_matches = matches
            header_idx = i

    metadata_lines = lines[:header_idx]
    account_number = extract_and_mask_account(metadata_lines)

    # 2. Extract currency from entire statement text
    currency = detect_currency(text_content[:2000])

    # 3. Read CSV into DataFrame starting from header_idx
    # Try comma, semicolon, tab
    csv_body = "\n".join(lines[header_idx:])
    
    df = None
    for sep in [",", ";", "\t", "|"]:
        try:
            temp_df = pd.read_csv(io.StringIO(csv_body), sep=sep, on_bad_lines='skip', dtype=str)
            if len(temp_df.columns) >= 3:
                # Check if identified columns contain date + desc
                cols = identify_columns(list(temp_df.columns))
                if cols["date"] and (cols["desc"] or cols["amount"] or cols["debit"]):
                    df = temp_df
                    break
        except Exception:
            continue

    if df is None:
        # Fallback with python engine
        df = pd.read_csv(io.StringIO(csv_body), sep=None, engine='python', on_bad_lines='skip', dtype=str)

    if df is None or df.empty or len(df.columns) < 2:
        raise ValueError("Unable to identify transaction columns in this CSV statement.")

    # Map columns
    col_map = identify_columns(list(df.columns))
    if not col_map.get("date") or not (col_map.get("debit") or col_map.get("credit") or col_map.get("amount")):
        raise ValueError(
            "Missing essential transaction columns (Date and Amount/Debit/Credit). "
            f"Found columns: {list(df.columns)}"
        )

    clean_df = standardize_dataframe(df, col_map)
    if clean_df.empty:
        raise ValueError("No valid transaction rows found in the CSV file.")

    return RawParsedData(
        df=clean_df,
        currency=currency,
        account_number=account_number,
        header_metadata=metadata_lines
    )
