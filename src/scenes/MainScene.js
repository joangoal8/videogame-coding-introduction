import Phaser from 'phaser'
import Player from '../player'
import Seta from '../Seta'

export default class MainScene extends Phaser.Scene
{
    constructor()
	{
		super('MainScene')
	}
    preload()
    {
        this.load.image('tiles','Tileset.png');
        this.load.tilemapTiledJSON('map','Map.json');
        this.load.image('bg-1', 'sky.png');
        this.load.image('sea', 'sea.png');
        this.load.image('player', 'idle-1.png');
        //Phaser.Physics.Arcade.Sprite
        // https://gammafp.com/tool/atlas-packer/
        this.load.atlas('sprites_jugador','player_anim/player_anim.png',
        'player_anim/player_anim_atlas.json');
        this.load.spritesheet('tilesSprites','Tileset.png',
        { frameWidth: 32, frameHeight: 32 });
    }

    create()
    {
        var bg_1 = this.add.tileSprite(0, 0, this.sys.game.canvas.width*2, this.sys.game.canvas.height*2, 'bg-1');
        bg_1.fixedToCamera = true;
        //necesitamos un player
        this.player = new Player(this,50,100);
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('Plataformas', 'tiles');
        
        var layer2 = map.createLayer('Fondo', tiles, 0, 0);
        var layer = map.createLayer('Suelo', tiles, 0, 0);
        //enable collisions for every tile
        layer.setCollisionByExclusion([-1],true);
        this.physics.add.collider(this.player,layer);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);

        
        this.objetos = map.getObjectLayer('objetos')['objects'];
        this.setas = [];
        for(var i = 0; i < this.objetos.length; ++i)
        {
            var obj = this.objetos[i];
            if(obj.gid == 115) // en mi caso la seta
            {
                var seta = new Seta(this,obj.x,obj.y);
                this.setas.push(seta);
                this.physics.add.overlap(seta, this.player, this.spriteHit,null,this);
            }
        }
        this.score = 1;
        this.scoreText = this.add.text(16, 16, 'PUNTOS: '+this.score, { 
            fontSize: '20px', 
            fill: '#000', 
            fontFamily: 'verdana, arial, sans-serif' 
          });
        
    }

    spriteHit (sprite1, sprite2) {

        sprite1.destroy();
 
    }

    update (time, delta)
    {
        this.player.update(time,delta);
    }
}