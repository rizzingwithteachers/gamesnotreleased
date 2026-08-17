import os
import re
from pathlib import Path

# Target settings
NEW_TITLE = "Dashboard | RapidIdentity"
FAVICON_PATH = "https://northallegheny.us004-rapididentity.com:443/files/NAlogo_gold_flat.png"
FAVICON_TAG = f'<link rel="icon" href="{FAVICON_PATH}" type="image/png">'

# Get current directory
project_dir = Path(__file__).parent

# Track updated files
updated_count = 0

for file_path in project_dir.rglob("*.html"):
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        # 1. Replace or Add <title>
        if re.search(r"<title>.*?</title>", content, flags=re.IGNORECASE | re.DOTALL):
            content = re.sub(
                r"<title>.*?</title>",
                f"<title>{NEW_TITLE}</title>",
                content,
                flags=re.IGNORECASE | re.DOTALL,
            )
        elif "</head>" in content.lower():
            content = re.sub(
                r"</head>",
                f"  <title>{NEW_TITLE}</title>\n</head>",
                content,
                flags=re.IGNORECASE,
            )

        # 2. Replace existing favicon links OR insert the new one into <head>
        icon_pattern = r'<link\s+[^>]*rel=["\'](?:shortcut\s+)?icon["\'][^>]*>'
        if re.search(icon_pattern, content, flags=re.IGNORECASE):
            content = re.sub(
                icon_pattern, FAVICON_TAG, content, flags=re.IGNORECASE
            )
        elif "</head>" in content.lower():
            content = re.sub(
                r"</head>", f"  {FAVICON_TAG}\n</head>", content, flags=re.IGNORECASE
            )

        # Save back to file
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

        print(f"Updated: {file_path.name}")
        updated_count += 1

    except Exception as e:
        print(f"Failed to update {file_path.name}: {e}")

print(f"\nDone! Successfully updated {updated_count} HTML file(s).")