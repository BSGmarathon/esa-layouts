import Point2D from '@esa-layouts/countdown/game/Point2D';

export interface PlayerOptions {
  width: number;
  height: number;
  startX: number;
  jumpPower: number;
  jumpHeight: number;
  gravity: number;
  playSpeed: number;
  showTime: number;
  imageSources: string[];
  jumpingImageSource: string;
  deathImageSource: string;
}

export interface IObstacle {
  position: Point2D;
  h: number;
  w: number;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface SpawnerOptions {
  width: number;
  height: number;
  minLength: number;
  maxlength: number;
  speed: number;
  maxActive: number;
  obstacles: IObstacle[];
}

export interface DifficultyOptions {
  speedIncreasement: number;
  maxIncreasement: number;
}
