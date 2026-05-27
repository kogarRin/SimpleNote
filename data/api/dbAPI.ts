import { jsonDbToolClass } from '../dbClass/notesClass.ts'
import type { DbRes, Note } from '../../src/ts/class/noteClass.ts'
import { Res, RESCODE } from '../../oth/res.ts'

const dataBase = new jsonDbToolClass()

export const dataApi = {
  /**
   * 获取笔记列表
   */
  getNotesFromDb: async (): Promise<Res<DbRes>> => {
    try {
      const res = await dataBase.loadJsonDb()
      if (Array.isArray(res.noteList)) {
        return new Res('success', res)
      }
      return new Res('数据文件损坏', { noteList: [] }, RESCODE.ERROR)
    } catch (e) {
      console.log(e)
      return new Res('error', { noteList: [] }, RESCODE.ERROR)
    }
  },

  /**
   * 添加笔记
   */
  addNote: async (): Promise<Res<null>> => {
    try {
      await dataBase.addNoteJson()
      return new Res('添加成功', null)
    } catch (e) {
      console.log(e)
      return new Res('添加失败', null, RESCODE.ERROR)
    }
  },

  /**
   * 删除笔记
   */
  deleteNote: async (idList: string[]): Promise<Res<null>> => {
    try {
      if (!Array.isArray(idList) || idList.length === 0) {
        return new Res('参数错误', null, RESCODE.PARAM_ERROR)
      }
      await dataBase.deleteNoteJson(idList)
      return new Res('删除成功', null)
    } catch (e) {
      console.log(e)
      return new Res('删除失败', null, RESCODE.ERROR)
    }
  },

  /**
   * 更新笔记
   */
  updateNote: async (note: Note): Promise<Res<null>> => {
    try {
      await dataBase.updateNoteJson(note)
      return new Res('保存成功', null)
    } catch (e) {
      console.log(e)
      return new Res('保存失败', null, RESCODE.ERROR)
    }
  },
}
