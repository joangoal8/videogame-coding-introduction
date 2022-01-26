import GameSprite from "./GameSprite";

export default class Gem extends GameSprite {

    constructor(scene,x,y)
    {
        super(scene,x+16,y-16,'tilesSprites',98);
        this.body.allowGravity = false;
    }

    update(time,delta)
    {
        console.log('Gem');
    }
}