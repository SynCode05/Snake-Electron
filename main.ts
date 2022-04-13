const { app, BrowserWindow } = require("electron");
require('@electron/remote/main').enable(BrowserWindow);
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        show: false,
        maxHeight: 800,
        maxWidth: 700,
        minWidth: 400,
        minHeight: 400,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.ts'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.removeMenu();
    win.maximize();
    win.show();

    win.loadFile('index.html');

    // win.webContents.openDevTools();
}

app.whenReady().then(() => {

   createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});