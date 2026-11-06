import re
from typing import Dict, List, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Standard category color palette
CATEGORY_COLORS: Dict[str, str] = {
    "Salary & Income": "#10B981",       # Emerald green
    "Food & Dining": "#F59E0B",         # Amber
    "Groceries & Supermarket": "#84CC16", # Lime
    "Housing & Rent": "#6366F1",        # Indigo
    "EMI & Loans": "#EF4444",           # Red
    "Utilities & Bills": "#06B6D4",     # Cyan
    "Shopping & Retail": "#EC4899",     # Pink
    "Travel & Transport": "#3B82F6",    # Blue
    "Entertainment & Leisure": "#8B5CF6", # Purple
    "Investments & Savings": "#14B8A6",  # Teal
    "Healthcare & Medical": "#F43F5E",  # Rose
    "Transfers & UPI": "#64748B",       # Slate
    "Bank Charges & Fees": "#94A3B8",   # Gray
    "Other Expenses": "#A855F7"         # Violet
}

# Rule taxonomy keywords
RULES: Dict[str, List[str]] = {
    "Salary & Income": [
        "salary", "payroll", "stipend", "bonus", "dividend", "interest cr", 
        "int.pd", "direct dep", "neft cr", "rtgs cr", "ach credit", "refund"
    ],
    "Housing & Rent": [
        "rent", "landlord", "society maintenance", "apartment maintenance", 
        "nobroker", "housing", "lease", "nestaway"
    ],
    "EMI & Loans": [
        "emi", "loan", "bajaj finserv", "home loan", "car loan", "personal loan", 
        "hdb financial", "hdfc credila", "equated monthly", "mortgage", "chase card epay",
        "citi payment", "sbi card", "credit card payment", "hdfc card pay"
    ],
    "Food & Dining": [
        "swiggy", "zomato", "restaurant", "cafe", "starbucks", "mcdonald", "burger king", 
        "domino", "pizza", "kfc", "dunkin", "barbeque", "bistro", "tims", "costa coffee",
        "subway", "eats", "doordash", "ubereats", "grubhub", "dining", "bakery"
    ],
    "Groceries & Supermarket": [
        "blinkit", "zepto", "instamart", "bigbasket", "dmart", "reliance fresh", 
        "spencer", "supermarket", "grocery", "trader joe", "whole foods", "walmart", 
        "target", "costco", "nature basket", "safeway", "kroger"
    ],
    "Utilities & Bills": [
        "electricity", "bescom", "tneb", "uppcl", "mahadiscom", "water bill", 
        "gas bill", "igl", "mgl", "airtel", "jio", "vi bill", "vodafone", "broadband", 
        "act corp", "wifi", "internet", "postpaid", "dth", "tata play", "dish tv", 
        "at&t", "verizon", "t-mobile", "coned", "utility"
    ],
    "Shopping & Retail": [
        "amazon", "amzn", "flipkart", "myntra", "ajio", "nykaa", "zara", "h&m", 
        "uniqlo", "ikea", "decathlon", "meesho", "ebay", "best buy", "etsy", 
        "lifestyle", "shoppers stop", "westside", "retail"
    ],
    "Travel & Transport": [
        "uber", "ola", "rapido", "metro", "irctc", "makemytrip", "goibibo", 
        "cleartrip", "indigo", "air india", "vistara", "flight", "petrol", "fuel", 
        "hpcl", "bpcl", "iocl", "shell", "fastag", "toll", "lyft", "gas station", 
        "parking", "railway"
    ],
    "Entertainment & Leisure": [
        "netflix", "spotify", "hotstar", "prime video", "bookmyshow", "pvr", 
        "inox", "cinema", "theatre", "apple music", "youtube premium", "steam", 
        "playstation", "audible", "disney", "hulu", "gym", "cult.fit", "cult fit"
    ],
    "Investments & Savings": [
        "zerodha", "groww", "kuvera", "upstox", "angelone", "mutual fund", "sip", 
        "uti mf", "hdfc mf", "sbi mf", "ppf", "nps", "et money", "vanguard", 
        "fidelity", "charles schwab", "robinhood", "coin", "crypto"
    ],
    "Healthcare & Medical": [
        "apollo", "pharmacy", "1mg", "pharmeasy", "medplus", "hospital", 
        "clinic", "dental", "doctor", "pathology", "diagnostic", "dr lal", 
        "thyrocare", "walgreens", "cvs pharmacy", "medicare"
    ],
    "Bank Charges & Fees": [
        "annual fee", "charge", "gst", "service charge", "atm fee", "sms charges", 
        "overdraft fee", "late fee", "penal int", "minimum bal fee", "maintenance fee"
    ]
}

