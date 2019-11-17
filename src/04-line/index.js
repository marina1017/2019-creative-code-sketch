import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import * as dat from 'dat.gui'
// importにやたらめったらはまった 下記のPRがマージされるまではaddAttribute()を.setAttribute()に変更する必要がある
// https://github.com/spite/THREE.MeshLine/pull/92/files
import { MeshLine, MeshLineMaterial, } from 'three.meshline';

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
  // 
  const segmentLength = 1;
  const nbrOfPoints = 10;
  const points = [];
  const turbulence = 0.5;
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
    new THREE.CatmullRomCurve3(points).getPoints(50)
  );

  var line = new MeshLine();
  line.setGeometry(linePoints);
  const geometry = line.geometry;
  //---------------------


  // マテリアル---------------
  // 適切なパラメータを使用してマテリアルを構築し、アニメーション化します。
  const material = new MeshLineMaterial({
    transparent: true,
    lineWidth: 0.2,
    color: new THREE.Color('#ff0000'),
    //常に行の2倍でなければなりません
    dashArray: 2,
    //ゼロからダッシュを開始
    dashOffset: 0, 
    //可視の長さの範囲最小：0.99、最大：0.5
    dashRatio: 0.75, 
  });
  //---------------------

  // particle systemをつくる---------------
   const lineMesh = new THREE.Mesh(
     //第1引数は,ジオメトリ
     line.geometry, 
     //第2引数は,マテリアル
     material
   );
   lineMesh.position.x = -4.5;

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

    // アニメーションを停止するには、ダッシュが出ているかどうかを確認します。
    if (lineMesh.material.uniforms.dashOffset.value < -2) return;
    console.log(lineMesh.material.uniforms.dashOffset)
    // dashOffset値をデクリメントして、パスをダッシュでアニメーション化します。
    lineMesh.material.uniforms.dashOffset.value -= 0.01;

    //シーンとカメラをいれる。
    renderer.render(scene,camera);
  }

  render();
  //---------------------
}
