var game = function() {

var Q = window.Q = Quintus()
	       .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")

	       .setup('myGame',
	       {
	       	width: 800,
	       	height: 600,
	       	scaleToFit : true //Scale the game to fit the screen of the player´s device
	       })
	       .controls().enableSound()
	       .touch();

	Q.component("dancer", {
		extend: {
			dance: function(){
				this.p.angle = 0;
				this.animate({angle: 360}, 0.5, Q.Easing.Quadratic.In);
			}
		}
	});       

	//Sprite personaje principal
	Q.Sprite.extend("Mario",{
			init: function(p) {
				this._super(p, {
					 sheet: "mario",
					 sprite: "mario_anim",
					 x: 250,
					 y: 250,
					 frame: 0,
					 scale: 1,
					 gravity: .75
				 });
				//el 2d es para darle gravedad, que este sobre el mapa y choque correctamente con la plataforma, no flotando
				//el platf para darle controles de juego, arriba, abajo, der, izq
				this.add("2d, platformerControls, animation, tween, dancer"); //componentes
				Q.input.on("up", this, function(){ 
					if(this.p.vy == 0) // para que el audio del salto vaya correctamente
					Q.audio.play("jump_small.mp3");
				});
				Q.input.on("fire", this, "dance");
			},
			step: function(dt){
				if(this.p.vx > 0){
					this.play("walk_right");
				} else if(this.p.vx < 0){
					this.play("walk_left");
				}

				if(this.p.vy < 0){
					if(this.p.vx > 0){
						this.play("jump_right");
					} else if(this.p.vx < 0){
						this.play("jump_left");
					}
				}
				
				if(this.p.vy > 0){
					if(this.p.vx > 0){
						this.play("fall_right");
					} else if(this.p.vx < 0){
						this.play("fall_left");
					}
				}
			},
			die: function(){
				Q.state.dec("lives", 1);
				console.log(Q.state.get("lives"));
				if(Q.state.get("lives") < 0){
					this.destroy();
					Q.stageScene("endGame", 2);
				}
			}

		});

	//Sprite de la seta
	Q.Sprite.extend("OneUp",{
			init: function(p) {
				this._super(p, {
					 asset: "1up.png",
					 scale: 1,
					 x: 20, //respecto a mario
					 y: -10,
					 sensor: true, //para que los objetos dejen pasar a mario aunque colisionen
				 	 taken: false
				 });
				this.on("sensor", this, "hit");
				this.add("tween"); //para animar y rotarla
			},
			hit: function(collision){
				if(this.taken) return;
				if(!collision.isA("Mario")) return;
				
				this.taken = true; //para coger las setas y que desaparezcan
				Q.state.inc("lives", 1);
				console.log(Q.state.get("lives"));
				collision.p.vy = -400;
				
				this.animate({y: this.p.y-100, angle:360}, //-200 para que la seta gire mas alto
							  2, //que tarde mas
							  Q.Easing.Quadratic.Out, //podemos probar animaciones diferntes In, InOut
							  {callback: function(){this.destroy()}});
				//this.destroy();
				Q.audio.play("coin.mp3");
			}
		});

	// Sprite del enemigo
	Q.Sprite.extend("Goomba",{
		init: function(p) {
			this._super(p, {
				 sheet: 'goomba',
				 x: 400+(Math.random()*200),
				 y: 250,
				 frame: 0,
				 vx: 100
			 });

			this.add('2d, aiBounce, animation'); //componentes
			this.on("bump.top", this, "onTop");
			this.on("bump.left,bump.right,bump.bottom",this, "kill");
		},
		onTop: function(collision){
			if(!collision.obj.isA("Mario")) return;
			collision.obj.p.vy = -200;
			console.log("Goomba dies");
			this.destroy();
			Q.audio.play("kill_enemy.mp3");
		},
		kill: function(collision){
			if(!collision.obj.isA("Mario")) return;
			collision.obj.p.vy = -200;
			collision.obj.p.vx = collision.normalX *-500;
			collision.obj.p.x += collision.normalX *-5;
			collision.obj.die();
		}
	});


	Q.load(["mario_small.png", "mario_small.json", "1up.png", "bg.png", "mapa2021.tmx",
		    "tiles.png", "goomba.png", "goomba.json", "music_main.mp3",
		    "kill_enemy.mp3", "jump_small.mp3",
		    "coin.mp3", "portada.png", "level_1.tmx","foresttiles01.png"],  function() {
		
		// Or from a .json asset that defines sprite locations
		Q.compileSheets("mario_small.png","mario_small.json");
		Q.compileSheets("goomba.png","goomba.json");

	Q.animations("mario_anim", {
		walk_right: { frames: [1,2,3], rate: 1/6, next: "parado_r"},
		walk_left: { frames: [15,16,17], rate: 1/6, next: "parado_l"},
		jump_right: { frames: [4], rate: 1/6, next: "parado_r" },
		jump_left: { frames: [18], rate: 1/6, next: "parado_l"},
		fall_right: { frames:[6,7], rate: 1/6, next: "parado_r" },
		fall_left: { frames: [21,21], rate: 1/6, next: "parado_l"},
		parado_r: { frames: [0]},
		parado_l: { frames: [14]},
		morir: { frames: [12], loop: false, rate: 1}
	});

		Q.scene("level1", function (stage){
			/*
			stage.insert(
				new Q.Repeater({asset: "bg.png", speedX: 0.5, speedY: 0.5}) //para repetir el fondo
			);
			*/
			Q.stageTMX("level_1.tmx", stage);
	
			mario = new Q.Mario();
			stage.insert(mario);
			//stage.insert(new Q.OneUp(), mario); //para que la seta se mueva con mario

			stage.add("viewport").follow(mario,{x: true, y: false}); //la camara sigue a mario centrado en el eje horizontal, en el vertical esta a false
			stage.viewport.scale = .75; //para acercar mas o menos la camara
			stage.viewport.offsetX = -200; //para colocar a mario mas a la izquierda del centro
			stage.on("destroy",function() {
				mario.destroy(); //para cuando salimos de la escena ya no reciba mas eventos de teclado
			});

			stage.insert(new Q.Goomba());

			Q.state.reset({lives:2});

			Q.audio.play("music_main.mp3", {loop: true});
		});

		//HUD de vidas
		Q.scene("hud", function(stage){
			label_lives = new Q.UI.Text({x:50, y:0, label: "lives:2"});
			stage.insert(label_lives);
			Q.state.on("change.lives",this,function(){
				label_lives.p.label = "lives: " + Q.state.get("lives");
			});
		});

		//Pantalla principal
		Q.scene("mainTitle", function(stage){
			var button = new Q.UI.Button({
				x: Q.width/2,
				y: Q.height/2,
				asset: "portada.png"
			});
			button.on("click", function () {
				Q.clearStages();
				Q.stageScene("level1", 1); //va a la capa del fondo
				Q.stageScene("hud", 2);
			});
			stage.insert(button);
		});

		//Pantalla final
		Q.scene('endGame', function(stage) {
			var container = stage.insert(new Q.UI.Container({
				x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
			}));

			var button2 = container.insert(new Q.UI.Button({
				x: 0, y: 0, fill: "#CCCCCC", label: "Play Again"
			}));

			var label = container.insert(new Q.UI.Text({
				x:10, y: -10 - button2.p.h, label: "You lose"
			}));

			button2.on("click",function() {
				Q.clearStages();
				Q.stageScene('mainTitle');
			});

			container.fit(20);
			Q.audio.stop();
		});

		//Q.debug = true;
		Q.stageScene("mainTitle");

	});

}