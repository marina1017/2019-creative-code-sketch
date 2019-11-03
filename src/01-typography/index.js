// ページの読み込みを待つ
    window.addEventListener('load', init);
    // シーンを作成
    const scene = new THREE.Scene();

    function init() {

        // サイズを指定
        const width = 960;
        const height = 540;

        // レンダラーを作成
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#myCanvas')
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        //axes 便利な座標を出す
        var axes = new THREE.AxisHelper(20);
        scene.add(axes);

        //真上から見るカメラ作る
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 50;
        camera.lookAt(scene.position);

        // スポットライト光源を作成
        //new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
        // const light = new THREE.SpotLight(0x00FF00, 4, 30, Math.PI / 6, 0, 0.5);
        // light.position.x = 0;
        // light.position.y = 0;
        // light.position.z = 0;
        // scene.add(light);

        // // ヘルパーを作成
        // const lightHelper = new THREE.SpotLightHelper(light);
        // scene.add(lightHelper);

        //底を作る
        ideyo_ita()

        tick();

        // 毎フレーム時に実行されるループイベントです
        function tick() {
            //geometry.rotation.y += 0.01;
            renderer.render(scene, camera); // レンダリング

        requestAnimationFrame(tick);
      }
    }

    //板を出す
function ideyo_ita(){
    //1.ジオメトリを新しく作る→PlaneGeometry - 板作るよ
    var planeGeometry = new THREE.PlaneGeometry(10, 10, 20, 20);
    //2.メッシュを作ります → 赤っぽいのにした
    var planeMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.DoubleSide} );
    //3.さっき作った1と2をTHREE.Mesh()の引数に入れてnew
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //場所決めないと出てきてくれない
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);
}
  
  