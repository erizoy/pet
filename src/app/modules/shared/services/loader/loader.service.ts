import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  get loader(): HTMLDivElement {
    return document.querySelectorAll<HTMLDivElement>('.loader-overlay')[0];
  }

  show(): void {
    this.loader.style.display = 'block';
  }

  hide(): void {
    // 100ms delay before hiding
    timer(100).pipe(take(1)).subscribe(_  => {
      this.loader.style.display = 'none';
    });
  }
}
