import re
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
from .categorizer import categorizer, CATEGORY_COLORS

def compute_analytics(df: pd.DataFrame, currency: str = "₹") -> Dict[str, Any]:
    """Compute complete analytical aggregations, recurring payments, and monthly trends."""
    df = df.copy()
    
    # Ensure year-month column
    df["year_month"] = df["date"].dt.strftime("%Y-%m")
    
    total_income = float(df["credit"].sum())
    total_expenses = float(df["debit"].sum())
    net_savings = total_income - total_expenses
    savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0.0

    # Monthly Trends
    monthly_groups = df.groupby("year_month")
    monthly_trends = []
    for ym, group in monthly_groups:
        inc = float(group["credit"].sum())
        exp = float(group["debit"].sum())
        sav = inc - exp
        rate = (sav / inc * 100) if inc > 0 else 0.0
        monthly_trends.append({
            "month": ym,
            "income": round(inc, 2),
            "expenses": round(exp, 2),
            "savings": round(sav, 2),
            "savings_rate": round(rate, 1)
        })

    # Sort months chronologically
    monthly_trends.sort(key=lambda x: x["month"])
    num_months = max(1, len(monthly_trends))
    avg_monthly_income = total_income / num_months
    avg_monthly_expense = total_expenses / num_months

    # Daily Balance & Low Balance Days
    # Group by date to get end-of-day balance
    daily_balance = df.groupby(df["date"].dt.date)["balance"].last()
    avg_daily_balance = float(daily_balance.mean()) if not daily_balance.empty else 0.0
    
    low_thresh = 1000.0 if currency == "₹" else 100.0
    low_balance_days = int((daily_balance < low_thresh).sum())

    # Category Breakdown (Expenses only)
    debit_df = df[df["debit"] > 0]
    category_summary = []
    if not debit_df.empty and total_expenses > 0:
        cat_agg = debit_df.groupby("category").agg(
            amount=("debit", "sum"),
            count=("debit", "count")
        ).reset_index()
        cat_agg["percentage"] = (cat_agg["amount"] / total_expenses * 100).round(1)
        cat_agg = cat_agg.sort_values(by="amount", ascending=False)

        for _, row in cat_agg.iterrows():
            c = row["category"]
            category_summary.append({
                "category": c,
                "amount": round(float(row["amount"]), 2),
                "percentage": float(row["percentage"]),
                "count": int(row["count"]),
                "color": CATEGORY_COLORS.get(c, "#6B7280")
            })

    # Top Merchants
    merchant_counts: Dict[str, Dict[str, Any]] = {}
    for _, row in debit_df.iterrows():
        m_name = categorizer.extract_clean_merchant(row["description"])
        if not m_name:
            # Fallback to first 2 words of description if clean
            words = row["description"].split()
            m_name = " ".join(words[:2]).strip()
            # Clean special characters
            m_name = re.sub(r'[^a-zA-Z0-9 ]', '', m_name)
            if len(m_name) < 3:
                m_name = "Direct Outflow"

        if m_name not in merchant_counts:
            merchant_counts[m_name] = {
                "merchant": m_name,
                "amount": 0.0,
                "count": 0,
                "category": row["category"]
            }
        merchant_counts[m_name]["amount"] += float(row["debit"])
        merchant_counts[m_name]["count"] += 1

    merchants_list = sorted(merchant_counts.values(), key=lambda x: x["amount"], reverse=True)[:8]
    for m in merchants_list:
        m["amount"] = round(m["amount"], 2)

    # Recurring Payments / Subscriptions Detection
    recurring_payments = _detect_recurring_payments(df)

    start_date = df["date_str"].min()
    end_date = df["date_str"].max()

    return {
        "summary": {
            "total_income": round(total_income, 2),
            "total_expenses": round(total_expenses, 2),
            "net_savings": round(net_savings, 2),
            "savings_rate": round(savings_rate, 1),
            "avg_monthly_income": round(avg_monthly_income, 2),
            "avg_monthly_expense": round(avg_monthly_expense, 2),
            "avg_daily_balance": round(avg_daily_balance, 2),
            "low_balance_days": low_balance_days,
            "transaction_count": len(df),
            "date_range_start": start_date,
            "date_range_end": end_date,
            "detected_currency": currency
        },
        "monthly_trends": monthly_trends,
        "categories": category_summary,
        "merchants": merchants_list,
        "recurring_payments": recurring_payments
    }

def _detect_recurring_payments(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Identify recurring subscriptions and bills by detecting repeating amounts & descriptions."""
    debits = df[df["debit"] > 0].copy()
    if len(debits) < 3:
        return []

    # Common subscription keywords to prioritize
    subscription_keywords = [
        "netflix", "spotify", "prime video", "hotstar", "youtube", "cult.fit", 
        "gym", "apple.com", "google storage", "cloud", "airtel", "jio", "broadband", 
        "rent", "maintenance", "emi", "sip", "lic", "insurance", "nobroker"
    ]

    recurring = []
    seen_names = set()

    # Step 1: Detect known subscription brands
    for kw in subscription_keywords:
        matches = debits[debits["description"].str.lower().str.contains(kw, na=False)]
        if len(matches) >= 2:
            amounts = matches["debit"].tolist()
            # If amounts are closely matched (std < 15% of mean)
            mean_amt = np.mean(amounts)
            std_amt = np.std(amounts)
            if std_amt < 0.20 * mean_amt or len(set(amounts)) == 1:
                name = categorizer.extract_clean_merchant(matches.iloc[0]["description"]) or kw.title()
                if name not in seen_names:
                    seen_names.add(name)
                    recurring.append({
                        "name": name,
                        "amount": round(float(mean_amt), 2),
                        "frequency": "Monthly",
                        "category": matches.iloc[0]["category"],
                        "count": len(matches),
                        "last_date": matches.iloc[-1]["date_str"]
                    })

    # Step 2: Detect repeating identical debits occurring in multiple distinct months
    grouped = debits.groupby(["description", "debit"])
    for (desc, amt), grp in grouped:
        if len(grp) >= 2:
            distinct_months = grp["date"].dt.to_period("M").nunique()
            if distinct_months >= 2:
                name = categorizer.extract_clean_merchant(desc) or desc[:30].strip()
                if name not in seen_names and amt > 100:
                    seen_names.add(name)
                    recurring.append({
                        "name": name,
                        "amount": round(float(amt), 2),
                        "frequency": "Monthly",
                        "category": grp.iloc[0]["category"],
                        "count": len(grp),
                        "last_date": grp.iloc[-1]["date_str"]
                    })

    # Sort by amount descending
    recurring.sort(key=lambda x: x["amount"], reverse=True)
    return recurring[:10]
