import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'node:path'
import { fileURLToPath } from 'url'
import { jsonDbToolClass } from '../data/dbClass/notesClass.ts'
import { addNote, getNotesFromDb } from '../data/api/dbAPI.ts'



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonToolInMain = new jsonDbToolClass();
let win: BrowserWindow;


function createWindow():void {
  win = new BrowserWindow({
    minWidth: 1200,
    minHeight: 750,
    icon: path.join(__dirname, '../public/assets/icon/icon.ico'),
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, './api/windowPreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
    win.loadURL(`http://localhost:5173`)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", ()=>{
  if (process.platform !== "darwin") {
    app.quit();
  }
});


ipcMain.handle('mini-window', () => {
  win.minimize();
});

ipcMain.handle('toggle-screen',  () => {
  win.isMaximized() ? win.unmaximize() : win.maximize();
});

ipcMain.handle('close-window',  () => {
  win.close();
});

ipcMain.handle('get-notes',  async ()=> {
  return await getNotesFromDb();
});

ipcMain.handle('add-notes', async () => {
  await addNote();
})
