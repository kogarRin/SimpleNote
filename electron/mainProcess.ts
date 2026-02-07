import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'node:path'
import { fileURLToPath } from 'url'
import { addNote, deleteNote, getNotesFromDb } from '../data/api/dbAPI.ts'
import Store from 'electron-store'
import * as fs from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const store = new Store()
let win: BrowserWindow

function createWindow(): void {
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
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * 窗口控制
 */
ipcMain.handle('mini-window', () => {
  win.minimize()
})

ipcMain.handle('toggle-screen', () => {
  win.isMaximized() ? win.unmaximize() : win.maximize()
})

ipcMain.handle('close-window', () => {
  win.close()
})

/**
 * 笔记相关
 */
ipcMain.handle('get-notes', async () => {
  return await getNotesFromDb()
})

ipcMain.handle('add-notes', async () => {
  await addNote()
})

ipcMain.handle('delete-notes', async (_, idList: string[]) => {
  await deleteNote(idList)
})

/**
 * 主题设置
 */
ipcMain.handle('get-theme', async (_) => {
  return store.get('theme')
})

ipcMain.handle('set-theme', async (_, theme: string) => {
  store.set('theme', theme)
})

ipcMain.handle('get-font', async (_) => {
  return store.get('font')
})

ipcMain.handle(
  'set-font',
  async (
    _,
    font: {
      name: string
      en: string
      family: string
    },
  ) => {
    store.set('font', font)
  },
)

ipcMain.handle('output-notes', async (_, title: string, txt: string) => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: '保存文件',
    defaultPath: `${title}`,
    filters: [
      { name: 'txt', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })
  if (canceled || !filePath) {
    return { message: '取消保存', data: null, code: 600 }
  }
  try {
    await fs.promises.writeFile(filePath, txt, 'utf8')
    return { message: '保存成功', data: filePath, code: 200 }
  } catch (e) {
    console.log(e)
    return { message: '保存失败', data: null, code: 700 }
  }
})
