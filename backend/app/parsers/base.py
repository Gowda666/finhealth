import re
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
import pandas as pd
import numpy as np

DATE_ALIASES = [
    "date", "txn date", "transaction date", "value date", "posting date", 
    "trans date", "post date", "booking date", "trade date"
]

DESC_ALIASES = [
    "narration", "description", "particulars", "remarks", "details", 
    "memo", "transaction remarks", "payee", "reference", "description / narration"
]

DEBIT_ALIASES = [
    "debit", "withdrawal", "dr", "withdrawal amount", "debit amount", 
    "dr amount", "withdrawn", "payment", "paid out", "charges", "withdrawal amt"
]

CREDIT_ALIASES = [
    "credit", "deposit", "cr", "deposit amount", "credit amount", 
    "cr amount", "deposited", "receipt", "paid in", "deposit amt"
]

BALANCE_ALIASES = [
    "balance", "closing balance", "closing bal", "available balance", 
    "bal", "running balance", "net balance", "balance amt"
]

AMOUNT_ALIASES = [
    "amount", "txn amount", "transaction amount", "trans amount", "total amount"
]

TYPE_ALIASES = [
    "type", "cr/dr", "cr_dr", "dr/cr", "transaction type", "txn type", "indicator"
]

@dataclass
class RawParsedData:
    df: pd.DataFrame
    currency: str = "₹"
    account_number: Optional[str] = None
    header_metadata: List[str] = None

def clean_amount(val: Any) -> float:
    """Normalize amount representations like '₹1,234.50', '(500.00)', '250.00 Cr' to float."""
    if val is None or pd.isna(val):
        return 0.0
    if isinstance(val, (int, float)):
        return float(val) if not np.isnan(val) else 0.0
    
    s = str(val).strip()
    if not s or s == "-" or s.lower() == "nan" or s.lower() == "none":
        return 0.0
    
    # Check negative in brackets: (100.00)
    is_bracket_neg = s.startswith("(") and s.endswith(")")
    
    # Remove currency symbols and formatting
    cleaned = re.sub(r'[^\d.\-]', '', s)
    if not cleaned or cleaned == "-":
        return 0.0
    
    try:
        num = float(cleaned)
        if is_bracket_neg and num > 0:
            num = -num
        return num
    except ValueError:
        return 0.0

def detect_currency(text_sample: str) -> str:
    """Detect INR vs USD vs other currency from text sample."""
    if "₹" in text_sample or "INR" in text_sample.upper() or "RUPEES" in text_sample.upper() or "RS." in text_sample.upper():
        return "₹"
    if "$" in text_sample or "USD" in text_sample.upper():
        return "$"
    if "€" in text_sample or "EUR" in text_sample.upper():
        return "€"
    if "£" in text_sample or "GBP" in text_sample.upper():
        return "£"
    return "₹"

def identify_columns(columns: List[str]) -> Dict[str, Optional[str]]:
    """Map arbitrary column headers to standard names: date, desc, debit, credit, balance, amount, type."""
    mapping = {
        "date": None,
        "desc": None,
        "debit": None,
        "credit": None,
        "balance": None,
        "amount": None,
        "type": None
    }
    
    cols_clean = [str(c).strip().lower() for c in columns]
    
    # Check exact match first, then fuzzy substring match
    for idx, c in enumerate(cols_clean):
        c_alnum = re.sub(r'[^a-z0-9]', ' ', c).strip()
        
        # Date
        if mapping["date"] is None:
            if c in DATE_ALIASES or any(a == c_alnum for a in DATE_ALIASES):
                mapping["date"] = columns[idx]
                continue
                
        # Debit
        if mapping["debit"] is None:
            if c in DEBIT_ALIASES or any(a == c_alnum for a in DEBIT_ALIASES):
                mapping["debit"] = columns[idx]
                continue
                
        # Credit
        if mapping["credit"] is None:
            if c in CREDIT_ALIASES or any(a == c_alnum for a in CREDIT_ALIASES):
                mapping["credit"] = columns[idx]
                continue
                
        # Balance
        if mapping["balance"] is None:
            if c in BALANCE_ALIASES or any(a == c_alnum for a in BALANCE_ALIASES):
                mapping["balance"] = columns[idx]
                continue
                
        # Type
        if mapping["type"] is None:
            if c in TYPE_ALIASES or any(a == c_alnum for a in TYPE_ALIASES):
                mapping["type"] = columns[idx]
                continue
                
        # Amount
        if mapping["amount"] is None:
            if c in AMOUNT_ALIASES or any(a == c_alnum for a in AMOUNT_ALIASES):
                mapping["amount"] = columns[idx]
                continue

        # Description (do after debit/credit to avoid partial word collisions)
        if mapping["desc"] is None:
            if c in DESC_ALIASES or any(a in c for a in ["narration", "particular", "desc", "detail", "memo"]):
                mapping["desc"] = columns[idx]
                continue

    # Second pass for date if not found
    if mapping["date"] is None:
        for idx, c in enumerate(cols_clean):
            if "date" in c:
                mapping["date"] = columns[idx]
                break

    # Second pass for desc
    if mapping["desc"] is None:
        for idx, c in enumerate(cols_clean):
            if any(term in c for term in ["info", "remark", "ref", "trans"]):
                if columns[idx] not in [mapping["date"], mapping["debit"], mapping["credit"], mapping["balance"]]:
                    mapping["desc"] = columns[idx]
                    break

    return mapping

