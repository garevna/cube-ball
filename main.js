'use strict'

// import { getWebkitRadialGradient, getRadialGradient } from './radialGradient'
// import css from './main.css'

document.garevna = {
	ie: detectIE (),
	perspective: { current: 700, increment: 1 },
	perspective_origin: {
		current: { x: 50, y: 100 },
		increment: { x: 5, y: -5 },
		min_val: { x: -150, y: -150 },
		max_val: { x: 150, y: 150 },
	},
	container: document.getElementById("garevnaCubeContainer"),
	cube: null,
	ball: null,
	mainSize: Math.round ( Math.min ( window.innerHeight, window.innerWidth ) * 0.1 ),
	cube_sides: [
        { id: "garevnaCubeBack",   rotation: [  0,   0,  0 ], translate: [] },
	      { id: "garevnaCubeBottom", rotation: [ 90,   0,  0 ], translate: [] },
	      { id: "garevnaCubeFront",  rotation: [  0,   0,  0 ], translate: [] },
	      { id: "garevnaCubeLeft",   rotation: [  0, -90,  0 ], translate: [] },
	      { id: "garevnaCubeRight",  rotation: [  0, -90,  0 ], translate: [] },
	      { id: "garevnaCubeTop",    rotation: [ 90,   0,  0 ], translate: [] }
  ],
	set_cube_sides_translate: function () {
		this.cube_sides [0].translate = [             0,             0,             0 ];       // Back
		this.cube_sides [1].translate = [             0, this.mainSize,             0 ];       // Bottom
		this.cube_sides [2].translate = [             0,             0, this.mainSize ];       // Front
		this.cube_sides [3].translate = [             0,             0,             0 ];       // Left
		this.cube_sides [4].translate = [ this.mainSize,             0,             0 ];       // Right
		this.cube_sides [5].translate = [             0,             0,             0 ];       // Top
	},
	buildCubeSide: function ( item, index ) {
		var side = document.createElement('div');
		document.garevna.cube.appendChild ( side );
		side.className = 'garevnaCubeFace';
		side.id = document.garevna.cube_sides [ index ].id;
		document.garevna.cube.sides.push ( side );
	},
	createCube: function () {
		this.cube = document.createElement('div');
		this.cube.id = 'garevnaCube';
		this.cube.style.WebkitPerspective = this.perspective.current + "px";
		this.cube.style.perspective = this.perspective.current + "px";
		this.cube.sides = [];
		this.cube_sides.forEach( this.buildCubeSide );
		this.container.appendChild ( this.cube );
	},
	createBall: function () {
		this.ball = document.createElement('div');
		this.ball.id = "garevnaCubeBall";
		this.ball.size = Math.round ( this.mainSize / 2 );
		this.ball.style.background = getWebkitRadialGradient ( this.ball.size, 1, "top_left" );
		this.ball.style.backgroundImage = getRadialGradient ( 1, "top_left" );
		this.ball._translate = 0;
		this.cube.appendChild ( this.ball );
	},
	initScene: function () {
		this.createCube ();
		this.createBall ();
		this.cubeResize ();
		if ( this.ie ) {
			this.ball.style.zIndex = 10;
			document.getElementById ("garevnaCubeBack").style.zIndex = 5;
			document.getElementById ("garevnaCubeFront").style.zIndex = 15;
		}
	},
	// ============================ Специально для ишака =================================
	ie_zIndex: function () {
		// this === document.garevna
		if ( this.perspective_origin.current.x < 0 ) {
			document.getElementById ("garevnaCubeLeft").style.zIndex = 11;
			document.getElementById ("garevnaCubeRight").style.zIndex = 7;
			if ( this.perspective_origin.current.y < 0 ) {
				document.getElementById ("garevnaCubeTop").style.zIndex = 12;
				document.getElementById ("garevnaCubeBottom").style.zIndex = 8;
			} else {
				document.getElementById ("garevnaCubeTop").style.zIndex = 8;
				document.getElementById ("garevnaCubeBottom").style.zIndex = 12;
			}
		} else {
			document.getElementById ("garevnaCubeLeft").style.zIndex = 7;
			document.getElementById ("garevnaCubeRight").style.zIndex = 11;
			if ( this.perspective_origin.current.y < 0 ) {
				document.getElementById ("garevnaCubeTop").style.zIndex = 12;
				document.getElementById ("garevnaCubeBottom").style.zIndex = 8;
			} else {
				document.getElementById ("garevnaCubeTop").style.zIndex = 8;
				document.getElementById ("garevnaCubeBottom").style.zIndex = 12;
			}
		}
	},
	// ==================================================================================================== rotateCube
	rotateCube: function () {
		let main = document.garevna
		let origin = main.perspective_origin
		if ( origin.current.x <= origin.min_val.x ) origin.increment.x =  5
		if ( origin.current.x >= origin.max_val.x ) origin.increment.x = -5
		origin.current.x += origin.increment.x;
		if ( origin.current.y <= origin.min_val.y ) { origin.increment.y =  5 }
		if ( origin.current.y >= origin.max_val.y ) { origin.increment.y = -5 }
		origin.current.y += origin.increment.y;

		var velocity =
			origin.current.y < 0 && main.ball._translate < main.mainSize * 0.85 ?
				Math.abs( origin.current.y * 5 / 150) :
					origin.current.y > 0 && main.ball._translate > 10 ?
			 			-( origin.current.y * 5 / 150) : 0

		main.ball._translate += velocity
		var dty = main.mainSize - main.ball.size + 'px'
		main.ball.style.transform = "translateY(" + dty + ") translateZ(" + main.ball._translate + "px)"
		main.ball.style.WebkitTransform = "translateY(" + dty + ") translateZ(" + main.ball._translate + "px)"
		if ( main.ie ) main.ie_zIndex ()

		main.cube.style.WebkitPerspectiveOrigin = origin.current.x + '% ' + origin.current.y + '%';
		main.cube.style.MozPerspectiveOrigin    = origin.current.x + '% ' + origin.current.y + '%';
		main.cube.style.perspectiveOrigin       = origin.current.x + '% ' + origin.current.y + '%';

		main.demoText ();
	},
	cubeResize: function () {
			var main = document.garevna;
			main.mainSize = Math.round ( Math.min ( window.innerHeight, window.innerWidth ) * 0.2 );
			main.set_cube_sides_translate ();
			var _paddingX = Math.round ( ( window.innerWidth - main.mainSize * 2 ) / 2 );
			var _paddingY = Math.round ( ( window.innerHeight - main.mainSize * 2 ) / 2 );
			main.cube.style.paddingTop = _paddingY + 'px';
			main.cube.style.paddingRight = _paddingX + 'px';
			main.cube.style.paddingBottom = _paddingY + 'px';
			main.cube.style.paddingLeft = _paddingX + 'px';
			main.cube.sides.forEach (
					( item, ind ) => {
							let side = main.cube_sides [ ind ]
							item.style.width = `${main.mainSize}px`
							item.style.height = `${main.mainSize}px`
							var translate = `
									translateX(${side.translate [ 0 ]}px)
									translateY(${side.translate [ 1 ]}px)
									translateZ(${side.translate [ 2 ]}px)`
							var rotation = `
									rotateX(${side.rotation [ 0 ]}deg)
									rotateY(${side.rotation [ 1 ]}deg)
									rotateZ(${side.rotation [ 2 ]}deg)`
							item.style.transform =
							item.style.WebkitTransform =
							item.style.MozTransform =
							item.style.MsTransform = translate + rotation
					}
			)
			main.ball.size = Math.round ( main.mainSize / 2 )
			main.ball.style.width = `${main.ball.size}px`
			main.ball.style.height = `${main.ball.size}px`
			var translate_y = `${main.ball.size + main.ball._translate}px`
			var translate_z = `${main.ball._translate}px`
			main.ball.style.transform = `translateY(${translate_y}) translateZ(${translate_z})`
			main.ball.style.WebkitTransform = `translateY(${translate_y}) translateZ(${translate_z})`
	},
	demoText: function () {
		document.getElementById("demo").innerHTML = `
					Perspective: ${document.garevna.cube.style.perspective}\n
					Perspective Origin: ${document.garevna.perspective_origin.current.x}%
															${document.garevna.perspective_origin.current.y}%`
	}
}

document.garevna.initScene ()
document.garevna.interval = setInterval( document.garevna.rotateCube, 100 )
