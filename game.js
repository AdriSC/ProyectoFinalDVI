var game = function() {

var Q = window.Q = Quintus()
	       .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")

	       .setup('Super Meat Boy',
	       {
	       	width: 800,
	       	height: 600,
	       	scaleToFit : true //Scale the game to fit the screen of the player´s device
	       })
	       .controls().enableSound()
	       .touch();     

	//Sprite personaje principal
	Q.Sprite.extend("SuperMeatBoy",{
        
        init: function(p){
            this._super(p, {
                sheet: "smb",
                sprite: "smb_anim",
                speed: 150,
                frame: 0,
                scale: 1,
				gravity: .3
            });
            this.add("2d, platformerControls, animation");
			this.on("bump.left, bump.right", this, "stick_on_wall");
			this.on("jump");
    		this.on("jumped");
        },

		stick_on_wall: function(collision){
			
			if(collision.obj.isA("Goal")) return;
			if(collision.normalX == 1 && collision.normalY == 0){
				this.p.landed = true;
				this.play("wall_left");
			}
			if(collision.normalX == -1 && collision.normalY == 0){
				this.p.landed = true;
				this.play("wall_right");
			}
		},

		jump: function(obj) {
			if (!obj.p.playedJump) {
			  Q.audio.play("Meat_jumps0.mp3");
			  obj.p.playedJump = true;
			}
		},
		
		jumped: function(obj) {
			obj.p.playedJump = false;
		},

        step: function(dt){
			
			if(Q.inputs['left']){
                this.play("walk_left");
                //aceleración izq
                if(this.p.speed < 500){
                    this.p.speed += 200*dt;
                }
                
            }
			
            if(Q.inputs['right']){
                this.play("walk_right");
                //aceleración dcha
                if(this.p.speed < 500){
                    this.p.speed += 200*dt;
                }
                
            }

			if(this.p.vx == 0 && this.p.vy == 0){
				this.play('stand_' + this.p.direction);
				this.p.speed = 150;
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
			//this.play("death");
			this.destroy();
			//Q.audio.stop();
			Q.stageScene(Q.stage(1).scene.name, 1);
        }
    });

	Q.Sprite.extend("Saw",{
		init: function(p){
			this._super(p, {
				 sheet: "utilities",
				 frame: 55,
				 scale: 1,
				 sensor: true,
			});
			this.p.points = [];
			
			//points in a circle from 0 to 15, where x: 2r / (nump / 2) and y: sqrt( sqr(r) - sqr(x)), 
			//this solve the first half, negative values on an inverse order for the second half
			for(var i = 0; i < 16; i++) {
		        if(i<8) this.p.points.push([((100/8)*i)-50, Math.sqrt(Math.pow(50,2)-Math.pow((((100/8)*i)-50),2))]);
		    	if(i>=8) this.p.points.push([((100/8)*(i-(2*(i-8))))-50, (-1)*Math.sqrt(Math.pow(50,2)-Math.pow((((100/8)*(i-(2*(i-8))))-50),2))]);
		    }

			this.on("sensor", this, "kill");		
		},

		step: function(dt){
			this.p.angle += 200 * dt;
		},

		kill: function(collision){
				if(!collision.isA("SuperMeatBoy")) return;
				collision.die();
				
		}
	});

	Q.Sprite.extend("Goal",{
		init: function(p){
			this._super(p, {
				 sheet: "utilities",
				 frame: 55,
				 x: 350,
				 y:900,
				 scale: 1,
				 sensor: true
			 });
			this.on('sensor', this, 'hit');
			this.p.level;
			this.p.points = [];
			this.p.points.push([30,45]);
			this.p.points.push([35,-10]);
			this.p.points.push([-35,-10]);
			this.p.points.push([-30,45]);
		},
		hit: function(collision){
			if(!collision.isA("SuperMeatBoy")) return;
				
			collision.p.vy = -40;

			this.destroy();
			
			Q.stageScene(this.p.level, 1);
		}
	});

	Q.Sprite.extend("ModTilesObj",{
			init: function(p) {
				
				this._super(p, {
					 sheet: "modTilesObj",
					 frame: 55,
					 scale: 1,
					 x: 20,
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
					 x: 20, 
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

	Q.load(["smb_anim.png", "smb_anim.json", 
		 	"lvl_1.tmx", "lvl_2.tmx", //tmx
		    "WorldMapTheme.mp3", "ForestFunk.mp3", "Whip03.mp3", "Escape.mp3", "ChoirUnlock.mp3", //music
			"Meat_jumps0.mp3", "Meat_Landing0.mp3", "Meat_Landing1.mp3", //sound effects
		    "portada.png", "bg_base.png", "foresttiles01.png", "foresttiles01Fix.png",
		    "forestall.png", "forestdarkall.png", "foresttiles01bg.png", 
		    "forestsetObj.png", "utilities.png", "end.png",
		    "modTiles1.json", "modTiles2.json","modTilesObj.json", "utilities.json"], function() {
		
		// Or from a .json asset that defines sprite locations
		Q.compileSheets("smb_anim.png", "smb_anim.json");
		Q.compileSheets("foresttiles01bg.png","modTiles1.json");
		Q.compileSheets("foresttiles01Fix.png","modTiles2.json");
		Q.compileSheets("forestsetObj.png","modTilesObj.json");
		Q.compileSheets("utilities.png","utilities.json");

		
		Q.animations("smb_anim", {
			walk_right: { frames: [1,2,3], rate: 1/6},
			walk_left: { frames: [5,6,7], rate: 1/6},
			jump_right: { frames: [8], rate: 1/6},
			wall_right:{frames: [9], loop: false},
			jump_left: { frames: [10], rate: 1/6},
			wall_left:{frames: [11], loop: false},
			stand_right: { frames: [0], loop: false},
			stand_left: { frames: [4], loop: false},
			death: { frames: [12], loop: false, rate: 1}
		});

		Q.scene("level1", function (stage){
		
			Q.stageTMX("lvl_1.tmx", stage);
		
			smb = new Q.SuperMeatBoy({x: 202, y: 1124});
			stage.insert(smb);
			
			stage.add("viewport").follow(smb,{x: true, y: true},{minX:0, maxX: 1830, minY: 0, maxY: 1200}); //la camara sigue a smb, AQUI SE MODIFICA LA CAMARA
			stage.viewport.scale = .96; //para acercar mas o menos la camara
			//stage.viewport.offsetX = -250; //para colocar a mario mas a la izquierda del centro
			stage.on("destroy",function() {
				smb.destroy(); //para cuando salimos de la escena ya no reciba mas eventos de teclado

			});


			Q.audio.play("ForestFunk.mp3", {loop: true});
		});

		Q.scene("level2", function (stage){

			Q.stageTMX("lvl_2.tmx", stage);
		
			smb = new Q.SuperMeatBoy({x: 696, y: 1304});
			stage.insert(smb);
			stage.add("viewport").follow(smb,{x: true, y: true},{minX:0, maxX: 1920, minY: 0, maxY: 1380});
			stage.viewport.scale = .96;
			//stage.viewport.offsetX = -250;
			stage.on("destroy",function() {
				smb.destroy();
			});

			//Q.audio.play("Escape.mp3", {loop: true});
		});

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

			var sprite = new Q.Sprite({ asset: "end.png", x: 400, y: 300, scale: 1 });
			sprite.p.opacity=0;
			sprite.add("tween");
      		stage.insert(sprite);
      		sprite
		        .animate({ x: 400, y:  300, opacity:1 }, 1, Q.Easing.Quadratic.InOut)

			var container = stage.insert(new Q.UI.Container({
				x: Q.width/2, y: Q.height/2, fill: "rgba(255, 127, 80, 0.8)" , border: 2
			}));

			var button2 = container.insert(new Q.UI.Button({
				x: 0, y: 0, fill: "#FFFFFF", label: "Play Again"
			}));

			var label = container.insert(new Q.UI.Text({
				x: 0, y: -10 - button2.p.h, label: "You win !!", size: 25
			}));

			button2.on("click",function() {
				Q.clearStages();
				Q.audio.stop();
				Q.stageScene('mainTitle');
			});

			container.fit(20);
			container.add("tween");
			container
        		.animate({ x: 398, y:  370, opacity:1 }, 1, Q.Easing.Quadratic.InOut)

			Q.audio.play("ChoirUnlock.mp3");

			//Nombre de los integrantes
			var container2 = stage.insert(new Q.UI.Container({
				x: 950, y: 550, fill: "rgba(255, 127, 80, 0)" 
			}));

			var label1 = container2.insert(new Q.UI.Text({
				x: 0, y: 0, label: "By: Adrián Salvador Crespo \n Sergio José Gomez Cortés \n Miriam Cabana Ramírez", size: 12, color: "#ffffff"
			}));

			container2.fit(20);
			container2.add("tween");

			container2
        		.animate({ x: 105, y:  550, opacity:1 }, 1.5, Q.Easing.Quadratic.InOut)

        	//Referencias
        	var container3 = stage.insert(new Q.UI.Container({
				x: 1050, y: 550, fill: "rgba(255, 127, 80, 0)" 
			}));

			var label1 = container3.insert(new Q.UI.Text({
				x: 0, y: 0, label: "Original Game by: \n Edmund McMillen and Tommy Refenes", size: 12, color: "#ffffff"
			}));

			container3.fit(20);
			container3.add("tween");

			container3
        		.animate({ x: 660, y:  550, opacity:1 }, 1.5, Q.Easing.Quadratic.InOut)
		});

		//Q.debug = true;
		Q.stageScene("mainTitle");

	});

}