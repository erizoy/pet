/** Represents a basic hashtag class */
export class Hashtag {
  public selected = false;

  /**
   * Creates instance of `Hashtag` class.
   * @param value - hashtag name
   *
   * By default hashtag is not selected
   */
  constructor(public value: string) {
    this.value = value;
  }

  toggle(): void {
    this.selected = !this.selected;
  }
}
