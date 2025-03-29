import { IObstacle, SpawnerOptions } from './types/options';

export default class Spawner {
  public readonly activeObstacles: IObstacle[] = [];
  private lastObstacle: IObstacle | null = null;
  private nextSpawnLength = 0;

  constructor(
    public readonly obstacles: IObstacle[],
    private readonly maxActive: number,
    public speed: number,
    private readonly startX: number,
    private readonly minLength: number,
    private readonly maxlength: number,
  ) {
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.activeObstacles.forEach((obstacle) => {
      obstacle.draw(ctx);
    });
  }

  update() {
    // Move active obstacles, and remove them
    // from the active list if they are out of sight.
    // eslint-disable-next-line no-plusplus
    for (let i = this.activeObstacles.length - 1; i > -1; i--) {
      this.activeObstacles[i].position.add(-this.speed, 0);

      if (this.activeObstacles[i].position.x < 0) {
        this.activeObstacles.splice(i, 1);
      }
    }

    // Try to spawn a new obstacle.
    this.trySpawn();
  }

  trySpawn() {
    // Don't allow any spawns if the number of active
    // obstacles is greater or equal to the value
    // of maxActive.
    if (this.activeObstacles.length >= this.maxActive) {
      return;
    }

    // Don't allow any spawns if the last obstacle
    // is not far enough away from the spawn position.
    if (this.lastObstacle != null
      && this.lastObstacle.position.x > this.startX - this.nextSpawnLength) {
      return;
    }

    // Get the inactive obstacles and continue if any
    // were found.
    const inactiveObstacles = this.getInactiveObstacles();
    if (inactiveObstacles.length === 0) {
      return;
    }

    // Get a random obstacle and spawn it to the scene.
    const randomIndex = Math.floor(Math.random() * inactiveObstacles.length);

    this.spawn(inactiveObstacles[randomIndex]);
  }

  spawn(obstacle: IObstacle) {
    // Set it as the last spawned obstacle.
    this.lastObstacle = obstacle;
    // Move it to the start position.
    this.lastObstacle.position.x = this.startX;
    // Add it to the list of active obstacles.
    this.activeObstacles.push(obstacle);
    // Calculate a new spawn length.
    this.nextSpawnLength = Math.floor(Math.random() * this.maxlength + this.minLength);
  }

  getInactiveObstacles() {
    const inactiveObstacles: IObstacle[] = [];

    this.obstacles.forEach((obstacle) => {
      if (obstacle.position.x < 0 || obstacle.position.x > this.startX) {
        inactiveObstacles.push(obstacle);
      }
    });

    return inactiveObstacles;
  }

  static create(options: SpawnerOptions, startX: number, groundY: number) {
    options.obstacles.forEach((obstacle, i) => {
      // eslint-disable-next-line no-param-reassign
      options.obstacles[i].position.x = -1;
      // eslint-disable-next-line no-param-reassign
      options.obstacles[i].position.y = groundY - options.obstacles[i].h;
    });

    return new Spawner(
      options.obstacles,
      options.maxActive,
      options.speed,
      startX,
      options.minLength,
      options.maxlength,
    );
  }
}
