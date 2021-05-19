import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  template: ''
})
export class BaseComponent implements OnDestroy {

  public destroy$: ReplaySubject<null> = new ReplaySubject<null>(1);

  constructor() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
