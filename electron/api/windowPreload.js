// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  //窗口相关
  miniWindow: () => ipcRenderer.invoke('mini-window'),
  toggleScreen: () => ipcRenderer.invoke('toggle-screen'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  //笔记相关
  getNotes: () => ipcRenderer.invoke('get-notes'),
  addNotes: () => ipcRenderer.invoke('add-notes'),
  deleteNotes: (idList) => ipcRenderer.invoke('delete-notes',idList),

  //主题设置
  getTheme: () => ipcRenderer.invoke('get-theme'),
  setTheme: (theme) => ipcRenderer.invoke('set-theme',theme),
  getFont: () => ipcRenderer.invoke('get-font'),
  setFont: (font) => ipcRenderer.invoke('set-font',font),
})

console.log('preload.js loaded');
