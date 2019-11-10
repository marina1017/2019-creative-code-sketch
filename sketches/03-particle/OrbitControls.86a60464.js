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
})({"js/OrbitControls.js":[function(require,module,exports) {
/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */
THREE.OrbitControls = function (object, domElement) {
  this.object = object;
  this.domElement = domElement !== undefined ? domElement : document; // API

  this.enabled = true;
  this.center = new THREE.Vector3();
  this.userZoom = true;
  this.userZoomSpeed = 1.0;
  this.userRotate = true;
  this.userRotateSpeed = 1.0;
  this.userPan = true;
  this.userPanSpeed = 2.0;
  this.autoRotate = false;
  this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

  this.minPolarAngle = 0; // radians

  this.maxPolarAngle = Math.PI; // radians

  this.minDistance = 0;
  this.maxDistance = Infinity;
  this.keys = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    BOTTOM: 40
  }; // internals

  var scope = this;
  var EPS = 0.000001;
  var PIXELS_PER_ROUND = 1800;
  var rotateStart = new THREE.Vector2();
  var rotateEnd = new THREE.Vector2();
  var rotateDelta = new THREE.Vector2();
  var zoomStart = new THREE.Vector2();
  var zoomEnd = new THREE.Vector2();
  var zoomDelta = new THREE.Vector2();
  var phiDelta = 0;
  var thetaDelta = 0;
  var scale = 1;
  var lastPosition = new THREE.Vector3();
  var STATE = {
    NONE: -1,
    ROTATE: 0,
    ZOOM: 1,
    PAN: 2
  };
  var state = STATE.NONE; // events

  var changeEvent = {
    type: 'change'
  };

  this.rotateLeft = function (angle) {
    if (angle === undefined) {
      angle = getAutoRotationAngle();
    }

    thetaDelta -= angle;
  };

  this.rotateRight = function (angle) {
    if (angle === undefined) {
      angle = getAutoRotationAngle();
    }

    thetaDelta += angle;
  };

  this.rotateUp = function (angle) {
    if (angle === undefined) {
      angle = getAutoRotationAngle();
    }

    phiDelta -= angle;
  };

  this.rotateDown = function (angle) {
    if (angle === undefined) {
      angle = getAutoRotationAngle();
    }

    phiDelta += angle;
  };

  this.zoomIn = function (zoomScale) {
    if (zoomScale === undefined) {
      zoomScale = getZoomScale();
    }

    scale /= zoomScale;
  };

  this.zoomOut = function (zoomScale) {
    if (zoomScale === undefined) {
      zoomScale = getZoomScale();
    }

    scale *= zoomScale;
  };

  this.pan = function (distance) {
    distance.transformDirection(this.object.matrix);
    distance.multiplyScalar(scope.userPanSpeed);
    this.object.position.add(distance);
    this.center.add(distance);
  };

  this.update = function () {
    var position = this.object.position;
    var offset = position.clone().sub(this.center); // angle from z-axis around y-axis

    var theta = Math.atan2(offset.x, offset.z); // angle from y-axis

    var phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);

    if (this.autoRotate) {
      this.rotateLeft(getAutoRotationAngle());
    }

    theta += thetaDelta;
    phi += phiDelta; // restrict phi to be between desired limits

    phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi)); // restrict phi to be betwee EPS and PI-EPS

    phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));
    var radius = offset.length() * scale; // restrict radius to be between desired limits

    radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));
    offset.x = radius * Math.sin(phi) * Math.sin(theta);
    offset.y = radius * Math.cos(phi);
    offset.z = radius * Math.sin(phi) * Math.cos(theta);
    position.copy(this.center).add(offset);
    this.object.lookAt(this.center);
    thetaDelta = 0;
    phiDelta = 0;
    scale = 1;

    if (lastPosition.distanceTo(this.object.position) > 0) {
      this.dispatchEvent(changeEvent);
      lastPosition.copy(this.object.position);
    }
  };

  function getAutoRotationAngle() {
    return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
  }

  function getZoomScale() {
    return Math.pow(0.95, scope.userZoomSpeed);
  }

  function onMouseDown(event) {
    if (scope.enabled === false) return;
    if (scope.userRotate === false) return;
    event.preventDefault();

    if (event.button === 0) {
      state = STATE.ROTATE;
      rotateStart.set(event.clientX, event.clientY);
    } else if (event.button === 1) {
      state = STATE.ZOOM;
      zoomStart.set(event.clientX, event.clientY);
    } else if (event.button === 2) {
      state = STATE.PAN;
    }

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
  }

  function onMouseMove(event) {
    if (scope.enabled === false) return;
    event.preventDefault();

    if (state === STATE.ROTATE) {
      rotateEnd.set(event.clientX, event.clientY);
      rotateDelta.subVectors(rotateEnd, rotateStart);
      scope.rotateLeft(2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed);
      scope.rotateUp(2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed);
      rotateStart.copy(rotateEnd);
    } else if (state === STATE.ZOOM) {
      zoomEnd.set(event.clientX, event.clientY);
      zoomDelta.subVectors(zoomEnd, zoomStart);

      if (zoomDelta.y > 0) {
        scope.zoomIn();
      } else {
        scope.zoomOut();
      }

      zoomStart.copy(zoomEnd);
    } else if (state === STATE.PAN) {
      var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
      scope.pan(new THREE.Vector3(-movementX, movementY, 0));
    }
  }

  function onMouseUp(event) {
    if (scope.enabled === false) return;
    if (scope.userRotate === false) return;
    document.removeEventListener('mousemove', onMouseMove, false);
    document.removeEventListener('mouseup', onMouseUp, false);
    state = STATE.NONE;
  }

  function onMouseWheel(event) {
    if (scope.enabled === false) return;
    if (scope.userZoom === false) return;
    var delta = 0;

    if (event.wheelDelta) {
      // WebKit / Opera / Explorer 9
      delta = event.wheelDelta;
    } else if (event.detail) {
      // Firefox
      delta = -event.detail;
    }

    if (delta > 0) {
      scope.zoomOut();
    } else {
      scope.zoomIn();
    }
  }

  function onKeyDown(event) {
    if (scope.enabled === false) return;
    if (scope.userPan === false) return;

    switch (event.keyCode) {
      case scope.keys.UP:
        scope.pan(new THREE.Vector3(0, 1, 0));
        break;

      case scope.keys.BOTTOM:
        scope.pan(new THREE.Vector3(0, -1, 0));
        break;

      case scope.keys.LEFT:
        scope.pan(new THREE.Vector3(-1, 0, 0));
        break;

      case scope.keys.RIGHT:
        scope.pan(new THREE.Vector3(1, 0, 0));
        break;
    }
  }

  this.domElement.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  }, false);
  this.domElement.addEventListener('mousedown', onMouseDown, false);
  this.domElement.addEventListener('mousewheel', onMouseWheel, false);
  this.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox

  this.domElement.addEventListener('keydown', onKeyDown, false);
};

THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
},{}]},{},["js/OrbitControls.js"], null)
//# sourceMappingURL=/OrbitControls.86a60464.js.map