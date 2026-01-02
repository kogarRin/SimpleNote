import path from 'path'
import { Low } from 'lowdb'
import { app } from 'electron'
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'url'
import lodash from 'lodash'
import type { FileShape, Note } from '@/ts/class/noteClass.ts'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log(__dirname)
export const getDataDir = () => {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev
    ? path.join(__dirname, '../db.json')
    : path.join(app.getPath('userData'), 'data', 'db.json')
}

export class jsonDbToolClass {
  fileBasePath:string
  jsonDb: Low<FileShape>

  constructor() {
    this.fileBasePath = getDataDir()
    const adapter = new JSONFile<FileShape>(this.fileBasePath)
    this.jsonDb = new Low<FileShape>(adapter, { noteList: []})
  }

  #setIdPrototype = () :string => {
    const tail = Math.random().toString(36).slice(-3)
    return Date.now().toString(36) + tail
  }

  async loadJsonDb():Promise<FileShape | null> {
    try {
      await this.jsonDb.read()
      return this.jsonDb.data
    } catch (error) {
      console.error(error)
      return null
    }
  }

}
