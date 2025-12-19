import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Global state
let statusBarItem: vscode.StatusBarItem;
let statusBarStatus: vscode.StatusBarItem;
let commandsWebviewProvider: SmartSplitCommandsProvider;
let statusWebviewProvider: SmartSplitStatusProvider;
let currentStatus: 'idle' | 'running' | 'success' | 'error' = 'idle';

export function activate(context: vscode.ExtensionContext) {
    console.log('SMART-Split Runner extension is now active!');

    // Create main status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = "$(layers) SMART-Split";
    statusBarItem.tooltip = "Click to run SMART-Split commands";
    statusBarItem.command = 'smart-split-runner.showMenu';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Create status indicator
    statusBarStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    updateStatusBar('idle');
    statusBarStatus.show();
    context.subscriptions.push(statusBarStatus);

    // Register webview providers for sidebar
    commandsWebviewProvider = new SmartSplitCommandsProvider(context.extensionUri);
    statusWebviewProvider = new SmartSplitStatusProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('smartSplitCommands', commandsWebviewProvider),
        vscode.window.registerWebviewViewProvider('smartSplitStatus', statusWebviewProvider)
    );

    // Register all commands
    registerCommands(context);
}

function registerCommands(context: vscode.ExtensionContext) {
    // Show Menu command
    context.subscriptions.push(
        vscode.commands.registerCommand('smart-split-runner.showMenu', showQuickPickMenu)
    );

    // Pipeline commands
    context.subscriptions.push(
        vscode.commands.registerCommand('smart-split-runner.runFull', () => {
            runDemoCommand('full', '🚀 Running Full Pipeline');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('smart-split-runner.runValidation', () => {
            runDemoCommand('validation', '✅ Running Validation');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('smart-split-runner.runQuality', () => {
            runDemoCommand('quality', '✨ Running Quality-Driven Decomposition');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('smart-split-runner.runCustom', () => {
            runDemoCommand('custom', '📝 Running with Custom Domain Prompts');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('smart-split-runner.cleanup', () => {
            runDemoCommand('cleanup', '🗑️ Cleaning Up Database');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('smart-split-runner.runSummary', () => {
            runDemoCommand('summary', '📊 Generating Summary Report');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('smart-split-runner.runAnalysis', runAnalysisCommand)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('smart-split-runner.openOutputFolder', openOutputFolder)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('smart-split-runner.refreshStatus', refreshStatus)
    );
}

async function showQuickPickMenu() {
    const items: vscode.QuickPickItem[] = [
        {
            label: '$(rocket) Run Full Pipeline',
            description: 'demo.py full',
            detail: 'Complete decomposition workflow with validation'
        },
        {
            label: '$(check-all) Run Validation',
            description: 'demo.py validation',
            detail: 'Analyze and validate current decomposition'
        },
        {
            label: '$(sparkle) Quality-Driven Decomposition',
            description: 'demo.py quality',
            detail: 'Run decomposition with quality targets (MQ, SIS, BAI)'
        },
        {
            label: '$(edit) Custom Domain Prompts',
            description: 'demo.py custom',
            detail: 'Use custom domain definitions for decomposition'
        },
        {
            label: '$(graph) Run Analysis & Charts',
            description: 'analysis.run_all',
            detail: 'Generate metrics visualizations and charts'
        },
        {
            label: '$(file-text) Generate Summary',
            description: 'demo.py summary',
            detail: 'Create comprehensive report of decomposition'
        },
        {
            label: '$(trash) Cleanup Database',
            description: 'demo.py cleanup',
            detail: 'Reset Neo4j database for fresh start'
        },
        {
            label: '$(folder-opened) Open Output Folder',
            description: 'analysis/output',
            detail: 'Open folder with generated charts and results'
        }
    ];

    const choice = await vscode.window.showQuickPick(items, {
        placeHolder: '🔧 Select a SMART-Split command',
        matchOnDescription: true,
        matchOnDetail: true
    });

    if (choice) {
        const label = choice.label;
        if (label.includes('Full Pipeline')) {
            vscode.commands.executeCommand('smart-split-runner.runFull');
        } else if (label.includes('Validation')) {
            vscode.commands.executeCommand('smart-split-runner.runValidation');
        } else if (label.includes('Quality')) {
            vscode.commands.executeCommand('smart-split-runner.runQuality');
        } else if (label.includes('Custom')) {
            vscode.commands.executeCommand('smart-split-runner.runCustom');
        } else if (label.includes('Analysis')) {
            vscode.commands.executeCommand('smart-split-runner.runAnalysis');
        } else if (label.includes('Summary')) {
            vscode.commands.executeCommand('smart-split-runner.runSummary');
        } else if (label.includes('Cleanup')) {
            vscode.commands.executeCommand('smart-split-runner.cleanup');
        } else if (label.includes('Output')) {
            vscode.commands.executeCommand('smart-split-runner.openOutputFolder');
        }
    }
}

function runDemoCommand(mode: string, title: string) {
    const workspaceFolder = getSmartSplitWorkspace();
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('SMART-Split workspace not found. Please open the smart-split folder.');
        return;
    }

    updateStatusBar('running', mode);

    const terminal = vscode.window.createTerminal({
        name: `SMART-Split: ${mode}`,
        cwd: workspaceFolder
    });

    terminal.show();
    terminal.sendText(`uv run python demo.py ${mode}`);
    
    vscode.window.showInformationMessage(title);

    // Update status after a delay (simulated completion)
    setTimeout(() => {
        updateStatusBar('idle');
        if (statusWebviewProvider) {
            statusWebviewProvider.refresh();
        }
    }, 5000);
}

function runAnalysisCommand() {
    const workspaceFolder = getSmartSplitWorkspace();
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('SMART-Split workspace not found. Please open the smart-split folder.');
        return;
    }

    updateStatusBar('running', 'analysis');

    const terminal = vscode.window.createTerminal({
        name: 'SMART-Split: Analysis',
        cwd: workspaceFolder
    });

    terminal.show();
    terminal.sendText('uv run python -m analysis.run_all');
    
    vscode.window.showInformationMessage('📊 Running Analysis & Generating Charts...');

    setTimeout(() => {
        updateStatusBar('idle');
        if (statusWebviewProvider) {
            statusWebviewProvider.refresh();
        }
    }, 5000);
}

function openOutputFolder() {
    const workspaceFolder = getSmartSplitWorkspace();
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('SMART-Split workspace not found.');
        return;
    }

    const outputPath = path.join(workspaceFolder, 'analysis', 'output');
    if (fs.existsSync(outputPath)) {
        vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputPath));
    } else {
        vscode.window.showWarningMessage('Output folder not found. Run analysis first.');
    }
}

function refreshStatus() {
    if (statusWebviewProvider) {
        statusWebviewProvider.refresh();
    }
    vscode.window.showInformationMessage('Status refreshed');
}

function updateStatusBar(status: 'idle' | 'running' | 'success' | 'error', command?: string) {
    currentStatus = status;
    switch (status) {
        case 'idle':
            statusBarStatus.text = '$(circle-outline) Ready';
            statusBarStatus.backgroundColor = undefined;
            statusBarStatus.tooltip = 'SMART-Split is ready';
            break;
        case 'running':
            statusBarStatus.text = `$(sync~spin) Running ${command || ''}`;
            statusBarStatus.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
            statusBarStatus.tooltip = `Running: ${command}`;
            break;
        case 'success':
            statusBarStatus.text = '$(check) Success';
            statusBarStatus.backgroundColor = undefined;
            statusBarStatus.tooltip = 'Last command completed successfully';
            break;
        case 'error':
            statusBarStatus.text = '$(error) Error';
            statusBarStatus.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            statusBarStatus.tooltip = 'Last command failed';
            break;
    }
}

function getSmartSplitWorkspace(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return undefined;
    }

    for (const folder of workspaceFolders) {
        const folderPath = folder.uri.fsPath;
        
        if (folderPath.endsWith('smart-split-extension')) {
            return path.dirname(folderPath);
        }
        
        if (folderPath.endsWith('smart-split') && !folderPath.endsWith('smart-split-extension')) {
            return folderPath;
        }
    }

    return workspaceFolders[0].uri.fsPath;
}

// Webview Provider for Commands Panel
class SmartSplitCommandsProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getCommandsHtml();

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'runFull':
                    vscode.commands.executeCommand('smart-split-runner.runFull');
                    break;
                case 'runValidation':
                    vscode.commands.executeCommand('smart-split-runner.runValidation');
                    break;
                case 'runQuality':
                    vscode.commands.executeCommand('smart-split-runner.runQuality');
                    break;
                case 'runCustom':
                    vscode.commands.executeCommand('smart-split-runner.runCustom');
                    break;
                case 'runAnalysis':
                    vscode.commands.executeCommand('smart-split-runner.runAnalysis');
                    break;
                case 'runSummary':
                    vscode.commands.executeCommand('smart-split-runner.runSummary');
                    break;
                case 'cleanup':
                    vscode.commands.executeCommand('smart-split-runner.cleanup');
                    break;
                case 'openOutput':
                    vscode.commands.executeCommand('smart-split-runner.openOutputFolder');
                    break;
            }
        });
    }

    private _getCommandsHtml(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            padding: 10px;
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        .btn {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 8px 12px;
            margin-bottom: 6px;
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            text-align: left;
            transition: background 0.2s;
        }
        .btn:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        .btn-primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        .btn-primary:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .btn-danger {
            background: var(--vscode-inputValidation-errorBackground);
        }
        .btn-icon {
            margin-right: 8px;
            font-size: 14px;
        }
        .btn-desc {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-left: auto;
        }
        .divider {
            height: 1px;
            background: var(--vscode-widget-border);
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="section">
        <div class="section-title">🚀 Pipeline Commands</div>
        <button class="btn btn-primary" onclick="send('runFull')">
            <span class="btn-icon">🚀</span>
            Full Pipeline
            <span class="btn-desc">demo.py full</span>
        </button>
        <button class="btn" onclick="send('runQuality')">
            <span class="btn-icon">✨</span>
            Quality-Driven
            <span class="btn-desc">demo.py quality</span>
        </button>
        <button class="btn" onclick="send('runCustom')">
            <span class="btn-icon">📝</span>
            Custom Domain
            <span class="btn-desc">demo.py custom</span>
        </button>
    </div>

    <div class="divider"></div>

    <div class="section">
        <div class="section-title">📊 Analysis</div>
        <button class="btn" onclick="send('runValidation')">
            <span class="btn-icon">✅</span>
            Validation
            <span class="btn-desc">demo.py validation</span>
        </button>
        <button class="btn" onclick="send('runAnalysis')">
            <span class="btn-icon">📈</span>
            Generate Charts
            <span class="btn-desc">analysis.run_all</span>
        </button>
        <button class="btn" onclick="send('runSummary')">
            <span class="btn-icon">📄</span>
            Summary Report
            <span class="btn-desc">demo.py summary</span>
        </button>
    </div>

    <div class="divider"></div>

    <div class="section">
        <div class="section-title">🛠️ Utilities</div>
        <button class="btn btn-danger" onclick="send('cleanup')">
            <span class="btn-icon">🗑️</span>
            Cleanup Database
            <span class="btn-desc">demo.py cleanup</span>
        </button>
        <button class="btn" onclick="send('openOutput')">
            <span class="btn-icon">📂</span>
            Open Output Folder
        </button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        function send(command) {
            vscode.postMessage({ command });
        }
    </script>
</body>
</html>`;
    }
}

// Webview Provider for Status Panel
class SmartSplitStatusProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        this._updateHtml();
    }

    public refresh() {
        this._updateHtml();
    }

    private _updateHtml() {
        if (this._view) {
            this._view.webview.html = this._getStatusHtml();
        }
    }

    private _getStatusHtml(): string {
        const workspace = getSmartSplitWorkspace();
        const resultsExist = workspace ? fs.existsSync(path.join(workspace, 'analysis', 'output', 'analysis_summary.json')) : false;
        
        let metrics = { mq: '—', sis: '—', bai: '—' };
        let services: string[] = [];

        if (workspace && resultsExist) {
            try {
                const summaryPath = path.join(workspace, 'analysis', 'output', 'analysis_summary.json');
                const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
                metrics = {
                    mq: summary.mq?.toFixed(3) || '—',
                    sis: summary.sis?.toFixed(3) || '—',
                    bai: summary.bai?.toFixed(3) || '—'
                };
            } catch { /* ignore */ }

            try {
                const mqPath = path.join(workspace, 'analysis', 'output', 'mq_results.json');
                if (fs.existsSync(mqPath)) {
                    const mqData = JSON.parse(fs.readFileSync(mqPath, 'utf-8'));
                    services = Object.keys(mqData.per_cluster || {});
                }
            } catch { /* ignore */ }
        }

        const statusIcon = currentStatus === 'running' ? '🔄' : 
                          currentStatus === 'success' ? '✅' : 
                          currentStatus === 'error' ? '❌' : '⚪';

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            padding: 10px;
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
        }
        .status-card {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
        }
        .status-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        .status-icon {
            font-size: 18px;
            margin-right: 8px;
        }
        .status-title {
            font-weight: 600;
            font-size: 13px;
        }
        .metric-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        .metric-row:last-child {
            border-bottom: none;
        }
        .metric-label {
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
        }
        .metric-value {
            font-weight: 600;
            font-size: 12px;
        }
        .metric-pass {
            color: var(--vscode-testing-iconPassed);
        }
        .metric-fail {
            color: var(--vscode-testing-iconFailed);
        }
        .services-list {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-top: 8px;
        }
        .service-tag {
            display: inline-block;
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 2px 8px;
            border-radius: 10px;
            margin: 2px;
            font-size: 10px;
        }
        .no-data {
            text-align: center;
            padding: 20px;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="status-card">
        <div class="status-header">
            <span class="status-icon">${statusIcon}</span>
            <span class="status-title">Current Status: ${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}</span>
        </div>
    </div>

    ${resultsExist ? `
    <div class="status-card">
        <div class="status-header">
            <span class="status-icon">📊</span>
            <span class="status-title">Quality Metrics</span>
        </div>
        <div class="metric-row">
            <span class="metric-label">MQ (Modularity)</span>
            <span class="metric-value ${parseFloat(metrics.mq) >= 0.7 ? 'metric-pass' : 'metric-fail'}">${metrics.mq}</span>
        </div>
        <div class="metric-row">
            <span class="metric-label">SIS (Independence)</span>
            <span class="metric-value ${parseFloat(metrics.sis) >= 0.75 ? 'metric-pass' : 'metric-fail'}">${metrics.sis}</span>
        </div>
        <div class="metric-row">
            <span class="metric-label">BAI (Alignment)</span>
            <span class="metric-value ${parseFloat(metrics.bai) >= 0.7 ? 'metric-pass' : 'metric-fail'}">${metrics.bai}</span>
        </div>
    </div>

    ${services.length > 0 ? `
    <div class="status-card">
        <div class="status-header">
            <span class="status-icon">🔧</span>
            <span class="status-title">Microservices (${services.length})</span>
        </div>
        <div class="services-list">
            ${services.map(s => `<span class="service-tag">${s}</span>`).join('')}
        </div>
    </div>
    ` : ''}
    ` : `
    <div class="no-data">
        <p>📭 No analysis results yet</p>
        <p>Run the Full Pipeline or Analysis to see metrics</p>
    </div>
    `}
</body>
</html>`;
    }
}

export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    if (statusBarStatus) {
        statusBarStatus.dispose();
    }
}