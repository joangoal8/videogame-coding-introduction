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
        if(this.scene != undefined)
        {
            this.setVelocityX(-20);
            this.play('move', true);    
        }  
    }

    playerHit (sprite1, sprite2) {
        // Check if player is immune
        if(!sprite2.immunity){
            sprite2.playerDamage();
            // Set inmmunity time
            sprite2.immunity = true;
            sprite2.immunity_end = this.scene.scene.time.now + 2000;
        }
        //sprite1.destroy();
    }
}