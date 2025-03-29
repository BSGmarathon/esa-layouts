import { IObstacle } from '../types/options';
import Point2D from '../Point2D';

export default class Rock implements IObstacle {
  constructor(
    public readonly position: Point2D,
    public readonly noOfParts: number,
    public readonly h: number,
    public readonly w: number,
  ) {
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.noOfParts; i += 0.3) {
      // Find width and height.
      const w = this.w / (i + 1);
      const h = this.h / (i + 2);

      // Find x and y position.
      const x = this.position.x + (this.w - w) / 2;
      const y = this.position.y + h;

      // Draw rect.
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.closePath();
    }
  }

  static create(x: number, y: number, w: number, h: number, noOfParts: number) {
    const position = new Point2D(x, y);
    return new Rock(position, noOfParts, w, h);
  }
}
