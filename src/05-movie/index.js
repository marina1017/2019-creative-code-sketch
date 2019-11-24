import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

window.addEventListener('DOMContentLoaded', init);

function init() {
  //ウィンドウの縦と横の長さを取得-----
  var width = window.innerWidth;
  var height = window.innerHeight;
  //---------------------

  // シーン---------------
  var scene = new THREE.Scene();
  //---------------------

  //Meshに追加する---------------------
  var geometry = new THREE.SphereGeometry( 5, 60, 40 );
  geometry.scale( - 1, 1, 1 );
  //---------------------

  //動画のテクスチャ---------------------
  var video = document.createElement( 'video' );
  video.width = 640;
  video.height = 360;
  video.autoplay = true;
  video.loop = true;
  video.src = "test.mp4";

  // var texture = new THREE.VideoTexture( video );
  // texture.minFilter = THREE.LinearFilter;
  //var material   = new THREE.MeshBasicMaterial( { map : texture } );
  //const material = new THREE.MeshBasicMaterial({color: 0x6699FF});
  console.log("テスト",document.getElementById("image_place").getAttribute("src"))
  var texture = new THREE.TextureLoader().load( document.getElementById("image_place").getAttribute("src"));
  console.log("texture",texture)
  var material = new THREE.MeshBasicMaterial( { map: texture } );
  console.log("material",material)
  
  //---------------------

  //メッシュ作る---------------------
  var sphere = new THREE.Mesh( geometry, material );

  scene.add( sphere );
  console.log(sphere)
  //---------------------

  // レンダラー---------------
  var renderer = new THREE.WebGLRenderer();
  // レンダラーが描画するキャンバスサイズの設定
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor({color: 0x000000});
  // キャンバスをDOMツリーに追加
  //document.body.appendChild( renderer.domElement );
  document.getElementById('stage').appendChild(renderer.domElement);
  //---------------------

  
  // カメラ---------------
  var camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight);
  camera.position.set(0, 0, 50);
  camera.lookAt(sphere.position);
  scene.add(camera);
  //---------------------

  ///補助線---------------
  var axis = new THREE.AxesHelper(1000);
  axis.position.set(0,0,0);
  scene.add(axis);
  //---------------------

  //コントロール---------------
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
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
  // var guiCtrl = function(){
  //   this.Camera_x = 0;
  //   this.Camera_y = 0;
  //   this.Camera_z = 100;
  //   this.color = "#26a01e";
  //   this.dashRatio = 0.985
  // };

  // var gui = new dat.GUI();
  // var guiObj = new guiCtrl();
  // var folder = gui.addFolder('Folder');
  // folder.add( guiObj, 'Camera_x', 0, 100 ).onChange(setCameraPosition);
  // folder.add( guiObj, 'Camera_y', 0, 100 ).onChange(setCameraPosition);
  // folder.add( guiObj, 'Camera_z', 0, 100 ).onChange(setCameraPosition);
  // folder.addColor( guiObj , 'color' ).onChange(setColor);
  // folder.add( guiObj, 'dashRatio', 0.5, 0.99).onChange(setDashRatio);
  // folder.open();

  // function setCameraPosition(){
  //   camera.position.set(guiObj.Camera_x, guiObj.Camera_y, guiObj.Camera_z);
  // }

  // function setColor(){
  //   //マテリアル
  //   var code = guiObj.color;
  //   var red   = parseInt(code.substring(1,3), 16);
  //   var green = parseInt(code.substring(3,5), 16);
  //   var blue  = parseInt(code.substring(5,7), 16);
  //   lineMesh.material.color.r  = red / 255
  //   lineMesh.material.color.g  = green / 255
  //   lineMesh.material.color.b  = blue / 255
  // }

  // function setDashRatio(){
  //   material.dashRatio = guiObj.dashRatio;
  // }
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
