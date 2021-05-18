import { Directive, ElementRef, EventEmitter, HostBinding, OnDestroy, OnInit, Output } from '@angular/core';
import { fromEvent, Observable, ReplaySubject } from 'rxjs';
import { elementAt, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { SwipeCoords, SwipeEvent } from '../../../models/swipe-event';

@Directive({
  selector: '[petSwipe]'
})
export class SwipeDirective implements OnInit, OnDestroy {
  @HostBinding('class.toggle-ready') get toggleReadyClass(): boolean {
    return this.#delta !== 0 && this.swipeEventByDelta() === SwipeEvent.TOGGLE;
  }
  @HostBinding('class.remove-ready') get removeReadyClass(): boolean {
    return this.#delta !== 0 && this.swipeEventByDelta() === SwipeEvent.REMOVE;
  }
  @HostBinding('style.left.px') get leftPosition(): number {
    return this.#delta;
  }
  @Output() swipeEnd: EventEmitter<SwipeEvent> = new EventEmitter<SwipeEvent>();
  #delta = 0;
  #destroy$: ReplaySubject<null> = new ReplaySubject<null>(1);

  constructor(
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    const domElement = this.elementRef.nativeElement;

    const getSwipeDistance = (startCoords: SwipeCoords, coords: SwipeCoords): SwipeCoords => ({
      x: coords.x - startCoords.x,
      y: coords.y - startCoords.y
    });

    const touchStarts: Observable<SwipeCoords> = fromEvent<TouchEvent>(domElement, 'touchstart').pipe(map(this.touchEventToPosition));
    const touchMoves: Observable<SwipeCoords> = fromEvent<TouchEvent>(domElement, 'touchmove').pipe(map(this.touchEventToPosition));
    const touchEnds: Observable<SwipeCoords> = fromEvent<TouchEvent>(domElement, 'touchend').pipe(map(this.touchEventToPosition));

    const moveStartsWithDirection = touchStarts.pipe(
      switchMap((startCoords: SwipeCoords) => touchMoves.pipe(
        elementAt(3),
        map((coords: SwipeCoords) => {
          const initialDeltaX = coords.x - startCoords.x;
          const initialDeltaY = coords.y - startCoords.y;
          return {x: startCoords.x, y: startCoords.y, initialDeltaX, initialDeltaY};
        })
    )));

    const horizontalMoveStarts = moveStartsWithDirection.pipe(
      filter(startCoords => Math.abs(startCoords.initialDeltaX) >= Math.abs(startCoords.initialDeltaY))
    );

    const movesUntilEnds = (startCoords: SwipeCoords): Observable<SwipeCoords> => touchMoves.pipe(
      map(coords => getSwipeDistance(startCoords, coords)),
      takeUntil(touchEnds.pipe(
        take(1),
        map(endCoords => getSwipeDistance(startCoords, endCoords)),
        tap(() => this.emitSwipeEndEvent())
      )));

    const horizontalMoves = horizontalMoveStarts.pipe(
      switchMap(startCoords => movesUntilEnds(startCoords))
    );

    horizontalMoves.pipe(
      takeUntil(this.#destroy$)
    ).subscribe((delta: SwipeCoords) => this.emitSwipeMoveEvent(delta));
  }

  public touchEventToPosition(touchEvent: TouchEvent): SwipeCoords  {
    return {x: touchEvent.changedTouches[0].clientX, y: touchEvent.changedTouches[0].clientY};
  }

  private emitSwipeMoveEvent(position: SwipeCoords): void {
    this.#delta = position.x;
  }

  private emitSwipeEndEvent(): void {
    this.swipeEnd.emit(this.swipeEventByDelta());
    this.#delta = 0;
  }

  private swipeEventByDelta(): SwipeEvent {
    return this.#delta < 0 ? SwipeEvent.REMOVE : SwipeEvent.TOGGLE;
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

}
