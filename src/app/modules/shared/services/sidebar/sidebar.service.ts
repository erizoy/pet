import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  #drawer!: MatDrawer;

  constructor() { }

  set drawer(input: MatDrawer) {
    this.#drawer = input;
  }

  get drawer(): MatDrawer {
    return this.#drawer;
  }
}
