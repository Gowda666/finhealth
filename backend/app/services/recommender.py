from typing import List, Dict, Any
import pandas as pd

def generate_recommendations(
    summary: Dict[str, Any], 
    categories: List[Dict[str, Any]], 
    monthly_trends: List[Dict[str, Any]], 
    recurring: List[Dict[str, Any]], 
    df: pd.DataFrame,
    currency: str = "₹"
) -> List[Dict[str, Any]]:
    """Generate intelligent, personalized, and actionable financial recommendations."""
    recommendations: List[Dict[str, Any]] = []
    rec_id = 1

    total_income = summary["total_income"]
    total_expenses = summary["total_expenses"]
    savings_rate = summary["savings_rate"]
    avg_monthly_expense = summary["avg_monthly_expense"]
    avg_daily_balance = summary["avg_daily_balance"]

    # 1. Month-over-Month Category Spike Analysis
    if len(monthly_trends) >= 2:
        last_m = monthly_trends[-1]["month"]
        prev_m = monthly_trends[-2]["month"]

        last_df = df[df["date"].dt.strftime("%Y-%m") == last_m]
        prev_df = df[df["date"].dt.strftime("%Y-%m") == prev_m]

        for cat in ["Food & Dining", "Shopping & Retail", "Entertainment & Leisure"]:
            last_cat_spend = float(last_df[last_df["category"] == cat]["debit"].sum())
            prev_cat_spend = float(prev_df[prev_df["category"] == cat]["debit"].sum())

            if prev_cat_spend > 1000 and last_cat_spend > prev_cat_spend * 1.25:
                pct_rise = round(((last_cat_spend - prev_cat_spend) / prev_cat_spend) * 100)
                diff = last_cat_spend - prev_cat_spend
                recommendations.append({
                    "id": f"rec-{rec_id}",
                    "type": "warning",
                    "title": f"{cat} Spend Spike (+{pct_rise}%)",
                    "description": (
                        f"Your spending on {cat} rose by {pct_rise}% in {last_m} "
                        f"({currency}{last_cat_spend:,.0f} vs {currency}{prev_cat_spend:,.0f} in {prev_m}). "
                        f"Consider setting a weekly budget to rein in discretionary spending."
                    ),
                    "impact": "High" if diff > 5000 else "Medium",
                    "potential_monthly_savings": round(diff * 0.5, 2)
                })
                rec_id += 1

    # 2. Savings Rate Optimization
    if savings_rate < 15.0 and total_income > 0:
        target_savings_gap = (total_income * 0.20) - (total_income - total_expenses)
        recommendations.append({
            "id": f"rec-{rec_id}",
            "type": "warning",
            "title": "Boost Savings Towards 20% Target",
            "description": (
                f"Your current savings rate is {savings_rate:.1f}%. Financial experts recommend saving at least 20% "
                f"of income. Allocating {currency}{max(0, target_savings_gap / max(1, len(monthly_trends))):,.0f} "
                "more per month into an automated savings plan will dramatically accelerate financial freedom."
            ),
            "impact": "High",
            "potential_monthly_savings": round(max(1000.0, avg_monthly_expense * 0.1), 2)
        })
        rec_id += 1
    elif savings_rate >= 30.0:
        recommendations.append({
            "id": f"rec-{rec_id}",
            "type": "success",
            "title": "Super Saver Status",
            "description": (
                f"Exceptional savings rate of {savings_rate:.1f}%! Ensure your surplus cash is working for you "
                "via index funds, SIPs, or high-yield instruments rather than idling in a low-interest savings account."
            ),
            "impact": "Low",
            "potential_monthly_savings": None
        })
        rec_id += 1

    # 3. Recurring Subscriptions Audit
    if len(recurring) >= 3:
        total_sub_monthly = sum(r["amount"] for r in recurring if r["frequency"] == "Monthly")
        recommendations.append({
            "id": f"rec-{rec_id}",
            "type": "tip",
            "title": f"Review {len(recurring)} Recurring Subscriptions",
            "description": (
                f"You have {len(recurring)} recurring subscriptions totaling approximately {currency}{total_sub_monthly:,.0f}/month "
                f"({currency}{total_sub_monthly * 12:,.0f}/year). Audit unused streaming, apps, or gym memberships to eliminate waste."
            ),
            "impact": "Medium",
            "potential_monthly_savings": round(total_sub_monthly * 0.35, 2)
        })
        rec_id += 1

    # 4. Emergency Runway Assessment
    if avg_monthly_expense > 0:
        runway_months = avg_daily_balance / avg_monthly_expense
        if runway_months < 1.0:
            recommendations.append({
                "id": f"rec-{rec_id}",
                "type": "warning",
                "title": "Low Emergency Cash Buffer",
                "description": (
                    f"Your average daily balance ({currency}{avg_daily_balance:,.0f}) provides less than 1 month "
                    f"of living expenses ({runway_months:.1f} months). We recommend building a liquid emergency cushion "
                    f"of 3 to 6 months ({currency}{avg_monthly_expense * 3:,.0f}) in a separate emergency fund."
                ),
                "impact": "High",
                "potential_monthly_savings": None
            })
            rec_id += 1
        elif runway_months >= 3.0:
            recommendations.append({
                "id": f"rec-{rec_id}",
                "type": "success",
                "title": "Solid Emergency Buffer",
                "description": (
                    f"You maintain an excellent liquidity cushion of ~{runway_months:.1f} months of living expenses, "
                    "protecting you against unforeseen life emergencies."
                ),
                "impact": "Low",
                "potential_monthly_savings": None
            })
            rec_id += 1

    # 5. Food & Dining / Delivery Optimization
    food_cat = next((c for c in categories if c["category"] == "Food & Dining"), None)
    if food_cat and food_cat["percentage"] > 20.0:
        rec_savings = food_cat["amount"] * 0.25 / max(1, len(monthly_trends))
        recommendations.append({
            "id": f"rec-{rec_id}",
            "type": "tip",
            "title": "High Food & Takeout Outflows",
            "description": (
                f"Food & Dining represents {food_cat['percentage']:.1f}% of your total expenditures "
                f"({currency}{food_cat['amount']:,.0f} across {food_cat['count']} orders). "
                "Cooking at home 2 more days per week can save up to 25% of this category."
            ),
            "impact": "Medium",
            "potential_monthly_savings": round(rec_savings, 2)
        })
        rec_id += 1

    # 6. Low Balance Days Caution
    if summary["low_balance_days"] > 0:
        recommendations.append({
            "id": f"rec-{rec_id}",
            "type": "warning",
            "title": "Avoid Minimum Balance Penalties",
            "description": (
                f"Your balance dropped below the safe threshold on {summary['low_balance_days']} days. "
                "Set up low-balance SMS alerts or maintain a small automated sweep-in account to avoid bank penalty fees."
            ),
            "impact": "High",
            "potential_monthly_savings": None
        })
        rec_id += 1

    return recommendations[:6]
