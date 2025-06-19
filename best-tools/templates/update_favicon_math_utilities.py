import os
import re

# Math tools from math.html
math_tools = [
    'basic-calculator.html',
    'scientific-calculator.html',
    'percentage-calculator.html',
    'fraction-calculator.html',
    'gpa-calculator.html',
    'statistics_calculator.html',
    'average_calculator.html',
    'cgpa-to-percentage.html',
    'common_factor_calculator.html',
    'density_calculator.html',
    'dew_point_calculator.html',
    'gcf-calculator.html',
    'grade-calculator.html',
    'half-life-calculator.html',
    'heat_index_calculator.html',
    'hex_calculator.html',
    'horsepower_calculator.html',
    'lcm-calculator.html',
    'log_calculator.html',
    'long_division_calculator.html',
    'mass_calculator.html',
    'matrix_calculator.html',
    'mean_median_mode_range_calculator.html',
    'molarity_calculator.html',
    'molecular_weight_calculator.html',
    'percent_error_calculator.html',
    'percent_off_calculator.html',
    'permutation-combination-calculator.html',
    'pvalue_calculator.html',
    'random-number-generator.html',
    'root_calculator.html',
    'rounding_calculator.html',
    'sample_size_calculator.html',
    'scientific_notation_calculator.html',
    'slope_calculator.html',
    'standard-deviation-calculator.html',
    'surface_area_calculator.html',
    'triangle-calculator.html',
    'volume_calculator.html',
    'wind-chill-calculator.html',
    'z-score-calculator.html',
    'acceleration_calculator.html',
    'area_calculator.html',
    'binary_calculator.html',
    'distance_calculator.html',
    'exponent_calculator.html',
    'factorial_calculator.html',
    'fibonacci_calculator.html',
    'force_calculator.html',
    'speed_calculator.html',
]

# Utilities tools from utilities.html
utilities_tools = [
    'color-picker.html',
    'image-resizer.html',
    'online-signature-pad.html',
    'subnet-calculator.html',
    'electricity_calculator.html',
    'bandwidth_calculator.html',
    'voltage_drop_calculator.html',
    'speed-test.html',
    'ip-lookup.html',
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
    for tool in math_tools + utilities_tools:
        filepath = os.path.join(TEMPLATES_DIR, tool)
        if os.path.exists(filepath):
            update_favicon(filepath)
        else:
            print(f'File not found: {filepath}')

if __name__ == '__main__':
    main() 