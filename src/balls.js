import * as THREE from 'three';
import { scene } from './scene.js';

let balls = [];
const radius = 0.0286;
const xDisplacement = 0.049637;//Used to calculate parent displacement 
const displacementVector = new THREE.Vector3(xDisplacement, 0 , -radius);//Parent displacement vector
const otherBallsDisplacement = new THREE.Vector3(0, 0, radius*2)//Children Horizontal displacement
const startingPosition = new THREE.Vector3(0.4, 0, 0);//First ball starting position
const geometry = new THREE.SphereGeometry(radius, 32, 32);//Ball SHape
const colors = ["#900C3F", "#ffbd33", "#0047AB", "#DAF7A6"];//Ball Colors

//Create an array of emissive materials
const emissiveMaterials = colors.map(color => 
    new THREE.MeshStandardMaterial({ 
        color: 0x222222,  
        emissive: color,  
        emissiveIntensity: 1, 
    })
);

function randomizeBalls() {
    let array = [...Array(7).fill(1), ...Array(7).fill(0)];//Create 7 ones and 7 zeros
    
    for (let i = array.length - 1; i > 0; i--) {//Fisher Yates Shuffling Algorithm
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    array.splice(4, 0, 2);
    
    return array;
}

let ballOrder = randomizeBalls();//Random arrangement of balls

let ballCount = 0;

//Spawn white ball
const ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), emissiveMaterials[3]);//creating ball
const position = new THREE.Vector3(-0.5, 0, 0);
ball.position.copy(position);//parent ball placement
ball.velocity = new THREE.Vector3(0, 0, 0);
let boundingBox = new THREE.Box3().setFromObject(ball);
scene.add(ball);
balls.push({ball, boundingBox});
ballCount++;

//Spawn Color Balls
for (let i = 0; i < 5; i++) {//position
    const ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), emissiveMaterials[ballOrder[ballCount-1]]);//creating ball
    const position = new THREE.Vector3().copy(startingPosition).addScaledVector(displacementVector, i);

    ball.position.copy(position);//parent ball placement
    ball.velocity = new THREE.Vector3(0, 0, 0);
    let boundingBox = new THREE.Box3().setFromObject(ball);
    scene.add(ball);
    balls.push({ball, boundingBox});
    ballCount++;

    for (let j = 1; j <= i; j++){//children balls
        const ball = new THREE.Mesh(geometry, emissiveMaterials[ballOrder[ballCount-1]]);
        const position2 = new THREE.Vector3().copy(position).addScaledVector(otherBallsDisplacement, j)

        ball.position.copy(position2);
        ball.velocity = new THREE.Vector3(0, 0, 0);
        let boundingBox = new THREE.Box3().setFromObject(ball);
        scene.add(ball);
        balls.push({ball, boundingBox}); 
        ballCount++;
    }
}

export {balls};