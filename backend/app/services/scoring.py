import numpy as np
import pandas as pd
from typing import Dict, Any, List

def compute_financial_health_score(summary: Dict[str, Any], df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate the 5-pillar transparent 0-100 Financial Health Score."""
    total_income = summary["total_income"]
    total_expenses = summary["total_expenses"]
    savings_rate = summary["savings_rate"]  # percentage e.g. 32.5
    avg_monthly_expense = summary["avg_monthly_expense"]
    avg_daily_balance = summary["avg_daily_balance"]
    low_balance_days = summary["low_balance_days"]

    # 1. Pillar 1: Savings Rate (Max: 25 pts)
    # Benchmark: >= 20% savings rate receives full 25 points.
    if total_income <= 0:
        savings_score = 0.0
        savings_status = "Critical"
        savings_expl = "No recorded income to calculate savings rate."
    elif savings_rate >= 20.0:
        savings_score = 25.0
        savings_status = "Optimal"
        savings_expl = f"Outstanding {savings_rate:.1f}% savings rate exceeds the 20% healthy benchmark."
    elif savings_rate > 0.0:
        savings_score = round((savings_rate / 20.0) * 25.0, 1)
        savings_status = "Good" if savings_score >= 15 else "Caution"
        savings_expl = f"Moderate {savings_rate:.1f}% savings rate; aim for at least 20% to build security."
    else:
        savings_score = 0.0
        savings_status = "Critical"
        savings_expl = f"Negative savings rate ({savings_rate:.1f}%); expenses exceed inflows."

    # 2. Pillar 2: Expense-to-Income Ratio (Max: 25 pts)
    # Benchmark: <= 50% expenses is optimal; > 90% is high risk.
    if total_income <= 0:
        expense_score = 0.0
        exp_status = "Critical"
        exp_expl = "Zero income recorded; expense ratio cannot be balanced."
    else:
        exp_ratio = (total_expenses / total_income) * 100.0
        if exp_ratio <= 50.0:
            expense_score = 25.0
            exp_status = "Optimal"
            exp_expl = f"Lean living expenses ({exp_ratio:.1f}% of income), leaves healthy room for goals."
        elif exp_ratio <= 80.0:
            # Scale from 25 down to 10
            expense_score = round(25.0 - ((exp_ratio - 50.0) / 30.0) * 15.0, 1)
            exp_status = "Good"
            exp_expl = f"Balanced spending ({exp_ratio:.1f}% of income), well within safety margins."
        elif exp_ratio <= 100.0:
            # Scale from 10 down to 2
            expense_score = round(10.0 - ((exp_ratio - 80.0) / 20.0) * 8.0, 1)
            exp_status = "Caution"
            exp_expl = f"High expense burden ({exp_ratio:.1f}% of income), leaving very little cushion."
        else:
            expense_score = 0.0
            exp_status = "Critical"
            exp_expl = f"Overspending ({exp_ratio:.1f}% of income); spending exceeds cashflow."

    # 3. Pillar 3: Debt & EMI Burden (Max: 20 pts)
    # Benchmark: DTI (Debt-to-Income) <= 15% is optimal, > 40% is dangerous.
    emi_df = df[df["category"] == "EMI & Loans"]
    total_emi = float(emi_df["debit"].sum())
    if total_income > 0:
        emi_ratio = (total_emi / total_income) * 100.0
    else:
        emi_ratio = 100.0 if total_emi > 0 else 0.0

    if total_emi == 0:
        debt_score = 20.0
        debt_status = "Optimal"
        debt_expl = "Zero recurring debt or loan EMI obligations identified."
    elif emi_ratio <= 15.0:
        debt_score = 20.0
        debt_status = "Optimal"
        debt_expl = f"Low EMI burden ({emi_ratio:.1f}% of income), well below the 35% safe threshold."
    elif emi_ratio <= 30.0:
        debt_score = 14.0
        debt_status = "Good"
        debt_expl = f"Manageable EMI repayments ({emi_ratio:.1f}% of income)."
    elif emi_ratio <= 50.0:
        debt_score = 7.0
        debt_status = "Caution"
        debt_expl = f"Heavy debt commitments ({emi_ratio:.1f}% of income); prioritize paying down debt."
    else:
        debt_score = 2.0
        debt_status = "Critical"
        debt_expl = f"Critical debt overload ({emi_ratio:.1f}% of income); risk of financial stress."

    # 4. Pillar 4: Balance Stability & Cash Buffer (Max: 15 pts)
    # Compares average daily balance to monthly expense (months of runway).
    if avg_monthly_expense > 0:
        months_runway = avg_daily_balance / avg_monthly_expense
    else:
        months_runway = 1.0

    if months_runway >= 2.0 and low_balance_days == 0:
        stability_score = 15.0
        stab_status = "Optimal"
        stab_expl = f"Strong liquidity: cash balance provides ~{months_runway:.1f} months of living buffer."
    elif months_runway >= 1.0:
        stability_score = 11.0 if low_balance_days <= 1 else 9.0
        stab_status = "Good"
        stab_expl = f"Sufficient buffer (~{months_runway:.1f} months expense coverage); {low_balance_days} low-balance days."
    elif months_runway >= 0.5:
        stability_score = 6.0
        stab_status = "Caution"
        stab_expl = f"Thin cash buffer (~{months_runway:.1f} months); vulnerable to surprise expenses."
    else:
        stability_score = max(0.0, 3.0 - (low_balance_days * 0.5))
        stab_status = "Critical"
        stab_expl = f"Depleted buffer with {low_balance_days} days near zero; high overdraft risk."

    # 5. Pillar 5: Spending Consistency & Volatility (Max: 15 pts)
    # Look at variance of monthly discretionary outflows
    monthly_debits = df.groupby(df["date"].dt.strftime("%Y-%m"))["debit"].sum().tolist()
    if len(monthly_debits) >= 2:
        mean_exp = np.mean(monthly_debits)
        std_exp = np.std(monthly_debits)
        cv = (std_exp / mean_exp) if mean_exp > 0 else 0.5
    else:
        cv = 0.15  # Default reasonable stability for shorter periods

    if cv <= 0.20:
        consistency_score = 15.0
        cons_status = "Optimal"
        cons_expl = "Highly disciplined and predictable spending month-over-month."
    elif cv <= 0.40:
        consistency_score = 11.0
        cons_status = "Good"
        cons_expl = "Stable spending with moderate seasonal fluctuations."
    elif cv <= 0.65:
        consistency_score = 7.0
        cons_status = "Caution"
        cons_expl = "Noticeable spending volatility with periodic unpredictable spikes."
    else:
        consistency_score = 3.0
        cons_status = "Critical"
        cons_expl = "Erratic spending behavior; large irregular outflows observed."

    # Total Health Score
    total_score = int(round(savings_score + expense_score + debt_score + stability_score + consistency_score))
    total_score = max(0, min(100, total_score))

    # Tiers
    if total_score >= 80:
        tier = "Excellent"
        color = "#10B981"  # Emerald
        summary_text = (
            f"Your financial health is Excellent at {total_score}/100! You maintain strong cashflow discipline, "
            f"a solid {savings_rate:.1f}% savings rate, and healthy balance protection. Keep building wealth!"
        )
    elif total_score >= 65:
        tier = "Good"
        color = "#3B82F6"  # Blue
        summary_text = (
            f"Your financial health is Good at {total_score}/100. You have healthy fundamentals, though minor "
            "optimizations in discretionary spending and emergency liquidity can elevate you to Excellent."
        )
    elif total_score >= 50:
        tier = "Fair"
        color = "#F59E0B"  # Amber
        summary_text = (
            f"Your financial health is Fair at {total_score}/100. Outflows consume a significant portion of income, "
            "leaving you vulnerable to unexpected financial shocks. Review high-spend categories."
        )
    else:
        tier = "Needs Attention"
        color = "#EF4444"  # Red
        summary_text = (
            f"Your score is {total_score}/100, indicating financial stress. High expenses or debt relative to "
            "income require immediate attention to avoid overdrafts and build a safety reserve."
        )

    pillars = [
        {
            "name": "Savings Rate",
            "score": savings_score,
            "max_score": 25.0,
            "percentage": round((savings_score / 25.0) * 100, 1),
            "status": savings_status,
            "explanation": savings_expl
        },
        {
            "name": "Expense-to-Income",
            "score": expense_score,
            "max_score": 25.0,
            "percentage": round((expense_score / 25.0) * 100, 1),
            "status": exp_status,
            "explanation": exp_expl
        },
        {
            "name": "Debt & EMI Burden",
            "score": debt_score,
            "max_score": 20.0,
            "percentage": round((debt_score / 20.0) * 100, 1),
            "status": debt_status,
            "explanation": debt_expl
        },
        {
            "name": "Balance Stability",
            "score": stability_score,
            "max_score": 15.0,
            "percentage": round((stability_score / 15.0) * 100, 1),
            "status": stab_status,
            "explanation": stab_expl
        },
        {
            "name": "Spending Consistency",
            "score": consistency_score,
            "max_score": 15.0,
            "percentage": round((consistency_score / 15.0) * 100, 1),
            "status": cons_status,
            "explanation": cons_expl
        }
    ]

    return {
        "total": total_score,
        "tier": tier,
        "color": color,
        "pillars": pillars,
        "summary_text": summary_text
    }
