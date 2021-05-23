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
	Q.Sprite.extend("SuperMeatBoy",{
        
        init: function(p){
            this._super(p, {
                sheet: "smb",
                sprite: "smb_anim",
                speed: 50,
                x: 250,
                y: 250,
                frame: 0,
                scale: 1,
				gravity: .3
            });
            this.add("2d, platformerControls, animation");
        },

        step: function(dt){
			
			if(Q.inputs['left']){
                this.play("walk_left");
                //aceleración izq
                if(this.p.speed < 500){
                    this.p.speed += 3;
                }
                
            }
			
            if(Q.inputs['right']){
                this.play("walk_right");
                //aceleración dcha
                if(this.p.speed < 500){
                    this.p.speed += 3;
                }
                
            }

			if(Q.inputs['up']){
				//TODO -- Muros
				
			}
			if(this.p.vx == 0 && this.p.vy == 0){
				this.play("stand_right");
				this.p.speed = 50;
			}

			if(this.p.vy != 0){
				if(this.p.vx > 0){
					this.play("jump_right");
				} else if(this.p.vx < 0){
					this.play("jump_left");
				}
			}

        },

        
		die: function(){
			this.destroy();
			Q.stageScene("endGame", 2);
        }
    });

	//Sprite de la seta
	/*Q.Sprite.extend("OneUp",{
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
				if(!collision.isA("SuperMeatBoy")) return;
				
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
		});*/

	// Sprite del enemigo
	/*Q.Sprite.extend("Goomba",{
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
			if(!collision.obj.isA("SuperMeatBoy")) return;
			collision.obj.p.vy = -200;
			console.log("Goomba dies");
			this.destroy();
			Q.audio.play("kill_enemy.mp3");
		},
		kill: function(collision){
			if(!collision.obj.isA("SuperMeatBoy")) return;
			collision.obj.p.vy = -200;
			collision.obj.p.vx = collision.normalX *-500;
			collision.obj.p.x += collision.normalX *-5;
			collision.obj.die();
		}
	});*/


	Q.Sprite.extend("Goal",{
		init: function(p){
			this._super(p, {
				 sheet: "utilities",
				 frame: 55,
				 scale: 1
			 });
		}
	});

	Q.Sprite.extend("ModTilesObj",{
			init: function(p) {
				
				this._super(p, {
					 sheet: "modTilesObj",
					 frame: 55,
					 scale: 1,
					 x: 20, //respecto a mario
					 y: -10,
					 sensor: true
				 });
			}
		});

	Q.Sprite.extend("ModTilesDark",{
			init: function(p) {
				
				this._super(p, {
					 sheet: "modTilesdark",
					 frame: 55,
					 scale: 1,
					 x: 20, //respecto a mario
					 y: -10,
					 sensor: true
				 });
			}
		});

	Q.Sprite.extend("ModTiles",{
			init: function(p) {
				this._super(p, {
					 sheet: "modTileslight",
					 frame: 55,
					 scale: 1
				 });
			}
		});

	Q.load(["smb_anim.png", "smb_anim.json", "1up.png", "bg.png", "mapa2021.tmx",
		    "tiles.png", "music_main.mp3",
		    "kill_enemy.mp3", "jump_small.mp3",
		    "coin.mp3", "portada.png", 
		    "level_1.tmx","foresttiles01.png", "bg_base.png", "WorldMapTheme.mp3", "ForestFunk.mp3",
		    "lvl_1.tmx","foresttiles01Fix.png", "modTiles1.json", "modTiles2.json","forestall.png",
		    "forestdarkall.png", "modTilesObj.json", "utilities.json","foresttiles01bg.png", "Whip03.mp3", "forestsetObj.png", "utilities.png"],  function() {
		
		// Or from a .json asset that defines sprite locations
		Q.compileSheets("smb_anim.png", "smb_anim.json");
		Q.compileSheets("utilities.png","saw.json");
		Q.compileSheets("foresttiles01bg.png","modTiles1.json");
		Q.compileSheets("foresttiles01Fix.png","modTiles2.json");
		Q.compileSheets("forestsetObj.png","modTilesObj.json");
		Q.compileSheets("utilities.png","utilities.json");

		
		Q.animations("smb_anim", {
			walk_right: { frames: [1,2,3], rate: 1/6},
			walk_left: { frames: [5,6,7], rate: 1/6},
			jump_right: { frames: [8], rate: 1/6},
			wall_right:{frames: [9]},
			jump_left: { frames: [10], rate: 1/6},
			wall_right:{frames: [11]},
			stand_right: { frames: [0], loop: false},
			stand_left: { frames: [4], loop: false},
			die: { frames: [12], loop: false, rate: 1}
		});

		Q.scene("level1", function (stage){
			/*
			stage.insert(
				new Q.Repeater({asset: "bg.png", speedX: 0.5, speedY: 0.5}) //para repetir el fondo
			);
			*/
			Q.stageTMX("lvl_1.tmx", stage);
		
			smb = new Q.SuperMeatBoy();
			stage.insert(smb);;
			//stage.insert(new Q.OneUp(), mario); //para que la seta se mueva con mario
			stage.add("viewport").follow(smb,{x: true, y: true},{minX:0, maxX: 1920, minY: 0, maxY: 1250}); //la camara sigue a mario, AQUI SE MODIFICA LA CAMARA
			stage.viewport.scale = 1; //para acercar mas o menos la camara
			stage.viewport.offsetX = -250; //para colocar a mario mas a la izquierda del centro
			stage.on("destroy",function() {
				smb.destroy(); //para cuando salimos de la escena ya no reciba mas eventos de teclado
			});

			//Q.state.reset({lives:2});

			Q.audio.play("ForestFunk.mp3", {loop: true});
		});

		//HUD de vidas
		/*Q.scene("hud", function(stage){
			label_lives = new Q.UI.Text({x:50, y:0, label: "lives:2"});
			stage.insert(label_lives);
			Q.state.on("change.lives",this,function(){
				label_lives.p.label = "lives: " + Q.state.get("lives");
			});
		});*/

		//Pantalla principal
		Q.scene("mainTitle", function(stage){
			var button = new Q.UI.Button({
				x: Q.width/2,
				y: Q.height/2,
				asset: "portada.png"
			});
			button.p.opacity = 0;
			button.add("tween");
			button.on("click", function () {
				Q.audio.play("Whip03.mp3");
				button
					 .animate({ x: 400, y: 300, scale: 4, opacity: 0 }, .9, Q.Easing.Quadratic.In,
					 		  {callback: function(){
					 		  				Q.clearStages();
					 		  				Q.audio.stop();
					 		  				Q.stageScene("level1", 1); //va a la capa del fondo
					 		  				Q.stageScene("hud", 2);}})
			});
			stage.insert(button);
			button
		        .animate({ x: 400, y:  300, opacity:1 }, .5, Q.Easing.Quadratic.InOut)
		        .chain({ angle: 360}, .3)
			Q.audio.play("WorldMapTheme.mp3", {loop: true});
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

		Q.debug = true;
		Q.stageScene("mainTitle");

	});

}