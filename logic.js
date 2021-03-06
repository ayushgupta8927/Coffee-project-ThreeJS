import globalvariable from "./GlobalVariable.js";

let flag = 0;
let ItemSelected;
let kettleVar=0;
function init(object, scene, objectList, animationList) {
  // console.log(flag);
  // console.log(objectList);
  console.log(animationList);
  if (object.name == "KETTLE") {
    console.log(object.position);
    if (
      object.position.x > -20 &&
      object.position.x < -10 &&
      object.position.y < -1 &&
      kettleVar==0

    ) {
      kettleVar++;
      globalvariable.flag=0;
      object.userData.isDraggable = false;
      if (flag == 0) {
        let mytext = " Step 3 - add coffee to the kettle";
        document.getElementById("info").style.transform = "translateY(-200px)";
        setTimeout(() => {
          document.getElementById("info").innerHTML = mytext;
          document.getElementById("info").style.transform = "translateY(0px)";
        }, 2000);

        objectList.find(
          (obj) => obj.name == "COFFEE"
        ).userData.isDraggable = true;
        play("./Audios/kettleJOin.mp3");
        scene.add(objectList.find((obj) => obj.name == "AREA"));
        // document.getElementById('item-tobeplaced-area').style.display='block';
        flag = 1;
      }
    }
    console.log(object.position);
    if (
      flag == 1 &&
      object.position.x > 20 &&
      object.position.x < 30 &&
      object.position.y < 20 &&
      object.position.y > 8
    ) {
      // console.log(animationList);
      animationList.find((obj) => obj.item == "KETTLE").action.play();
      play("./Audios/PouringCoffee.mp3");
      setTimeout(() => {
        // scene.remove(objectList.find((obj) => obj.name == "KETTLE"));
        scene.remove(objectList.find((obj) => obj.name == "AREA"));
      }, 3500);
      // (objectList.find((obj) => obj.name == "KETTLE")).position.x = 40;
      // (objectList.find((obj) => obj.name == "KETTLE")).position.y = -4.5;
      // (objectList.find((obj) => obj.name == "KETTLE")).position.z = 10;
      setTimeout(() => {
        // scene.add('KETTLE')
        objectList.find((obj) => obj.name == "KETTLE").position.x = 40;
        objectList.find((obj) => obj.name == "KETTLE").position.y = -4.5;
        objectList.find((obj) => obj.name == "KETTLE").position.z = 10;
        // var img = document.createElement('img');
        //     img.src = "./Images/confetti.gif" ;
        //     img.width="700px";
        //     img.height="700px";

        //     document.getElementById('body').appendChild(img);
        document.getElementById('congratulations').style.display='block';
        play("./Audios/Congratulations.mp3");
        setTimeout(()=>{
          document.getElementById('congratulations').style.display='none';

        },2000);


      }, 5000);
      document.getElementById("info").style.display = "none";
      console.log("playing kettle animation");
    }
  }
  if (object.name == "COFFEE") {
    console.log(object.position);
    if (
      object.position.x > -1 &&
      object.position.x < 10 &&
      object.position.y < 14
    ) {
      // console.log(object.position);
      console.log("playing coffee animation");
      animationList.find((obj) => obj.item == "COFFEE").action.play();
      play("./Audios/addCoffee.mp3");
      setTimeout(() => {
        // -----------------------------------
        document.getElementById("overlay").style.display = "block";
        var ele = document.getElementById("selectedItem").innerHTML;
        console.log(ele);
        setTimeout(() => {
          ele = document.getElementById("selectedItem").innerHTML;
          if (ele == "2") {
            console.log("Water activated");
            objectList.find(
              (obj) => obj.name == "WATER"
            ).userData.isDraggable = true;
            document.getElementById("modelSelectedItem").value = "Water";
            let mytext = `Step 4 - Add ${
              document.getElementById("modelSelectedItem").value
            } in the kettle`;

            document.getElementById("info").innerHTML = mytext;
            document.getElementById("info").style.transform = "translateY(0px)";
          } else {
            objectList.find(
              (obj) => obj.name == "MILK"
            ).userData.isDraggable = true;
            document.getElementById("modelSelectedItem").value = "Milk";
            let mytext = `Step 4 - Add ${
              document.getElementById("modelSelectedItem").value
            } in the kettle`;

            document.getElementById("info").innerHTML = mytext;
            document.getElementById("info").style.transform = "translateY(0px)";
          }
          document.getElementById("overlay").style.display = "none";
        }, 5000); //time for overlay

      }, 4000);
    }
  }

  if (object.name == "MILK") {
    // console.log(object.position);
    if (
      object.position.x > -1 &&
      object.position.x < 10 &&
      object.position.y < 14
    ) {
      console.log(object.position);
      console.log(
        "playing milk animations" +
          animationList.find((obj) => obj.item == "MILK")
      );
      animationList.find((obj) => obj.item == "MILK").action.play();
      play("./Audios/AddMilk.mp3");
      setTimeout(() => {
        objectList.find(
          (obj) => obj.name == "SUGAR"
        ).userData.isDraggable = true;
      }, 4000);
    }
  }
  if (object.name == "WATER") {
    if (
      object.position.x > -1 &&
      object.position.x < 10 &&
      object.position.y < 14
    ) {
      console.log(object.position);
      console.log(
        "playing water animations" +
          animationList.find((obj) => obj.item == "WATER")
      );
      animationList.find((obj) => obj.item == "WATER").action.play();
      play("./Audios/AddWater.mp3");
      setTimeout(() => {
        objectList.find(
          (obj) => obj.name == "SUGAR"
        ).userData.isDraggable = true;
      }, 4000);
    }
  }

  

  if (object.name == "SUGAR") {
    if (
      object.position.x > -1 &&
      object.position.x < 10 &&
      object.position.y < 14
    ) {

      animationList.find((obj) => obj.item == "SUGAR").action.play();
      // objectList.find((obj)=>obj.name == 'TEAPOT').userData.isDraggable=true;
      play("./Audios/addSugar.mp3");
      setTimeout(() => {
        globalvariable.flag=1;
        document.getElementById("info").style.transform = "translateY(-200px)";
      }, 15000);
      scene.remove(objectList.find((obj) => obj.name == "AREA"));
    }
  }


}

function play(path) {
  var audio = new Audio(path);
  audio.play();
}
export { init };
