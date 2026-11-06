from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Transaction(BaseModel):
    id: str
    date: str
    description: str
    raw_description: Optional[str] = None
    category: str
    debit: float = 0.0
    credit: float = 0.0
    balance: float = 0.0
    is_anomaly: bool = False
    anomaly_reason: Optional[str] = None

class MonthlyTrend(BaseModel):
    month: str
    income: float
    expenses: float
    savings: float
    savings_rate: float

class CategoryBreakdown(BaseModel):
    category: str
    amount: float
    percentage: float
    count: int
    color: Optional[str] = None

class MerchantBreakdown(BaseModel):
    merchant: str
    amount: float
    count: int
    category: str

class RecurringItem(BaseModel):
    name: str
    amount: float
    frequency: str
    category: str
    count: int
    last_date: str

class AnomalyItem(BaseModel):
    id: str
    date: str
    description: str
    amount: float
    category: str
    reason: str
    severity: str = "medium"  # low, medium, high

class ScorePillar(BaseModel):
    name: str
    score: float
    max_score: float
    percentage: float
    status: str
    explanation: str

class HealthScoreBreakdown(BaseModel):
    total: int
    tier: str  # Excellent, Good, Fair, Needs Attention
    color: str
    pillars: List[ScorePillar]
    summary_text: str

class RecommendationItem(BaseModel):
    id: str
    type: str  # warning, success, tip, info
    title: str
    description: str
    impact: str  # High, Medium, Low
    potential_monthly_savings: Optional[float] = None

class FinancialSummary(BaseModel):
    total_income: float
    total_expenses: float
    net_savings: float
    savings_rate: float
    avg_monthly_income: float
    avg_monthly_expense: float
    avg_daily_balance: float
    low_balance_days: int
    transaction_count: int
    date_range_start: str
    date_range_end: str
    detected_currency: str = "₹"

class AnalysisResponse(BaseModel):
    status: str = "success"
    filename: str
    account_number_masked: Optional[str] = None
    currency: str = "₹"
    summary: FinancialSummary
    health_score: HealthScoreBreakdown
    monthly_trends: List[MonthlyTrend]
    categories: List[CategoryBreakdown]
    merchants: List[MerchantBreakdown]
    recurring_payments: List[RecurringItem]
    anomalies: List[AnomalyItem]
    recommendations: List[RecommendationItem]
    transactions: List[Transaction]
