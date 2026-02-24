import re

# Read the HTML file
with open('TNEA-Cutoff-Analyzer/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix malformed opening tags (< div -> <div)
content = re.sub(r'< (div|span|button|p|h[1-6]|a|li|ul|ol|table|tr|td|th|tbody|thead|section|article|header|footer|nav|main|aside)', r'<\1', content)

# Fix malformed closing tags (</div > -> </div>)
content = re.sub(r'</(div|span|button|p|h[1-6]|a|li|ul|ol|table|tr|td|th|tbody|thead|section|article|header|footer|nav|main|aside) >', r'</\1>', content)

# Write back
with open('TNEA-Cutoff-Analyzer/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed all malformed HTML tags!")