# Merchant cleaning pattern
COMMON_MERCHANTS: Dict[str, str] = {
    "swiggy": "Swiggy",
    "zomato": "Zomato",
    "amazon": "Amazon",
    "amzn": "Amazon",
    "flipkart": "Flipkart",
    "blinkit": "Blinkit",
    "zepto": "Zepto",
    "uber": "Uber",
    "ola": "Ola",
    "netflix": "Netflix",
    "spotify": "Spotify",
    "cult.fit": "Cult.fit",
    "cultfit": "Cult.fit",
    "starbucks": "Starbucks",
    "mcdonald": "McDonald's",
    "airtel": "Airtel",
    "jio": "Jio Telecom",
    "irctc": "IRCTC",
    "zerodha": "Zerodha",
    "groww": "Groww",
    "myntra": "Myntra",
    "walmart": "Walmart",
    "target": "Target",
    "costco": "Costco",
    "apollo": "Apollo Pharmacy",
    "pharmeasy": "PharmEasy",
    "bescom": "BESCOM Electricity",
    "fastag": "FASTag Toll",
    "apple": "Apple Services"
}

# Synthetic seed corpus to train lightweight ML fallback classifier
TRAINING_CORPUS: List[Tuple[str, str]] = [
    ("payroll tech services direct deposit monthly salary", "Salary & Income"),
    ("dividend credit from shares investment fund", "Salary & Income"),
    ("interest credited on fixed deposit savings account", "Salary & Income"),
    ("rental payment to landlord monthly apartment", "Housing & Rent"),
    ("society maintenance flat charges quarterly", "Housing & Rent"),
    ("housing society maintenance charges bill", "Housing & Rent"),
    ("housing loan emi auto debit hdfc bank", "EMI & Loans"),
    ("car loan instalment auto debit axis bank", "EMI & Loans"),
    ("credit card outstanding payment bill desk", "EMI & Loans"),
    ("personal loan deduction monthly repayment", "EMI & Loans"),
    ("pizza dinner craft beer bistro burger lunch", "Food & Dining"),
    ("coffee espresso latte pastry bakery takeout", "Food & Dining"),
    ("fine dining gourmet kitchen restaurant food order", "Food & Dining"),
    ("fresh vegetable fruits milk bread grocery store", "Groceries & Supermarket"),
    ("supermarket daily essentials pantry items organic food", "Groceries & Supermarket"),
    ("electricity bill payment energy power supply", "Utilities & Bills"),
    ("broadband fiber internet monthly subscription bill", "Utilities & Bills"),
    ("mobile recharge postpaid data connection voice", "Utilities & Bills"),
    ("cooking gas cylinder utility water municipality tax", "Utilities & Bills"),
    ("clothing shoes apparel sunglasses fashion bag", "Shopping & Retail"),
    ("electronics gadget headphones laptop mouse purchase", "Shopping & Retail"),
    ("home decor furniture kitchenware online order", "Shopping & Retail"),
    ("cab ride taxi fare airport drop transit", "Travel & Transport"),
    ("train reservation express railway ticket booking", "Travel & Transport"),
    ("flight tickets domestic airlines airfare luggage", "Travel & Transport"),
    ("petrol fuel refill diesel gas station pump", "Travel & Transport"),
    ("movie cinema popcorn ticket multiplex theatre", "Entertainment & Leisure"),
    ("streaming music podcast subscription monthly", "Entertainment & Leisure"),
    ("gym fitness center membership workout yoga", "Entertainment & Leisure"),
    ("equity mutual fund systematic investment plan purchase", "Investments & Savings"),
    ("stocks securities broker deposit trading balance", "Investments & Savings"),
    ("national pension scheme retirement contribution", "Investments & Savings"),
    ("prescription medicine tablets capsules doctor consultation", "Healthcare & Medical"),
    ("blood test pathology clinic diagnostic hospital bills", "Healthcare & Medical"),
    ("dentist dental care root canal eye checkup spectacles", "Healthcare & Medical"),
    ("monthly account maintenance ledger fee charges", "Bank Charges & Fees"),
    ("atm interchange fee debit card annual charge tax", "Bank Charges & Fees"),
    ("money sent to friend upi transfer via phone", "Transfers & UPI"),
    ("fund transfer peer to peer payment settled", "Transfers & UPI")
]

