import { IObstacle, PlayerOptions } from './types/options';
import Point2D from './Point2D';
import Collider from './Collider';
import Animator from './Animator';
import Movement from './Movement';

export default class RunnerPlayer {
  constructor(
    private readonly position: Point2D,
    private readonly animator: Animator,
    public readonly movement: Movement,
    private readonly collider: Collider,
    private readonly jumpingImage: HTMLImageElement,
    private readonly deathImage: HTMLImageElement,
  ) {
    //
  }

  update() {
    this.movement.update();
    if (this.movement.isGrounded) {
      this.animator.update();
    }
  }

  getPlayerImage(gameOver: boolean) {
    if (gameOver) {
      return this.deathImage;
    }

    if (this.movement.isGrounded) {
      return this.animator.getImage();
    }

    return this.jumpingImage;
  }

  draw(ctx: CanvasRenderingContext2D, gameOver: boolean) {
    ctx.beginPath();
    ctx.drawImage(
      this.getPlayerImage(gameOver),
      this.position.x,
      this.position.y,
      this.collider.w,
      this.collider.h,
    );
    ctx.closePath();
  }

  jump() {
    if (this.movement.isGrounded) {
      this.movement.jump();
      this.animator.reset();
    }
  }

  overlapsWithOthers(others: Collider[] | IObstacle[]) {
    return this.collider.overlapsWithOthers(others);
    // return false;
  }

  static create(options: PlayerOptions, groundY: number): RunnerPlayer {
    const position = new Point2D(options.startX, groundY);
    const collider = new Collider(position, options.width, options.height);
    const animator = Animator.create(options.playSpeed, options.showTime, options.imageSources);
    const movement = new Movement(
      position,
      groundY,
      options.height,
      options.jumpPower,
      options.jumpHeight,
      options.gravity,
    );

    const jumpingImage = document.querySelector(options.jumpingImageSource) as HTMLImageElement;
    const deathImage = document.querySelector(options.deathImageSource) as HTMLImageElement;

    return new RunnerPlayer(position, animator, movement, collider, jumpingImage, deathImage);
  }
}
