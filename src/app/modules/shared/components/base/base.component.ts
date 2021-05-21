import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

/**
 * BaseComponent implements OnDestroy where emits destroy$ ReplySubject
 * that can be useful for unsubscribing from Observables
 */
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
