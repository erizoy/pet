export interface ListTask {
  uuid: string;
  text: string;
  status: boolean;
}

export interface List {
  uuid: string;
  title: string;
  userId: string;
  guest?: string;
  tasks?: ListTask[];
}

export class List {
  public isGuest = false;

  constructor(
    list: List,
    email: string
  ) {

    this.uuid = list.uuid;
    this.title = list.title;
    this.userId = list.userId;

    if (list.guest) {
      this.guest = list.guest;
      this.isGuest = this.guest === email;
    }
  }
}
