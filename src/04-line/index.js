import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import * as dat from 'dat.gui'
// importにやたらめったらはまった 下記のPRがマージされるまではaddAttribute()を.setAttribute()に変更する必要がある
// https://github.com/spite/THREE.MeshLine/pull/92/files
import { MeshLine, MeshLineMaterial, } from 'three.meshline';

window.addEventListener('DOMContentLoaded', init);
//生成するラインの個数
var NUM = 200;

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
    //geometryをいっぱい作る
    var geometries = [];
    for(var i = 0; i < NUM; i++) {
      const segmentLength = 1;
      const nbrOfPoints = 15;
      const points = [];
      //ランダム性？
      const turbulence = Math.random(0.1,3.5);
      for (let i = 0; i < nbrOfPoints; i++) {
        // THREE.Vector3にポイントをラップする必要があります
        points.push(new THREE.Vector3(
          i * segmentLength,
          (Math.random() * (turbulence * 2)) - turbulence,
          (Math.random() * (turbulence * 2)) - turbulence,
        ));
      }

      // 3Dスプライン
      const linePoints = new THREE.Geometry().setFromPoints(
        new THREE.CatmullRomCurve3(points).getPoints(500)
      );

      var line = new MeshLine();
      line.setGeometry(linePoints);
      geometries[i] = line.geometry;
    }
    console.log("geometries",geometries[0])


  //---------------------


  // マテリアル---------------
  // 適切なパラメータを使用してマテリアルを構築し、アニメーション化します。
  const material = new MeshLineMaterial({
    transparent: true,
    lineWidth: 0.4,
    color: new THREE.Color('#ff0000'),
    opacity: 0.5,
    //常に行の2倍でなければなりません
    dashArray: 4,
    //ゼロからダッシュを開始
    dashOffset: 0, 
    //可視の長さの範囲最小：0.99、最大：0.5
    dashRatio: 0.985, 
  });
  material.transparent = true
  
  //---------------------

  // particle systemをつくる---------------
  //  const lineMesh = new THREE.Mesh(
  //    //第1引数は,ジオメトリ
  //    geometry, 
  //    //第2引数は,マテリアル
  //    material
  //  );
  //  lineMesh.position.x = 0;
  //  scene.add(lineMesh);
   
  for(var i = 0; i < NUM; i++) {
    var lineMesh = new THREE.Mesh( geometries[i], material);
    lineMesh.position.x = 0;
    lineMesh.rotation.x = i / 10*Math.PI*Math.random(0,1000);
    lineMesh.rotation.y = i / 10*Math.PI*Math.random(0,1000);
    scene.add(lineMesh);
  }

  
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
    mesh.material.color.r  = red / 255
    mesh.material.color.g  = green / 255
    mesh.material.color.b  = blue / 255
  }

  function setDashRatio(){
    material.dashRatio = guiObj.dashRatio;
  }
  //---------------------
  
  // レンダリング---------------------
  function render(){
    // マウスでカメラを操作するため
    controls.update();

    // アニメーションを停止するには、ダッシュが出ているかどうかを確認します。
    //if (lineMesh.material.uniforms.dashOffset.value < -2) return;
    // dashOffset値をデクリメントして、パスをダッシュでアニメーション化します。
    //lineMesh.material.uniforms.dashOffset.value -= 0.01;
    //for(var i = 0; i < NUM; i++) {
    lineMesh.material.uniforms.dashOffset.value -= 0.01;
    lineMesh.rotation.y += 0.005;
      // lineMeshs[i].rotation.y += i / 25000 * Math.PI;
      // lineMeshs[i].rotation.x += i / 25000 * Math.PI;
      // lineMeshs[i].scale.x = 0.3 * Math.sin( Date.now() / 2000) + 1;
      // lineMeshs[i].scale.y = 0.3 * Math.sin( Date.now() / 2000) + 1;
      // lineMeshs[i].rotation.y += 0.005;
    //}

    //リピートするのに必要
    requestAnimationFrame(render);
    //シーンとカメラをいれる。
    renderer.render(scene,camera);
  }

  render();
  //---------------------
}
