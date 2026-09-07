import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const starVertexShader = `
    attribute float aSize;
    attribute float aPhase;
    attribute float aSpeed;
    attribute vec3 aColor;
    varying float vTwinkle;
    varying vec3 vColor;
    uniform float uTime;
    void main() {
        vTwinkle = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * aSpeed + aPhase));
        vColor = aColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const starFragmentShader = `
    varying float vTwinkle;
    varying vec3 vColor;
    void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d) * vTwinkle;
        gl_FragColor = vec4(vColor, alpha);
    }
`;

function makeStarField(count, radiusMin, radiusMax, sizeMin, sizeMax, palette, blending) {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const r = radiusMin + Math.random() * (radiusMax - radiusMin);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        sizes[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
        phases[i] = Math.random() * Math.PI * 2;
        speeds[i] = 0.25 + Math.random() * 1.3;

        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: blending || THREE.NormalBlending
    });

    return new THREE.Points(geo, mat);
}

function makeGalaxy(count, armCount, spread, size, colorA, colorB) {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const t = Math.random();
        const arm = i % armCount;
        const angle = t * Math.PI * 4 + arm * ((Math.PI * 2) / armCount);
        const radius = t * spread * (0.4 + Math.random() * 0.6);
        const wobble = (Math.random() - 0.5) * spread * 0.15;

        positions[i * 3] = Math.cos(angle) * radius + wobble;
        positions[i * 3 + 1] = Math.sin(angle) * radius + wobble;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.12;

        sizes[i] = size * (0.5 + Math.random());
        phases[i] = Math.random() * Math.PI * 2;
        speeds[i] = 0.12 + Math.random() * 0.3;

        const mix = Math.random();
        colors[i * 3] = colorA[0] * (1 - mix) + colorB[0] * mix;
        colors[i * 3 + 1] = colorA[1] * (1 - mix) + colorB[1] * mix;
        colors[i * 3 + 2] = colorA[2] * (1 - mix) + colorB[2] * mix;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geo, mat);
}

// large, soft, near-static glow blobs for atmospheric depth between galaxies
function makeNebula(count, spread, size, color) {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;
        sizes[i] = size * (0.7 + Math.random() * 0.6);
        phases[i] = Math.random() * Math.PI * 2;
        speeds[i] = 0.05 + Math.random() * 0.08;
        colors[i * 3] = color[0];
        colors[i * 3 + 1] = color[1];
        colors[i * 3 + 2] = color[2];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.5
    });

    return new THREE.Points(geo, mat);
}

export default function SpaceBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1200);
        camera.position.set(0, 0, 60);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        const starPalette = [
            [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1],
            [0.96, 0.94, 0.89],
            [0.72, 0.62, 0.96],
            [0.96, 0.76, 0.56]
        ];

        // three depth layers — far is dense/small, near is sparse/bigger, all twinkling
        const farStars = makeStarField(5200, 120, 500, 0.6, 1.8, starPalette, THREE.NormalBlending);
        const midStars = makeStarField(1900, 55, 220, 1.1, 2.6, starPalette, THREE.NormalBlending);
        const nearStars = makeStarField(650, 20, 90, 1.8, 3.4, starPalette, THREE.NormalBlending);

        const starGroup = new THREE.Group();
        starGroup.add(farStars, midStars, nearStars);
        scene.add(starGroup);

        // nebula glow — soft atmosphere behind the galaxies
        const nebulaA = makeNebula(40, 260, 90, [0.35, 0.16, 0.55]);
        nebulaA.position.set(-60, 30, -320);
        scene.add(nebulaA);
        const nebulaB = makeNebula(35, 220, 80, [0.5, 0.28, 0.18]);
        nebulaB.position.set(80, -40, -350);
        scene.add(nebulaB);

        // four galaxies, varied palettes, positions, and scales
        const galaxyGroup = new THREE.Group();

        const galaxyA = makeGalaxy(1100, 3, 46, 2.6, [0.55, 0.24, 0.91], [0.29, 0.56, 0.91]);
        galaxyA.position.set(-75, 45, -220);
        galaxyA.rotation.x = 0.5;
        galaxyGroup.add(galaxyA);

        const galaxyB = makeGalaxy(850, 2, 34, 2.2, [0.95, 0.63, 0.24], [0.95, 0.39, 0.31]);
        galaxyB.position.set(95, -50, -260);
        galaxyB.rotation.x = -0.4;
        galaxyB.rotation.z = 1.1;
        galaxyGroup.add(galaxyB);

        const galaxyC = makeGalaxy(700, 4, 28, 1.9, [0.29, 0.56, 0.91], [0.55, 0.24, 0.91]);
        galaxyC.position.set(-30, -70, -400);
        galaxyC.rotation.x = 0.9;
        galaxyC.rotation.z = -0.6;
        galaxyGroup.add(galaxyC);

        const galaxyD = makeGalaxy(600, 2, 24, 2.0, [0.95, 0.39, 0.31], [0.95, 0.63, 0.24]);
        galaxyD.position.set(60, 70, -340);
        galaxyD.rotation.x = -0.7;
        galaxyGroup.add(galaxyD);

        scene.add(galaxyGroup);

        // shooting stars — bigger pool, varied color/speed for a livelier sky
        const SHOOT_COUNT = 8;
        const shootColors = [0xfff6ec, 0xbfe0ff, 0xffd9b0];
        const shootingStars = [];
        for (let i = 0; i < SHOOT_COUNT; i++) {
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
            const mat = new THREE.LineBasicMaterial({
                color: shootColors[i % shootColors.length],
                transparent: true,
                opacity: 0
            });
            const line = new THREE.Line(geo, mat);
            line.visible = false;
            scene.add(line);
            shootingStars.push({
                mesh: line,
                active: false,
                t: 0,
                duration: 1,
                start: new THREE.Vector3(),
                end: new THREE.Vector3(),
                nextSpawn: Math.random() * 3
            });
        }

        function spawnShootingStar(s) {
            const startX = -50 + Math.random() * 30;
            const startY = 20 + Math.random() * 20;
            const z = -25 - Math.random() * 50;
            s.start.set(startX, startY, z);
            s.end.set(startX + 40 + Math.random() * 25, startY - 28 - Math.random() * 18, z);
            s.t = 0;
            s.duration = 0.7 + Math.random() * 0.6;
            s.active = true;
            s.mesh.visible = true;
        }

        // scroll + mouse parallax
        let scrollFrac = 0;
        function updateScrollFrac() {
            const max = document.body.scrollHeight - window.innerHeight;
            scrollFrac = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        }
        window.addEventListener('scroll', updateScrollFrac, { passive: true });
        updateScrollFrac();

        let mouseX = 0;
        let mouseY = 0;
        function onMouseMove(e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }
        window.addEventListener('mousemove', onMouseMove);

        let camZ = 60;
        const clock = new THREE.Clock();
        let frameId;

        function animate() {
            frameId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            const dt = clock.getDelta();

            farStars.material.uniforms.uTime.value = t;
            midStars.material.uniforms.uTime.value = t;
            nearStars.material.uniforms.uTime.value = t;
            nebulaA.material.uniforms.uTime.value = t;
            nebulaB.material.uniforms.uTime.value = t;
            galaxyA.material.uniforms.uTime.value = t;
            galaxyB.material.uniforms.uTime.value = t;
            galaxyC.material.uniforms.uTime.value = t;
            galaxyD.material.uniforms.uTime.value = t;

            // continuous ambient drift, plus scroll adds extra rotation on top
            starGroup.rotation.y = t * 0.012 + scrollFrac * Math.PI * 0.6;
            starGroup.rotation.x = scrollFrac * 0.15;

            galaxyGroup.rotation.y = t * 0.01;
            galaxyA.rotation.z += 0.0006;
            galaxyB.rotation.z -= 0.0005;
            galaxyC.rotation.z += 0.0004;
            galaxyD.rotation.z -= 0.0007;

            const targetZ = 60 - scrollFrac * 42;
            camZ += (targetZ - camZ) * 0.04;
            camera.position.z = camZ;
            camera.position.x += (mouseX * 6 - camera.position.x) * 0.03;
            camera.position.y += (-mouseY * 4 - camera.position.y) * 0.03;
            camera.lookAt(0, 0, 0);

            shootingStars.forEach((s) => {
                if (!s.active) {
                    s.nextSpawn -= dt;
                    if (s.nextSpawn <= 0) spawnShootingStar(s);
                    return;
                }
                s.t += dt / s.duration;
                if (s.t >= 1) {
                    s.active = false;
                    s.mesh.visible = false;
                    s.mesh.material.opacity = 0;
                    s.nextSpawn = 1.5 + Math.random() * 4;
                    return;
                }
                const head = s.start.clone().lerp(s.end, s.t);
                const tailT = Math.max(0, s.t - 0.08);
                const tail = s.start.clone().lerp(s.end, tailT);
                const posAttr = s.mesh.geometry.attributes.position;
                posAttr.setXYZ(0, tail.x, tail.y, tail.z);
                posAttr.setXYZ(1, head.x, head.y, head.z);
                posAttr.needsUpdate = true;
                const fade = s.t < 0.15 ? s.t / 0.15 : s.t > 0.8 ? (1 - s.t) / 0.2 : 1;
                s.mesh.material.opacity = Math.max(0, Math.min(1, fade));
            });

            renderer.render(scene, camera);
        }

        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', handleResize);

        if (reduceMotion) {
            renderer.render(scene, camera);
        } else {
            animate();
        }

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('scroll', updateScrollFrac);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            });
        };
    }, []);

    return <canvas ref={canvasRef} id="space-canvas" />;
}
