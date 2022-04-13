import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import contextMenu from 'electron-context-menu';
import { ipcHooks } from './ipcHooks';
import { shortcuts } from './shortcuts';

export class Application {
    public mainWindow: BrowserWindow = null;

    constructor() {
        this.registerFlash();
        app.on('ready', this.onReady.bind(this));
        app.on('window-all-closed', this.onAllClosed.bind(this));

        app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
        app.commandLine.appendSwitch('disable-features', 'CrossOriginOpenerPolicy');
        app.commandLine.appendSwitch('disable-renderer-backgrounding');
        app.commandLine.appendSwitch('--enable-npapi');

        if (process.platform !== 'darwin') {
            app.commandLine.appendSwitch('high-dpi-support', '1');
            app.commandLine.appendSwitch('force-device-scale-factor', '1');
        }
    }

    private registerFlash(): void {
        let plugins = {
            flash: {
                name: 'win/x32/pepflashplayer.dll',
                version: '32.0.0.363',
            }
        };

        switch (process.platform) {
            case 'darwin':
                plugins.flash.name = 'osx/PepperFlashPlayer.plugin';
                break;
            default:
                if (process.arch === 'x64' || process.arch === 'arm64') plugins.flash.name = 'win/x64/pepflashplayer.dll';
                break;
        }
        app.commandLine.appendSwitch('--ppapi-flash-path', path.join(__dirname.includes('.asar') ? process.resourcesPath : __dirname, '../../resources/flash/' + plugins.flash.name));
        app.commandLine.appendSwitch('--ppapi-flash-version', plugins.flash.version);
    }

    private onReady(event): void {
        this.mainWindow = new BrowserWindow({
            height: 720,
            width: 1280,
            frame: false,
            titleBarStyle: 'hiddenInset',
            webPreferences: {
                nodeIntegration: true,
                webviewTag: true,
                plugins: true,
                enableRemoteModule: true,
                contextIsolation: false
            }
        });

        this.mainWindow.loadFile(path.join(__dirname, '../../src/index.html'));
        new ipcHooks(this);
        new shortcuts(this);
    }

    private onAllClosed(): void {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }
}

new Application();
