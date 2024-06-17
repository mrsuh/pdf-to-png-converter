const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.send('open-file'),
    onFileOpened: (callback) => ipcRenderer.on('file-opened', (_event, value) => callback(value)),
    onFileHandled: (callback) => ipcRenderer.on('file-handled', (_event, value) => callback(value)),
    onLog: (callback) => ipcRenderer.on('log', (_event, value) => callback(value)),
})
