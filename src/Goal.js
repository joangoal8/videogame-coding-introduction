import GameSprite from "./GameSprite";

export default class Goal extends GameSprite {

    constructor(scene,x,y)
    {
        super(scene,x+16,y-16,'tilesSprites',121);
        this.body.allowGravity = false;
    }

    update(time,delta)
    {
    }
}