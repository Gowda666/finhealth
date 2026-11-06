import pytest
import pandas as pd
from app.services.scoring import compute_financial_health_score

def test_excellent_health_score():
    summary = {
        "total_income": 100000.0,
        "total_expenses": 50000.0,
        "savings_rate": 50.0,
        "avg_monthly_income": 100000.0,
        "avg_monthly_expense": 50000.0,
        "avg_daily_balance": 150000.0,
        "low_balance_days": 0
    }
    df = pd.DataFrame([
        {"date": pd.Timestamp("2026-05-01"), "debit": 20000.0, "credit": 100000.0, "category": "Salary & Income"},
        {"date": pd.Timestamp("2026-05-05"), "debit": 30000.0, "credit": 0.0, "category": "Food & Dining"}
    ])
    score_result = compute_financial_health_score(summary, df)
    assert score_result["total"] >= 80
    assert score_result["tier"] == "Excellent"
    assert len(score_result["pillars"]) == 5

def test_poor_health_score_deficit():
    summary = {
        "total_income": 40000.0,
        "total_expenses": 60000.0,
        "savings_rate": -50.0,
        "avg_monthly_income": 40000.0,
        "avg_monthly_expense": 60000.0,
        "avg_daily_balance": 500.0,
        "low_balance_days": 12
    }
    df = pd.DataFrame([
        {"date": pd.Timestamp("2026-05-01"), "debit": 0.0, "credit": 40000.0, "category": "Salary & Income"},
        {"date": pd.Timestamp("2026-05-05"), "debit": 35000.0, "credit": 0.0, "category": "EMI & Loans"},
        {"date": pd.Timestamp("2026-05-15"), "debit": 25000.0, "credit": 0.0, "category": "Food & Dining"}
    ])
    score_result = compute_financial_health_score(summary, df)
    assert score_result["total"] < 50
    assert score_result["tier"] == "Needs Attention"
