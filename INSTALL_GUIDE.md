# SMART-Split VS Code Extension - Installation Guide

## ✅ Extension Successfully Created!

The SMART-Split Runner extension has been packaged and is ready to install.

## 📦 Installation Options

### Option 1: Install from VSIX File (Recommended)

1. **Locate the VSIX file**:
   ```
   /Users/lahiruramesh/smart-split-v2/smart-split/smart-split-extension/smart-split-runner-0.0.1.vsix
   ```

2. **Install in VS Code**:
   - Open VS Code
   - Go to Extensions view (`Cmd+Shift+X` or `Ctrl+Shift+X`)
   - Click the `...` menu (three dots) at the top
   - Select **"Install from VSIX..."**
   - Navigate to and select `smart-split-runner-0.0.1.vsix`
   - Restart VS Code if prompted

### Option 2: Development Mode (For Testing)

1. Open the extension folder in VS Code:
   ```bash
   code /Users/lahiruramesh/smart-split-v2/smart-split/smart-split-extension
   ```

2. Press `F5` to launch Extension Development Host

3. Test the extension in the new window

---

## 🚀 Usage

Once installed, you'll see a **🚀 SMART-Split** button in the status bar (bottom-left).

### Quick Access Menu
Click the status bar icon to open the command menu:
- **Run Full Pipeline** - Complete decomposition workflow
- **Run Validation** - Quality metrics analysis
- **Run Analysis** - Generate charts and visualizations
- **Cleanup Database** - Reset Neo4j for fresh start

### Command Palette
Access via `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux):
- `SMART-Split: Show Menu`
- `SMART-Split: Run Full Pipeline`
- `SMART-Split: Run Validation`
- `SMART-Split: Run Analysis`
- `SMART-Split: Cleanup Database`

---

## ⚙️ Requirements

Ensure these are installed before using the extension:

- ✅ **Python 3.8+**
- ✅ **UV package manager** (`pip install uv` or `brew install uv`)
- ✅ **Neo4j database** running on `bolt://localhost:7687`
- ✅ **SMART-Split framework** set up with dependencies

---

## 📁 File Structure

```
smart-split-extension/
├── dist/
│   └── extension.js          # Compiled extension
├── src/
│   └── extension.ts          # Source code
├── package.json              # Extension manifest
├── README.md                 # Documentation
├── CHANGELOG.md              # Version history
└── smart-split-runner-0.0.1.vsix  # Installable package
```

---

## 🔧 Development Commands

If you want to modify the extension:

```bash
cd /Users/lahiruramesh/smart-split-v2/smart-split/smart-split-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package as VSIX
npm run package-extension
```

---

## 🎯 Features Implemented

✅ Status bar integration with icon
✅ Quick pick menu for all commands
✅ Terminal integration for command execution
✅ Automatic workspace detection
✅ Command Palette integration
✅ Four core commands (Full, Validation, Analysis, Cleanup)

---

## 🐛 Troubleshooting

**Issue**: Extension doesn't find SMART-Split workspace
- **Solution**: Ensure you've opened the `smart-split` folder in VS Code

**Issue**: Commands fail to execute
- **Solution**: Verify `uv` is installed and in your PATH (`which uv`)

**Issue**: Status bar icon not visible
- **Solution**: Restart VS Code after installation

---

## 📝 Next Steps

1. Install the extension using Option 1 above
2. Open your SMART-Split workspace in VS Code
3. Click the 🚀 icon in the status bar
4. Select a command and watch it execute!

**Enjoy faster access to SMART-Split commands!** 🎉
