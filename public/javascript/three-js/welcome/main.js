import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
//import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.125/src/loaders/FontLoader.js';
import { TTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/TTFLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.125/src/geometries/TextGeometry.js';

init();

function init() {
	loadScene()
}

var gltfLoader, model, controls, container, scene, camera, renderer, hemiLight, dirLight
function loadScene() {
	container = document.getElementById("mapCanvas");
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setClearColor( 0xffffff, 0 )
	scene = new THREE.Scene();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	let newCanvas = renderer.domElement
	container.appendChild(newCanvas);
	window.addEventListener("resize", onWindowResize);
	camera = new THREE.PerspectiveCamera(
		65,
		container.clientWidth / container.clientHeight,
		0.01,
		100
	);
	scene.background = new THREE.Color('#2b3e50');
	//scene.background = new THREE.Color('#000000');

	hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
	hemiLight.position.set(0, 20, 0);
	scene.add(hemiLight);

	dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
	dirLight.position.set(3, 20, 10);
	dirLight.castShadow = true;
	scene.add(dirLight);
	
	loadIndividualGLTF();
	addGaeltacht();
	//addText();
}

function loadIndividualGLTF() {

	gltfLoader = new GLTFLoader();
	gltfLoader.load("avatars/ireland-map.glb", function(gltf) {
		model = gltf.scene;
		model.receiveShadow = true;
		scene.add( model );
		camera.position.set(0, 3.5, 4.5)
		camera.lookAt(0, 0.5, 0)
		//controls = new OrbitControls(camera, renderer.domElement);
		//controls.target.set(0, 0.5, 0);
		//controls.update();
		animate()
	})
}

function addGaeltacht() {
	let geometry = new THREE.CylinderGeometry( 0.15, 0.15, 0.025, 32 )
	let material = new THREE.MeshLambertMaterial( { color: 0x11a822 } );
	let cylinder = new THREE.Mesh( geometry, material );
	cylinder.position.y += 0.6
	cylinder.position.x -= 0.7
	cylinder.position.z += 0.3
	scene.add( cylinder );

	let yoyoTween = new TWEEN.Tween(cylinder.scale).to({x: 2.0, y:1.0, z:2.0}, 1500)
	yoyoTween.easing(TWEEN.Easing.Quadratic.InOut)
	yoyoTween.repeat(Infinity)
	yoyoTween.yoyo(true)
	yoyoTween.start()
}

function addText() {
	//const loader = new TTFLoader();
	const fontLoader = new FontLoader();

	fontLoader.load( 'images/celtic-font.json', function ( font ) {
		const geometry = new TextGeometry( 'the Virtual Gaeltacht', {
			font: font,
			size: 0.3,
			height: 0.1,
			//curveSegments: 12,
			//bevelEnabled: true,
			//bevelThickness: 10,
			//bevelSize: 8,
			//bevelOffset: 0,
			//bevelSegments: 5
		} );
		geometry.computeBoundingBox()
		let materials = [
			new THREE.MeshPhongMaterial( { color: 0x008800, flatShading: true } ), // front
			new THREE.MeshPhongMaterial( { color: 0x10530d} ) // side
		];
		let textMesh1 = new THREE.Mesh( geometry, materials )
		textMesh1.position.set(-2.5, 2.0, -0.1)
		textMesh1.rotation.set(0, 0, 0)
		scene.add(textMesh1)
	} );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
	TWEEN.update()
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

//export { animate }
