import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import Stats from "https://cdn.jsdelivr.net/npm/three@0.125/examples/jsm/libs/stats.module.js";

let	scene, renderer, clock, container, stats, windowWidth, windowHeight /*controlPanelHeight*/
const setupScene = () => {

	container = document.getElementById("threeCanvas");
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setClearColor( 0xffffff, 0 )
	clock = new THREE.Clock();
	scene = new THREE.Scene();
	stats = new Stats();
	renderer.setPixelRatio(window.devicePixelRatio);
	windowWidth = window.innerWidth
	windowHeight = window.innerHeight
	renderer.setSize(windowWidth, windowHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;

	container.appendChild(renderer.domElement);
	container.appendChild(stats.dom);

	//controlPanelHeight = $('#controlPanel').height()
	//resizeFrame()

	//if (showAxesHelper) {
		//const axesHelper = new THREE.AxesHelper( 5 );
		//scene.add( axesHelper );
	//}


	window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
	windowWidth = window.innerWidth
	windowHeight = window.innerHeight
	//controlPanelHeight = $('#controlPanel').height()
	//resizeFrame()
	camera.aspect = windowWidth / windowHeight;
	cameraMe.aspect = windowWidth / windowHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(windowWidth, windowHeight);
}

//function resizeFrame() {
	//$('#frameLeft').css({
		//"bottom": controlPanelHeight + "px",
		//"left": 0.37*windowWidth + "px",
		//"height": 0.25*windowHeight + "px",
	//})
	//$('#frameRight').css({
		//"bottom": controlPanelHeight + "px",
		//"right": 0.37*windowWidth + "px",
		//"height": 0.25*windowHeight + "px",
	//})
	//$('#frameTop').css({
		//"bottom": controlPanelHeight + windowHeight*0.25 + "px",
		//"right": 0.37*windowWidth + "px",
		//"left": 0.37*windowWidth + "px",
		//"height": 0.005*windowWidth + "px",
	//})
	//$('#frameLeftSkew').css({
		//"bottom": controlPanelHeight + "px",
		//"left": 0.365*windowWidth + "px",
		//"height": 0.25*windowHeight + 0.005*windowWidth + "px",
	//})
	//$('#frameRightSkew').css({
		//"bottom": controlPanelHeight + "px",
		//"right": 0.365*windowWidth + "px",
		//"height": 0.25*windowHeight + 0.005*windowWidth + "px",
	//})
//}

export { setupScene, scene, renderer, clock, container, stats, windowWidth, windowHeight, onWindowResize }