def parse_dates_robust(series: pd.Series) -> pd.Series:
    """Safely parse bank statement date formats."""
    # Common formats
    for fmt in ["%d/%m/%Y", "%d-%m-%Y", "%d-%b-%Y", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%y", "%d-%m-%y"]:
        try:
            converted = pd.to_datetime(series, format=fmt, errors="coerce")
            if converted.notna().sum() > 0.6 * len(series):
                return converted
        except Exception:
            pass
    # Fallback to general parser with dayfirst=True
    return pd.to_datetime(series, dayfirst=True, errors="coerce")

def standardize_dataframe(df: pd.DataFrame, col_map: Dict[str, Optional[str]]) -> pd.DataFrame:
    """Normalize extracted DataFrame into standard columns: date, description, debit, credit, balance."""
    if mapping_date := col_map.get("date"):
        dates = parse_dates_robust(df[mapping_date])
    else:
        # Fallback date if missing
        dates = pd.date_range(end=pd.Timestamp.today(), periods=len(df))
    
    if mapping_desc := col_map.get("desc"):
        descriptions = df[mapping_desc].astype(str).str.strip()
    else:
        descriptions = pd.Series(["Transaction"] * len(df))

    debits = pd.Series(0.0, index=df.index)
    credits = pd.Series(0.0, index=df.index)

    # Case A: Separate debit and credit columns
    if col_map.get("debit") and col_map.get("credit"):
        debits = df[col_map["debit"]].apply(clean_amount).abs()
        credits = df[col_map["credit"]].apply(clean_amount).abs()

    # Case B: Single Amount column with Type (CR/DR)
    elif col_map.get("amount") and col_map.get("type"):
        amt_col = df[col_map["amount"]].apply(clean_amount)
        type_col = df[col_map["type"]].astype(str).str.upper().str.strip()
        for i in df.index:
            t = type_col.loc[i]
            val = abs(amt_col.loc[i])
            if any(k in t for k in ["CR", "CREDIT", "DEP"]):
                credits.loc[i] = val
            elif any(k in t for k in ["DR", "DEBIT", "WITHDRAWAL"]):
                debits.loc[i] = val
            else:
                if amt_col.loc[i] < 0:
                    debits.loc[i] = val
                else:
                    credits.loc[i] = val

    # Case C: Single Amount column signed (+ for credit, - for debit)
    elif col_map.get("amount"):
        raw_amt = df[col_map["amount"]].apply(clean_amount)
        for i in df.index:
            v = raw_amt.loc[i]
            if v < 0:
                debits.loc[i] = abs(v)
            else:
                credits.loc[i] = v
                
    elif col_map.get("debit"):
        debits = df[col_map["debit"]].apply(clean_amount).abs()
    elif col_map.get("credit"):
        credits = df[col_map["credit"]].apply(clean_amount).abs()

    # Balance column
    if col_map.get("balance"):
        balances = df[col_map["balance"]].apply(clean_amount)
    else:
        balances = pd.Series(np.nan, index=df.index)

    normalized = pd.DataFrame({
        "date": dates,
        "description": descriptions,
        "debit": debits,
        "credit": credits,
        "balance": balances
    })

    # Drop rows where date is NaT and both debit and credit are 0
    normalized = normalized.dropna(subset=["date"])
    normalized = normalized[(normalized["debit"] > 0) | (normalized["credit"] > 0) | (normalized["balance"].notna())]
    
    # Sort chronologically
    normalized = normalized.sort_values(by="date").reset_index(drop=True)

    # Reconstruct running balance if missing
    if normalized["balance"].isna().all() or (normalized["balance"] == 0).all():
        running = 50000.0  # assumed initial base
        calc_bal = []
        for _, row in normalized.iterrows():
            running += (row["credit"] - row["debit"])
            calc_bal.append(round(running, 2))
        normalized["balance"] = calc_bal
    else:
        # Forward fill or backfill any intermittent null balances
        normalized["balance"] = normalized["balance"].ffill().bfill().fillna(0.0)

    # Format date to YYYY-MM-DD
    normalized["date_str"] = normalized["date"].dt.strftime("%Y-%m-%d")

    return normalized
