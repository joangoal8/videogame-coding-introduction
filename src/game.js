import Phaser from 'phaser'

import MainScene from './scenes/MainScene'

//Configuración de la escena
const windows = {width: 800, height: 480};
const config = {
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
            gravity: {y: 200},
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
export default game

//'http://labs.phaser.io'
//'assets/skies/space3.png'
//'assets/sprites/phaser3-logo.png'
//'assets/particles/red.png'