class CategorizerEngine:
    def __init__(self):
        # Build and train ML fallback pipeline
        texts = [item[0] for item in TRAINING_CORPUS]
        labels = [item[1] for item in TRAINING_CORPUS]
        self.ml_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
            ("clf", MultinomialNB(alpha=0.1))
        ])
        self.ml_pipeline.fit(texts, labels)

    def extract_clean_merchant(self, desc: str) -> Optional[str]:
        """Extract recognizable merchant name from narration string."""
        desc_lower = desc.lower()
        for kw, merchant in COMMON_MERCHANTS.items():
            if kw in desc_lower:
                return merchant
        
        # If narration looks like UPI/NAME/ID, extract NAME
        upi_match = re.search(r'UPI(?:/|-)([A-Za-z0-9 ]+?)(?:/|-|\d)', desc, re.IGNORECASE)
        if upi_match:
            candidate = upi_match.group(1).strip()
            if len(candidate) > 2 and not candidate.isnumeric():
                return candidate.title()
                
        # POS / Card match
        pos_match = re.search(r'(?:POS|ECOM|TXN)\s+([A-Za-z0-9 ]+)', desc, re.IGNORECASE)
        if pos_match:
            candidate = pos_match.group(1).split()[0].strip()
            if len(candidate) > 2:
                return candidate.title()

        return None

    def categorize(self, description: str, debit: float, credit: float) -> str:
        """Categorize transaction using rules first, ML fallback second."""
        desc_lower = (description or "").lower()

        # If credit and matches salary patterns
        if credit > 0:
            for kw in RULES["Salary & Income"]:
                if kw in desc_lower:
                    return "Salary & Income"
            # Interest credit
            if "interest" in desc_lower or "int.pd" in desc_lower or "dividend" in desc_lower:
                return "Salary & Income"
            if credit > debit and any(k in desc_lower for k in ["salary", "payroll", "stipend"]):
                return "Salary & Income"

        # Check keyword rules
        for category, keywords in RULES.items():
            if category == "Salary & Income" and credit == 0 and debit > 0:
                continue  # Don't categorize debits as salary unless explicit refund
            for kw in keywords:
                if re.search(r'\b' + re.escape(kw) + r'\b', desc_lower) or kw in desc_lower:
                    return category

        # Generic UPI or transfer
        if "upi" in desc_lower or "imps" in desc_lower or "neft" in desc_lower or "rtgs" in desc_lower:
            return "Transfers & UPI"

        # Clean description for ML
        clean_text = re.sub(r'[^a-zA-Z\s]', ' ', desc_lower)
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()

        if len(clean_text) >= 4:
            try:
                pred = self.ml_pipeline.predict([clean_text])[0]
                proba = max(self.ml_pipeline.predict_proba([clean_text])[0])
                if proba >= 0.35:
                    return pred
            except Exception:
                pass

        return "Other Expenses"

categorizer = CategorizerEngine()
