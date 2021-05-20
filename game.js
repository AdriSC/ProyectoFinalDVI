var game = function() {

// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` component.
var Q = window.Q = Quintus()
	       .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
	       // Maximize this game to whatever the size of the browser is
	       .setup('myGame')
	       // And turn on default input controls and touch input (for UI)
	       .controls()
	       .touch();

	Q.Sprite.extend("Mario",{
			init: function(p) {
				this._super(p, {
					 sheet: "marioR",
					 x: 250,
					 y: 250,
					 frame: 0,
					 scale: 3
				 });
				Q.input.on("left", this, function(){ this.p.x -= 10;});
				Q.input.on("right", this, function(){ this.p.x += 10;});
				Q.input.on("up", this, function(){ this.p.y -= 10;});
				Q.input.on("down", this, function(){ this.p.y += 10;});
			}
		});


	Q.Sprite.extend("OneUp",{
			init: function(p) {
				this._super(p, {
					 asset: "1up.png",
					 scale: 0.3,
					 x: 20, //respecto a mario
					 y: -10
				 });
			}
		});



	Q.load(["mario_small.png", "mario_small.json", "1up.png", "bg.png", "mapa2021.tmx", "tiles.png" ],  function() {
		
		// Or from a .json asset that defines sprite locations
		Q.compileSheets("mario_small.png","mario_small.json");

		Q.scene("level1", function (stage){
			/*
			stage.insert(
				new Q.Repeater({asset: "bg.png", speedX: 0.5, speedY: 0.5}) //para repetir el fondo
			);
			*/
			Q.stageTMX("mapa2021.tmx", stage);
	
			mario = new Q.Mario();
			stage.insert(mario);
			stage.insert(new Q.OneUp(), mario); //para que la seta se mueva con mario

			stage.add("viewport").follow(mario,{x: true, y: false}); //la camara sigue a mario centrado en el eje horizontal, en el vertical esta a false
			stage.viewport.scale = .75; //para acercar mas o menos la camara
			stage.viewport.offsetX = -200; //para colocar a mario mas a la izquierda del centro
			stage.on("destroy",function() {
				mario.destroy(); //para cuando salimos de la escena ya no reciba mas eventos de teclado
			});

		});

		Q.stageScene("level1");
	});

}