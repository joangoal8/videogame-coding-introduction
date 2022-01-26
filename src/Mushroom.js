import GameSprite from "./GameSprite";

export default class Mushroom extends GameSprite {

    constructor(scene,x,y)
    {
        super(scene,x+16,y-16,'tilesSprites',114);
        this.body.allowGravity = false;
    }

    update(time,delta)
    {
        console.log('Seta');
    }
}