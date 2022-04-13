const { app, BrowserWindow } = require("electron");
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        show: false,
        maxHeight: 800,
        maxWidth: 700,
        minWidth: 400,
        minHeight: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.ts')
        }
    });

    win.maximize();
    win.show();

    win.loadFile('index.html');

    // win.webContents.openDevTools();
}

app.whenReady().then(() => {

   createWindow();
//    window.localStorage.getItem()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});