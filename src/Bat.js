import GameSprite from "./GameSprite";

export default class Bat extends GameSprite
{
    constructor(scene,x,y)
    {
        super(scene,x,y,'bat');

        // Move to the front
        this.depth = 99
        this.body.allowGravity = false;
        
        this.anims.create({
            key: 'move',
            frames: this.scene.anims.generateFrameNames('bat', { start: 1, end: 7}),
            frameRate: 10,
            repeat: -1
        });   
        
    }

    update(time,delta)
    {
        this.setVelocityX(-20);
        this.play('move', true);      
    }

    playerHit (sprite1, sprite2) {
        // Hide sprite
        sprite2.depth = -5
        // Show game over menu
        this.scene.scene.gameOverMenu()
    }
}