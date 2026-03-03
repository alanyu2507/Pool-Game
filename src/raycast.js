import * as THREE from 'three';
import { balls } from "./balls.js";
import { scene } from "./scene.js";
import { cue } from "./cue.js";
import { calculateCollision } from './physics.js';

export function updateRayCast(oldLines) {
    let lines = [];

    // Remove old prediction lines safely
    oldLines.forEach(line => scene.remove(line));

    // Create a Raycaster
    const raycaster = new THREE.Raycaster();
    const maxLength = 10;
    let start = balls[0].ball.position;
    let direction = start.clone().sub(cue.position.clone()).normalize();
    raycaster.set(start, direction.clone().normalize());

    // Perform the intersection test with only the balls
    const intersects = raycaster.intersectObjects(balls.map(ball => ball.ball), true);

    let end;
    if (intersects.length > 0) {
        end = intersects[0].point;
    } else {
        end = start.clone().add(direction.clone().multiplyScalar(maxLength));
    }

    // Draw initial shot prediction line
    let geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const material2 = new THREE.LineBasicMaterial({ color: 0x000000 });

    let line = new THREE.Line(geometry, material);
    scene.add(line);
    lines.push(line);

    // If no intersection, return
    if (intersects.length === 0) return lines;

    // Create a simulation of the collision
    let hitBall = intersects[0].object;
    let ball1Velocity = direction.clone().normalize();
    let ball2Velocity = hitBall.velocity.clone().normalize();
    let whiteBallStart = end.clone().add(direction.clone().normalize().multiplyScalar(-0.0286));

    let { v1New, v2New } = calculateCollision(
        { position: whiteBallStart, velocity: ball1Velocity },
        { position: hitBall.position.clone(), velocity: ball2Velocity }
    );

    

    // Draw post-collision paths
    
    
    let predictedEnd1 = whiteBallStart.clone().add(v1New.clone().multiplyScalar(0.3));
    let predictedEnd2 = end.clone().add(v2New.clone().multiplyScalar(0.3));

    geometry = new THREE.BufferGeometry().setFromPoints([whiteBallStart, predictedEnd1]);
    line = new THREE.Line(geometry, material);
    scene.add(line);
    lines.push(line);

    geometry = new THREE.BufferGeometry().setFromPoints([hitBall.position.clone(), predictedEnd2]);
    line = new THREE.Line(geometry, material2);
    scene.add(line);
    lines.push(line);

    return lines;
}