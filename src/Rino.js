import GameSprite from "./GameSprite";

export default class Rino extends GameSprite
{
    constructor(scene,x,y)
    {
        super(scene,x,y,'rino');

        // Move to the front
        this.depth = 99

        this.scene.physics.add.overlap(this, this.scene.attackHitbox, this.takeDamage, null, this);

        
        this.anims.create({
            key: 'move',
            frames: this.scene.anims.generateFrameNames('rino', { start: 1, end: 7}),
            frameRate: 10,
            repeat: -1
        });   
        
    }

    update(time,delta)
    {
        if(this.scene != undefined)
        {
            this.setVelocityX(-50);
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

    takeDamage()
    {
        // TODO: Añadir sonido
        this.destroy();
    }
}