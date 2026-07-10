import os

css_path = 'C:/Users/akrom/.gemini/antigravity/scratch/abdugofforov/style.css'
css_dir = 'C:/Users/akrom/.gemini/antigravity/scratch/abdugofforov/css'

if not os.path.exists(css_dir):
    os.makedirs(css_dir)

with open(css_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def get_chunk(start, end):
    return ''.join(lines[start:end])

# variables: 1 to 132 (0-indexed: 0 to 131)
with open(os.path.join(css_dir, 'variables.css'), 'w', encoding='utf-8') as f:
    f.write(get_chunk(0, 132))

# base: 132 to 307
with open(os.path.join(css_dir, 'base.css'), 'w', encoding='utf-8') as f:
    f.write(get_chunk(132, 307))

# layout: 307 to 1398
with open(os.path.join(css_dir, 'layout.css'), 'w', encoding='utf-8') as f:
    f.write(get_chunk(307, 1398))

# components: 1398 to 1842
with open(os.path.join(css_dir, 'components.css'), 'w', encoding='utf-8') as f:
    f.write(get_chunk(1398, 1842))

# pages: 1842 to 2895
with open(os.path.join(css_dir, 'pages.css'), 'w', encoding='utf-8') as f:
    f.write(get_chunk(1842, 2895))

# animations: 2895 to end
with open(os.path.join(css_dir, 'animations.css'), 'w', encoding='utf-8') as f:
    f.write(get_chunk(2895, len(lines)))

with open(css_path, 'w', encoding='utf-8') as f:
    f.write('''@import url("css/variables.css");
@import url("css/base.css");
@import url("css/layout.css");
@import url("css/components.css");
@import url("css/pages.css");
@import url("css/animations.css");
''')

print("CSS split successful!")
