# SMART-Split Runner

A comprehensive VS Code extension for the SMART-Split microservice decomposition framework. Features a **sidebar view**, **command palette integration**, and **real-time status indicators**.

## ✨ Features

### 🎛️ Sidebar Panel
Access all SMART-Split commands from a dedicated sidebar:
- **Commands Panel**: Beautiful buttons for all operations
- **Status Panel**: Real-time metrics display (MQ, SIS, BAI)
- **Service Overview**: See all detected microservices

### 📋 Available Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| 🚀 **Full Pipeline** | Complete decomposition workflow | `Cmd+Shift+S` |
| ✅ **Validation** | Analyze current decomposition | — |
| ✨ **Quality-Driven** | Decomposition with quality targets | — |
| 📝 **Custom Domain** | Use custom domain prompts | — |
| 📈 **Generate Charts** | Run analysis & visualizations | — |
| 📄 **Summary Report** | Generate comprehensive report | — |
| 🗑️ **Cleanup Database** | Reset Neo4j for fresh start | — |
| 📂 **Open Output** | Open analysis output folder | — |

### 📊 Status Bar Integration
- **🔧 SMART-Split**: Click to open quick menu
- **Status Indicator**: Shows idle/running/success/error state

### ⌨️ Keyboard Shortcuts
- `Cmd+Shift+S` (Mac) / `Ctrl+Shift+S` (Win): Show command menu
- `Cmd+Shift+F` (Mac) / `Ctrl+Shift+F` (Win): Run full pipeline

## Requirements

- **Python 3.8+** installed on your system
- **UV package manager** installed (`pip install uv` or `brew install uv`)
- **SMART-Split framework** cloned and set up
- **Neo4j database** running on `bolt://localhost:7687`

## Installation

### Option 1: Install from VSIX (Recommended)
1. Package the extension: `npm run package` (in the extension directory)
2. Install in VS Code: Extensions → `...` → Install from VSIX
3. Select `smart-split-runner-0.0.1.vsix`

### Option 2: Development Mode
1. Open the `smart-split-extension` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. The extension will be active in the new window

## Usage

1. **Open the SMART-Split workspace** in VS Code
2. Click the **🚀 SMART-Split** icon in the status bar
3. Select the command you want to run
4. View the output in the integrated terminal

The extension automatically detects your SMART-Split workspace and runs commands in the correct directory.

## Extension Settings

This extension does not add any custom settings at this time.

## Known Issues

- The extension assumes the SMART-Split project is in your workspace
- Requires `uv` to be installed and available in your PATH

## Release Notes

### 0.0.1

Initial release:
- Status bar integration with quick pick menu
- Four core commands (Full Pipeline, Validation, Analysis, Cleanup)
- Command Palette integration
- Automatic workspace detection
- Terminal integration for command execution

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
