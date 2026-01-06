import { jsonDbToolClass } from '../dbClass/notesClass.ts'
import type { DbRes } from '../../src/ts/class/noteClass.ts'
import { Res } from '../../oth/res.ts'



const dataBase = new jsonDbToolClass()

/**
 * @function getNotesFromDb 获取笔记列表
 */
export async function getNotesFromDb(): Promise<Res<DbRes>> {
  try {
    const res = await dataBase.loadJsonDb();
    if (Array.isArray(res.noteList)) {
      return new Res(`success`, res);
    }
    return new Res(`数据文件损坏`, {noteList: []}, 700);
  } catch (e) {
    console.log(e)
    return new Res(`error`, { noteList: [] }, 700)
  }
}

/**
 * @function addNote 添加笔记
 */
export async function addNote(): Promise<Res<null>> {
  try {
    await dataBase.addNoteJson();
    return new Res(`添加成功`, null)
  } catch (e) {
    console.log(e)
    return new Res(`添加失败`, null, 700)
  }
}

/**
 * @function deleteNote 删除笔记
 */
export async function deleteNote(idList: string[]) {
  try {
    if (!Array.isArray(idList)) {
      return new Res(`参数错误`, null, 701)
    }
    await dataBase.deleteNoteJson(idList)
    return new Res(`删除成功`, null)
  } catch (e) {
    console.log(e)
    return new Res(`删除失败,发生错误`, null, 700)
  }
}
