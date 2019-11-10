window.addEventListener('DOMContentLoaded', init);

function init() {
  // シーン
  var scene = new THREE.Scene();

  // レンダラー
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // カメラ
  var camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight);
  camera.position.set(0, 0, 100);
  scene.add(camera);

  // 星屑を作成します
  // 形状データを作成
  const geometry = new THREE.Geometry();
  // 配置する範囲
  const SIZE = 3000;
  // 配置する個数
  const LENGTH = 4000;
  for (let i = 0; i < LENGTH; i++) {
    geometry.vertices.push(
      new THREE.Vector3(
        SIZE * (Math.random() - 0.5),
        SIZE * (Math.random() - 0.5),
        SIZE * (Math.random() - 0.5)
      )
    );
  }
  // マテリアルを作成
  var material = new THREE.PointsMaterial({
    // 一つ一つのサイズ
    size: 10,
    // 色
    color: 0xffffff
  });
  // 物体を作成
  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  // マウス
  var controls = new THREE.OrbitControls(camera);

  // ライト
  light = new THREE.DirectionalLight(0xcccccc,1);
  light.position = new THREE.Vector3(0, 10, 10);
  ambient = new THREE.AmbientLight(0x333333);
  scene.add(light);
  scene.add(ambient);

  // GUIパラメータ
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

  gui = new dat.GUI();
  guiObj = new guiCtrl();
  var folder = gui.addFolder('Folder');
  folder.add( guiObj, 'Camera_x', 0, 100 ).onChange(setCameraPosition);
  folder.add( guiObj, 'Camera_y', 0, 100 ).onChange(setCameraPosition);
  folder.add( guiObj, 'Camera_z', 0, 100 ).onChange(setCameraPosition);
  folder.addColor( guiObj , 'color' ).onChange(setColor);
  folder.add( guiObj, 'size', 10, 100).onChange(setSize);
  folder.add( guiObj, 'alert' );
  folder.open();

  function setCameraPosition(){
    camera.position.set(guiObj.Camera_x, guiObj.Camera_y, guiObj.Camera_z);
  }

  function setColor(){
    //マテリアル
    console.log("guiObj", guiObj)
    var code = guiObj.color;
    var red   = parseInt(code.substring(1,3), 16);
    var green = parseInt(code.substring(3,5), 16);
    var blue  = parseInt(code.substring(5,7), 16);
    mesh.material.color.r  = red / 255
    mesh.material.color.g  = green / 255
    mesh.material.color.b  = blue / 255
    console.log("mesh.material.color",mesh.material.color)
  }

  function setSize(){
    mesh.material.size = guiObj.size;
    console.log(mesh);
  }
  
  // レンダリング
  function render(){
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene,camera);
  }

  render();
}
