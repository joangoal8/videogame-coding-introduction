import {Scene} from 'phaser'
import Player from '../Player'
import Mushroom from '../Mushroom'
import Gem from '../Gem'
import Slime from '../Slime'
import CloudPlatform from "../CloudPlatform";

export default class MainScene extends Scene
{
    constructor()
	{
		super('MainScene')
	}
    preload()
    {
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
        this.load.spritesheet('slime', 'slime_anim/slime_anim.png', 
        { frameWidth: 44, frameHeight: 30 });
    }

    create()
    {
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

        this.cloudPlatform1 = new CloudPlatform(this, 3291, 200, this.game.canvas.height / 5, 'VERTICAL_DOWN')
        this.physics.add.collider(this.cloudPlatform1, this.player);

        this.cloudPlatform2 = new CloudPlatform(this, 3128, 300, this.game.canvas.width / 5, 'HORIZONTAL_RIGHT')
        this.physics.add.collider(this.cloudPlatform2, this.player);
        
        // Create tiles
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('Plataformas', 'tiles');
        var skyTiles = map.addTilesetImage('Fondos','sky')
        
        // Create layers
        var layer0 = map.createLayer('Fondo2', skyTiles, 0, 0);
        var layer1 = map.createLayer('Fondo', tiles, 0, 0);
        var layer = map.createLayer('Suelo', tiles, 0, 0);

        //enable collisions for every tile
        layer.setCollisionByExclusion([-1],true);
        this.physics.add.collider(this.player,layer);
        this.physics.add.collider(this.slime1,layer);
        this.physics.add.collider(this.slime2,layer);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);

        
        this.objetos = map.getObjectLayer('objetos')['objects'];
        this.setas = [];
        this.gemas = [];
        for(var i = 0; i < this.objetos.length; ++i)
        {
            var obj = this.objetos[i];
            if(obj.gid === 115) // en mi caso la seta
            {
                var seta = new Mushroom(this,obj.x,obj.y);
                this.setas.push(seta);
                this.physics.add.overlap(seta, this.player, this.player.spriteHit,null,this);
            }
            if(obj.gid === 99){
                var gema = new Gem(this,obj.x,obj.y);
                this.gemas.push(gema);
                this.physics.add.overlap(gema, this.player, this.player.spriteHitX2,null,this);
            }
        }


        this.scoreText = this.add.text(16, 16, 'PUNTOS: '+ this.player.score, { 
            fontSize: '20px', 
            fill: '#000', 
            fontFamily: 'verdana, arial, sans-serif' 
        // Make text move with camera using setScrollFactor(0)
          }).setScrollFactor(0);
        // Set text in front
        this.scoreText.depth=99;

        /*
        var r3 = this.add.rectangle(80, 530, 9999, 128);
        r3.setStrokeStyle(2, 0xff0000);
        this.physics.add.overlap(r3, this.player, this.deathZone,null,this);

        this.graphics.lineStyle(1, 0x00ff00, 1);
        this.graphics.strokeRectShape(this.rect);
        this.physics.add.overlap(this.player, this.rect.obj,this.deathZone);
        console.log(this.physics.add.overlap(this.player, this.graphics, this.deathZone));
        */

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
        var gameover = this.add.text(220, 200, 'GAME OVER', { 
            fontSize: '60px', 
            fill: '#ff0000', 
            fontFamily: 'verdana, arial, sans-serif'
        }).setScrollFactor(0); 
        gameover.depth = 100;
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
        this.slime1.update(time,delta);
        this.slime2.update(time,delta);
        //console.log(this.physics.add.overlap(this.player, this.graphics));
    }
}