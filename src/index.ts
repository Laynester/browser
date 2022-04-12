import { app, BrowserWindow, ipcMain} from 'electron';
import * as path from 'path';
import contextMenu from 'electron-context-menu';


let mainWindow: BrowserWindow = null;
let pluginName;

switch (process.platform) {
  case 'win32':
      if (process.arch === "x32" || process.arch === "ia32") {
          pluginName = 'win/pepflashplayer-32.dll';
      } else {
          pluginName = 'win/pepflashplayer.dll';
      }
      break;
  case 'darwin':
      pluginName = 'mac/PepperFlashPlayer.plugin';
      break;
  case "linux":
      if (process.arch === "arm") {
          pluginName = 'lin/libpepflashplayer_arm.so';
      } else {
          pluginName = 'lin/libpepflashplayer_amd.so';
      }
      break;
  case "freebsd":
  case "netbsd":
  case "openbsd":
      pluginName = 'libpepflashplayer.so';
      break;
}
app.commandLine.appendSwitch('--enable-npapi')
if (process.platform !== "darwin") {
  app.commandLine.appendSwitch('high-dpi-support', "1");
  app.commandLine.appendSwitch('force-device-scale-factor', "1");
} 
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname.includes(".asar") ? process.resourcesPath : __dirname, "flash/" + pluginName));
//app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('no-sandbox');

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

