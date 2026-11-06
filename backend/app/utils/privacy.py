import re
from typing import Optional, Tuple

ACCOUNT_REGEX = re.compile(r'\b(?:\d[ -]*?){9,18}\b')
CARD_REGEX = re.compile(r'\b(?:\d{4}[ -]?){3}\d{4}\b')
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
PHONE_REGEX = re.compile(r'\b(?:\+?\d{1,3}[- ]?)?(?:[6-9]\d{9}|\d{10})\b')
UPI_REGEX = re.compile(r'\b[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}\b')

def mask_account_number(acc_str: str) -> str:
    """Mask account or card number preserving last 4 digits."""
    clean = re.sub(r'\D', '', acc_str)
    if len(clean) >= 8:
        return f"XXXX-XXXX-{clean[-4:]}"
    elif len(clean) >= 4:
        return f"XX-{clean[-4:]}"
    return "XXXX"

def mask_sensitive_text(text: str) -> str:
    """Sanitize any description or statement text to remove PII."""
    if not text or not isinstance(text, str):
        return ""
    
    # Mask credit/debit card numbers
    def mask_card_match(match):
        digits = re.sub(r'\D', '', match.group(0))
        return f"XXXX-XXXX-XXXX-{digits[-4:]}" if len(digits) >= 4 else "XXXX-CARD"
    
    # Mask account numbers (10 to 18 digits)
    def mask_acc_match(match):
        digits = re.sub(r'\D', '', match.group(0))
        if len(digits) >= 9:
            return f"XXXX-XXXX-{digits[-4:]}"
        return match.group(0)

    # Mask UPI handles / emails
    def mask_upi_match(match):
        vpa = match.group(0)
        parts = vpa.split('@')
        name = parts[0]
        domain = parts[1]
        masked_name = name[0] + "***" if len(name) > 1 else "***"
        return f"{masked_name}@{domain}"

    # Mask phone numbers
    def mask_phone_match(match):
        ph = re.sub(r'\D', '', match.group(0))
        if len(ph) >= 10:
            return f"******{ph[-4:]}"
        return match.group(0)

    # Apply masks
    cleaned = CARD_REGEX.sub(mask_card_match, text)
    cleaned = ACCOUNT_REGEX.sub(mask_acc_match, cleaned)
    cleaned = EMAIL_REGEX.sub(mask_upi_match, cleaned)
    cleaned = UPI_REGEX.sub(mask_upi_match, cleaned)
    cleaned = PHONE_REGEX.sub(mask_phone_match, cleaned)
    return cleaned.strip()

def extract_and_mask_account(header_lines: list[str]) -> Optional[str]:
    """Scan statement header metadata lines to detect account number."""
    keywords = ["account no", "account number", "a/c no", "acct #", "account #", "a/c:"]
    for line in header_lines:
        lower = line.lower()
        for kw in keywords:
            if kw in lower:
                # Look for digits
                nums = re.findall(r'\b\d{8,18}\b', line)
                if nums:
                    return mask_account_number(nums[0])
    return None
