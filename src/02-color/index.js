// ページの読み込みを待つ
    window.addEventListener('load', init);

    function init() {

        // サイズを指定
        const width = 960;
        const height = 540;
        // レンダラーを作成
        const renderer = new THREE.WebGLRenderer({
          canvas: document.querySelector('#myCanvas'),
          antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        // レンダラー側で影を有効に
        renderer.shadowMap.enabled = true;
        // シーンを作成
        const scene = new THREE.Scene();
        // カメラを作成
        const camera = new THREE.PerspectiveCamera(30, width / height);
        // 光源を作成 （一つ目）
        {
          const spotLight_red = new THREE.SpotLight(
            0xff0000,
            4,
            2000,
            Math.PI / 5,
            0.2,
            1.5
          );
          spotLight_red.position.set(700, 300, 500);
          spotLight_red.castShadow = true; // 影を落とす設定
          spotLight_red.shadow.mapSize.width = 2048;
          spotLight_red.shadow.mapSize.height = 2048;
          scene.add(spotLight_red);
        }
        // 光源を作成 （二つ目）
        {
          const spotLight_green = new THREE.SpotLight(
            0x00ff00,
            4,
            2000,
            Math.PI / 5,
            0.2,
            1.5
          );
          spotLight_green.position.set(-700, 300, 500);
          spotLight_green.castShadow = true; // 影を落とす設定
          spotLight_green.shadow.mapSize.width = 2048;
          spotLight_green.shadow.mapSize.height = 2048;
          scene.add(spotLight_green);
        }
        // 光源を作成 （三つ目）
        {
          const spotLight_blue = new THREE.SpotLight(
            0x0000ff,
            4,
            2000,
            Math.PI / 5,
            0.2,
            1.5
          );
          spotLight_blue.position.set(0, 300, -700);
          spotLight_blue.castShadow = true; // 影を落とす設定
          spotLight_blue.shadow.mapSize.width = 2048;
          spotLight_blue.shadow.mapSize.height = 2048;
          scene.add(spotLight_blue);
        }

        // 地面を作成
        {
          //new THREE.Mesh( geometry, material );だから第一引数にgeometry　第二引数にmaterialを入れておく
          const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshPhongMaterial( {color: 0xFFFFFF, side: THREE.DoubleSide} )
          );
          //地面の角度を平面にしている
          floor.rotation.x = -Math.PI / 2;
          // 影の設定
          floor.receiveShadow = true; 
          scene.add(floor);
        }

        // // マス目を作成
        // {
        //   // 立方体のマテリアルとジオメトリを作成
        //   const material = new THREE.MeshStandardMaterial({
        //     color: 0x22dd22,
        //     roughness: 0.1,
        //     metalness: 0.2
        //   });
        //   const geometry = new THREE.BoxGeometry(45, 45, 45);
        //   // 立方体を複数作成しランダムに配置
        //   for (let i = 0; i < 60; i++) {
        //     const box = new THREE.Mesh(geometry, material);
        //     box.position.x = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
        //     box.position.y = 25;
        //     box.position.z = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
        //     // 影の設定
        //     box.receiveShadow = true;
        //     box.castShadow = true;
        //     scene.add(box);
        //   }
        // }

        // ドーナツを作成
        const geometry = new THREE.BoxGeometry(40, 40, 40);
        // マテリアルを作成
        const material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
        // メッシュを作成
        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        // 3D空間にメッシュを追加
        scene.add(mesh);
        
        tick();
        // 毎フレーム時に実行されるループイベントです
        function tick() {
          // 角度に応じてカメラの位置を設定
          //x 上下に揺れる
          camera.position.x = 500 * Math.sin(Date.now() / 2000);
          //y 増えるほど上に
          camera.position.y = 1200;
          //z 横向きに揺れる
          camera.position.z = 500 * Math.cos(Date.now() / 2000);
          // 原点方向を見つめる
          camera.lookAt(new THREE.Vector3(0, 0, 0));
          // レンダリング
          renderer.render(scene, camera);
          requestAnimationFrame(tick);
        }
    }
  
  