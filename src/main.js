const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const path = require('node:path');
const {pdfToPng} = require('pdf-to-png-converter');

const createWindow = () => {
    const window = new BrowserWindow({
        width: 700,
        height: 350,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    ipcMain.on('open-file', async (event, ...args) => {
        try {
            const result = await dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [
                    {name: 'PDF', extensions: ['pdf']},
                ]
            });

            if (result.filePaths.length !== 1) {
                window.webContents.send('file-opened', {success: false});
                return;
            }

            const filPath = result.filePaths[0];

            window.webContents.send('file-opened', {success: true, filePath: filPath});

            const converted = await pdfToPng(filPath, {
                viewportScale: 2.0,
                outputFolder: path.dirname(filPath),
            });

            window.webContents.send('file-handled', converted);
        } catch (error) {
            window.webContents.send('log', error);
        }
    })

    window.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
