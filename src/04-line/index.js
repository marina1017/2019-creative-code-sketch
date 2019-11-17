import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import * as dat from 'dat.gui'
// importにやたらめったらはまった
// import * as Meshline from 'three.meshline'
// だとだめなのかだれか教えてほしい・・・・
// 参考 https://github.com/spite/THREE.MeshLine/issues/28
import { MeshLine, MeshLineMaterial, } from 'meshline-andrewray'
//import { MeshLine, MeshLineMaterial, } from 'three.meshline'
;

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
  camera.position.set(0, 0, 100);
  scene.add(camera);
  //---------------------

  //オブジェクト---------------
  // 
  var geometry = new THREE.Geometry();
  for( var j = 0; j < Math.PI; j += 2 * Math.PI / 100 ) {
	  var v = new THREE.Vector3( Math.cos( j ), Math.sin( j ), 0 );
	  geometry.vertices.push( v );
  }
  var line = new MeshLine();
  line.setGeometry( geometry );
  //---------------------


  // マテリアル---------------
  // Build the material with good parameters to animate it.
  const material = new MeshLineMaterial({
    transparent: true,
    lineWidth: 0.1,
    //color: new Color('#ff0000'),
    dashArray: 2,     // always has to be the double of the line
    dashOffset: 0,    // start the dash at zero
    dashRatio: 0.75,  // visible length range min: 0.99, max: 0.5
  });
  //---------------------

  // particle systemをつくる---------------
  // var mesh = new THREE.Points(
  //   //第一引数は,geometry
  //   geometry,
  //   //第一引数は,マテリアル
  //   material
  // );
  
  //04の今回は「BoxGeometry」をつかっているのでメッシュをTHREE.Meshをつかっている
  // var mesh = new THREE.Mesh(
  //   //第1引数は,ジオメトリ
  //   geometry,
  //   //第2引数は,マテリアル
  //   material
  // );
   // Build the Mesh
   const lineMesh = new THREE.Mesh(
     //第1引数は,ジオメトリ
     line.geometry, 
     //第2引数は,マテリアル
     material
   );

  scene.add(lineMesh);
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
    //mesh.rotation.y += 0.001;

    // meshに設定したgeometryの中に入っている点のy軸をランダムに動かすようにする
    // mesh.geometry.vertices.forEach(vertex => {
    //   vertex.setY(vertex.y + vertex.velocity.y);
    // });
    // geometryの「geometry.verticesNeedUpdate」はレンダリング後に毎回falseになるらしいのでtrueをここで設定している。
    // https://stackoverflow.com/questions/24531109/three-js-vertices-does-not-update
    //mesh.geometry.verticesNeedUpdate = true;
    // マウスでカメラを操作するため
    controls.update();

    // // Check if the dash is out to stop animate it.
    // if (lineMesh.material.uniforms.dashOffset.value < -2) return;

    // // Decrement the dashOffset value to animate the path with the dash.
    // lineMesh.material.uniforms.dashOffset.value -= 0.01;

    //シーンとカメラをいれる。
    renderer.render(scene,camera);
  }

  render();
  //---------------------
}
