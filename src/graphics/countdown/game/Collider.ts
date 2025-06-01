import Point2D from './Point2D';
import { IObstacle } from './types/options';

export default class Collider {
  constructor(
    public readonly position: Point2D,
    public readonly w: number,
    public readonly h: number,
  ) {
    //
  }

  // A method that can be used to check if the
  // collider overlaps with another collider.
  overlaps(other: Collider | IObstacle) {
    return this.position.x < other.position.x + other.w
      && this.position.x + this.w > other.position.x
      && this.position.y < other.position.y + other.h
      && this.position.y + this.h > other.position.y;
  }

  // A method that returns true if the collider
  // overlaps with one in the list of colliders.
  overlapsWithOthers(others: Collider[] | IObstacle[]): boolean {
    for (const other of others) {
      if (this.overlaps(other)) {
        return true;
      }
    }

    return false;
  }
}
