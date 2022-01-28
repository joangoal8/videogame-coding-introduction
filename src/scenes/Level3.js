import {Scene} from 'phaser'
import Player from '../Player'
import Mushroom from '../Mushroom'
import Gem from '../Gem'
import Bat from '../Bat'

import CloudPlatform from "../CloudPlatform";

export default class Level3 extends Scene
{
    constructor()
	{
		super('Level3')
	}
    preload()
    {
        // Load audio  //cesar
        this.load.audio('theme', [
            'audio/New_Hope.ogg',
            'audio/New_Hope.mp3'
        ]);

        // Load images
        this.load.image('tiles','Tileset2.png');
        this.load.image('sky','sky2.png');
        this.load.image('player', 'idle-1.png');
        this.load.image('cloudPlatform', 'cloud-platform.png');

        // Load map
        this.load.tilemapTiledJSON('map','Level3.json');

        // Load atlas
        this.load.atlas('sprites_jugador','player_anim/player_anim.png',
        'player_anim/player_anim_atlas.json');

        // Load spritesheets
        this.load.spritesheet('tilesSprites','Tileset2.png',
        { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('skyeSprites','sky2.png',
        { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('bat', 'enemy_anim/bat_anim.png', 
        { frameWidth: 46, frameHeight: 30 });

        }

    create()
    {
        //musica de fondo
        var music = this.sound.add('theme', {volume: 0.5, loop: true});
        music.play();
        //

        this.gameover = false
        //var bg_1 = this.add.tileSprite(0, 0, this.sys.game.canvas.width*2, this.sys.game.canvas.height*2, 'bg-1');
        //bg_1.fixedToCamera = true;

        // Create player
        this.player = new Player(this,100,300);

        // Create enemy

        this.bat1 = new Bat(this,500,200);
        this.physics.add.overlap(this.bat1, this.player, this.bat1.playerHit,null,this);

        // Create cloudplatforms
        this.cloudPlatform1 = new CloudPlatform(this, 300, 400, this.game.canvas.height / 4, 'VERTICAL_DOWN')
        this.physics.add.collider(this.cloudPlatform1, this.player);

       
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

        this.physics.add.collider(this.bat1,layer);

        this.cameras.main.setBounds(-80, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        
        this.objetos = map.getObjectLayer('Objetos')['objects'];
        this.setas = [];
        this.gemas = [];
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
        this.bat1.update(time,delta);
        this.cloudPlatform1.update(time, delta);
   }
}