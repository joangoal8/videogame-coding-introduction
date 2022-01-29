import {Scene} from 'phaser'
import Player from '../Player'
import Mushroom from '../Mushroom'
import Gem from '../Gem'
import Slime from '../Slime'
import Bat from '../Bat'
import Rino from '../Rino'

import CloudPlatform from "../CloudPlatform";
import gameControllerInstance from "../GameController";

export default class MainScene extends Scene
{
    constructor()
	{
		super('MainScene')
	}
    preload()
    {
        // Load audio  //cesar
        this.load.audio('theme', [
            'audio/Ship.ogg',
            'audio/Ship.mp3'
        ]);

        // Load images
        this.load.image('tiles','Tileset.png');
        this.load.image('sky','sky.png');
        this.load.image('sea', 'sea.png');
        this.load.image('player', 'idle-1.png');
        this.load.image('cloudPlatform', 'cloud-platform.png');
        //this.load.image('bg-1', 'sky.png');

        // Load map
        this.load.tilemapTiledJSON('map','Map.json');

        // Load atlas
        this.load.atlas('sprites_jugador','player_anim/player_anim.png',
        'player_anim/player_anim_atlas.json');

        // Load spritesheets
        this.load.spritesheet('tilesSprites','Tileset.png',
        { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('skyeSprites','sky.png',
        { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('slime', 'enemy_anim/slime_anim.png', 
        { frameWidth: 44, frameHeight: 30 });
        this.load.spritesheet('bat', 'enemy_anim/bat_anim.png', 
        { frameWidth: 46, frameHeight: 30 });
        this.load.spritesheet('rino', 'enemy_anim/rino_anim.png', 
        { frameWidth: 52, frameHeight: 34 });
        }

    create()
    {
        //musica de fondo
        const music = this.sound.add('theme', {volume: 0.5, loop: true});
        music.play();
        //

        this.gameover = false
        //var bg_1 = this.add.tileSprite(0, 0, this.sys.game.canvas.width*2, this.sys.game.canvas.height*2, 'bg-1');
        //bg_1.fixedToCamera = true;

        // Create player
        this.player = new Player(this,100,100);

        // Create slime enemy
        this.slime1 = new Slime(this,800,100);
        this.physics.add.overlap(this.slime1, this.player, this.slime1.playerHit,null,this);

        this.slime2 = new Slime(this,700,200);
        this.physics.add.overlap(this.slime2, this.player, this.slime2.playerHit,null,this);

        this.bat1 = new Bat(this,500,200);
        this.physics.add.overlap(this.bat1, this.player, this.bat1.playerHit,null,this);

        this.rino1 = new Rino(this,900,100);
        this.physics.add.overlap(this.rino1, this.player, this.rino1.playerHit,null,this);

        this.cloudPlatform2 = new CloudPlatform(this, 3128, 300, this.game.canvas.width / 5, 'HORIZONTAL_RIGHT')
        this.physics.add.collider(this.cloudPlatform2, this.player);
        
        this.cloudPlatform1 = new CloudPlatform(this, 3291, 200, this.game.canvas.height / 5, 'VERTICAL_DOWN')
        this.physics.add.collider(this.cloudPlatform1, this.player);

        this.cloudPlatform4 = new CloudPlatform(this, 3528, 300, this.game.canvas.width / 10, 'HORIZONTAL_RIGHT')
        this.physics.add.collider(this.cloudPlatform4, this.player);

        this.cloudPlatform5 = new CloudPlatform(this, 3791, 200, this.game.canvas.height / 5, 'VERTICAL_DOWN')
        this.physics.add.collider(this.cloudPlatform5, this.player);

        // Create tiles
        const map = this.make.tilemap({key: 'map'});
        const tiles = map.addTilesetImage('Plataformas', 'tiles');
        const skyTiles = map.addTilesetImage('Fondos', 'sky');

        // Create layers
        const layer0 = map.createLayer('Fondo2', skyTiles, 0, 0);
        const layer1 = map.createLayer('Fondo', tiles, 0, 0);
        const layer = map.createLayer('Suelo', tiles, 0, 0);

        //enable collisions for every tile
        layer.setCollisionByExclusion([-1],true);
        this.physics.add.collider(this.player,layer);
        this.physics.add.collider(this.slime1,layer);
        this.physics.add.collider(this.slime2,layer);
        this.physics.add.collider(this.bat1,layer);
        this.physics.add.collider(this.rino1,layer);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        
        this.objetos = map.getObjectLayer('objetos')['objects'];
        this.setas = [];
        this.gemas = [];
        for(let i = 0; i < this.objetos.length; ++i)
        {
            const obj = this.objetos[i];
            if(obj.gid === 115) // en mi caso la seta
            {
                const mushroom = new Mushroom(this, obj.x, obj.y);
                this.setas.push(mushroom);
                this.physics.add.overlap(mushroom, this.player, this.player.spriteHit,null,this);
            }
            if(obj.gid === 99){
                const gem = new Gem(this, obj.x, obj.y);
                this.gemas.push(gem);
                this.physics.add.overlap(gem, this.player, this.player.spriteHitX2,null,this);
            }
        }

        this.scoreText = this.add.text(16, 16, 'PUNTOS: '+ this.player.score, { font: "25px Arial Black", fill: "#fff" }).setScrollFactor(0);
        this.scoreText.setStroke('#00f', 5);
        this.scoreText.setShadow(2, 2, "#333333", 2, true, true);
        this.scoreText.depth=99;
    }

    deathZone(){
        console.log("Muerto");
    }

    gameOverMenu(){
        // Block camera follow
        this.cameras.main.stopFollow();
        // Set game over for blocking inputs in player
        this.gameover = true
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

        this.next_level_button = this.add.text(300, 400, 'Next Level', {
            fontSize: '60px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        }).setScrollFactor(0);

        this.reload_button.setInteractive()
        .on('pointerdown', () => this.actionOnClick())
        .on('pointerover', () => this.enterButtonHoverState())
        .on('pointerout', () => this.enterButtonRestState() );

        this.next_level_button.setInteractive()
            .on('pointerdown', () => this.nextLevelActionOnClick())
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState() );
    }

    actionOnClick(){
        gameControllerInstance.restart(this.scene);
    }

    nextLevelActionOnClick(){
        gameControllerInstance.nextLevel();
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
        this.slime1.update(time,delta);
        this.slime2.update(time,delta);
        this.bat1.update(time,delta);
        this.rino1.update(time,delta);
        this.cloudPlatform1.update(time, delta);
        this.cloudPlatform2.update(time, delta);
        this.cloudPlatform4.update(time, delta);
        this.cloudPlatform5.update(time, delta);
    }
}