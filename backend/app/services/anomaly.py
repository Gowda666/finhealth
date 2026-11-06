import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple
from sklearn.ensemble import IsolationForest

def detect_anomalies(df: pd.DataFrame, currency: str = "₹") -> Tuple[pd.DataFrame, List[Dict[str, Any]]]:
    """Flag anomalous debit transactions using both dynamic IQR rules and IsolationForest."""
    df["is_anomaly"] = False
    df["anomaly_reason"] = None
    anomalies: List[Dict[str, Any]] = []

    debit_mask = df["debit"] > 0
    debit_df = df[debit_mask].copy()

    if len(debit_df) < 5:
        # Not enough data points to compute meaningful statistical distribution
        return df, anomalies

    # 1. Category-level Median and IQR
    category_stats = debit_df.groupby("category")["debit"].agg(
        median="median",
        q75=lambda x: np.percentile(x, 75) if len(x) > 1 else np.median(x),
        q25=lambda x: np.percentile(x, 25) if len(x) > 1 else np.median(x),
        count="count"
    ).to_dict("index")

    # Overall dataset stats
    overall_p95 = np.percentile(debit_df["debit"], 95)
    overall_median = np.median(debit_df["debit"])

    # 2. IsolationForest on debits
    # Feature matrix: log-scaled debit amount
    iso_features = np.log1p(debit_df["debit"].values).reshape(-1, 1)
    # Contamination around 3% to 5%
    contamination = min(0.08, max(0.02, 3.0 / len(debit_df)))
    
    try:
        iso_model = IsolationForest(contamination=contamination, random_state=42)
        iso_preds = iso_model.fit_predict(iso_features)
    except Exception:
        iso_preds = np.ones(len(debit_df))

    for idx, (original_idx, row) in enumerate(debit_df.iterrows()):
        amt = row["debit"]
        cat = row["category"]
        reason = None
        severity = "medium"

        # Check category median multiplier
        cat_info = category_stats.get(cat, {})
        cat_med = cat_info.get("median", overall_median)
        cat_count = cat_info.get("count", 1)

        # Rule 1: Extreme spike vs category (e.g. ₹40,000 for food or shopping)
        if cat_count >= 3 and amt > max(2000.0, 3.5 * cat_med) and amt > 1.5 * overall_median:
            ratio = round(amt / cat_med, 1)
            reason = f"Amount ({currency}{amt:,.0f}) is {ratio}x higher than typical {cat} spending ({currency}{cat_med:,.0f})."
            severity = "high" if ratio > 5 else "medium"

        # Rule 2: Top 95th percentile spike
        elif amt >= overall_p95 and amt > 3 * overall_median and amt > 5000:
            reason = f"Unusually large single debit ({currency}{amt:,.0f}), exceeding 95% of all recorded expenses."
            severity = "high"

        # Rule 3: IsolationForest flagging if amount is substantially above average
        elif iso_preds[idx] == -1 and amt > 2.5 * overall_median:
            reason = f"Identified as statistical outlier based on spending distribution."
            severity = "low"

        if reason:
            df.loc[original_idx, "is_anomaly"] = True
            df.loc[original_idx, "anomaly_reason"] = reason

            anomalies.append({
                "id": str(original_idx),
                "date": row["date_str"],
                "description": row["description"],
                "amount": float(amt),
                "category": cat,
                "reason": reason,
                "severity": severity
            })

    # Sort anomalies descending by amount
    anomalies.sort(key=lambda x: x["amount"], reverse=True)
    return df, anomalies
