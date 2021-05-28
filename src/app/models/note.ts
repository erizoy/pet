/** Describes note model */
export interface Note {
  /** Unique identifier */
  uuid: string;
  /** Owner's id */
  userId: string;
  /** Hashtag for filtering */
  hashtags: string[];
  /** Note's text */
  text: string;
}

/** Represents a basic note class */
export class Note {
  /**
   * Creates instance of `Note` class.
   * @param note - initial object
   *
   * If `note.hashtags` not presented in model, set empty array
   */
  constructor(note: Note) {
    this.uuid = note.uuid;
    this.userId = note.userId;
    this.text = note.text;
    this.hashtags = note.hashtags || [];
  }
}
