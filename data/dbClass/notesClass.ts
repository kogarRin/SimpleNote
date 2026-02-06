import path from 'path'
import { Low } from 'lowdb'
import { app } from 'electron'
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'url'
import lodash from 'lodash'
import type { DbRes, Note } from '@/ts/class/noteClass.ts'
import moment from 'moment/moment.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const getDataDir = () => {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev
    ? path.join(__dirname, '../db.json')
    : path.join(app.getPath('userData'), 'data', 'db.json')
}

export class jsonDbToolClass {
  fileBasePath: string
  jsonDb: Low<DbRes>

  constructor() {
    this.fileBasePath = getDataDir()
    const adapter = new JSONFile<DbRes>(this.fileBasePath)
    this.jsonDb = new Low<DbRes>(adapter, { noteList: [] })
  }

  #setIdPrototype = (): string => {
    const tail = Math.random().toString(36).slice(-3)
    return Date.now().toString(36) + tail
  }

  async loadJsonDb(): Promise<DbRes> {
    try {
      await this.jsonDb.read()
      return this.jsonDb.data
    } catch (error) {
      console.error(error)
      return { noteList: [] }
    }
  }

  //增
  async addNoteJson(): Promise<null> {
    const emptyNoteType = () => ({
      title: '无标题',
      content: '',
      tags: [],
      createAt: moment().format('YYYY-M-D'),
      id: this.#setIdPrototype(),
    })
    try {
      await this.jsonDb.read()
      this.jsonDb.data.noteList.push(emptyNoteType());
      await this.jsonDb.write()
      return null
    } catch (err) {
      return null
    }
  }

  //删
  async deleteNoteJson(idArray: string[]): Promise<null> {
    await this.jsonDb.read()
    if (Array.isArray(idArray) && idArray.length > 0) {
      lodash.remove(this.jsonDb.data.noteList, (item) => idArray.includes(item.id))
      await this.jsonDb.write()
    }
    return null
  }
  async deleteTagsInNoteList(noteId: string, tag: string): Promise<null> {
    try {
      await this.jsonDb.read()
      const noteIndexForUpdate = this.jsonDb.data.noteList.findIndex((item) => item.id === noteId)
      await this.jsonDb.update(({ noteList }) => {
        if (!noteList[noteIndexForUpdate] || !Array.isArray(noteList[noteIndexForUpdate].tags))
          return null
        lodash.pull(noteList[noteIndexForUpdate].tags, tag)
      })
      return null
    } catch (error) {
      console.error(error)
      return null
    }
  }

  //改
  async updateNoteJson(newNote: Note) {
    try {
      await this.jsonDb.read()
      const noteIndexForUpdate = this.jsonDb.data.noteList.findIndex(
        (item) => item.id === newNote.id,
      )
      if (noteIndexForUpdate === -1) {
        return null
      } else {
        await this.jsonDb.update(({ noteList }) => {
          noteList[noteIndexForUpdate] = newNote
        })
        return null
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }
  async updateNoteTags(noteId: string, tag: string) {
    await this.jsonDb.read()
    const noteIndexForUpdate = this.jsonDb.data.noteList.findIndex((item) => item.id === noteId)
    try {
      if (noteIndexForUpdate === -1) {
        return null
      }
      await this.jsonDb.update(({ noteList }) => {
        const target = noteList[noteIndexForUpdate]
        if (!target) {
          return null
        }
        if (!Array.isArray(target.tags)) {
          target.tags = []
        }
        target.tags.push(tag)
      })
    } catch (error) {
      console.error(error)
    }
  }
}
