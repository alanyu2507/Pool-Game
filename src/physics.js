import * as THREE from 'three';
import { balls } from "./balls.js";
import { scene } from './scene.js';
// Function to check for collisions
// Calculates the new velocity vectors without applying them immediately
export function calculateCollision(ball1, ball2) {
    let diff = ball1.position.clone().sub(ball2.position);
    let normal = diff.clone().normalize();

    let relativeVelocity = ball1.velocity.clone().sub(ball2.velocity);
    let speedAlongNormal = relativeVelocity.dot(normal);

    if (speedAlongNormal > 0) return { v1New: ball1.velocity, v2New: ball2.velocity }; // Ignore if moving apart

    let v1n = normal.clone().multiplyScalar(ball1.velocity.dot(normal));
    let v2n = normal.clone().multiplyScalar(ball2.velocity.dot(normal));

    let v1t = ball1.velocity.clone().sub(v1n);
    let v2t = ball2.velocity.clone().sub(v2n);

    let v1New = v2n.add(v1t);
    let v2New = v1n.add(v2t);

    return { v1New, v2New };
}

function checkCollisions(deltaTime) {
    let newVelocities = new Map(); // Store new velocities temporarily
    let collisionDeltaTime = deltaTime * 0.5;

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let ball1 = balls[i].ball;
            let ball2 = balls[j].ball;

            // Calculate current distance
            let currentDistance = ball1.position.distanceTo(ball2.position);
            let minDistance = 0.0286 + 0.0286;

            // Only use future positions for fast-moving balls
            let useFutureCheck = ball1.velocity.length() > 0.1 || ball2.velocity.length() > 0.1;

            let futureDistance;
            
            if (useFutureCheck) {
                // Predict future positions only for fast-moving balls
                let futurePosition1 = ball1.position.clone().add(ball1.velocity.clone().multiplyScalar(collisionDeltaTime));
                let futurePosition2 = ball2.position.clone().add(ball2.velocity.clone().multiplyScalar(collisionDeltaTime));
                futureDistance = futurePosition1.distanceTo(futurePosition2);
            } else {
                // Use current positions for slow-moving balls
                futureDistance = currentDistance;
            }

            // Collision check
            if (futureDistance < minDistance) {
                let { v1New, v2New } = calculateCollision(ball1, ball2);

                newVelocities.set(ball1, v1New);
                newVelocities.set(ball2, v2New);
            }
        }
    }

    // Apply new velocities after all collision checks
    newVelocities.forEach((velocity, ball) => {
        ball.velocity.copy(velocity);
    });
}

const boundingBoxes = [];
const boxSize = new THREE.Vector3(0.07, 0.07, 0.07);  // Set box dimensions

// Array of designated positions
const positions = [
    new THREE.Vector3(1.12, 0, 0.6),   // Position 1
    new THREE.Vector3(-1.12, 0, 0.6),  // Position 2
    new THREE.Vector3(1.12, 0, -0.6),  // Position 3
    new THREE.Vector3(-1.12, 0, -0.6), // Position 4
    new THREE.Vector3(0.0, 0, 0.64),   // Position 5
    new THREE.Vector3(0.0, 0, -0.64)   // Position 6
];

positions.forEach((pos) => {
    // Create invisible bounding box
    const bbox = new THREE.Box3().setFromCenterAndSize(pos, boxSize);
    boundingBoxes.push(bbox);

    // For visualization: create a visible mesh
    const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }); // Red wireframe
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    // Set position of the visible box mesh
    boxMesh.position.copy(pos);
    scene.add(boxMesh);
});

function checkSunk (boundingBox) {
    for (let i = 0; i < boundingBoxes.length; i++) {
        
        let hole = boundingBoxes[i];
        let ball = boundingBox;

        if (hole.intersectsBox(ball)) {
            return true;
            
        }  
    }

    return false;
}

export function updatePhysics(deltaTime) {
    for (let i = balls.length - 1; i >= 0; i--) {  // Iterate in reverse to avoid index issues
        const { ball, boundingBox } = balls[i];
        
        ball.position.add(ball.velocity.clone().multiplyScalar(deltaTime));
        boundingBox.setFromObject(ball);
    
        // Apply friction
        ball.velocity.multiplyScalar(0.985);
    
        // Threshold
        if (ball.velocity.length() < 0.01) {
            ball.velocity.set(0, 0, 0);
        }
    
        // Collision with table walls
        if (ball.position.x > 1.1014 || ball.position.x < -1.1014) {
            ball.velocity.x = ball.velocity.x * -1;
        }
        if (ball.position.z > 0.57313 || ball.position.z < -0.57313) {
            ball.velocity.z = ball.velocity.z * -1;
        }
    
    
        // Collision with other balls
        checkCollisions(deltaTime);
    
        // Remove ball if sunk
        if (checkSunk(boundingBox)) {
            scene.remove(ball);
            console.log("removed");
            if (i == 0){
                scene.add(ball);
                ball.position.set(-0.5, 0, 0);
                ball.velocity = new THREE.Vector3(0, 0, 0);
            } else {
                balls.splice(i, 1);
            }            
                      
        }
    }
}
