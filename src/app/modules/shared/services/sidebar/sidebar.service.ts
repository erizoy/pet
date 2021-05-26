import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  #sidebarRef?: MatDrawer;

  constructor() { }

  set sidebarRef(input: MatDrawer | undefined) {
    this.#sidebarRef = input;
  }

  get sidebarRef(): MatDrawer | undefined {
    return this.#sidebarRef;
  }
}
