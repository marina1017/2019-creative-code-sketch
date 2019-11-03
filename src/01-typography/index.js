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
        camera.position.z = 1000;
        camera.lookAt(scene.position);

        // 平行光源
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        // ポイント光源
        const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
        scene.add(pointLight);
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
        scene.add(pointLightHelper);

        // ドーナツを作成
        const geometry = new THREE.TorusGeometry(30, 10, 64, 10);
        // マテリアルを作成
        const material = new THREE.MeshToonMaterial({ color: 0x6699ff });
        // メッシュを作成
        const mesh = new THREE.Mesh(geometry, material);
        // 3D空間にメッシュを追加
        scene.add(mesh);

        tick();

        // 毎フレーム時に実行されるループイベントです
        function tick() {
            // メッシュを回転させる
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;

            // ライトを周回させる
          pointLight.position.set(
            500 * Math.sin(Date.now() / 500),
            500 * Math.sin(Date.now() / 1000),
            500 * Math.cos(Date.now() / 500)
          );
            // レンダリング
            renderer.render(scene, camera); 

        requestAnimationFrame(tick);
      }
    }
  
  