/*
 * MIT License
 * 
 * Copyright (c) 2018 olopes
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
document.addEventListener("DOMContentLoaded", function () {
	// TODO failureCount successCount
	// TODO define movement lists for attack/defense
	// TODO code attack/defense combinations for each success/failure
	// TODO animate using setTimeout();
	// TODO display victory!/try again
	
	var player, ninja, playerImage, ninjaImage, 
		font, resultFont, alphaImage, canvas, context,
		imgCount,
	actions = {
			idle            : [{y:0,x:0}],
			walk            : [{y:0,x:1},{y:0,x:2},{y:0,x:3},{y:0,x:4},{y:0,x:5},{y:0,x:6}],
			walkrev         : [{y:0,x:6},{y:0,x:5},{y:0,x:4},{y:0,x:3},{y:0,x:2},{y:0,x:1}],
			crouch          : [{y:0,x:7},{y:0,x:8},{y:0,x:9}],
			prone           : [{y:0,x:9},{y:0,x:8},{y:0,x:7}],

			stand           : [{y:1,x:0}],
			dmgHigh         : [{y:1,x:1},{y:1,x:2}],
			dmgLow          : [{y:1,x:3},{y:1,x:4}],
			dmgCrouch       : [{y:1,x:5},{y:1,x:6}],
			jump            : [{y:1,x:7},{y:1,x:8},{y:1,x:9}],
			land            : [{y:1,x:9},{y:1,x:8},{y:1,x:7}],

			vrtStrikeStand  : [{y:2,x:0},{y:2,x:1},{y:2,x:2},{y:2,x:3}],
			hrzStrikeStand  : [{y:2,x:4},{y:2,x:5},{y:2,x:6}],
			punchStand      : [{y:2,x:7},{y:2,x:8}],
			guardStand      : [{y:2,x:9}],

			vrtStrikeCrouch : [{y:3,x:0},{y:3,x:1},{y:3,x:2},{y:3,x:3}],
			hrzStrikeCrouch : [{y:3,x:4},{y:3,x:5},{y:3,x:6}],
			punchCrouch     : [{y:3,x:7},{y:3,x:8}],
			guardCrouch     : [{y:3,x:9}],


			vrtStrikeJump   : [{y:4,x:0},{y:4,x:1},{y:4,x:2},{y:4,x:3}],
			hrzStrikeJump   : [{y:4,x:4},{y:4,x:5},{y:4,x:6}],
			punchJump       : [{y:4,x:7},{y:4,x:8}],
			guardJump       : [{y:4,x:9}],

			// death is special
			death           : [{y:5,x:2,w:2}]
	},
	animations = [],
	animationScript = [];
	
	function gameLoop() {
		var callback;
		player.update();
		if(ninja.update()) {
			callback = animations.shift();
			if(animations.length)
				animationScript = animations.shift();
			callback();
		} else {
			// Clear the canvas
			context.clearRect(0, 130, 400, 150);
			player.render();
			ninja.render();

			window.requestAnimationFrame(gameLoop);
		}
	}
	
	function __appendFrames(p1Action,p2Action, xoff) {
		var i, i1, i2, ll;
		ll = p1Action.length > p2Action.length?p1Action.length:p2Action.length;
		for(i = 0, i1=0, i2=0; i < ll; i++, i1++, i2++) {
			if(i1 >= p1Action.length) i1 = 0;
			if(i2 >= p2Action.length) i2 = 0;
			animationScript.push([p1Action[i1], p2Action[i2], xoff]);
		}
	}
	
	function clearText() {
		context.clearRect(0, 90, 400, 40);
	}
	
	function fightMessage() {
		resultFont.render("FIGHT!", {x:126,y:90});
		player.reset();
		ninja.reset();
		setTimeout(gameLoop, 1000);
		setTimeout(clearText, 2000);
	}
	
	function showResultMessage() {
		if(failureCount > 0)
			resultFont.render("try again", {x:85,y:90});
		else
			resultFont.render("victory!", {x:97,y:90});
	}
	
	(function buildAnimation() {
		// first build positioning
		__appendFrames(actions.idle,actions.idle);
		__appendFrames(actions.idle,actions.idle);
		__appendFrames(actions.idle,actions.idle);
		__appendFrames(actions.idle,actions.idle);
		__appendFrames(actions.idle,actions.idle);
		__appendFrames(actions.stand,actions.stand);
		__appendFrames(actions.stand,actions.stand);
		animations.push(animationScript);
		animations.push(fightMessage);
		animationScript = [];

		__appendFrames(actions.stand,actions.stand);
		__appendFrames(actions.stand,actions.stand);
		__appendFrames(actions.stand,actions.stand);
		__appendFrames(actions.walk,actions.walk, 3);
		__appendFrames(actions.walk,actions.walk, 1.7);
		//__appendFrames(actions.walk,actions.walk, 1);
		__appendFrames(actions.stand,actions.stand);
		__appendFrames(actions.stand,actions.stand);
		__appendFrames(actions.stand,actions.stand);
		
		// combat sequence
		__appendFrames(actions.punchStand,actions.guardStand);
		__appendFrames(actions.vrtStrikeStand,actions.dmgHigh);
		__appendFrames(actions.hrzStrikeStand,actions.dmgLow);
		__appendFrames(actions.stand,actions.crouch);
		__appendFrames(actions.idle,actions.dmgCrouch);
		__appendFrames(actions.idle,actions.death);
		animations.push(animationScript);
		animations.push(showResultMessage);
		animationScript = animations.shift();
	}());
	
	imgCount = 0;
	function checkLoad() {
		if(++imgCount === 2) {
			gameLoop();
		}
	}
	
	function renderPlayerNames() {
		    // first calculate rendered text size
		var player1Len = font.textLength(player1Name),
		    player2Len = font.textLength(player2Name),
		    // determine text position
		    player1Pos = {x:33,y:40},
		    player2Pos = {x:400-player2Len-33,y:40};
		    // render!
		font.render(player1Name, player1Pos);
		font.render(player2Name, player2Pos);
	}

	function sprite (options) {

		var that = {},
		frameIndex = 0,
		tickCount = 0,
		animationIdx = options.animationIdx,
		ticksPerFrame = options.ticksPerFrame || 10,
		numberOfFrames = animationScript.length,
		scale = options.scale || 1,
		direction = options.direction || 1;

		that.width = options.width;
		that.height = options.height;
		that.x = options.x;
		that.y = options.y;
		that.image = options.image;
		that.swidth=options.width*scale;
		that.sheight=options.height*scale;
		
		that.reset = function () {
			tickCount = 0;
			frameIndex = 0;
			numberOfFrames = animationScript.length;
		};

		that.update = function (){
			tickCount += 1;

			if (tickCount > ticksPerFrame) {

				tickCount = 0;

				// If the current frame index is in range
				if (frameIndex < numberOfFrames - 1) {
					var speed=animationScript[frameIndex][2]||0;
					// Go to the next frame
					frameIndex += 1;
					
					// update location
					that.x += direction* scale * (speed || 0);
				} else {
					frameIndex = 0;
					// finished!
					return true;
				}
			}
			return false;
		};

		that.render = function () {
			var frame = animationScript[frameIndex][animationIdx],
			fw = frame.w||1;

			// Draw the animation
			context.drawImage(
					that.image,
					frame.x * that.width*fw,  // start clipping coordinate X
					frame.y * that.height,    // start clipping coordinate Y
					that.width*fw,            // clipped width
					that.height,              // clipped height
					that.x-that.width*(fw-1), // canvas coordinate X
					that.y,                   // canvas coordinate Y
					that.swidth*fw,           // width (stretch or reduce)
					that.sheight);            // height (stretch or reduce)
		};

		return that;
	}

	function makeFont(options) {
		var that = {
				image: options.image
		}, _i, _j, _c,
		scale = options.scale || 1,
		colorPos = options.color == 'white' ? 10 : 0,  // defaults to multicolor
		alphaw = {'I': {w:5},'L': {w:9},'T': {w:9},'Y': {w:9},'1': {w:9},' ': {w:4},'.': {w:6},'-': {w:7},'\'':{w:5},'"': {w:8},'!': {w:5}},
		alpha='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-_\'"!?';
		for(_i = 0,_j=0; _i < alpha.length; _i++) {
			_c = alpha[_i];
			if(!alphaw[_c]) alphaw[_c] = {w:10};
			alphaw[_c].x=_j;
			_j+=alphaw[_c].w;
		}
		
		that.textLength = function (txt) {
			return txt.toUpperCase().split('').reduce((acc,val) => acc+Math.floor((alphaw[val]||{w:0}).w*scale), 0);
		};
		
		that.render = function (txt, pos) {
			var i, c, glyph, acc, scalew, scaleh;
			txt = txt.toUpperCase();
			for(i = 0, acc=0; i < txt.length; i++) {
				glyph = alphaw[txt[i]];
				if(!glyph) continue;
				scalew = Math.floor(glyph.w*scale);
				scaleh = Math.floor(10*scale);
				context.drawImage(
						that.image,
						glyph.x,           // start clipping coordinate X
						colorPos,          // start clipping coordinate Y
						glyph.w,           // clipped width
						10,                // clipped height
						pos.x+acc,         // canvas coordinate X
						pos.y,             // canvas coordinate Y
						scalew,            // width (stretch or reduce)
						scaleh);           // height (stretch or reduce)
				acc += scalew;
			}
		};

		return that;
	}
	
	// Get canvas
	canvas = document.getElementById("dojoAnimation");
	canvas.width = 400;
	canvas.height = 280;
	context = canvas.getContext("2d");

	// Create sprite sheet
	playerImage = new Image();
	playerImage.addEventListener("load", checkLoad);
	ninjaImage = new Image();
	ninjaImage.addEventListener("load", checkLoad);
	alphaImage = new Image();
	alphaImage.addEventListener("load", renderPlayerNames);

	// Create sprite
	player = sprite({
		width: 32,
		height: 64,
		scale: 3,
		x: 40,
		y: 80,
		image: playerImage,
		animationIdx: (failureCount > 0)?1:0,
		direction: 1,
		ticksPerFrame: 10
	});

	ninja = sprite({
		width: 32,
		height: 64,
		scale: 3,
		x: 264,
		y: 80,
		image: ninjaImage,
		animationIdx: (failureCount > 0)?0:1,
		direction:-1,
		ticksPerFrame: 10
	});
	
	font = makeFont({
		image: alphaImage,
		color: 'white'
	});

	resultFont = makeFont({
		image: alphaImage,
		scale: 3
	});

	// Load sprite sheet
	playerImage.src = "karate_white.png";
	ninjaImage.src = "ninja_bluef.png";
	alphaImage.src = "text_sprites.png";

}
);
