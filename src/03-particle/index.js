import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import * as dat from 'dat.gui'

import { MeshLine, MeshLineMaterial, } from 'three.meshline';
import { Material } from 'three';

window.addEventListener('DOMContentLoaded', init);

function init() {
  // シーン---------------
  var scene = new THREE.Scene();
  //---------------------

  // レンダラー---------------
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //---------------------

  // カメラ---------------
  var camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight);
  camera.position.set(0, 0, 100);
  scene.add(camera);
  //---------------------

  //オブジェクト---------------
  // 形状データを作成
  const geometry = new THREE.Geometry();
  // 配置する範囲
  const SIZE = 3000;
  // 配置する個数
  const LENGTH = 10000;

  // geometryにランダムに点をいれていく
  for (let i = 0; i < LENGTH; i++) {
    var particle = new THREE.Vector3(
      SIZE * (Math.random() - 0.5),
      SIZE * (Math.random() - 0.5),
      SIZE * (Math.random() - 0.5)
    );
    //particleオブジェクトにvelocityプロパティをいれる
    particle.velocity = new THREE.Vector3(
      0,
      Math.random(1,10),
      Math.random(1,10)
    );
    geometry.vertices.push(particle);
  }
  geometry.verticesNeedUpdate = true;
  geometry.elementNeedUpdate = true;
  //---------------------


  // マテリアル---------------
  var material = new THREE.PointsMaterial({
    // 一つ一つのサイズ
    size: 10,
    // 色
    color: 0xffffff,
    //ブレンド(加算)
    blending: THREE.AdditiveBlending,
    //透過するか
    transparent: true,
    clipIntersection: true
  });
  //---------------------

  // particle systemをつくる---------------
  var mesh = new THREE.Points(
    //第一引数は,geometry
    geometry,
    //第一引数は,マテリアル
    material
  );

  scene.add(mesh);
  //---------------------


  // マウス---------------
  var controls = new OrbitControls(camera, renderer.domElement);
  //---------------------

  // ライト---------------
  var light = new THREE.DirectionalLight(0xcccccc,1);
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
    this.Message = '';
    this.color = "#FFFFFF";
    this.size = 10;
    this.alert = function(){
      alert("アラートのテスト");
    };
  };

  var gui = new dat.GUI();
  var guiObj = new guiCtrl();
  var folder = gui.addFolder('Folder');
  folder.add( guiObj, 'Camera_x', 0, 100 ).onChange(setCameraPosition);
  folder.add( guiObj, 'Camera_y', 0, 100 ).onChange(setCameraPosition);
  folder.add( guiObj, 'Camera_z', 0, 100 ).onChange(setCameraPosition);
  folder.addColor( guiObj , 'color' ).onChange(setColor);
  folder.add( guiObj, 'size', 10, 1000).onChange(setSize);
  folder.add( guiObj, 'alert' );
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
    mesh.material.color.r  = red / 255
    mesh.material.color.g  = green / 255
    mesh.material.color.b  = blue / 255
  }

  function setSize(){
    mesh.material.size = guiObj.size;
  }
  //---------------------
  
  // レンダリング---------------------
  function render(){
    requestAnimationFrame(render);
    //particle system自体をまわす
    mesh.rotation.y += 0.001;

    // meshに設定したgeometryの中に入っている点のy軸をランダムに動かすようにする
    mesh.geometry.vertices.forEach(vertex => {
      vertex.setY(vertex.y + vertex.velocity.y);
    });
    // geometryの「geometry.verticesNeedUpdate」はレンダリング後に毎回falseになるらしいのでtrueをここで設定している。
    // https://stackoverflow.com/questions/24531109/three-js-vertices-does-not-update
    mesh.geometry.verticesNeedUpdate = true;
    
    // マウスでカメラを操作するため
    controls.update();

    //シーンとカメラをいれる。
    renderer.render(scene,camera);
  }

  render();
  //---------------------
}
