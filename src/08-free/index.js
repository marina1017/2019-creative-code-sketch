import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import ColladaLoader from 'three-collada-loader'
import * as dat from 'dat.gui'
// importにやたらめったらはまった 
// 下記のPRがマージされるまではaddAttribute()を.setAttribute()に変更する必要がある
// https://github.com/spite/THREE.MeshLine/pull/92/files
import { MeshLine, MeshLineMaterial, } from 'three.meshline';
import { Material } from 'three';

window.addEventListener('DOMContentLoaded', init);


function init() {
  // 基本設定---------------
  // 画面サイズ設定
  const width = window.innerWidth;
  const height = window.innerHeight - 200;

  //設定
  let isRotateX = false;
  let isRotateY = false;
  let isRotateZ = false;

  //HTMLで設定した周り
  const xrotateElement = document.getElementById('xrotate');
  xrotateElement.onclick = function() {
    isRotateX = !isRotateX;
  }
  const yrotateElement = document.getElementById('yrotate');
  yrotateElement.onclick = function() {
    isRotateY = !isRotateY;
  }
  const zrotateElement = document.getElementById('zrotate');
  zrotateElement.onclick = function() {
    isRotateZ = !isRotateZ;
  }

  document.getElementById('white-bg').onclick = function() {
    scene.background = new THREE.Color(0xFFFFFF);
  }
  document.getElementById('black-bg').onclick = function() {
    scene.background = new THREE.Color(0x000000);
  }
  document.getElementById('green-bg').onclick = function() {
    scene.background = new THREE.Color(0x00FF00);
  }
  //---------------------

  // シーン---------------
  var scene = new THREE.Scene();
  //---------------------

  // レンダラー---------------
  //html から id が myCanvas である canvas タグを JavaScript で取得し、 レンダラーに設定する
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
  });
  // レンダラーが描画するキャンバスサイズの設定
  renderer.setSize( width, height);
  
  //---------------------

  // カメラ---------------
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 0, 50);

  // マウスの動きに合わせる
  var controls = new OrbitControls(camera);


  scene.add(camera);
  //---------------------

  //オブジェクト---------------
  let model;
  // Collada 形式のモデルデータを読み込む
  const loader = new ColladaLoader();
  // dae ファイルのパスを指定
  loader.load('test.dae', (collada) => {
    model = collada.scene;
    scene.add(model); // 読み込み後に3D空間に追加
  });
  
  //---------------------


  // マテリアル---------------
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  //---------------

  //Meshに追加する---------------------
  //const cube = new THREE.Mesh(geometry, material);
  //scene.add(cube);
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
    //モデルの回転をコントロール
    if (model) {
      if (isRotateX) {
        model.rotation.x += getRadian(1);
      }
      if (isRotateY) {
        model.rotation.y += getRadian(1);
      }
      if (isRotateZ) {
        model.rotation.z += getRadian(1);
      }
    }

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
