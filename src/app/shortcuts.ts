import { app, BrowserWindow, globalShortcut } from 'electron';
import { Application } from './application';

export class shortcuts
{ 
    private mainWindow: BrowserWindow = null;
    
    constructor(main: Application)
    {
        this.mainWindow = main.mainWindow;

        this.mainWindow.on('focus', this.register.bind(this))
        this.mainWindow.on('blur', this.blur.bind(this))
    }

    private register()
    {
        globalShortcut.register('CommandorControl+t', () => this.mainWindow.webContents.send('app/openTab'));
        globalShortcut.register('CommandorControl+w', () => this.mainWindow.webContents.send('app/closeTab'));
    }
    
    private blur()
    {
        globalShortcut.unregister('CommandorControl+t')
        globalShortcut.unregister('CommandorControl+w')
    }
}