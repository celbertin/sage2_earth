// SAGE2 is available for use under the SAGE2 Software License
//
// University of Illinois at Chicago's Electronic Visualization Laboratory (EVL)
// and University of Hawai'i at Manoa's Laboratory for Advanced Visualization and
// Applications (LAVA)
//
// See full text, terms and conditions in the LICENSE.txt included file
//
// Copyright (c) 2014

//Adapted from a tutorial found in http://learningthreejs.com
//Written by Alexandra Etienne and Jerome Etienne
//http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/


/* global THREE */

var earth = SAGE2_App.extend({
	init: function(data) {
		this.SAGE2Init("div", data);

		this.resizeEvents = "onfinish";
		this.maxFPS = 60.0;

		this.element.id = "div" + data.id;
		this.frame  = 0;
		this.width  = this.element.clientWidth;
		this.height = this.element.clientHeight;

		this.renderer = new THREE.WebGLRenderer();

		//setup the camera
		this.camera = new THREE.PerspectiveCamera(25, this.width / this.height, 1, 10000);
		this.camera.position.set(0, 40, 170);

		//setup the orbit controls used to move the camera around the sphere (dragging)
		this.orbitControls = new THREE.OrbitControls(this.camera, this.element);
		this.orbitControls.maxPolarAngle = Math.PI / 2;
		this.orbitControls.minDistance = 200;
		this.orbitControls.maxDistance = 500;
		this.orbitControls.autoRotate  = true;
		this.orbitControls.zoomSpeed   = 0.1;
		this.orbitControls.autoRotateSpeed = 0.0; // 30 seconds per round when fps is 60

		this.scene    = new THREE.Scene();
-
		this.renderer.setSize(this.width, this.height);
		this.element.appendChild(this.renderer.domElement);

		// set up the sphere variables
		//var radius = 0.3;
		var radius = 30;
		var segments = 32;
		var rings = 32;

		var position = new THREE.Vector3(0, 0, 0);
		//var scale    = new THREE.Vector3(100, 100, 100);

		//setup the sphere
		this.geometry = new THREE.SphereGeometry(radius, segments, rings);
		this.material = new THREE.MeshPhongMaterial();
		this.earthMesh = new THREE.Mesh( this.geometry, this.material );

		this.earthMesh.position.copy(position);
		//this.earthMesh.scale.copy(scale);

		//setup texture
		this.material.map = THREE.ImageUtils.loadTexture(this.resrcPath + 'images/NE2_ps_flat.jpg');

		//setup bumpmap (for mountains and such) works with earthmap.jpg
		//this.material.bumpMap    = THREE.ImageUtils.loadTexture(this.resrcPath + 'images/earthbump.jpg');
		//this.material.bumpScale = 0.05;

		/*
		//setup specular map to make the ocean reflect light works with earthmap.jpg
		this.material.specularMap    = THREE.ImageUtils.loadTexture(this.resrcPath + 'images/earthspec.jpg');
		this.material.specular  = new THREE.Color('grey');
		*/

		//add the sphere to the scene
		this.scene.add( this.earthMesh );
		// and the camera
		this.scene.add(this.camera);

		// create a point lights
		var light = new THREE.PointLight(0xffffff, 1);
		light.position.set(2, 5, 1);
		light.position.multiplyScalar(30);
		this.scene.add(light);

		var light2 = new THREE.PointLight(0xffffff, 0.75);
		light2.position.set(-12, 4.6, 2.4);
		light2.position.multiplyScalar(30);
		this.scene.add(light2);

		//create ambient light
		this.scene.add(new THREE.AmbientLight(0xe6e6e6));

		// draw!
		this.renderer.render(this.scene, this.camera);
		this.controls.finishedAddingControls();
	},

	load: function(date) {
	},

	draw: function(date) {
		this.renderer.render(this.scene, this.camera);
	},

	resize: function(date) {
		this.width  = this.element.clientWidth;
		this.height = this.element.clientHeight;
		this.renderer.setSize(this.width, this.height);

		this.refresh(date);
	},

	event: function(eventType, position, user_id, data, date) {
		this.passSAGE2PointerAsMouseEvents = false;
		//if left click down, allow dragging
		if (eventType === "pointerPress" && (data.button === "left")) {
			this.dragging=true;
			this.orbitControls.mouseDown(position.x, position.y, 0);
			this.refresh(date);
			console.log("left click down");
		//if counter moves while left click down
		} else if (eventType === "pointerMove" && this.dragging) {
			this.orbitControls.mouseMove(position.x, position.y);
			this.refresh(date);
			console.log("left click drag");
		//if left click up, dragging stops
		} else if (eventType === "pointerRelease" && (data.button === "left")) {
			this.dragging=false;
			this.refresh(date);
			console.log("left click up");
		} else {
			this.passSAGE2PointerAsMouseEvents = true;
		}
	}

});
