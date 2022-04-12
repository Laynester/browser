import { app, BrowserWindow, ipcMain} from 'electron';
import * as path from 'path';
import contextMenu from 'electron-context-menu';


let mainWindow: BrowserWindow = null;
let plugins = {
  flash: {
    name: 'win/x32/pepflashplayer.dll',
    version: '32.0.0.363',
  }
}

switch (process.platform) {
  case 'darwin':
    plugins.flash.name = 'osx/PepperFlashPlayer.plugin'
    break
  default:
    if (process.arch === 'x64' || process.arch === 'arm64') plugins.flash.name = 'win/x64/pepflashplayer.dll'
    break
}

app.commandLine.appendSwitch('disable-renderer-backgrounding')
if (process.platform !== 'darwin') {
  app.commandLine.appendSwitch('high-dpi-support', '1')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}
app.commandLine.appendSwitch('--enable-npapi')
app.commandLine.appendSwitch('--ppapi-flash-path', path.join(__dirname.includes('.asar') ? process.resourcesPath : __dirname, '../flash/' + plugins.flash.name))
app.commandLine.appendSwitch('--ppapi-flash-version', plugins.flash.version)

const createWindow = (): void => {
  // Create the browser window.
   mainWindow = new BrowserWindow({
    height: 720,
    width: 1280,
     frame: false,
    titleBarStyle:"hiddenInset",
      backgroundColor: '#FFFFFF',
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
        plugins: true,
        nodeIntegrationInSubFrames: false,
        nodeIntegrationInWorker: false
      }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('disable-features', 'CrossOriginOpenerPolicy')

app.on("web-contents-created", (e, contents) => {
  contextMenu(
    {
      prepend: (params, browserWindow) => [
        {
            label: 'Inspect Element..',
          click: (menuItem, browserWindow, event) =>
          {
            contents.openDevTools({mode: 'bottom',activate:true});
            browserWindow.webContents.setDevToolsWebContents(contents)
            contents.openDevTools();
            }
        }
    ],
     window: contents,
      showSaveImageAs: true,
     showInspectElement: false
  });
})

ipcMain.on('electron-react-titlebar/maximumize/set', () =>
{
  if (mainWindow?.isMaximizable()) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})

ipcMain.on('ELECTRON_GUEST_VIEW_MANAGER_CALL', () =>
{
  console.log('wtv')
});

