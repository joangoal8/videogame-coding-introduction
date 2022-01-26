import GameSprite from "./GameSprite";

export default class Slime extends GameSprite
{
    constructor(scene,x,y)
    {
        super(scene,x,y,'slime');

        // Move to the front
        this.depth = 99

        //this.body.setSize(this.frame.width - 30, this.frame.height - 10, true)

        this.anims.create({
            key: 'move',
            frames: this.scene.anims.generateFrameNames('slime', { start: 1, end: 10}),
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