<script setup lang="ts">
import { DifficultyOptions, PlayerOptions, SpawnerOptions } from './types/options';
import EndlessRunnerGame from './EndlessRunnerGame';
import Rock from './obstacles/Rock';
import Cactus from './obstacles/Cactus';
import { nextTick, onMounted, useTemplateRef } from 'vue';

const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
let game: EndlessRunnerGame | null = null;

onMounted(async () => {
  // we need to wait a tick to make sure that we have the canvas
  await nextTick();

  const playerOptions: PlayerOptions = {
    width: 40,
    height: 52,
    startX: 40,
    jumpPower: 15,
    jumpHeight: 220,
    gravity: 12,
    playSpeed: 2,
    showTime: 5,
    imageSources: [
      '#turtle1',
      '#turtle2',
      '#turtle3',
      '#turtle4',
      '#turtle5',
      '#turtle6',
    ],
    jumpingImageSource: '#turtle-jump',
    deathImageSource: '#turtle-death',
  };

  const spawnerOptions: SpawnerOptions = {
    width: 30,
    height: 50,
    minLength: 200,
    maxlength: 350,
    speed: 5,
    maxActive: 5,
    obstacles: [
      Cactus.create(-130, 0, 30, 66, '#sprite-cactus'),
      Cactus.create(-130, 0, 30, 66, '#sprite-cactus'),
      Cactus.create(-130, 0, 30, 66, '#sprite-cactus'),
      Cactus.create(-130, 0, 30, 66, '#sprite-cactus'),
      Cactus.create(-130, 0, 98, 66, '#sprite-big-cactus'),
      Cactus.create(-130, 0, 98, 66, '#sprite-big-cactus'),
      Cactus.create(-130, 0, 98, 66, '#sprite-big-cactus'),
      // You always want equal or more obstacles than that can be active
      // Tree.create(-130, 0, 8, 32, 15),
      // Tree.create(-130, 0, 8, 32, 15),
      // Tree.create(-130, 0, 8, 32, 15),
      Rock.create(-130, 0, 28, 25, 5),
      Rock.create(-130, 0, 28, 25, 5),
    ],
  };

  const difficulty: DifficultyOptions = {
    speedIncreasement: 0.01,
    maxIncreasement: 1,
  };

  // Create an instance of the game.
  const frameRate = 30;
  const groundOffset = 20;

  game = new EndlessRunnerGame(
    canvas.value!,
    frameRate,
    groundOffset,
    playerOptions,
    spawnerOptions,
    difficulty,
  );

  // Create an instance of the game.
  game.start();
});
</script>

<template>
  <div>
    <div >
      <div class="FlexColum scorePart">
        <p>Score: {{ game?.score }}</p>
        <p v-if="game?.highScore">HI Score: {{ game?.highScore }}</p>
      </div>
      <canvas ref="canvas" width="1865" height="300" />
    </div>

    <div>
      <img id="turtle1" src="./img/turtle1.png">
      <img id="turtle2" src="./img/turtle2.png">
      <img id="turtle3" src="./img/turtle3.png">
      <img id="turtle4" src="./img/turtle4.png">
      <img id="turtle5" src="./img/turtle5.png">
      <img id="turtle6" src="./img/turtle6.png">
      <img id="turtle-jump" src="./img/turtle-jump.png">
      <img id="turtle-death" src="./img/turtle-death.png">
      <img id="sprite-cactus" src="./img/sprite-cactus.png">
      <img id="sprite-big-cactus" src="./img/sprite-three-cactus.png">
    </div>
  </div>
</template>

<style lang="scss" scoped>
img {
  display: none;
}

.scorePart {
  padding-left: 10px;
  justify-content: space-between;
  max-width: 100%;
  //background: red;

  p {
    font-size: 1.5em;
  }
}

canvas {
  box-sizing: border-box;
  //background: orangered;
  //border: 5px solid purple;
}
</style>
