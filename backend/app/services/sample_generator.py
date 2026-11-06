import random
from datetime import datetime, timedelta
import pandas as pd
from typing import Dict, Any, List

def generate_sample_statement_df(months: int = 6, currency: str = "₹") -> pd.DataFrame:
    """Generate realistic 6-month bank statement data for testing and instant demo."""
    random.seed(42)  # Deterministic seed for reproducible sample demo
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30 * months)
    
    records: List[Dict[str, Any]] = []
    current_balance = 45000.0 if currency == "₹" else 3500.0
    salary_amount = 85000.0 if currency == "₹" else 5800.0

    current_dt = start_date
    month_cursor = -1

    while current_dt <= end_date:
        curr_m = current_dt.month
        # Monthly Salary on 1st or nearest day
        if curr_m != month_cursor and current_dt.day <= 5:
            month_cursor = curr_m
            current_balance += salary_amount
            records.append({
                "date": current_dt.strftime("%Y-%m-%d"),
                "description": "TECH CORP ACH SALARY CREDIT",
                "category": "Salary & Income",
                "debit": 0.0,
                "credit": salary_amount,
                "balance": round(current_balance, 2)
            })

            # Rent on 2nd or 3rd
            rent_amt = 24000.0 if currency == "₹" else 1500.0
            current_balance -= rent_amt
            records.append({
                "date": (current_dt + timedelta(days=2)).strftime("%Y-%m-%d"),
                "description": "RENT TO LANDLORD APARTMENT #402",
                "category": "Housing & Rent",
                "debit": rent_amt,
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

            # Loan EMI on 5th
            emi_amt = 8500.0 if currency == "₹" else 420.0
            current_balance -= emi_amt
            records.append({
                "date": (current_dt + timedelta(days=4)).strftime("%Y-%m-%d"),
                "description": "AUTO-DEBIT HDFC LOAN EMI",
                "category": "EMI & Loans",
                "debit": emi_amt,
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

            # Mutual Fund SIP on 7th
            sip_amt = 15000.0 if currency == "₹" else 800.0
            current_balance -= sip_amt
            records.append({
                "date": (current_dt + timedelta(days=6)).strftime("%Y-%m-%d"),
                "description": "ZERODHA MUTUAL FUND SIP INVES",
                "category": "Investments & Savings",
                "debit": sip_amt,
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

            # Subscriptions on 10th
            sub_netflix = 649.0 if currency == "₹" else 15.99
            current_balance -= sub_netflix
            records.append({
                "date": (current_dt + timedelta(days=9)).strftime("%Y-%m-%d"),
                "description": "NETFLIX ENTERTAINMENT SUBSCRIPTION",
                "category": "Entertainment & Leisure",
                "debit": sub_netflix,
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

            sub_spotify = 119.0 if currency == "₹" else 9.99
            current_balance -= sub_spotify
            records.append({
                "date": (current_dt + timedelta(days=9)).strftime("%Y-%m-%d"),
                "description": "SPOTIFY PREMIUM MONTHLY",
                "category": "Entertainment & Leisure",
                "debit": sub_spotify,
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

            # Utilities on 12th
            elec_amt = random.uniform(1800, 2600) if currency == "₹" else random.uniform(80, 140)
            current_balance -= elec_amt
            records.append({
                "date": (current_dt + timedelta(days=11)).strftime("%Y-%m-%d"),
                "description": "BESCOM ELECTRICITY BILL PAYMENT",
                "category": "Utilities & Bills",
                "debit": round(elec_amt, 2),
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

            broadband_amt = 999.0 if currency == "₹" else 65.0
            current_balance -= broadband_amt
            records.append({
                "date": (current_dt + timedelta(days=12)).strftime("%Y-%m-%d"),
                "description": "AIRTEL FIBER BROADBAND BILL",
                "category": "Utilities & Bills",
                "debit": broadband_amt,
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

        # Routine frequent expenses: Groceries, Food, Cabs, Shopping
        # Food & Dining every 2-3 days
        if random.random() < 0.35:
            food_amt = random.uniform(320, 950) if currency == "₹" else random.uniform(18, 55)
            vendor = random.choice(["SWIGGY ORDER", "ZOMATO RESTAURANT", "STARBUCKS CAFE", "BURGER KING"])
            current_balance -= food_amt
            records.append({
                "date": current_dt.strftime("%Y-%m-%d"),
                "description": f"UPI/{vendor}/PAYMENT",
                "category": "Food & Dining",
                "debit": round(food_amt, 2),
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

        # Groceries every 4 days
        if random.random() < 0.25:
            groc_amt = random.uniform(650, 2400) if currency == "₹" else random.uniform(35, 120)
            vendor = random.choice(["BLINKIT GROCERY", "ZEPTO QUICK CART", "BIGBASKET SUPERMARKET", "DMART RETAIL"])
            current_balance -= groc_amt
            records.append({
                "date": current_dt.strftime("%Y-%m-%d"),
                "description": f"POS/{vendor}",
                "category": "Groceries & Supermarket",
                "debit": round(groc_amt, 2),
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

        # Transport every 3 days
        if random.random() < 0.30:
            tr_amt = random.uniform(140, 480) if currency == "₹" else random.uniform(12, 35)
            vendor = random.choice(["UBER TRIP", "OLA RIDE", "METRO SMARTCARD RECHARGE", "PETROL HPCL STATION"])
            current_balance -= tr_amt
            records.append({
                "date": current_dt.strftime("%Y-%m-%d"),
                "description": f"UPI/{vendor}",
                "category": "Travel & Transport",
                "debit": round(tr_amt, 2),
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

        # Occasional Shopping
        if random.random() < 0.12:
            shop_amt = random.uniform(900, 3800) if currency == "₹" else random.uniform(45, 180)
            vendor = random.choice(["AMAZON INDIA RETAIL", "FLIPKART INTERNET", "MYNTRA DESIGNS", "DECATHLON SPORTS"])
            current_balance -= shop_amt
            records.append({
                "date": current_dt.strftime("%Y-%m-%d"),
                "description": f"ECOM/{vendor}",
                "category": "Shopping & Retail",
                "debit": round(shop_amt, 2),
                "credit": 0.0,
                "balance": round(current_balance, 2)
            })

        current_dt += timedelta(days=1)

    # Inject 1 notable Anomaly for testing/demo (e.g. Apple electronics purchase)
    anomaly_date = (start_date + timedelta(days=65)).strftime("%Y-%m-%d")
    anomaly_amt = 54900.0 if currency == "₹" else 1199.0
    current_balance -= anomaly_amt
    records.append({
        "date": anomaly_date,
        "description": "APPLE STORE INDIA ELECTRONICS ONLINE",
        "category": "Shopping & Retail",
        "debit": anomaly_amt,
        "credit": 0.0,
        "balance": round(current_balance, 2)
    })

    df = pd.DataFrame(records)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(by="date").reset_index(drop=True)
    df["date_str"] = df["date"].dt.strftime("%Y-%m-%d")

    # Re-verify running balances
    bal = 45000.0 if currency == "₹" else 3500.0
    bals = []
    for _, row in df.iterrows():
        bal += (row["credit"] - row["debit"])
        bals.append(round(bal, 2))
    df["balance"] = bals

    return df
