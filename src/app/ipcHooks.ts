import { app, BrowserWindow, globalShortcut, ipcMain, ipcRenderer, WebContents, WebviewTag } from 'electron';
import { IpcMainEvent } from 'electron/main';
import { Application } from './application';

export class ipcHooks {
    private mainWindow: BrowserWindow = null;
    private _windows: Map<string, BrowserWindow> = new Map();

    constructor(application: Application) {
        this.mainWindow = application.mainWindow;

        ipcMain.on('electron-react-titlebar/maximumize/set', this.onTitleMaximize.bind(this));

        ipcMain.on('app/devtools', this.onDevTools.bind(this));

        app.on('web-contents-created', (webContentsCreatedEvent, contents) => {
            if (contents.getType() === 'browserView') {
                contents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
                    event.preventDefault();
                    if (disposition !== 'new-window') return;

                    if (this._windows.get(frameName)) return this._windows.get(frameName).focus();

                    options.show = false;

                    let window = new BrowserWindow(options);
                    window.on('page-title-updated', () => {
                        window.show(); 
                    });
                    window.on('close', () => {
                        this._windows.delete(frameName); 
                    });
                    event.newGuest = window;
                    this._windows.set(frameName, window);

                });
            }
        });
    }

    private onTitleMaximize(event: IpcMainEvent): void {
        if (this.mainWindow?.isMaximizable()) {
            if (this.mainWindow.isMaximized()) {
                this.mainWindow.unmaximize();
            } else {
                this.mainWindow.maximize();
            }
        }
    }

    private onDevTools(event: IpcMainEvent) {
        this.mainWindow.webContents.setDevToolsWebContents(null);
        this.mainWindow.webContents.openDevTools();
    }
}
