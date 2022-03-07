import Phaser from 'phaser'

import MainScene from './scenes/MainScene'
import Level2 from './scenes/Level2'
import Level3 from './scenes/Level3'
import Level4 from './scenes/Level4'

class GameController {

    constructor(windows)
    {
        this.gameover = false
        this.levelIndex = 0;
        this.configs = [
            {
                type: Phaser.AUTO,
                width: windows.width,
                height: windows.height,
                parent: "canvas",
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                scene: MainScene,
                physics: {
                    default: 'arcade',
                    arcade: {
                        debug: false
                    }
                },
            },
            {
                type: Phaser.AUTO,
                width: windows.width,
                height: windows.height,
                parent: "canvas",
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                scene: Level2,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: {y: 200},
                        debug: false
                    }
                },
            },
            {
                type: Phaser.AUTO,
                width: windows.width,
                height: windows.height,
                parent: "canvas",
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                scene: Level3,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: {y: 200},
                        debug: false
                    }
                },
            },
            {
                type: Phaser.AUTO,
                width: windows.width,
                height: windows.height,
                parent: "canvas",
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                scene: Level4,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: {y: 200},
                        debug: false
                    }
                },
            }
        ];
        this.game = new Phaser.Game(this.configs[this.levelIndex]);
    }

    nextLevel() {
        if(this.levelIndex < this.configs.length) {
            this.levelIndex++;
            this.game.destroy(true);
            this.game = new Phaser.Game(this.configs[this.levelIndex]);
        }
    }

    getLevel() {
        return this.game;
    }

    restart(scene) {
        scene.restart();
    }
}

const gameControllerInstance = new GameController({width: 800, height: 480});
export default gameControllerInstance;

