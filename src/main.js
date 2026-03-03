import * as THREE from 'three';
import { scene, camera, renderer, controls, composer } from "./scene.js";
import {balls} from "./balls.js";
import { updatePhysics } from "./physics.js";
import { cue } from "./cue.js";
import { updateTurn } from "./game.js";
import { updateRayCast } from "./raycast.js";

const clock = new THREE.Clock();;
let lines = [];
// Animation loop
function animate() {
    requestAnimationFrame(animate);

    let deltaTime = clock.getDelta();   

    updatePhysics(deltaTime); // physics update
    updateTurn();

    
    if (balls[0].ball.velocity.length() == 0) {
        
        lines = updateRayCast(lines);        
    }
    
    controls.update();
    composer.render();
}

// Start animation
animate();

// Handle resizing
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
