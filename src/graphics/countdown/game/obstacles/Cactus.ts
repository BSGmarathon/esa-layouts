import { IObstacle } from '../types/options';
import Point2D from '../Point2D';

export default class Cactus implements IObstacle {
  constructor(
    public readonly position: Point2D,
    private readonly image: HTMLImageElement,
    public readonly spw: number,
    public readonly sph: number,
  ) {
  }

  public readonly h: number = this.sph;
  public readonly w: number = this.spw - 50;

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.spw,
      this.sph,
    );
    ctx.closePath();
  }

  static create(x: number, y: number, w: number, h: number, sprite: string) {
    const position = new Point2D(x, y);
    const spriteImg = document.querySelector(sprite) as HTMLImageElement;

    return new Cactus(position, spriteImg, w, h);
  }
}
