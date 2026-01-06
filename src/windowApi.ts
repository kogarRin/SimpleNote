/**
 * 全局接口类型声明
 */

import type { Res } from '../oth/res.ts'
import type { DbRes } from '@/ts/class/noteClass.ts'

export interface ElectronAPI {
  miniWindow(): Promise<void>
  toggleScreen(): Promise<void>
  closeWindow(): Promise<void>

  getNotes(): Promise<Res<DbRes>>
  addNotes(): Promise<null>
}

