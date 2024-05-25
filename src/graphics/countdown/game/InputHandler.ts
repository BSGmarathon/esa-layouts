import ComfyJS from 'comfy.js';

const INPUT_JUMP = 'Space';

export default class InputHandler {
  private keys: string[] = [];
  private chatJump = false;

  constructor() {
    window.addEventListener('keydown', (e) => {
      // eslint-disable-next-line default-case
      switch (e.code) {
        case INPUT_JUMP: {
          if (this.keys.includes(e.code)) {
            return;
          }

          this.keys.push(e.code);

          break;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const keyIdx = this.keys.indexOf(e.code);

      if (keyIdx > -1) {
        this.keys.splice(keyIdx, 1);
      }
    });

    ComfyJS.onChat = (user, message, flags, self, extra) => {
      if (this.chatJump) {
        return;
      }

      if (message.toLowerCase() === 'jump') {
        this.chatJump = true;

        setTimeout(() => {
          this.chatJump = false;
        }, 100);
      }
    };

    ComfyJS.Init('bsg_marathon', '', ['bsg_marathon', 'esamarathon', 'duncte123']);
  }

  get isJump() {
    return this.chatJump || this.keys.includes(INPUT_JUMP);
  }
}
