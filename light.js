let light;


function init() {

  light = new THREE.DirectionalLight(0xffffbb, 0.7);

  //const light = new THREE.SpotLight( 0xffffff, 1.5 );
  light.position.set(0, 20, 50);
  light.angle = Math.PI/9;

  light.castShadow = true;
  light.shadow.camera.near = 100;
  light.shadow.camera.far = 200;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  return light;
}
export {init}