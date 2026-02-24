import re

path = r'd:\TNEA Cutoff Analyzer\TNEA-Cutoff-Analyzer\index.html'

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find ALL script tags
    scripts = list(re.finditer(r'<script>(.*?)</script>', content, re.DOTALL))
    
    print(f"Found {len(scripts)} script tags.")
    
    if scripts:
        # The last one is likely the main app logic now
        main_script = scripts[-1].group(1)
        
        with open('check_syntax_v2.js', 'w', encoding='utf-8') as f:
            f.write(main_script)
            
        print("Extracted main script to check_syntax_v2.js")
        
except Exception as e:
    print(f"Error: {e}")
