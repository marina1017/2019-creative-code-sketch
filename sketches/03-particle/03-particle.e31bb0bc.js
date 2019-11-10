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
window.addEventListener('DOMContentLoaded', init);

function init() {
  // シーン
  var scene = new THREE.Scene(); // レンダラー

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement); // カメラ

  var camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight);
  camera.position.set(0, 0, 100);
  scene.add(camera); // マウス

  var controls = new THREE.OrbitControls(camera); // ライト

  light = new THREE.DirectionalLight(0xcccccc, 1);
  light.position = new THREE.Vector3(0, 10, 10);
  ambient = new THREE.AmbientLight(0x333333);
  scene.add(light);
  scene.add(ambient); // キューブ

  var geometry = new THREE.BoxGeometry(12, 12, 12);
  var c = '#c2dc94';
  var material = new THREE.MeshPhongMaterial({
    color: c
  });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, 0);
  scene.add(cube); // GUIパラメータ

  var guiCtrl = function guiCtrl() {
    this.Camera_x = 0;
    this.Camera_y = 0;
    this.Camera_z = 100;
    this.Message = '';
    this.color = "#c2dc94";

    this.alert = function () {
      alert("サンプル");
    };
  };

  gui = new dat.GUI();
  guiObj = new guiCtrl();
  var folder = gui.addFolder('Folder');
  folder.add(guiObj, 'Camera_x', 0, 100).onChange(setCameraPosition);
  folder.add(guiObj, 'Camera_y', 0, 100).onChange(setCameraPosition);
  folder.add(guiObj, 'Camera_z', 0, 100).onChange(setCameraPosition);
  folder.addColor(guiObj, 'color').onChange(setColor);
  folder.add(guiObj, 'alert');
  folder.open();

  function setCameraPosition() {
    camera.position.set(guiObj.Camera_x, guiObj.Camera_y, guiObj.Camera_z);
  }

  function setColor() {
    material = new THREE.MeshPhongMaterial({
      color: guiObj.color
    });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  } // レンダリング


  function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  }

  render();
}
},{}]},{},["index.js"], null)
//# sourceMappingURL=/03-particle.e31bb0bc.js.map