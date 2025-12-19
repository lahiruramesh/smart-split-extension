#!/bin/bash

# SMART-Split Extension Quick Install Script

echo "🚀 SMART-Split Extension Quick Install"
echo "======================================"
echo ""

EXTENSION_DIR="/Users/lahiruramesh/smart-split-v2/smart-split/smart-split-extension"
VSIX_FILE="$EXTENSION_DIR/smart-split-runner-0.0.1.vsix"

# Check if VSIX file exists
if [ ! -f "$VSIX_FILE" ]; then
    echo "❌ VSIX file not found at: $VSIX_FILE"
    echo "Please run: cd $EXTENSION_DIR && npm run package-extension"
    exit 1
fi

echo "✅ Found VSIX file: smart-split-runner-0.0.1.vsix"
echo ""

# Try to install using VS Code CLI
if command -v code &> /dev/null; then
    echo "📦 Installing extension..."
    code --install-extension "$VSIX_FILE"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Extension installed successfully!"
        echo ""
        echo "📝 Next steps:"
        echo "  1. Restart VS Code"
        echo "  2. Look for the 🚀 SMART-Split icon in the status bar"
        echo "  3. Click it to access SMART-Split commands"
        echo ""
    else
        echo ""
        echo "⚠️  Automatic installation failed."
        echo ""
        echo "Please install manually:"
        echo "  1. Open VS Code"
        echo "  2. Go to Extensions (Cmd+Shift+X)"
        echo "  3. Click '...' menu → Install from VSIX"
        echo "  4. Select: $VSIX_FILE"
        echo ""
    fi
else
    echo "⚠️  VS Code CLI 'code' command not found."
    echo ""
    echo "Please install manually:"
    echo "  1. Open VS Code"
    echo "  2. Go to Extensions (Cmd+Shift+X)"
    echo "  3. Click '...' menu → Install from VSIX"
    echo "  4. Select: $VSIX_FILE"
    echo ""
fi
