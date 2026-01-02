export interface Note{
  id: string,
  title: string,
  content: string,
  tags: string[],
  createAt: Date,
}
export interface FileShape { noteList: Note[] }

class NoteClass implements Note {
  NoteList: Note[];

  constructor(_ori: Note[]) {
    this.NoteList = _ori;
  }
  getNoteById(Id:string): Note[]{
    return this.NoteList.filter((note:Note)=> note.id === Id);
  }
}
