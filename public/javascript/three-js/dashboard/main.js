import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/loaders/GLTFLoader.js";

init();

function init() {
	loadScene()
	console.log('invitedChat: ', invitedChat)
	if (invitedChat !== 'false') {
		$('#joinChatButtonsContainer').append(
			`<div class="row mt-2">
				<div class="col-sm d-flex justify-content-center">
					<a href="#" data-toggle="modal" data-target="#joinInvitedChatModal" class="btn btn-lg btn-success btn-block">Join ${inviter}'s chat</a>
				</div>
			</div>`
		)
		$('#invitationSentence').html(`You were invited to to join ${invitedChat} by ${inviter}`)
		$('#invitedUrl').val(invitedChat)
	}
	//setUpAvatar();
}

var gltfLoader, model, controls, container, scene, camera, renderer, hemiLight, dirLight
function loadScene() {
	container = document.getElementById("avatarCanvas");
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
		35,
		container.clientWidth / container.clientHeight,
		0.01,
		100
	);
	scene.background = new THREE.Color('#2b3e50');
	//scene.background = new THREE.Color('#000000');

	hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
	hemiLight.position.set(0, 20, 0);
	scene.add(hemiLight);

	dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
	dirLight.position.set(3, 10, 10);
	dirLight.castShadow = false;
	scene.add(dirLight);
	
	loadIndividualGLTF();
}

function loadIndividualGLTF() {

	gltfLoader = new GLTFLoader();
	gltfLoader.load("avatars/" + userName + '.glb', function(gltf) {
		model = gltf.scene;
		scene.add( model );
		let direction = new THREE.Vector3();
		let headPos;
		model.traverse(function(object) {
			if (object.name === "Head") {
				headPos = object.getWorldPosition(direction)
				console.log('headPos: ', headPos)
			}
		})
		camera.position.set(0, headPos.y+0.1, 2.5)
		controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, headPos.y+0.1, 0);
		controls.update();
		animate()
	})
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

//export { animate }
