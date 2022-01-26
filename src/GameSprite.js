import {Physics} from 'phaser'

export default class GameSprite extends Physics.Arcade.Sprite {

    constructor(scene,x,y, texture, frame = -1)
    {
        if (frame === -1) {
            super(scene,x,y, texture);
        } else {
            super(scene,x,y, texture, frame);
        }
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}