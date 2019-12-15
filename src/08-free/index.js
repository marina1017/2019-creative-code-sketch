import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import * as dat from 'dat.gui'
// importにやたらめったらはまった 
// 下記のPRがマージされるまではaddAttribute()を.setAttribute()に変更する必要がある
// https://github.com/spite/THREE.MeshLine/pull/92/files
import { MeshLine, MeshLineMaterial, } from 'three.meshline';
import { Material } from 'three';

window.addEventListener('DOMContentLoaded', init);


function init() {
  // シーン---------------
  var scene = new THREE.Scene();
  //---------------------

  // レンダラー---------------
  var renderer = new THREE.WebGLRenderer();
  // レンダラーが描画するキャンバスサイズの設定
  renderer.setSize( window.innerWidth, window.innerHeight );
  // キャンバスをDOMツリーに追加
  document.body.appendChild( renderer.domElement );
  //---------------------

  // カメラ---------------
  var camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight);
  camera.position.set(0, 0, 50);
  scene.add(camera);
  //---------------------

  //オブジェクト---------------
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  //---------------------


  // マテリアル---------------
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  //---------------

  //Meshに追加する---------------------
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  //---------------------


  // マウス---------------
  var controls = new OrbitControls(camera, renderer.domElement);
  //---------------------

  // クリック---------------
  // マウスクリックイベントのリスナー登録
  document.addEventListener( 'mousedown', clickPosition, false );
  // クリックされたときになにするか
  function clickPosition(event){
    console.log("くりっくされました",event)
  }
  //---------------------

  // ライト---------------
  //DirectionalLight(色,強度)をきめれる
  var light = new THREE.DirectionalLight(0xffffff,2);
  light.position.set(new THREE.Vector3(0, 10, 10));
  var ambient = new THREE.AmbientLight(0x333333);
  scene.add(light);
  scene.add(ambient);
  //---------------------

  // GUIで変更できるようにする---------------
  var guiCtrl = function(){
    this.Camera_x = 0;
    this.Camera_y = 0;
    this.Camera_z = 100;
    this.color = "#26a01e";
    this.dashRatio = 0.985
  };

  var gui = new dat.GUI();
  var guiObj = new guiCtrl();
  var folder = gui.addFolder('Folder');
  folder.add( guiObj, 'Camera_x', 0, 100 ).onChange(setCameraPosition);
  folder.add( guiObj, 'Camera_y', 0, 100 ).onChange(setCameraPosition);
  folder.add( guiObj, 'Camera_z', 0, 100 ).onChange(setCameraPosition);
  folder.addColor( guiObj , 'color' ).onChange(setColor);
  folder.add( guiObj, 'dashRatio', 0.5, 0.99).onChange(setDashRatio);
  folder.open();

  function setCameraPosition(){
    camera.position.set(guiObj.Camera_x, guiObj.Camera_y, guiObj.Camera_z);
  }

  function setColor(){
    //マテリアル
    var code = guiObj.color;
    var red   = parseInt(code.substring(1,3), 16);
    var green = parseInt(code.substring(3,5), 16);
    var blue  = parseInt(code.substring(5,7), 16);
  }

  function setDashRatio(){
    material.dashRatio = guiObj.dashRatio;
  }
  //---------------------
  
  // レンダリング---------------------
  function render(){
    // マウスでカメラを操作するため
    controls.update();
    //リピートするのに必要
    requestAnimationFrame(render);
    //シーンとカメラをいれる。
    renderer.render(scene,camera);
  }

  render();
  //---------------------
}
