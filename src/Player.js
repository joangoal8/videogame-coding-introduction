import { Physics } from 'phaser'
import gameControllerInstance from "./GameController";
class StateMachine 
{

  constructor(initialState, possibleStates, stateArgs=[]) {
    this.initialState = initialState;
    this.possibleStates = possibleStates;
    this.stateArgs = stateArgs;
    this.state = null;

    // Las instancias de estado obtienen acceso a la máquina de estado a través de this.stateMachine.
    for (const state of Object.values(this.possibleStates)) {
      state.stateMachine = this;
    }
  }

  step() {
    // En el primer paso, el estado es null y necesitamos inicializar el primer estado.
    if (this.state === null) {
      this.state = this.initialState;
      this.possibleStates[this.state].enter(...this.stateArgs);
    }

    // Ejecutar el estado actual en ejecución
    this.possibleStates[this.state].execute(...this.stateArgs);
  }

  transition(newState, ...enterArgs) {
    this.state = newState;
    this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs);
  }
}

class State 
{
    // (START) Ejecuta una función cuando hagamos la primera transición a un nuevo estado.
    enter() {} 
    // (UPDATE) Ejecuta una función durante cada llamada de actualización según el estado actual.
    execute() {}
}

class IdleState extends State
{
    enter(scene, player) 
    {
        player.setVelocityX(0);
        player.play('idle', true);
    }

    execute(scene, player) 
    {

        const {left, right, space, shift} = player.keys;

        if(right.isDown || left.isDown)
        {
            this.stateMachine.transition('walk');
            return;
        }

        if(!player.body.onFloor())
        {
            this.stateMachine.transition('jump');
            return;
        }

        if(space.isDown)
        {
            // Potencia de salto parado
            player.setVelocityY(-300);
            this.stateMachine.transition('jump');
            return;
        }

        if(shift.isDown)
        {
            this.stateMachine.transition('attack');
            return;
        }
    }
}

class WalkState extends State
{

    execute(scene, player) 
    {
        const {left, right, space, shift} = player.keys;

        if(!player.body.onFloor())
        {
            this.stateMachine.transition('jump');
            return;
        }

        if(space.isDown)
        {
            // Potencia de salto corriendo
            player.setVelocityY(-350);
            this.stateMachine.transition('jump');
            return;
        }

        if(shift.isDown)
        {
            this.stateMachine.transition('attack');
            return;
        }

        if (!(left.isDown || right.isDown)) 
        {
            this.stateMachine.transition('idle');
            return;
        }

        if (left.isDown) 
        {
            player.setVelocityX(-player.speed);
            player.setFlipX(true); 
            player.setOffset(40, 15);

        } else if (right.isDown) 
        {
            player.setVelocityX(player.speed);
            player.setFlipX(false);
            player.setOffset(25, 15); 
        }

        player.play('walk', true);

    }
}

class JumpState extends State
{
    enter(scene, player) 
    {
        player.play('jump', true);
    }
    execute(scene, player) 
    {
        const {left, right, space, shift} = player.keys;

        if(player.body.onFloor())
        {
            this.stateMachine.transition('idle');
            return;
        }

        // Movimiento en el aire
        if (left.isDown) 
        {
            player.setVelocityX(-player.speed);
            player.setFlipX(true); 
            player.setOffset(40, 15);

        } else if (right.isDown) 
        {
            player.setVelocityX(player.speed);
            player.setFlipX(false);
            player.setOffset(25, 15); 
        }
       
    }
}

class AttackState extends State
{
    enter(scene, player) 
    {
        scene.attackHitbox.x = player.x;
        scene.attackHitbox.y = player.y;
        scene.attackHitbox.body.enable = true;

        player.setVelocityX(0);
        player.play('attack');
        player.once('animationcomplete', () => 
        {
            scene.attackHitbox.body.enable = false;
            this.stateMachine.transition('idle');
        });
    }   
}



export default class Player extends Phaser.Physics.Arcade.Sprite
{

    //(Escena, posición en la escena (x, y) y hoja del sprite)
    constructor(scene, x, y)
    {
        super(scene, x, y);
        this.scene = scene;

        this.init();
        this.animate(); 
    }  

    init()
    {        
        this.scene.add.existing(this); //Añadimos a la escena lógica este jugador
        this.scene.physics.add.existing(this); //Añadimos a la escena física este jugador
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.body.setSize(this.frame.width - 25, this.frame.height, false); // Adaptamos la máscara de colisiones
        this.setOffset(25, 15); // Ajustamos el offset (cuando gira se reajusta) 
        this.speed = 125;
        this.body.setGravityY(400);
        this.score = 0;
        this.life = 3;
        this.immunity_end = 0;
        this.immunity = false;
        this.depth = 99;

        // Hitbox attack 
        this.scene.attackHitbox = this.scene.add.rectangle(this.x, this.y, 60, this.height, 0xff0000, 0); // (scene, x, y, width, height, fillColor, opacity)          
        this.scene.physics.world.enable(this.scene.attackHitbox);
        this.scene.attackHitbox.body.enable = false;

    }

    animate()
    {
        
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('player', { 
                prefix: 'warrior_sheetnoeffect_', 
                start: 0, 
                end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', { 
                prefix: 'warrior_sheetnoeffect_', 
                start: 6, 
                end: 12 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('player', { 
                prefix: 'warrior_sheetnoeffect_', 
                start: 41, 
                end: 48 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNames('player', { 
                prefix: 'warrior_sheetnoeffect_', 
                start: 77, 
                end: 83 }),
            frameRate: 20,
            repeat: 0
        });

        this.stateMachine = new StateMachine('idle', {
            idle: new IdleState(),
            walk: new WalkState(),
            jump: new JumpState(),
            attack: new AttackState(),
        }, [this.scene, this]);
    }


    update(time, delta)
    {
        if(!this.scene.gameover){ // Check if player is alive
            this.stateMachine.step();
        }
        if (this.scene.game.canvas.height < this.y-100 && this.scene.scene.key != 'Level2') {
                this.playerDamage()
        }
        this.setImmunity();
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

    playerDamage () {
        this.life--;

        this.scene.damage_sound.play();
        switch(this.life){
            case 0:
                // Show game over menu
                this.scene.gameOverMenu()
                this.scene.heart3.destroy();
                break;
            case 1:
                this.scene.heart2.destroy();
                break;
            case 2:
                this.scene.heart1.destroy();
                break;
            default:
                break;
        }

    }

    setImmunity(){  
        // too early      
        if(this.immunity_end>this.scene.time.now){
            console.log("Inmmunity");
            this.tint = 0xff0000
            return;
        }else{
            console.log("Inmmunity End");
            this.immunity = false;
            this.tint = 0xffffff
        }
        
    }
}