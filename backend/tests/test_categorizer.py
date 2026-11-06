import pytest
from app.services.categorizer import categorizer

def test_keyword_categorization():
    assert categorizer.categorize("UPI/SWIGGY/123", 450.0, 0.0) == "Food & Dining"
    assert categorizer.categorize("NETFLIX SUBSCRIPTION", 649.0, 0.0) == "Entertainment & Leisure"
    assert categorizer.categorize("AUTO DEBIT HDFC LOAN EMI", 12000.0, 0.0) == "EMI & Loans"
    assert categorizer.categorize("AIRTEL FIBER BILL", 999.0, 0.0) == "Utilities & Bills"
    assert categorizer.categorize("TECH CORP SALARY CREDIT", 0.0, 85000.0) == "Salary & Income"
    assert categorizer.categorize("UBER RIDE BANGALORE", 350.0, 0.0) == "Travel & Transport"
    assert categorizer.categorize("ZERODHA BROKING MUTUAL FUND", 10000.0, 0.0) == "Investments & Savings"

def test_merchant_cleaner():
    assert categorizer.extract_clean_merchant("UPI/SWIGGY/ORDER4920") == "Swiggy"
    assert categorizer.extract_clean_merchant("AMAZON INDIA RETAIL") == "Amazon"
    assert categorizer.extract_clean_merchant("UBER TRIP 1290") == "Uber"
