import os
import re

# List of canonical conversion tool HTML files from conversion.html
conversion_tools = [
    'unit-converter.html',
    'currency-converter.html',
    'image-converter.html',
    'pdf_converter.html',
    'json-to-xml-converter.html',
    'roman-numeral-converter.html',
    'image-to-base64.html',
    'markdown-to-html-converter.html',
    'pdf-to-image-converter.html',
    'video-converter.html',
    'xml-to-json-converter.html',
    'archive_converter.html',
    'audio_converter.html',
    'document-converter.html',
    'heic_converter.html',
    'image_converter_tool.html',
    'image_pdf_converter.html',
    'image_svg_converter.html',
    'raw_image_converter.html',
    'resolution_converter.html',
    'video-to-audio-converter.html',
    'video-to-gif-converter.html',
    'word-to-pdf-converter.html',
    'pdf-to-word-converter.html',
    'pdf-to-ppt-converter.html',
    'ppt-to-pdf-converter.html',
    'pdf_excel_converter.html',
    'pdf_compressor.html',
    'conversion-calculator.html',
    'video_converter.html',
    'html-to-markdown.html',
    'text-case-converter.html',
]

# Directory containing the HTML files
TEMPLATES_DIR = '.'

# The favicon line to enforce
FAVICON_LINE = '<link rel="icon" type="image/svg+xml" href="favicon.svg">'

# Regex to match any favicon link
FAVICON_REGEX = re.compile(r'<link[^>]+rel=["\"]icon["\"][^>]*>', re.IGNORECASE)

def update_favicon(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Remove all favicon lines
    content_new = re.sub(FAVICON_REGEX, '', content)
    # Insert the correct favicon line just before </head>
    if FAVICON_LINE not in content_new:
        content_new = re.sub(r'(</head>)', f'    {FAVICON_LINE}\n\1', content_new, flags=re.IGNORECASE)
    # Remove extra blank lines
    content_new = re.sub(r'\n\s*\n', '\n', content_new)
    if content != content_new:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content_new)
        print(f'Updated: {filepath}')
    else:
        print(f'No change needed: {filepath}')

def main():
    for tool in conversion_tools:
        filepath = os.path.join(TEMPLATES_DIR, tool)
        if os.path.exists(filepath):
            update_favicon(filepath)
        else:
            print(f'File not found: {filepath}')

if __name__ == '__main__':
    main() 