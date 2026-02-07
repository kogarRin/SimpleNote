import { jsonDbToolClass } from '../dbClass/notesClass.ts'
import type { DbRes } from '../../src/ts/class/noteClass.ts'
import { Res, RESCODE } from '../../oth/res.ts'

const dataBase = new jsonDbToolClass()

/**
 * @function getNotesFromDb 获取笔记列表
 */
export async function getNotesFromDb(): Promise<Res<DbRes>> {
  try {
    const res = await dataBase.loadJsonDb()
    if (Array.isArray(res.noteList)) {
      return new Res(`success`, res)
    }
    return new Res(`数据文件损坏`, { noteList: [] }, RESCODE.ERROR)
  } catch (e) {
    console.log(e)
    return new Res(`error`, { noteList: [] }, RESCODE.ERROR)
  }
}

/**
 * @function addNote 添加笔记
 */
export async function addNote(): Promise<Res<null>> {
  try {
    await dataBase.addNoteJson()
    return new Res(`添加成功`, null)
  } catch (e) {
    console.log(e)
    return new Res(`添加失败`, null, RESCODE.ERROR)
  }
}

/**
 * @function deleteNote 删除笔记
 */
export async function deleteNote(idList: string[]) {
  try {
    if (!Array.isArray(idList)) {
      return new Res(`参数错误`, null, RESCODE.PARAM_ERROR)
    }
    await dataBase.deleteNoteJson(idList)
    return new Res(`删除成功`, null)
  } catch (e) {
    console.log(e)
    return new Res(`删除失败,发生错误`, null, RESCODE.ERROR)
  }
}
