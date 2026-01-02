// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('windowApi', {
  miniWindow: () => ipcRenderer.invoke('mini-window'),
  toggleScreen: () => ipcRenderer.invoke('toggle-screen'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  getNotes: () => ipcRenderer.invoke('get-notes'),
})

console.log('preload.js loaded');
