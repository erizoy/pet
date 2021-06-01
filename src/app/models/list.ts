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
  /** Owner's email */
  owner: string;
  /** Guest's email */
  guest?: string;
  /** Array of list's tasks */
  tasks?: ListTask[];
  /** Model for guest's and owner's tokens */
  subscribers: {
    owner: string | null;
    guest: string | null;
  }
}

/** Represents a basic list class without tasks */
export class List {
  /** `true` means, that current user is the owner of the `List` and list is shared to someone */
  public isOwner = false;
  /** `false` means, that current user is the owner of the `List` */
  public isGuest = false;
  /** percentage of done tasks */
  public percentage: number = 0;
  /** true, if subscribers includes user's token */
  subscribed = false;

  /**
   * Creates instance of `List` class.
   * @param list - initial object
   * @param email - current user email
   * @param token - user's push notification token
   *
   * If `email` equals `list.quest` then current user is not an owner of the List
   */
  constructor(list: List, email: string | null, token: string | null) {
    this.uuid = list.uuid;
    this.title = list.title;
    this.owner = list.owner;

    if (list.guest) {
      this.guest = list.guest;
      this.isGuest = email ? this.guest === email : false;
      this.isOwner = !this.isGuest;
    }

    if (list.tasks) {
      const tasksObject = list.tasks;
      const tasks = Object.values(tasksObject)
      this.percentage = Math.floor(tasks.filter(task => task.status).length / tasks.length * 100);
    }

    this.subscribers = {
      owner: list.subscribers?.owner || null,
      guest: list.subscribers?.guest || null
    };

    if (token && (this.isOwner || this.isGuest)) {
      this.subscribed = this.isOwner ?
        this.subscribers.owner === token:
        this.subscribers.guest === token
    }
  }
}
