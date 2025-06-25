export default class Background {
  private current: number;

  constructor(
    private readonly max: number,
    private readonly w: number,
    private readonly h: number,
  ) {
    this.current = max;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw background color.
    // ctx.beginPath();
    // ctx.fillStyle = 'rgb(0, 0, 0)';
    // ctx.rect(0, 0, this.w, this.h);
    // ctx.fill();
    // ctx.closePath();

    // Set inverse colors for other objects.
    /* eslint-disable no-param-reassign */
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    /* eslint-enable no-param-reassign */
  }

  update(): void {
    // Does not need to do anything anymore
  }
}
