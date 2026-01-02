import type { Note } from '@/ts/class/noteClass.ts'

export interface WindowAPI {
  miniWindow(): Promise<void>
  toggleScreen(): Promise<void>
  closeWindow(): Promise<void>
  getNotes(): Promise<Note[]>
}
