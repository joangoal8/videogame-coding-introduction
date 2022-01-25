import { Physics } from 'phaser'

export default class CloudPlatform extends Physics.Arcade.Sprite {

    constructor(scene,x,y, range, direction) {
        super(scene, x, y, 'cloudPlatform')
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
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
        if (this.direction === 'HORIZONTAL_RIGHT' && (this.x < (this.startX + this.range / 2))) {
            this.x++;
            if (this.x === (this.startX + this.range / 2)) {
                this.direction = 'HORIZONTAL_LEFT';
            }
        }
        if (this.direction === 'HORIZONTAL_LEFT' && (this.x > (this.startX - this.range / 2))) {
            this.x--;
            if (this.x === (this.startX - this.range / 2)) {
                this.direction = 'HORIZONTAL_RIGHT';
            }
        }
        if (this.direction === 'VERTICAL_DOWN' && (this.y < (this.startY + this.range / 2))) {
            this.y++;
            if (this.y === (this.startY + this.range / 2)) {
                this.direction = 'VERTICAL_UP';
            }
        }
        if (this.direction === 'VERTICAL_UP' && (this.y > (this.startY - this.range / 2))) {
            this.y--;
            if (this.y === (this.startY - this.range / 2)) {
                this.direction = 'VERTICAL_DOWN';
            }
        }
    }
}