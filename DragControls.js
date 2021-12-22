import {
  EventDispatcher,
  Matrix4,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
} from "./three.module.js";
import * as Logic from "./logic.js";
import globalvariable from "./GlobalVariable.js";

const _plane = new Plane();
const _raycaster = new Raycaster();

const _pointer = new Vector2();
const _offset = new Vector3();
const _intersection = new Vector3();
const _worldPosition = new Vector3();
const _inverseMatrix = new Matrix4();

class DragControls extends EventDispatcher {
  constructor(_objects, _scene, _actions, _camera, _domElement) {
    super();

    _domElement.style.touchAction = "none"; // disable touch scroll

    let _selected = null,
      _hovered = null;

    const _intersections = [];

    //

    const scope = this;

    function activate() {
      _domElement.addEventListener("pointermove", onPointerMove);
      _domElement.addEventListener("pointerdown", onPointerDown);
      _domElement.addEventListener("pointerup", onPointerCancel);
      _domElement.addEventListener("pointerleave", onPointerCancel);
    }

    function deactivate() {
      _domElement.removeEventListener("pointermove", onPointerMove);
      _domElement.removeEventListener("pointerdown", onPointerDown);
      _domElement.removeEventListener("pointerup", onPointerCancel);
      _domElement.removeEventListener("pointerleave", onPointerCancel);

      _domElement.style.cursor = "";
    }

    function dispose() {
      deactivate();
    }

    function getObjects() {
      return _objects;
    }

    function getRaycaster() {
      return _raycaster;
    }

    function onPointerMove(event) {
      if (scope.enabled === false) return;

      updatePointer(event);

      _raycaster.setFromCamera(_pointer, _camera);

      if (_selected) {
        if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
          if (_selected.userData.isDraggable) {
            _selected.position.copy(
              _intersection.sub(_offset).applyMatrix4(_inverseMatrix)
            );
            // console.log(_selected);
            if (_selected.position.y < -4.5) {
              _selected.position.y = -4.5;
            }
            if (_selected.position.x > 105) {
              _selected.position.x = 105;
            }
            if (_selected.position.x < -73) {
              _selected.position.x = -73;
            }
            if (
              _selected.position.y < -1.5 &&
              _selected.position.x < 0 &&
              _selected.position.x > -40
            )
              _selected.position.y = -1.5;
            // Logic.init(_selected,_objects,_actions);
            if (_selected.name != "KETTLE") {
              // console.log(_selected.name);
              // console.log(_selected.position);
              if (
                _selected.position.x < 30 &&
                _selected.position.x > -25 &&
                _selected.position.y < 8
              ) {
                _selected.position.x = -33;
                _selected.position.y = 8;
              }
            }
            if (_selected.name == "KETTLE") {
              // console.log(_selected.position);
              if (
                _selected.position.x < 34 &&
                _selected.position.x > 0 &&
                _selected.position.y < 10
              ) {
                _selected.position.y = 12;
              }
            }
          }
        }
        scope.dispatchEvent({ type: "drag", object: _selected });

        return;
      }

      // hover support

      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        _intersections.length = 0;

        _raycaster.setFromCamera(_pointer, _camera);
        _raycaster.intersectObjects(_objects, true, _intersections);

        if (_intersections.length > 0) {
          const object = _intersections[0].object;

          _plane.setFromNormalAndCoplanarPoint(
            _camera.getWorldDirection(_plane.normal),
            _worldPosition.setFromMatrixPosition(object.matrixWorld)
          );

          if (_hovered !== object && _hovered !== null) {
            scope.dispatchEvent({ type: "hoveroff", object: _hovered });

            _domElement.style.cursor = "auto";
            _hovered = null;
          }

          if (_hovered !== object) {
            scope.dispatchEvent({ type: "hoveron", object: object });

            _domElement.style.cursor = "pointer";
            _hovered = object;
          }
        } else {
          if (_hovered !== null) {
            scope.dispatchEvent({ type: "hoveroff", object: _hovered });

            _domElement.style.cursor = "auto";
            _hovered = null;
          }
        }
      }
    }
    var selecting = 0;
    function onPointerDown(event) {
      if (scope.enabled === false) return;
      updatePointer(event);

      _intersections.length = 0;

      _raycaster.setFromCamera(_pointer, _camera);
      _raycaster.intersectObjects(_objects, true, _intersections);

      if (_intersections.length > 0) {
        _selected =
          scope.transformGroup === true
            ? _objects[0]
            : _intersections[0].object;
        let x = _selected;
        while (x.parent != null && x.parent.type != "Scene") {
          x = x.parent;
        }
        _selected = x;
        console.log(_selected);
        if (_selected.name == "SWITCH" && _selected.state == "off") {
          _selected.state = "on";
          _selected.material.color.set(0x00ff00);
          globalvariable.flag = 1;
          let mytext = " Step 2 - Put the kettle on stove";
          document.getElementById("info").style.transform =
            "translateY(-200px)";
          setTimeout(() => {
            document.getElementById("info").innerHTML = mytext;
            document.getElementById("info").style.transform = "translateY(0px)";
          }, 2000);
        }
        _plane.setFromNormalAndCoplanarPoint(
          _camera.getWorldDirection(_plane.normal),
          _worldPosition.setFromMatrixPosition(_selected.matrixWorld)
        );

        if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
          _inverseMatrix.copy(_selected.parent.matrixWorld).invert();
          _offset
            .copy(_intersection)
            .sub(_worldPosition.setFromMatrixPosition(_selected.matrixWorld));
        }

        _domElement.style.cursor = "move";

        scope.dispatchEvent({ type: "dragstart", object: _selected });
      }
    }

    function onPointerCancel() {
      if (scope.enabled === false) return;

      if (_selected) {
        Logic.init(_selected, _scene, _objects, _actions);

        scope.dispatchEvent({ type: "dragend", object: _selected });

        _selected = null;
      }

      _domElement.style.cursor = _hovered ? "pointer" : "auto";
    }

    function updatePointer(event) {
      const rect = _domElement.getBoundingClientRect();

      _pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    activate();

    // API

    this.enabled = true;
    this.transformGroup = false;

    this.activate = activate;
    this.deactivate = deactivate;
    this.dispose = dispose;
    this.getObjects = getObjects;
    this.getRaycaster = getRaycaster;
  }
}

export { DragControls };
