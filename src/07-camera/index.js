//やりたいこと
//これをこの環境で動かす
//https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_dof.html
//import * as THREE from 'three'
//const THREE = require('three');
//import * as Stats from 'stats'
//const STATS = require('stats');
      //import * as dat from 'dat.gui';
//import { GUI } from 'dat.gui';
const GUI = require('dat.gui');
      //import { GUI } from './jsm/libs/dat.gui.module.js';
//import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import * as THREE from 'three'
import { BloomEffect, EffectComposer, EffectPass, RenderPass, RealisticBokehEffect, VignetteEffect } from 'postprocessing'
//import {Stats} from 'stats'

// import { WebGLRenderer } from 'three';
// //多分デフォルト＋aをいれてくれてそう・・・・・
// import EffectComposer, {
//     Pass,
//     RenderPass,
//     ShaderPass,
//     TexturePass,
//     ClearPass,
//     MaskPass,
//     ClearMaskPass,
//     CopyShader,
// } from '@johh/three-effectcomposer';
// import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';

			// import { RenderPass } from './jsm/postprocessing/RenderPass.js';
			// import { BokehPass } from './jsm/postprocessing/BokehPass.js';
			var container, stats;
			var camera, scene, renderer,
				materials = [], objects = [],
				singleMaterial, zmaterial = [],
				parameters, i, j, k, h, x, y, z, nobjects, cubeMaterial;
			var mouseX = 0, mouseY = 0;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			var width = window.innerWidth;
			var height = window.innerHeight;
      var postprocessing = {};
      
//イニシャライズ
init();
//アニメーション
animate();
      
