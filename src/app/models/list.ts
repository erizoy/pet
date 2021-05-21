/** Describes task model */
export interface ListTask {
  /** Unique identifier */
  uuid: string;
  /** Text description */
  text: string;
  /** Element position in list */
  position: number;
  /** Status where true means done */
  status: boolean;
}

/** Describes list model */
export interface List {
  /** Unique identifier */
  uuid: string;
  /** Title */
  title: string;
  /** Owner's id */
  userId: string;
  /** Guest's email */
  guest?: string;
  /** Array of list's tasks */
  tasks?: ListTask[];
}

/** Represents a basic list class without tasks */
export class List {
  /** `false` means, that current user is the owner of the `List` */
  public isGuest = false;

  /**
   * Creates instance of `List` class.
   * @param list - initial object
   * @param email - current user email
   *
   * If `email` equals `list.quest` then current user is not an owner of the List
   */
  constructor(list: List, email: string) {
    this.uuid = list.uuid;
    this.title = list.title;
    this.userId = list.userId;

    if (list.guest) {
      this.guest = list.guest;
      this.isGuest = this.guest === email;
    }
  }
}
