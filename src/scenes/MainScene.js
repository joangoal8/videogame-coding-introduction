import Phaser from 'phaser'
import Player from '../player'
import Seta from '../Seta'
import Gema from '../Gema'


export default class MainScene extends Phaser.Scene
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
    }

    create()
    {
        //var bg_1 = this.add.tileSprite(0, 0, this.sys.game.canvas.width*2, this.sys.game.canvas.height*2, 'bg-1');
        //bg_1.fixedToCamera = true;

        // Create player
        this.player = new Player(this,100,100);

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

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);

        
        this.objetos = map.getObjectLayer('objetos')['objects'];
        this.setas = [];
        this.gemas = [];
        for(var i = 0; i < this.objetos.length; ++i)
        {
            var obj = this.objetos[i];
            if(obj.gid == 115) // en mi caso la seta
            {
                var seta = new Seta(this,obj.x,obj.y);
                this.setas.push(seta);
                this.physics.add.overlap(seta, this.player, this.spriteHit,null,this);
            }
            if(obj.gid == 99){
                var gema = new Gema(this,obj.x,obj.y);
                this.gemas.push(gema);
                this.physics.add.overlap(gema, this.player, this.spriteHitx2,null,this);
            }
        }
        this.score = 1;
        this.scoreText = this.add.text(16, 16, 'PUNTOS: '+this.score, { 
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
    spriteHit (sprite1, sprite2) {

        sprite1.destroy();
        console.log("+1");
    }

    spriteHitx2 (sprite1, sprite2){
        sprite1.destroy();
        console.log("+2");

    }

    update (time, delta)
    {
        this.player.update(time,delta);
        //console.log(this.physics.add.overlap(this.player, this.graphics));
    }
}