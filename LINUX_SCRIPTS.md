
# Linux Setup Scripts

Since the automatic script file creation might have failed, please copy the content below into two separate files.

## 1. install-ebook-engine.sh

Create a file named `install-ebook-engine.sh` and paste the following code:

```bash
#!/bin/bash

# ==========================================
# Ebook-Engine Installer & Updater
# ==========================================

# Configuration
WEBAPP_DIR="ebook-engine-webapp"
ZIP_FILE="ebook-engine-webapp.zip"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Starting Ebook-Engine Setup...${NC}"

# 1. Check for Dependencies
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: Node.js (npm) is not installed.${NC}"
    echo "Please install Node.js (v18 or higher) to continue."
    exit 1
fi

if ! command -v unzip &> /dev/null; then
    echo -e "${RED}Error: 'unzip' utility is not installed.${NC}"
    echo "Please install it (e.g., sudo apt install unzip)."
    exit 1
fi

# 2. Check for ZIP file
if [ ! -f "$ZIP_FILE" ]; then
    # Try to find any zip if the specific name isn't found
    ZIP_FILE=$(find . -maxdepth 1 -name "*.zip" | head -n 1)
    if [ -z "$ZIP_FILE" ]; then
        echo -e "${RED}Error: No application ZIP file found in this directory.${NC}"
        exit 1
    fi
fi

echo -e "Found package: ${GREEN}$ZIP_FILE${NC}"

# 3. Extract/Update
if [ -d "$WEBAPP_DIR" ]; then
    echo "Updating existing installation..."
    # We unzip using -o to overwrite files without prompting
    unzip -o "$ZIP_FILE" -d "$WEBAPP_DIR"
else
    echo "Creating new installation..."
    mkdir -p "$WEBAPP_DIR"
    unzip "$ZIP_FILE" -d "$WEBAPP_DIR"
fi

# 4. Install/Update Dependencies
echo -e "${BLUE}Installing NPM Dependencies...${NC}"
cd "$WEBAPP_DIR" || exit

# This fixes the black screen issue by ensuring node_modules exists
npm install

# 5. Initialize Git (Optional)
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial install"
fi

echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}  Installation Complete!             ${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""
echo "To run the app:"
echo "  ./run-ebook-engine.sh --dev"
```

---

## 2. run-ebook-engine.sh

Create a file named `run-ebook-engine.sh` and paste the following code:

```bash
#!/bin/bash

# ==========================================
# Ebook-Engine Launcher
# ==========================================

WEBAPP_DIR="ebook-engine-webapp"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Ensure we are in the right place
if [ ! -d "$WEBAPP_DIR" ]; then
    echo -e "Error: Directory '$WEBAPP_DIR' not found."
    echo "Please run ./install-ebook-engine.sh first."
    exit 1
fi

cd "$WEBAPP_DIR" || exit

# Self-Healing: Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Dependencies missing. Running repair (npm install)...${NC}"
    npm install
fi

# Mode Selection
if [ "$1" == "--prod" ]; then
    echo -e "${GREEN}Starting PRODUCTION Preview...${NC}"
    echo "Building optimized assets..."
    npm run build
    echo "Launching preview server..."
    npm run preview
else
    echo -e "${GREEN}Starting DEVELOPMENT Server...${NC}"
    echo "This supports hot-reloading for editing."
    npm run dev
fi
```

## How to use

1.  Copy the content above into the respective files.
2.  Make them executable:
    ```bash
    chmod +x install-ebook-engine.sh run-ebook-engine.sh
    ```
3.  Run the installer:
    ```bash
    ./install-ebook-engine.sh
    ```
4.  Run the app:
    ```bash
    ./run-ebook-engine.sh --dev
    ```