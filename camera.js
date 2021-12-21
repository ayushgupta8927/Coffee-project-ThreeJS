let camera;


function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  camera.position.z = 100;
  camera.position.y = 18;
  return camera;
}

export {init}