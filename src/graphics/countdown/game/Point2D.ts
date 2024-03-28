export default class Point2D {
  constructor(
    public x: number,
    public y: number,
  ) {
    //
  }

  // A method that can be used to increase
  // or decrease the value of x and y.
  add(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }
}
