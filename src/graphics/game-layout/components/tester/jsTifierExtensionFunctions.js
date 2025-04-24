/* eslint-disable no-param-reassign */

function setupMainFont(ctx) {
  ctx.fillStyle = 'white';
  ctx.font = '23px Goodlight';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
}

function drawMainText(ctx, text, x, y, maxWidth) {
  ctx.shadowBlur = 3;
  ctx.shadowColor = 'black';
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  setupMainFont(ctx);
  // y = font size in px
  ctx.fillText(text, x, y, maxWidth);

  // draw again for main shadow?

  ctx.shadowBlur = 0;
  ctx.shadowColor = '#cf773b';
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // TODO: do I need to redefine this?
  // ctx.fillStyle = 'white';
  // ctx.font = '23px Goodlight'
  // ctx.textAlign = 'left'
  // ctx.textBaseline = 'bottom';
  // y = font size in px
  ctx.fillText(text, x, y, maxWidth);
}

window.setupMainFont = setupMainFont;
window.drawMainText = drawMainText;
