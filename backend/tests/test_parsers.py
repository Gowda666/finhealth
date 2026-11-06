import pytest
import io
import pandas as pd
from app.parsers.base import clean_amount, identify_columns, detect_currency, standardize_dataframe
from app.parsers.csv_parser import parse_csv_stream
from app.utils.privacy import mask_sensitive_text, mask_account_number

def test_clean_amount():
    assert clean_amount("₹1,250.50") == 1250.50
    assert clean_amount("$45.00") == 45.00
    assert clean_amount("(500.00)") == -500.00
    assert clean_amount("-120.75") == -120.75
    assert clean_amount("1,000.00 Cr") == 1000.00
    assert clean_amount(None) == 0.0
    assert clean_amount("-") == 0.0

def test_detect_currency():
    assert detect_currency("Statement in INR ₹ Rupees") == "₹"
    assert detect_currency("Balance: $4,500.00 USD") == "$"
    assert detect_currency("Opening balance 1000.00") == "₹"

def test_identify_columns():
    cols = ["Txn Date", "Narration", "Withdrawal Amt", "Deposit Amt", "Closing Balance"]
    mapped = identify_columns(cols)
    assert mapped["date"] == "Txn Date"
    assert mapped["desc"] == "Narration"
    assert mapped["debit"] == "Withdrawal Amt"
    assert mapped["credit"] == "Deposit Amt"
    assert mapped["balance"] == "Closing Balance"

def test_privacy_masking():
    assert mask_account_number("50100412894567") == "XXXX-XXXX-4567"
    masked = mask_sensitive_text("Payment to UPI user@hdfcbank for account 50100412894567")
    assert "XXXX-XXXX-4567" in masked
    assert "u***@hdfcbank" in masked

def test_parse_csv_stream():
    sample_csv = b"""HDFC Bank Statement
Account No: 50100412894567
Customer: Test User

Date,Narration,Debit,Credit,Balance
01/05/2026,Salary Credit,,75000,100000
03/05/2026,Rent Payment,20000,,80000
05/05/2026,Swiggy Food,450,,79550
"""
    result = parse_csv_stream(sample_csv, "test.csv")
    assert result.account_number == "XXXX-XXXX-4567"
    assert len(result.df) == 3
    assert "date_str" in result.df.columns
    assert result.df["credit"].sum() == 75000.0
    assert result.df["debit"].sum() == 20450.0
