import { IObstacle } from '../types/options';
import Point2D from '../Point2D';

export default class Tree implements IObstacle {
  h: number;
  w: number;


  constructor(
    public readonly position: Point2D,
    private readonly trunkWidth: number,
    private readonly trunkHeight: number,
    private readonly crownRadius: number,
  ) {
    // Calculate width and height based on the
    // passed parameters.
    this.w = this.calculateWidth();
    this.h = this.calculateHeight();
  }

  // A method that returns the width based on
  // the width of the trunk and diameter of the crown.
  calculateWidth() {
    return (this.trunkWidth > this.crownRadius ? this.trunkWidth : this.crownRadius * 2);
  }

  // A method that returns the height based on
  // trunk height and crown diameter (radius * 2).
  calculateHeight() {
    return (this.trunkHeight + this.crownRadius * 2);
  }

  // A method that can be used to draw the tree.
  draw(ctx: CanvasRenderingContext2D) {
    this.drawTrunk(ctx);
    this.drawCrown(ctx);
  }

  // A method that draws the trunk of the tree.
  drawTrunk(ctx: CanvasRenderingContext2D) {
    const x = this.position.x + (this.w / 2) - (this.trunkWidth / 2);
    const y = this.position.y + (this.crownRadius * 2) - 1;

    ctx.beginPath();
    ctx.rect(x, y, this.trunkWidth, this.trunkHeight);
    ctx.fill();
    ctx.closePath();
  }

  // A method that draws the crown of the tree.
  drawCrown(ctx: CanvasRenderingContext2D) {
    const x = this.position.x + this.w / 2;
    const y = this.position.y + this.crownRadius;

    ctx.beginPath();
    ctx.arc(x, y, this.crownRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  // A method that can be used to create a tree
  // without passing a point2D.
  // eslint-disable-next-line max-len
  static create(x: number, y: number, trunkWidth: number, trunkHeight: number, crownRadius: number) {
    const position = new Point2D(x, y);
    return new Tree(position, trunkWidth, trunkHeight, crownRadius);
  }
}
