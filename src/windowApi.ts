/**
 * 全局接口类型声明
 */

import type { Res } from '../oth/res.ts'
import type { DbRes, Note } from '@/ts/class/noteClass.ts'
import type { FontDesc } from '@/stores/setting.ts'

export interface ElectronAPI {
  miniWindow(): Promise<void>
  toggleScreen(): Promise<void>
  closeWindow(): Promise<void>

  getNotes(): Promise<Res<DbRes>>
  addNotes(): Promise<Res<null>>
  deleteNotes(idArray: string[]): Promise<Res<null>>
  outputNotes(title: string, txt: string): Promise<Res<string | null>>
  updateNote(note: Note): Promise<Res<null>>

  getTheme(): Promise<string>
  setTheme(theme: string): Promise<void>
  getFont(): Promise<FontDesc>
  setFont(font: FontDesc): Promise<void>
}
