import {Scene} from 'phaser'
import Player from '../Player'
import Mushroom from '../Mushroom'
import Gem from '../Gem'
import Bat from '../Bat'
import Goal from '../Goal'
import gameControllerInstance from "../GameController";



import CloudPlatform from "../CloudPlatform";

export default class Level3 extends Scene
{
    constructor()
	{
		super('Level3')
	}
    preload()
    {
        // Load audio 
        this.load.audio('theme', [
            'audio/Yellow-Forest.ogg',
            'audio/Yellow-Forest.mp3'
        ]);

        this.load.audio('damage', [
            'audio/damage.ogg',
            'audio/damage.mp3',
        ]);


        this.load.audio('attack', [
            'audio/sword-effect.wav'
        ]);


        // Load images
        this.load.image('tiles','Tileset2.png');
        this.load.image('cloudPlatform', 'cloud-platform.png');
        this.load.image('heart', 'heart.png');

        // Load map
        this.load.tilemapTiledJSON('map','Level4.json');

        // Load atlas
        this.load.atlas('player', 'Player/player.png', 'Player/player_atlas.json');

        // Load spritesheets
        this.load.spritesheet('tilesSprites','Tileset2.png',
        { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('bat', 'enemy_anim/bat_anim.png', 
        { frameWidth: 46, frameHeight: 30 });

    }

    create()
    {
        // Check for only one overlap 
        this.overlapTriggered = false;
        //musica de fondo
        this.music = this.sound.add('theme', {volume: 0.1, loop: true});
        this.music.play();
        // Damage sound
        this.damage_sound = this.sound.add('damage', {volume: 1, loop: false});
        this.gameover = false

        this.attack_sound = this.sound.add('attack', {volume: 1, loop: false});

        // Create player
        this.player = new Player(this,50,400);

        // Create enemy
        this.bat0 = new Bat(this,300,450);
        this.physics.add.overlap(this.bat0, this.player, this.bat0.playerHit,null,this);
        this.bat1 = new Bat(this,750,500);
        this.physics.add.overlap(this.bat1, this.player, this.bat1.playerHit,null,this);
        this.bat2 = new Bat(this,1000,350);
        this.physics.add.overlap(this.bat2, this.player, this.bat2.playerHit,null,this);
        this.bat3 = new Bat(this,1250,200);
        this.physics.add.overlap(this.bat3, this.player, this.bat3.playerHit,null,this);
        this.bat4 = new Bat(this,1500,300);
        this.physics.add.overlap(this.bat4, this.player, this.bat4.playerHit,null,this);
        this.bat5 = new Bat(this,1750,450);
        this.physics.add.overlap(this.bat5, this.player, this.bat5.playerHit,null,this);

        // Create tiles
        const map = this.make.tilemap({key: 'map'});
        const tiles = map.addTilesetImage('Plataformas', 'tiles');
        const skyTiles = map.addTilesetImage('Fondo', 'sky');

        // Create layers
        const layer0 = map.createLayer('Cielo', skyTiles, 0, 0);
        const layer1 = map.createLayer('Fondo', tiles, 0, 0);
        const layer = map.createLayer('Suelo', tiles, 0, 0);

        //enable collisions for every tile
        layer.setCollisionByExclusion([-1],true);
        this.physics.add.collider(this.player,layer);

        this.cameras.main.setBounds(-80, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.startFollow(this.player);

        
        this.objetos = map.getObjectLayer('Objetos')['objects'];
        this.setas = [];
        this.gemas = [];
        this.goals = [];
        for(let i = 0; i < this.objetos.length; ++i)
        {
            const obj = this.objetos[i];
            if(obj.gid === 115) // Seta
            {
                const mushroom = new Mushroom(this, obj.x, obj.y);
                this.setas.push(mushroom);
                this.physics.add.overlap(mushroom, this.player, this.player.spriteHit,null,this);
            }
            if(obj.gid === 98){ //Gema
                const gem = new Gem(this, obj.x, obj.y);
                this.gemas.push(gem);
                this.physics.add.overlap(gem, this.player, this.player.spriteHitX2,null,this);
            }
            if(obj.gid === 121 || obj.gid === 138 || obj.gid === 157 || obj.gid === 175){
                const goal = new Goal(this, obj.x, obj.y);
                this.goals.push(goal);
                this.physics.add.overlap(goal, this.player, this.goalOverlap,null,this);
            }
        }

        this.scoreText = this.add.text(16, 16, 'PUNTOS: '+ this.player.score, { font: "25px Arial Black", fill: "#fff" }).setScrollFactor(0);
        this.scoreText.setStroke('#00f', 5);
        this.scoreText.setShadow(2, 2, "#333333", 2, true, true);
        this.scoreText.depth=99;

        this.heart1 = this.add.image(this.game.canvas.width-60 , 16, 'heart').setScrollFactor(0);
        this.heart2 = this.add.image(this.game.canvas.width-40 , 16, 'heart').setScrollFactor(0);
        this.heart3 = this.add.image(this.game.canvas.width-20 , 16, 'heart').setScrollFactor(0);
    }

    goalOverlap(player){
        if(this.overlapTriggered){
            this.physics.world.removeCollider(player);
            return;
          };
          console.log('overlap');
          this.overlapTriggered=true;
          this.endGame();
    }

    endGame(){
        // Block camera follow
        this.cameras.main.stopFollow();
        // Set game over for blocking inputs in player
        this.music.stop();
        this.gameover = true;
        // Add GAME OVER text
        const gameOver = this.add.text(220, 200, 'THE END', {
            fontSize: '60px',
            fill: '#ff0000',
            fontFamily: 'verdana, arial, sans-serif'
        }).setScrollFactor(0);
        gameOver.depth = 100;
    }


    gameOverMenu(){
        this.player.depth = -5;
        // Block camera follow
        this.cameras.main.stopFollow();
        // Set game over for blocking inputs in player
        this.music.stop();
        this.gameover = true;
        // Add GAME OVER text
        const gameOver = this.add.text(220, 200, 'GAME OVER', {
            fontSize: '60px',
            fill: '#ff0000',
            fontFamily: 'verdana, arial, sans-serif'
        }).setScrollFactor(0);
        gameOver.depth = 100;
        // Add RESTART button
        this.reload_button = this.add.text(300, 300, 'Restart', {
            fontSize: '60px', 
            fill: '#fff', 
            fontFamily: 'verdana, arial, sans-serif'
        }).setScrollFactor(0); 
        this.reload_button.setInteractive()
        .on('pointerdown', () => this.actionOnClick())
        .on('pointerover', () => this.enterButtonHoverState())
        .on('pointerout', () => this.enterButtonRestState() );

        //this.scene.pause();
    }
    
    actionOnClick(){
        this.scene.restart()
    }
    enterButtonHoverState(){
        this.reload_button.setStyle({ fill: '#ff0'});
    }
    enterButtonRestState(){
        this.reload_button.setStyle({ fill: '#fff' });
    }

    update (time, delta)
    {
        this.player.update(time,delta);
        this.bat0.update(time,delta);
        this.bat1.update(time,delta);
        this.bat2.update(time,delta);
        this.bat3.update(time,delta);
        this.bat4.update(time,delta);
        this.bat5.update(time,delta);
    }
}