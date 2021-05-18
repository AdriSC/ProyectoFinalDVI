{
	Q.Sprite.extend("Mario",{
		init: function(p) {
			this._super(p, {
				 sheet: "mario",
				 sprite: "mario_anim",
				 x: 250,
				 y: 250,
				 frame: 0,
				 scale: 1
			 });
			this.add("2d, platformerControls, animation");
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
			Q.state.dec("lives",1);
			console.log(Q.state.get("lives"));
			if(Q.state.get("lives")<0){
				this.destroy();
				Q.stageScene("endGame",2);
			}
		}

	});


	Q.Sprite.extend("OneUp",{
		init: function(p) {
			this._super(p, {
				 asset: "1up.png",
				 scale: 1,
				 x: 20,
				 y: -10,
				 sensor: true,
				 taken: false
			 });


			this.on("sensor", this, "hit");
			this.add("tween");
		},
		hit: function(collision){
			if(this.taken) return;
			if(!collision.obj.isA("Mario")) return;

			this.taken = true;
			Q.state.inc("lives", 1);
			console.log(Q.state.get("lives"));
			collision.obj.p.vy = -400;

			this.animate({y: this.p.y-100, angle: 360},
				1,
				Q.Easing.Quadratic.InOut,
				{callback: function(){this.destroy()}});
		}
	});


	// ## Enemy Sprite
	// Create the Enemy class to add in some baddies
	Q.Sprite.extend("Goomba",{
		init: function(p) {
			this._super(p, {
				 sheet: 'goomba',
				 x: 400+(Math.random()*200),
				 y: 250,
				 frame: 0,
				 vx: 100
			 });

			// Enemies use the Bounce AI to change direction
			// whenver they run into something.
			this.add('2d, aiBounce, animation');
			this.on("bump.top", this, "onTop");
			this.on("bump.left,bump.right,bump.bottom",this, "kill");
		},
		onTop: function(collision){
			if(!collision.obj.isA("Mario")) return;
			collision.obj.p.vy = -200;
			console.log("Goomba dies");
			this.destroy();
		},
		kill: function(collision){
			if(!collision.obj.isA("Mario")) return;
			collision.obj.p.vx = -200;
			collision.obj.p.vy = collision.normalX=-500;
			collision.obj.p.vy = collision.normalY=-5;
			collision.obj.die();
		}
		
	});





		Q.scene("hud", function(stage){
		label_lives = new Q.UI.Text({x:50, y:0, label: "lives: 2"});
		stage.insert(label_lives);
		Q.state.on("change.lives",this, function(){
			label_lives.p.label = "lives: " + Q.stage.get("lives");
		});
	});

	Q.scene("mainTitle",function(stage){
		var button = new Q.UI.Button({
			x: Q.width/2,
			y: Q.height/2,
			asset: "title-screen.png"
		});
		button.on("click", function () {
			Q.clearStages();
			Q.stageScene("level1", 1);
			Q.stageScene("hud", 2);
		});
		stage.insert(button);
	});


	// To display a game over / game won popup box,
	// create a endGame scene that takes in a `label` option
	// to control the displayed message.
	Q.scene('endGame', function(stage) {
		var container = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
		}));

		var button2 = container.insert(new Q.UI.Button({
			x: 0, y: 0, fill: "#CCCCCC", label: "Play Again"
		}));

		var label = container.insert(new Q.UI.Text({
			x:10, y: -10 - button2.p.h, label: stage.options.label
		}));

		// When the button is clicked, clear all the stages
		// and restart the game.
		button2.on("click",function() {
			Q.clearStages();
			Q.stageScene('mainTitle');
		});

		// Expand the container to visibly fit it's contents
		// (with a padding of 20 pixels)
		container.fit(20);

		Q.audio.stop();
	});

	Q.stageScene("mainTitle");
	});

	// ## Asset Loading and Game Launch
	// Q.load can be called at any time to load additional assets
	// assets that are already loaded will be skipped
	// The callback will be triggered when everything is loaded
	Q.load(["mario_small.png", "mario_small.json", "1up.png", "1up.json", "bg.png", "mapa2021.tmx", "tiles.png" ,"goomba.png", "goomba.json", "music_main.mp3", "title-screen.png", "kill_enemy.mp3", "music_die.mp3"],  function() {
	
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

	// Finally, call stageScene to run the game
	Q.stageScene("level1");
	});
	}; // var game = ...

}	


