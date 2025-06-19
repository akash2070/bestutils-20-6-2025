import os
import re
from datetime import date
import xml.etree.ElementTree as ET

templates_dir = 'best-tools/templates'
sitemap_path = 'best-tools/sitemap.xml'

templates = set(f for f in os.listdir(templates_dir) if f.endswith('.html'))
tree = ET.parse(sitemap_path)
root = tree.getroot()
ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
existing = set()
for loc in root.findall('.//ns:loc', ns):
    m = re.match(r'.*/templates/(.*)', loc.text)
    if m:
        existing.add(m.group(1))
missing = templates - existing

def cat(f):
    f = f.lower()
    if 'auto' in f or 'mileage' in f or 'fuel' in f or 'tire' in f or 'boat' in f or 'speed' in f:
        return 'AUTOMOTIVE'
    if 'loan' in f or 'finance' in f or 'roi' in f or 'investment' in f or 'tax' in f or 'mortgage' in f or 'emi' in f or 'retirement' in f or 'annuity' in f or 'pension' in f or 'salary' in f or 'commission' in f or 'budget' in f or 'payment' in f or 'payback' in f or 'lease' in f or 'rent' in f or 'real-estate' in f or 'refinance' in f or 'college' in f or 'house_affordability' in f or 'ira' in f:
        return 'FINANCE'
    if 'bmi' in f or 'bmr' in f or 'body' in f or 'weight' in f or 'health' in f or 'heart' in f or 'calorie' in f or 'pregnancy' in f or 'period' in f or 'ovulation' in f or 'gfr' in f or 'bac' in f or 'one_rep' in f or 'height' in f or 'lean' in f or 'overweight' in f or 'anorexic' in f or 'sleep' in f or 'tdee' in f:
        return 'HEALTH'
    if 'calc' in f or 'math' in f or 'average' in f or 'fraction' in f or 'gcf' in f or 'lcm' in f or 'root' in f or 'log' in f or 'triangle' in f or 'matrix' in f or 'long_division' in f or 'roman' in f or 'scientific' in f or 'mean' in f or 'standard' in f or 'statistics' in f or 'sample' in f or 'z-score' in f or 'pvalue' in f or 'hex' in f or 'grade' in f or 'gpa' in f or 'cgpa' in f or 'depricialtion' in f or 'density' in f or 'half-life' in f or 'horsepower' in f or 'molarity' in f or 'molecular' in f or 'permutation' in f or 'combination' in f or 'percent' in f or 'rounding' in f:
        return 'MATH'
    if 'convert' in f or 'converter' in f or 'unit' in f or 'currency' in f or 'pdf' in f or 'image' in f or 'audio' in f or 'video' in f or 'document' in f or 'html' in f or 'json' in f or 'xml' in f or 'ppt' in f or 'raw' in f or 'heic' in f or 'resolution' in f:
        return 'CONVERSION'
    if 'concrete' in f or 'roofing' in f or 'tile' in f or 'gravel' in f or 'mulch' in f or 'stair' in f or 'square_footage' in f or 'surface_area' in f or 'ohms' in f or 'resistor' in f or 'voltage' in f:
        return 'CONSTRUCTION'
    if 'color' in f or 'resizer' in f or 'subnet' in f or 'electricity' in f or 'voice' in f or 'stopwatch' in f or 'random' in f or 'uuid' in f or 'password' in f or 'qr' in f or 'text-case' in f or 'url' in f:
        return 'UTILITIES'
    if 'age' in f or 'date' in f or 'time' in f or 'due' in f or 'hours' in f or 'sleep' in f:
        return 'TIME'
    if 'word' in f or 'essay' in f or 'signature' in f or 'jwt' in f or 'password' in f or 'qr' in f or 'regex' in f or 'resume' in f or 'sql' in f or 'text' in f or 'typing' in f:
        return 'TEXT'
    return 'OTHER'

catmap = {}
for f in missing:
    catmap.setdefault(cat(f), []).append(f)
urltpl = '        <url>\n            <loc>https://bestutils.com/templates/{}</loc>\n            <lastmod>{}</lastmod>\n            <changefreq>monthly</changefreq>\n            <priority>0.7</priority>\n        </url>\n'
today = date.today().isoformat()
with open(sitemap_path, 'r', encoding='utf-8') as fin:
    lines = fin.readlines()
out = []
i = 0
while i < len(lines):
    out.append(lines[i])
    for catname in ['AUTOMOTIVE','FINANCE','HEALTH','MATH','CONVERSION','CONSTRUCTION','UTILITIES','TIME','TEXT','OTHER']:
        if '<!-- ================= {} TOOLS ================= -->'.format(catname) in lines[i]:
            i += 1
            while i < len(lines) and '<!--' in lines[i] and 'Missing' in lines[i]:
                i += 1
            if catname in catmap:
                for f in sorted(catmap[catname]):
                    out.append(urltpl.format(f, today))
            continue
    i += 1
with open(sitemap_path, 'w', encoding='utf-8') as fout:
    fout.writelines(out)
print('Added missing tool links to sitemap.xml') 