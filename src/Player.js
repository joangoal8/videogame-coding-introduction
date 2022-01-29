import { Physics } from 'phaser'
import gameControllerInstance from "./GameController";


export default class Player extends Physics.Arcade.Sprite
{
    constructor(scene,x,y)
    {
        super(scene,x,y,'player');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.score = 0;

        //continuación
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        // Move to the front
        this.depth = 99

        this.body.setSize(this.frame.width - 30, this.frame.height - 10, true);

        this.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 18, prefix: 'walk-' }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 4, prefix: 'idle-' }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 4, prefix: 'jump-' }),
            frameRate: 5,
            repeat: -1
        });
        
    }

    update(time,delta)
    {
        if(!this.scene.gameover){ // Check if player is alive
            if(this.cursor.left.isDown)
            {
                this.setVelocityX(-200);
                this.setFlipX(true); 
            }
            else if(this.cursor.right.isDown)
            {
                this.setVelocityX(200);
                this.setFlipX(false); 
            }
            else
            {
                //Parado
                this.setVelocityX(0);
            }

            if (this.cursor.space.isDown && this.body.onFloor()) {
                this.setVelocityY(-200);
            }

            if(!this.body.onFloor())
                this.play('jump', true);
            else if(this.body.velocity.x !== 0)
                this.play('walk', true);
            else
                this.play('idle', true);
        }

        if (this.scene.game.canvas.height < this.y-100 && this.scene.scene.key != 'Level2') {
                this.playerDead()
        }
    }


    spriteHit (sprite1, sprite2) {
        this.player.score += 1;
        this.scoreText.setText('PUNTOS: ' + this.player.score);
        sprite1.destroy();
    }

    spriteHitX2 (sprite1, sprite2){
        this.player.score += 2;
        this.scoreText.setText('PUNTOS: ' + this.player.score);
        sprite1.destroy();
    }

    playerDead () {
        // Show game over menu
            this.scene.gameOverMenu()
    }
}