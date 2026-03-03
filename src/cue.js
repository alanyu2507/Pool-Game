import * as THREE from 'three';
import {balls} from "./balls.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from "./scene.js";
import { PI } from 'three/tsl';



let cue = null;
const loader = new GLTFLoader();
let strength = 3;

loader.load("./Assets/poolcue.glb", function (gltf) {
    cue = gltf.scene;
    cue.rotation.z = -0.1;
    cue.position.set(balls[0].ball.position.x-0.1, balls[0].ball.position.y, balls[0].ball.position.z);
    scene.add(cue);
});

let rotationx = Math.PI/2;
let rotationy = Math.PI/2;
//Controlling cue
document.addEventListener("keydown", (event) => {
    //Rotate left
    if (event.key === "ArrowLeft") {
        cue.rotation.y = cue.rotation.y - 2*Math.PI*0.01;
        rotationx = rotationx - (2*Math.PI*0.01);
        rotationy = rotationy + (2*Math.PI*0.01);
        cue.position.x = balls[0].ball.position.x - 0.1 * Math.sin(rotationx)
        cue.position.z = balls[0].ball.position.z + 0.1 * Math.cos(rotationy)
       
    } 
    //Rotate Right
    else if (event.key === "ArrowRight") {
        cue.rotation.y = cue.rotation.y + 2*Math.PI*0.01;
        rotationx = rotationx + (2*Math.PI*0.01);
        rotationy = rotationy - (2*Math.PI*0.01);
        cue.position.x = balls[0].ball.position.x - 0.1 * Math.sin(rotationx)
        cue.position.z = balls[0].ball.position.z + 0.1 * Math.cos(rotationy)
        
    } else if (event.key === "ArrowDown") {
        cue.rotation.y = cue.rotation.y + 2*Math.PI*0.0001;
        rotationx = rotationx + (2*Math.PI*0.0001);
        rotationy = rotationy - (2*Math.PI*0.0001);
        cue.position.x = balls[0].ball.position.x - 0.1 * Math.sin(rotationx)
        cue.position.z = balls[0].ball.position.z + 0.1 * Math.cos(rotationy)
        
    } else if (event.key === "ArrowUp") {
        cue.rotation.y = cue.rotation.y - 2*Math.PI*0.0001;
        rotationx = rotationx - (2*Math.PI*0.0001);
        rotationy = rotationy + (2*Math.PI*0.0001);
        cue.position.x = balls[0].ball.position.x - 0.1 * Math.sin(rotationx)
        cue.position.z = balls[0].ball.position.z + 0.1 * Math.cos(rotationy)
        
    } 
    

    //Hit ball
    if (event.key === "Enter") {
       let direction = new THREE.Vector3();
       direction.subVectors(balls[0].ball.position, cue.position);
       direction.normalize();
       let force = direction.clone().multiplyScalar(strength)
       balls[0].ball.velocity = force;
    }
});




/*document.addEventListener('click', () => {
    const force = 5;
    const direction = new THREE.Vector3(Math.sin(cue.rotation.y), 0, Math.cos(cue.rotation.y));
    balls[0].velocity.add(direction.multiplyScalar(force));
});*/

export {cue};