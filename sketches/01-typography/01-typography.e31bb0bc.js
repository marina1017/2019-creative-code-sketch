// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
// ページの読み込みを待つ
window.addEventListener('load', init); // シーンを作成

var scene = new THREE.Scene();

function init() {
  // サイズを指定
  var width = 960;
  var height = 540; // レンダラーを作成

  var renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas')
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height); //axes 便利な座標を出す

  var axes = new THREE.AxisHelper(20);
  scene.add(axes); //真上から見るカメラ作る

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 50;
  camera.lookAt(scene.position); // スポットライト光源を作成
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

  ideyo_ita();
  tick(); // 毎フレーム時に実行されるループイベントです

  function tick() {
    //geometry.rotation.y += 0.01;
    renderer.render(scene, camera); // レンダリング

    requestAnimationFrame(tick);
  }
} //板を出す


function ideyo_ita() {
  //1.ジオメトリを新しく作る→PlaneGeometry - 板作るよ
  var planeGeometry = new THREE.PlaneGeometry(10, 10, 20, 20); //2.メッシュを作ります → 赤っぽいのにした

  var planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
  }); //3.さっき作った1と2をTHREE.Mesh()の引数に入れてnew

  var plane = new THREE.Mesh(planeGeometry, planeMaterial); //場所決めないと出てきてくれない

  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;
  scene.add(plane);
}
},{}]},{},["index.js"], null)
//# sourceMappingURL=/01-typography.e31bb0bc.js.map