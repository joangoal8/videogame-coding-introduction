import GameSprite from "./GameSprite";

export default class CloudPlatform extends GameSprite {

    constructor(scene,x,y, range, direction) {
        super(scene, x, y, 'cloudPlatform')
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.startX = x;
        this.startY = y;
        this.range = range;
        this.direction = direction;
        // Move to the front
        this.depth = 99
    }

    update(time,delta)
    {
        if (this.direction === 'HORIZONTAL_RIGHT' && (this.x < (this.startX + this.range / 2))) 
        {
            //this.x++;
            this.setVelocityX(+50);
            if (this.x === (this.startX + this.range / 2)) {
                this.direction = 'HORIZONTAL_LEFT';
                this.setVelocityX(-50);
            }
        }else{ 
            if (this.direction === 'HORIZONTAL_RIGHT') 
            {
                this.x--;
                this.setVelocityX(-50);
                this.direction = 'HORIZONTAL_LEFT';
            }
        }
 
        if (this.direction === 'HORIZONTAL_LEFT' && (this.x > (this.startX - this.range / 2))) 
        {
            //this.x--;
            this.setVelocityX(-50);

            if (this.x === (this.startX - this.range / 2)) 
            {
                this.direction = 'HORIZONTAL_RIGHT';
                this.setVelocityX(+50);
            }
        }else{ 
            if (this.direction === 'HORIZONTAL_LEFT') 
            {
                this.x++;
                this.setVelocityX(+50);
                this.direction = 'HORIZONTAL_RIGHT';
            }
        }

        if (this.direction === 'VERTICAL_DOWN' && (this.y < (this.startY + this.range / 2))) 
        {
            //this.y++;
            this.setVelocityY(+50);

            if (this.y === (this.startY + this.range / 2)) 
            {
                this.direction = 'VERTICAL_UP';
                
            }
        }else{ 
            if (this.direction === 'VERTICAL_DOWN') 
            {
                this.y++;
                this.setVelocityY(-50);
                this.direction = 'VERTICAL_UP';
            }
        }    
        if (this.direction === 'VERTICAL_UP' && (this.y > (this.startY - this.range / 2))) 
        {
            //this.y--;
            this.setVelocityY(-50);

            if (this.y === (this.startY - this.range / 2)) 
            {
                this.direction = 'VERTICAL_DOWN';
                this.setVelocityY(+50);
            }
        }else{ 
            if (this.direction === 'VERTICAL_UP') 
            {
                this.y--;
                this.setVelocityY(-50);
                this.direction = 'VERTICAL_DOWN';
            }
        }
    }
}