export default class Animator {
  private timer = 0;
  private index = 0;

  constructor(
    private readonly playSpeed: number,
    private readonly showTime: number,
    private readonly images: HTMLImageElement[],
  ) {
    //
  }

  // A method used to update the animation over time.
  update() {
    this.timer += this.playSpeed;
    if (this.timer >= this.showTime) {
      this.timer = 0;
      this.index = (this.index + 1) % this.images.length;
    }
  }

  // A method that returns the current image of the animation.
  getImage() {
    return this.images[this.index];
  }

  // A method that reset the animation to the first image.
  reset() {
    this.index = 0;
  }

  // A method that can be used to create an instance of an animator
  // by specifying images' locations instead of instances of HTMLImageElements.
  static create(playSpeed: number, showTime: number, imageSelectors: string[]) {
    const images: HTMLImageElement[] = [];

    imageSelectors.forEach((selector) => {
      images.push(document.querySelector(selector) as HTMLImageElement);
    });

    return new Animator(playSpeed, showTime, images);
  }
}
