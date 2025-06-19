import os
import re

# Automotive tools from automotive.html
automotive_tools = [
    'fuel_cost_calculator.html',
    'gas_mileage_calculator.html',
    'mileage_calculator.html',
    'tire-size-calculator.html',
]

# Construction tools from construction.html
construction_tools = [
    'concrete-calculator.html',
    'roofing-calculator.html',
    'square_footage_calculator.html',
    'tile_calculator.html',
    'stair_calculator.html',
    'gravel_calculator.html',
    'mulch_calculator.html',
    'ohms-law-calculator.html',
    'resistor-calculator.html',
]

TEMPLATES_DIR = '.'
FAVICON_LINE = '<link rel="icon" type="image/svg+xml" href="favicon.svg">'
FAVICON_REGEX = re.compile(r'<link[^>]+rel=["\"]icon["\"][^>]*>', re.IGNORECASE)

def update_favicon(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content_new = re.sub(FAVICON_REGEX, '', content)
    if FAVICON_LINE not in content_new:
        content_new = re.sub(r'(</head>)', f'    {FAVICON_LINE}\n\1', content_new, flags=re.IGNORECASE)
    content_new = re.sub(r'\n\s*\n', '\n', content_new)
    if content != content_new:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content_new)
        print(f'Updated: {filepath}')
    else:
        print(f'No change needed: {filepath}')

def main():
    for tool in automotive_tools + construction_tools:
        filepath = os.path.join(TEMPLATES_DIR, tool)
        if os.path.exists(filepath):
            update_favicon(filepath)
        else:
            print(f'File not found: {filepath}')

if __name__ == '__main__':
    main() 