import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { FBXLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js";
import { DragControls } from "./DragControls.js";
import * as Camera from "./camera.js";
import * as Light from "./light.js";
import globalvariable from "./GlobalVariable.js";
let container;
let camera, scene, renderer;
let controls, group;
let components = [];
let actions = [];
let modelReadyCount = 0;
let coffeeMixer = THREE.AnimationMixer;
let milkMixer = THREE.AnimationMixer;
let sugarMixer = THREE.AnimationMixer;
let kettleMixer = THREE.AnimationMixer;
let waterMixer = THREE.AnimationMixer;

let mixers = [];
init();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = Camera.init();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  scene.add(new THREE.AmbientLight(0x505050));
  const light = Light.init();
  scene.add(light);

  group = new THREE.Group();
  scene.add(group);

  //FLOOR
  let pos = { x: 0, y: -40, z: 0 };
  let scale = { x: 400, y: 2, z: 400 };
  const planeSize = 40;
  const loader = new THREE.TextureLoader();

  const texture = loader.load(
    "https://threejsfundamentals.org/threejs/resources/images/checker.png"
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  const repeats = planeSize / 2;
  texture.repeat.set(repeats, repeats);
  let blockPlane = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide })
  );

  const plangeo = new THREE.PlaneGeometry(400, 200);

  const ceiling = new THREE.Mesh(
    plangeo,
    new THREE.MeshBasicMaterial({
      color: 0x808080,
      map: new THREE.TextureLoader().load("./Images/ceiling.jpg"),
      side: THREE.DoubleSide,
    })
  );
  ceiling.rotateX(Math.PI / 2);
  ceiling.position.z = -100;
  ceiling.position.x = 0;
  ceiling.position.y = 100;
  scene.add(ceiling);

  //WALLS
  const boxgeo = new THREE.BoxGeometry(401, 201);

  const planeBack = new THREE.Mesh(
    boxgeo,
    new THREE.MeshLambertMaterial({
      color: 0x808080,
      map: new THREE.TextureLoader().load("./Images/wall.jpg"),
    })
  );
  planeBack.position.z = -200;
  planeBack.position.y = 5;
  scene.add(planeBack);

  const planeRight = new THREE.Mesh(
    boxgeo,
    new THREE.MeshLambertMaterial({
      color: 0x808080,
      map: new THREE.TextureLoader().load("./Images/wall.jpg"),
    })
  );
  planeRight.position.x = 200;
  planeRight.position.y = 5;
  planeRight.rotateY(-Math.PI / 2);
  scene.add(planeRight);

  const planeLeft = new THREE.Mesh(
    boxgeo,
    new THREE.MeshLambertMaterial({
      color: 0x808080,
      map: new THREE.TextureLoader().load("./Images/wall.jpg"),
    })
  );
  planeLeft.position.x = -200;
  planeLeft.position.y = 5;
  planeLeft.rotateY(Math.PI / 2);
  scene.add(planeLeft);

  blockPlane.position.set(pos.x, pos.y, pos.z);
  blockPlane.scale.set(scale.x, scale.y, scale.z);
  blockPlane.castShadow = true;
  blockPlane.receiveShadow = true;
  scene.add(blockPlane);

  // STOVE

  const ageometry = new THREE.PlaneGeometry(35, 35);
  const cirgeometry = new THREE.CircleGeometry(14.8, 400);
  const incirgeometry = new THREE.CircleGeometry(14.5, 400);

  const first = new THREE.Mesh(
    ageometry,
    new THREE.MeshLambertMaterial({ color: 0x000000 })
  );
  const circle = new THREE.Mesh(
    cirgeometry,
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  const incircle = new THREE.Mesh(
    incirgeometry,
    new THREE.MeshLambertMaterial({ color: 0xf0f0f0 })
  );

  first.position.x = -13.9;
  first.position.y = -2.5;
  first.position.z = 5;
  // circle.position.x = -13.9;
  // circle.position.y = -2;
  // circle.position.z = 5;

  incircle.position.x = -13.9;
  incircle.position.y = -1.7;
  incircle.position.z = 5;
  first.rotateX(-Math.PI / 2);

  circle.rotateX(-Math.PI / 2);
  incircle.rotateX(-Math.PI / 2);

  scene.add(first);
  // scene.add(circle);
  scene.add(incircle);

  const objLoader = new FBXLoader();

  // Position t place model in teapot

  const geomet = new THREE.PlaneGeometry(25, 30);
  const area = new THREE.Mesh(
    geomet,
    new THREE.MeshLambertMaterial({
      color: 0xffffff,
      // opacity: 0.9,
      // transparent: true,
      map: new THREE.TextureLoader().load("./Images/placement.png"),
    })
  );
  area.position.x = 5;
  area.position.y = 22;
  area.position.z = 1;
  // scene.add(area);
  area.name = "AREA";
  components.push(area);

  //Switch

  const swit = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.7, 2),
    new THREE.MeshLambertMaterial({
      color: 0xff0000,
    })
  );
  swit.position.x = 0;
  swit.position.y = 0;
  swit.position.z = 25;
  swit.name = "SWITCH";
  swit.state = "off";
  components.push(swit);
  scene.add(swit);

  document.addEventListener("click", function () {
  });

  //CUP

  objLoader.loadAsync("./Models/cup.fbx").then((group) => {
    const cup = group;

    cup.position.x = 20;
    cup.position.y = -4.5;
    cup.position.z = 20;
    cup.scale.set(1, 1, 1);
    cup.rotateY(Math.PI / 5);
    cup.castShadow = true;
    cup.receiveShadow = true;
    cup.name = "CUP";
    console.log(cup.position);
    cup.userData.isDraggable = false;

    scene.add(cup);
    components.push(cup);
    count++;
  });

  //WATER

  objLoader.loadAsync("./Models/jug_anim.fbx").then((group) => {
    const water = group;
    waterMixer = new THREE.AnimationMixer(group);
    mixers.push(waterMixer);
    water.position.x = 87;
    water.position.y = -4.5;
    water.position.z = 10;
    water.scale.set(0.1, 0.2, 0.1);
    water.rotateY(-2*Math.PI/4 );
    water.castShadow = true;
    water.receiveShadow = true;
    water.name = "WATER";
    console.log(water.position);
    water.userData.isDraggable = false;
    const action = waterMixer.clipAction(group.animations[1]);
    // action.play();
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    waterMixer.addEventListener("finished", () => {
      water.position.x = -52;
      water.position.y = -4.0;
      water.position.z = 5;
      water.rotation.y=5;

      let mytext = "step 5 -Add sugar as per your preference and stir well";

      document.getElementById("info").style.transform = "translateY(-200px)";
      setTimeout(() => {
        document.getElementById("info").innerHTML = mytext;
        document.getElementById("info").style.transform = "translateY(0px)";
      }, 1500);
    });
    actions.push({ item: "WATER", action: action });

    modelReadyCount += 1;
    scene.add(water);
    components.push(water);
    count++;
  });

  //COFFEE
  objLoader.loadAsync("./Models/coffee_anim.fbx").then((group) => {
    const coffee = group;
    coffeeMixer = new THREE.AnimationMixer(group);
    mixers.push(coffeeMixer);
    coffee.position.x = 105;
    coffee.position.y = -4.5;
    coffee.position.z = 15;
    coffee.scale.set(0.1, 0.1, 0.1);
    coffee.rotateY((4 * Math.PI) / 3);
    const action = coffeeMixer.clipAction(group.animations[1]);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    coffeeMixer.addEventListener("finished", () => {
      // scene.remove(coffee);
      coffee.position.x = -95;
      coffee.position.y = -4.5;
      coffee.position.z = 15;
      coffee.rotation.y = 17;

      document.getElementById("info").style.transform = "translateY(-200px)";
    });
    // action.play();
    actions.push({ item: "COFFEE", action: action });
    modelReadyCount += 1;
    coffee.name = "COFFEE";
    coffee.castShadow = true;
    coffee.receiveShadow = true;
    coffee.userData.isDraggable = false;

    scene.add(coffee);
    components.push(coffee);

    count++;
  });

  //SUGAR

  objLoader.loadAsync("./Models/sugar_anim.fbx").then((group) => {
    const sugar = group;
    sugarMixer = new THREE.AnimationMixer(group);
    mixers.push(sugarMixer);

    sugar.position.x = 60;
    sugar.position.y = -4.5;
    sugar.position.z = 15;
    sugar.scale.set(0.1, 0.1, 0.1);
    sugar.rotation.y = 9;
    sugar.castShadow = true;
    sugar.receiveShadow = true;
    const action = sugarMixer.clipAction(group.animations[1]);
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    sugarMixer.addEventListener("finished", () => {
      sugar.position.x = -70;
      sugar.position.y = -4.5;
      sugar.position.z = 15;
      sugar.rotation.y = 4;
      let mytext = "Wait until your coffee gets ready!!";
      document.getElementById("info").style.transform = "translateY(-200px)";
      setTimeout(() => {
        document.getElementById("info").innerHTML = mytext;
        document.getElementById("info").style.transform = "translateY(0px)";
        var audio3 = new Audio("./Audios/boiling2.mp3");
        var audio = new Audio("./Audios/CoffeeReady.mp3");
        audio.play();
        audio3.play();
      }, 3000);
      let mytext2 = "Your Coffee is ready to serve !! Enjoy";
      document.getElementById("info").style.transform = "translateY(-200px)";
      setTimeout(() => {
        document.getElementById("info").innerHTML = mytext2;
        document.getElementById("info").style.transform = "translateY(0px)";
        var audio2 = new Audio("./Audios/ServeCoffee.mp3");
        audio2.play();
        area.position.x = 30;
        area.position.y = 17;
        scene.add(area);
      }, 8000);
      let mytext3 = "Now, move the kettle to transfer it to the cup";
      document.getElementById("info").style.transform = "translateY(-200px)";
      setTimeout(() => {
        document.getElementById("info").innerHTML = mytext3;
        document.getElementById("info").style.transform = "translateY(0px)";
        var audio2 = new Audio("./Audios/cupReady.mp3");
        audio2.play();
        area.position.x = 30;
        area.position.y = 17;
        scene.add(area);
      }, 10000);
    });
    // action.play();
    actions.push({ item: "SUGAR", action: action });
    modelReadyCount += 1;

    sugar.name = "SUGAR";
    sugar.userData.isDraggable = false;

    scene.add(sugar);
    components.push(sugar);
    count++;
  });

  //KETTLE

  objLoader.loadAsync("./Models/kettleA.fbx").then((group) => {
    const kettle = group;
    kettleMixer = new THREE.AnimationMixer(group);
    mixers.push(kettleMixer);
    kettle.position.x = 40;
    kettle.position.y = -4.5;
    kettle.position.z = 10;
    kettle.scale.set(0.8, 0.8, 0.8);

    const action = kettleMixer.clipAction(group.animations[1]);

    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    actions.push({ item: "KETTLE", action: action });
    modelReadyCount += 1;
    kettle.userData.isDraggable = true;
    kettle.name = "KETTLE";
    scene.add(kettle);
    components.push(kettle);
    count++;
  });

  //MILK

  objLoader.loadAsync("./Models/milk_anim.fbx").then((group) => {
    const milk = group;
    milkMixer = new THREE.AnimationMixer(group);
    mixers.push(milkMixer);

    milk.position.x = 76;
    milk.position.y = -4.0;
    milk.position.z = 8;
    milk.rotation.y = 4;
    milk.scale.set(0.08, 0.09, 0.07);
    milk.userData.isDraggable = false;
    // console.log(group.animations);
    const action = milkMixer.clipAction(group.animations[0]);
    // action.play();
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    milkMixer.addEventListener("finished", () => {
      milk.position.x = -52;
      milk.position.y = -4.0;
      milk.position.z = 5;
      milk.rotation.y = 5;

      let mytext = "step 5 -Add sugar as per your preference and stir well";

      document.getElementById("info").style.transform = "translateY(-200px)";
      setTimeout(() => {
        document.getElementById("info").innerHTML = mytext;
        document.getElementById("info").style.transform = "translateY(0px)";
      }, 1500);
    });
    actions.push({ item: "MILK", action: action });

    modelReadyCount += 1;
    milk.castShadow = true;
    milk.receiveShadow = true;
    milk.name = "MILK";
    scene.add(milk);
    components.push(milk);
    count++;
  });

  const table = new THREE.Mesh(
    new THREE.BoxGeometry(40, 50, 220),
    new THREE.MeshLambertMaterial({
      color: 0xd6c79f,
      map: new THREE.TextureLoader().load("/Images/woooden.jpg"),
    })
  );

  table.position.x = 0;
  table.position.y = -30;
  table.position.z = 5;

  table.rotateY(Math.PI / 2);
  scene.add(table);

  const tabletop = new THREE.Mesh(
    new THREE.BoxGeometry(42, 2, 235),
    new THREE.MeshLambertMaterial({
      color: 0x836633,
    })
  );
  tabletop.position.x = 0;
  tabletop.position.y = -5;
  tabletop.position.z = 5;

  tabletop.rotateY(Math.PI / 2);
  scene.add(tabletop);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  setInterval(function () {
    if (globalvariable.flag == 0) {
      components.find(
        (obj) => obj.name == "KETTLE"
      ).userData.isDraggable = false;
    } else if (globalvariable.flag == 1) {
      components.find(
        (obj) => obj.name == "KETTLE"
      ).userData.isDraggable = true;
    }
  });
  render();
}
var count = 0;
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (modelReadyCount == 5) {
    // mixer.update(clock.getDelta());
    //   for ( var i = 0; i < mixers.length;  i ++ ) {

    //     mixers[ i ].update( clock.getDelta() );
    // }
    const t = clock.getDelta();
    coffeeMixer.update(t);
    kettleMixer.update(t);
    sugarMixer.update(t);
    milkMixer.update(t);
    waterMixer.update(t);
  }

  render();
}

animate();

function render() {
  renderer.render(scene, camera);
  // requestAnimationFrame(render);
  if (count == 6) {
    controls = new DragControls(
      [...components],
      scene,
      actions,
      camera,
      renderer.domElement
    );
    count = -1;
    // actions[2].action.play();
    // actions[1].action.play();

    console.log(actions);
  }
}
