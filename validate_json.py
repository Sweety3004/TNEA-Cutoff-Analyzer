import re

path = r'd:\TNEA Cutoff Analyzer\TNEA-Cutoff-Analyzer\index.html'

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the last <script> tag which usually contains the main logic
    scripts = list(re.finditer(r'<script>(.*?)</script>', content, re.DOTALL))
    if not scripts:
        print("No script tags found.")
    else:
        # Get the largest script block
        main_script = max(scripts, key=lambda m: len(m.group(1))).group(1)
        
        with open('check_syntax.js', 'w', encoding='utf-8') as f:
            f.write(main_script)
            
        print("Extracted JS to check_syntax.js")
        
except Exception as e:
    print(f"Error: {e}")
