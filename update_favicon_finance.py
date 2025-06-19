import os
import re
from difflib import get_close_matches

# Canonical finance tool names from finance.html (without path)
canonical_files = [
    'loan-calculator.html', 'mortgage-calculator.html', 'auto-loan-calculator.html', 'personal-loan-calculator.html',
    'student_loan_calculator.html', 'business_loan_calculator.html', 'boat-loan-calculator.html', 'va-mortgage-calculator.html',
    'mortgage-calculator-uk.html', 'refinance-calculator.html', 'mortgage_payoff_calculator.html', 'mortgage-amortization-calculator.html',
    'amortization-calculator.html', 'repayment-calculator.html', 'loan-emi-calculator.html',
    'investment-calculator.html', 'compound-interest-calculator.html', 'interest-calculator.html', 'simple_interest_calculator.html',
    'interest-rate-calculator.html', 'roi-calculator.html', 'future_value_calculator.html', 'sip-calculator.html', 'irr_calculator.html',
    'payback_period_calculator.html', 'retirement-calculator.html', '401k-calculator.html', 'ira-calculator.html', 'roth_ira_calculator.html',
    'pension_calculator.html', 'social_security_calculator.html', 'rmd-calculator.html', 'savings_calculator.html', 'annuity-calculator.html',
    'annuity-payout-calculator.html', 'income-tax-calculator.html', 'income-tax-estimator.html', 'sales-tax-calculator.html', 'gst-calculator.html',
    'vat-calculator.html', 'marriage_tax_calculator.html', 'real-estate-calculator.html', 'rental-property-calculator.html', 'rent-calculator.html',
    'rent-vs-buy-calculator.html', 'house_affordability_calculator.html', 'margin_calculator.html', 'commission_calculator.html', 'budget_calculator.html',
    'salary-calculator.html', 'take_home_calculator.html', 'depricialtion-calculator.html', 'gdp_calculator.html'
]

# Use absolute path for templates directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(SCRIPT_DIR, 'best-tools', 'templates')
FAVICON_LINE = '<link rel="icon" type="image/svg+xml" href="favicon.svg">'

# Regex to match any favicon link
favicon_regex = re.compile(r'<link[^>]*rel=["\"]icon["\"][^>]*>', re.IGNORECASE)

def normalize(name):
    return name.replace('-', '').replace('_', '').lower()

def update_favicon(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Remove all existing favicon lines
    content_new = re.sub(favicon_regex, '', content)
    # Insert the correct favicon line just after <head> if not present
    if FAVICON_LINE not in content_new:
        content_new = re.sub(r'(<head[^>]*>)', r'\1\n    ' + FAVICON_LINE, content_new, count=1, flags=re.IGNORECASE)
    # Clean up extra blank lines
    content_new = re.sub(r'\n\s*\n', '\n', content_new)
    if content != content_new:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content_new)
        print(f'Updated: {filepath}')
    else:
        print(f'No change needed: {filepath}')

def main():
    actual_files = [f for f in os.listdir(TEMPLATES_DIR) if f.endswith('.html')]
    mapped = {}
    for canon in canonical_files:
        canon_norm = normalize(canon)
        matches = [f for f in actual_files if normalize(f) == canon_norm]
        if not matches:
            # Try fuzzy match (difflib)
            close = get_close_matches(canon, actual_files, n=1, cutoff=0.8)
            if close:
                matches = close
        if matches:
            mapped[canon] = matches[0]
        else:
            print(f'No match found for: {canon}')
    for canon, fname in mapped.items():
        path = os.path.join(TEMPLATES_DIR, fname)
        update_favicon(path)

if __name__ == '__main__':
    main() 