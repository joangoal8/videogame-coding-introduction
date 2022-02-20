import GameSprite from "./GameSprite";

export default class Slime extends GameSprite
{
    constructor(scene,x,y, range, sentido)
    {
        super(scene,x,y,'slime');

        this.startX = x;
        this.startY = y;
        this.range = range;
        this.direction = sentido;

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
        if(this.scene != undefined)
        {
            this.play('move', true);      

            if (this.direction === 'RIGHT' && (this.x < (this.startX + this.range / 2))) 
            {
                this.setVelocityX(+20);
                if (this.x === (this.startX + this.range / 2)) {
                    this.flipX=false;
                    this.direction = 'LEFT';
                    this.setVelocityX(-20);
                }
            }else{ 
                if (this.direction === 'RIGHT') 
                {
                    this.x--;
                    this.flipX=false;
                    this.setVelocityX(-20);
                    this.direction = 'LEFT';
                }
            }
    
            if (this.direction === 'LEFT' && (this.x > (this.startX - this.range / 2))) 
            {
                this.setVelocityX(-20);
                if (this.x === (this.startX - this.range / 2)) 
                {
                    this.flipX=true;
                    this.direction = 'RIGHT';
                    this.setVelocityX(+20);
                }
            }else{ 
                if (this.direction === 'LEFT') 
                {
                    this.x++;
                    this.flipX=true;
                    this.setVelocityX(+20);
                    this.direction = 'RIGHT';
                }
            }
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