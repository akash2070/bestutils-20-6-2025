import os
import re
from difflib import get_close_matches

# Health calculator files as per health.html
health_files = [
    'bmi-calculator.html', 'calorie-calculator.html', 'body-fat-calculator.html', 'ideal-weight-calculator.html',
    'pregnancy-calculator.html', 'bmr-calculator.html', 'anorexic-bmi-calculator.html', 'army_body_fat_calculator.html',
    'bac_calculator.html', 'body-surface-area-calculator.html', 'body-type-calculator.html', 'gfr_calculator.html',
    'golf_handicap_calculator.html', 'healthy_weight_calculator.html', 'heart_rate_calculator.html', 'height_calculator.html',
    'lean_body_mass_calculator.html', 'love_calculator.html', 'macro_calculator.html', 'one_rep_max_calculator.html',
    'overweight_calculator.html', 'ovulation_calculator.html', 'period_calculator.html', 'pregnancy-conception-calculator.html',
    'pregnancy_weight_calculator.html', 'sleep_calculator.html', 'tdee_calculator.html', 'weight_calculator.html',
    'weight_watchers_calculator.html'
]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(SCRIPT_DIR, 'best-tools', 'templates')
FAVICON_LINE = '<link rel="icon" type="image/svg+xml" href="favicon.svg">'

favicon_regex = re.compile(r'<link[^>]*rel=["\"]icon["\"][^>]*>', re.IGNORECASE)

def normalize(name):
    return name.replace('-', '').replace('_', '').lower()

def update_favicon(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content_new = re.sub(favicon_regex, '', content)
    if FAVICON_LINE not in content_new:
        content_new = re.sub(r'(<head[^>]*>)', r'\1\n    ' + FAVICON_LINE, content_new, count=1, flags=re.IGNORECASE)
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
    for canon in health_files:
        canon_norm = normalize(canon)
        matches = [f for f in actual_files if normalize(f) == canon_norm]
        if not matches:
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