function init() {
  // div要素をつくる---------------
	container = document.createElement( 'div' );
  document.body.appendChild( container );
  //---------------------

  // カメラ ---------------------
	camera = new THREE.PerspectiveCamera( 70, width / height, 1, 3000 );
  camera.position.z = 200;
  //---------------------
  // シーン---------------
  var scene = new THREE.Scene();
  //---------------------

  // レンダラー---------------
  renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
  container.appendChild( renderer.domElement );
  //---------------------

  // テクスチャー---------------
  var src1 = document.getElementById("image_place1").getAttribute("src");
  var src2 = document.getElementById("image_place2").getAttribute("src");
  var src3 = document.getElementById("image_place3").getAttribute("src");
  var src4 = document.getElementById("image_place4").getAttribute("src");
  var src5 = document.getElementById("image_place5").getAttribute("src");
  var src6 = document.getElementById("image_place6").getAttribute("src");
	// var path = "textures/cube/SwedishRoyalCastle/";
	// var format = '.jpg';
	// var urls = [
	// 	path + 'px' + format, path + 'nx' + format,
	// 	path + 'py' + format, path + 'ny' + format,
	// 	path + 'pz' + format, path + 'nz' + format
  // ];
  var urls = [
    src1,
    src2,
    src3,
    src4,
    src5,
    src6
  ]
  console.log(urls)
  
  var textureCube = new THREE.CubeTextureLoader().load( urls );
  console.log(textureCube)
  //---------------------

  // マテリアルー---------------
  parameters = { color: 0xff1100, envMap: textureCube };
	cubeMaterial = new THREE.MeshBasicMaterial( parameters );
	singleMaterial = false;
	if ( singleMaterial ) zmaterial = [ cubeMaterial ];
	  var geo = new THREE.SphereBufferGeometry( 1, 20, 10 );
		var xgrid = 14,
		ygrid = 9,
		zgrid = 14;
		nobjects = xgrid * ygrid * zgrid;
		var s = 60;
		var count = 0;
		for ( i = 0; i < xgrid; i ++ )
			for ( j = 0; j < ygrid; j ++ )
				for ( k = 0; k < zgrid; k ++ ) {
					var mesh;
					if ( singleMaterial ) {
						mesh = new THREE.Mesh( geo, zmaterial );
					} else {
						mesh = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( parameters ) );
						materials[ count ] = mesh.material;
					}
					x = 200 * ( i - xgrid / 2 );
					y = 200 * ( j - ygrid / 2 );
					z = 200 * ( k - zgrid / 2 );
				  mesh.position.set( x, y, z );
					mesh.scale.set( s, s, s );
					mesh.matrixAutoUpdate = false;
					mesh.updateMatrix();
					scene.add( mesh );
					objects.push( mesh );
					count ++;
        }
        //下の関数
        initPostprocessing();
        renderer.autoClear = false;
        
        // Statsー---------------
				//stats = new Stats();
        // container.appendChild( stats.dom );
        // //onDocumentMouseMoveは下で使われている関数
				// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				// document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				// document.addEventListener( 'touchmove', onDocumentTouchMove, false );
				// window.addEventListener( 'resize', onWindowResize, false );
				// var effectController = {
				// 	focus: 500.0,
				// 	aperture:	5,
				// 	maxblur:	1.0
				// };
				// var matChanger = function ( ) {
				// 	postprocessing.bokeh.uniforms[ "focus" ].value = effectController.focus;
				// 	postprocessing.bokeh.uniforms[ "aperture" ].value = effectController.aperture * 0.00001;
				// 	postprocessing.bokeh.uniforms[ "maxblur" ].value = effectController.maxblur;
        // };
        
        // dat.GUIまわりー---------------
				// var gui = new GUI();
				// gui.add( effectController, "focus", 10.0, 3000.0, 10 ).onChange( matChanger );
				// gui.add( effectController, "aperture", 0, 10, 0.1 ).onChange( matChanger );
				// gui.add( effectController, "maxblur", 0.0, 3.0, 0.025 ).onChange( matChanger );
				// gui.close();
        // matChanger();
        // ー---------------
      }
      
      // Statsで使われている---------------
			function onDocumentMouseMove( event ) {
				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;
			}
			function onDocumentTouchStart( event ) {
				if ( event.touches.length == 1 ) {
					event.preventDefault();
					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;
				}
			}
			function onDocumentTouchMove( event ) {
				if ( event.touches.length == 1 ) {
					event.preventDefault();
					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;
				}
			}
			function onWindowResize() {
				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;
				width = window.innerWidth;
				height = window.innerHeight;
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize( width, height );
				postprocessing.composer.setSize( width, height );
      }
      // ---------------
      
      //ライブラリ(RenderPass,BokehPass)をつかってる---------
			function initPostprocessing() {
        var renderPass = new RenderPass( scene, camera );

        //よくわからん
        const bokehEffect = new RealisticBokehEffect({
          focus: 1.55,
          focalLength: 0.5,
          luminanceThreshold: 0.325,
          luminanceGain: 2.0,
          bias: -0.35,
          fringe: 0.7,
          maxBlur: 2.5,
          rings: 6,
          samples: 5,
          showFocus: false,
          manualDoF: false,
          pentagon: true
        });

        //BokehPassからEffectPassに名前が変更されてしまった？
        //https://github.com/vanruesc/postprocessing/issues/108
				// var bokehPass = new EffectPass( scene, camera, {
				// 	focus: 1.0,
				// 	aperture:	0.025,
				// 	maxblur:	1.0,
				// 	width: width,
				// 	height: height
        // } );
        var bokehPass = new EffectPass(
          camera,
          bokehEffect,
          new VignetteEffect()
        );

				var composer = new EffectComposer( renderer );
				composer.addPass( renderPass );
				composer.addPass( bokehPass );
				postprocessing.composer = composer;
				postprocessing.bokeh = bokehPass;
      }
      // ---------------

      // 何度もレンダリングする時につかう
			function animate() {
				requestAnimationFrame( animate, renderer.domElement );
				//stats.begin();
				render();
				//stats.end();
      }
      
			function render() {
				var time = Date.now() * 0.00005;
				camera.position.x += ( mouseX - camera.position.x ) * 0.036;
				camera.position.y += ( - ( mouseY ) - camera.position.y ) * 0.036;
				//camera.lookAt( scene.position );
				if ( ! singleMaterial ) {
					for ( i = 0; i < nobjects; i ++ ) {
						h = ( 360 * ( i / nobjects + time ) % 360 ) / 360;
						materials[ i ].color.setHSL( h, 1, 0.5 );
					}
				}
				// postprocessing.composer.render( 0.1 );
      }
      // ---------------