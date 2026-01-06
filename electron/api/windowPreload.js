// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  miniWindow: () => ipcRenderer.invoke('mini-window'),
  toggleScreen: () => ipcRenderer.invoke('toggle-screen'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  getNotes: () => ipcRenderer.invoke('get-notes'),
  addNotes: () => ipcRenderer.invoke('add-notes'),
})

console.log('preload.js loaded');
