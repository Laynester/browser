import { BrowserWindow, ipcMain } from "electron"
import { IpcMainEvent } from "electron/main";
import { Application } from "./application"

export class ipcHooks
{
    private mainWindow: BrowserWindow = null;
    private _windows: Map<string, BrowserWindow> = new Map();

    constructor(app: Application)
    {
        this.mainWindow = app.mainWindow;

        ipcMain.on('electron-react-titlebar/maximumize/set', this.onTitleMaximize.bind(this))
        ipcMain.on('app/newWindow', this.onNewWindow.bind(this))
    }

    private onTitleMaximize(event: IpcMainEvent): void
    {
        if (this.mainWindow?.isMaximizable())
        {
            if (this.mainWindow.isMaximized())
            {
                this.mainWindow.unmaximize()
            } else
            {
                this.mainWindow.maximize()
            }
        }
    }

    private onNewWindow(event: IpcMainEvent, args: any): void
    {
        if (this._windows.get(args.title)) return this._windows.get(args.title).focus();
        let window = new BrowserWindow({
            height: args.height,
            width: args.width,
            frame: true,
            vibrancy: 'ultra-dark',
            webPreferences: {
                nodeIntegration: true,
                webviewTag: true,
                plugins: true
            }
        });

        window.show();

        window.loadURL(args.url);

        window.on('close', ()=> this._windows.delete(args.title));

        this._windows.set(args.title, window)
    }
}