import { DifficultyOptions, PlayerOptions, SpawnerOptions } from './types/options';
import RunnerPlayer from './RunnerPlayer';
import Background from './Background';
import Spawner from './Spawner';
import InputHandler from './InputHandler';

export default class EndlessRunnerGame {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly groundY: number;

  private speed = 0;
  public score = 0;
  public highScore = parseInt(localStorage.getItem('highScore') || '0', 10);
  private player: RunnerPlayer | null = null;
  private spawner: Spawner | null = null;
  private gameOver = false;

  private readonly inputHandler = new InputHandler();
  private background: Background = new Background(0, 0, 0);

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly frameRate: number,
    groundOffset: number,
    private readonly playerOptions: PlayerOptions,
    private readonly spawnerOptions: SpawnerOptions,
    private readonly difficulty: DifficultyOptions,
  ) {
    this.groundY = this.canvas.height - groundOffset;

    const ctx = canvas.getContext('2d');

    if (ctx === null) {
      throw new Error('Could not get 2d context from canvas');
    }

    this.ctx = ctx;

    this.initialize();
  }

  initialize(): void {
    this.background = new Background(0, this.canvas.width, this.canvas.height);
    this.player = RunnerPlayer.create(this.playerOptions, this.groundY);
    this.spawner = Spawner.create(this.spawnerOptions, this.canvas.width, this.groundY);
    this.speed = 0;
    this.score = 0;
    this.gameOver = false;
  }

  start(): void {
    setInterval(() => {
      this.update();
    }, this.frameRate);
  }

  handleInput(): void {
    if (this.inputHandler.isJump) {
      // If the game is ended,
      // restart the game.
      if (this.gameOver) {
        // this.initialize();
        // Do nothing.
      } else {
        // otherwise, execute the
        // player's jump behaviour.
        this.player?.jump();
      }
    }
  }

  update(): void {
    this.handleInput();

    if (this.player === null || this.spawner === null) {
      return;
    }

    // Clear the canvas.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw game objects
    this.background.draw(this.ctx);
    this.drawGround();
    // this.drawScore();
    this.player?.draw(this.ctx, this.gameOver);
    this.spawner?.draw(this.ctx);

    if (this.gameOver) {
      // Draw game over elements.
      this.drawGameOver();
      this.updateHighScore(this.score);

      // otherwise, execute game behaviour.
    } else {
      this.increaseDifficulty();

      // Execute update.
      this.background.update();
      this.player.update();
      this.spawner.update();

      // Check for collisions.
      this.gameOver = this.player.overlapsWithOthers(this.spawner.activeObstacles);

      if (this.gameOver) {
        setTimeout(() => {
          this.initialize();
        }, 5 * 1000);
      }

      // Increase score.
      // eslint-disable-next-line no-plusplus
      this.score++;
    }

    // if (this.highScore > 0) {
    //   this.drawHighScore();
    // }
  }

  increaseDifficulty() {
    if (this.player === null || this.spawner === null) {
      return;
    }

    if (this.speed < this.difficulty.maxIncreasement) {
      this.speed += this.difficulty.speedIncreasement;
      this.player.movement.jumpPower += this.difficulty.speedIncreasement;
      this.player.movement.gravity += this.difficulty.speedIncreasement;
      this.spawner.speed += this.difficulty.speedIncreasement;
    }
  }

  drawGameOver(): void {
    this.ctx.font = '40px sans-serif';
    this.ctx.beginPath();
    this.ctx.fillText(
      'Type "jump" to jump',
      (this.canvas.width / 2) - 260,
      (this.canvas.height / 2) - 50,
    );
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.fillText('GAME OVER', (this.canvas.width / 2) - 190, this.canvas.height / 2);
    this.ctx.closePath();

    this.ctx.font = '30px sans-serif';
    this.ctx.beginPath();
    this.ctx.fillText(
      'Game restarts in 5 seconds',
      (this.canvas.width / 2) - 290,
      (this.canvas.height / 2) + 50,
    );
    this.ctx.closePath();
  }

  drawScore(): void {
    this.ctx.beginPath();
    this.ctx.fillText(`score: ${this.score}`, 10, this.highScore > 0 ? 40 : 20);
    this.ctx.closePath();
  }

  drawHighScore(): void {
    this.ctx.beginPath();
    this.ctx.fillText(`HI score: ${this.highScore}`, 10, 20);
    this.ctx.closePath();
  }

  updateHighScore(newHigh: number): void {
    this.highScore = Math.max(this.highScore, newHigh);
    // localStorage.setItem('highScore', this.highScore.toString());
  }

  drawGround(): void {
    this.ctx.beginPath();
    this.ctx.rect(0, this.groundY, this.canvas.width, 3);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
