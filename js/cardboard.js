navigator.getUserMedia = (
	navigator.getUserMedia || 
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia
);

var videoA = document.getElementById("videoA");
var videoB = document.getElementById("videoB");
var mediaStream;
var streaming;

var imgCount = 0;

$(document).ready(function() {
	if (!navigator.getUserMedia) {
		alert("Sorry - your browser does not support getUserMedia - try Chrome or Firefox");
	}
			
	$("body").on('click', "#start_button", function(e) {
		e.preventDefault();
		navigator.getUserMedia({
			video: true,
			audio: false
		},
		function(stream) {
			if (navigator.mozGetUserMedia) {
				videoA.mozSrcObject = stream;
				videoB.mozSrcObject = stream;
			} else {
				var url = window.URL || window.webkitURL;
				var src = url ? url.createObjectURL(stream) : stream;
				console.log(src);
				videoA.src = src;
				videoB.src = src;
			}
			mediaStream = stream;
			videoA.play();
			videoB.play();
		},
		function(error) {
			console.log("ERROR: " + error);
		});
	});

	$("#stop_button").click(function(e) {
		videoA.pause();
		videoB.pause();
		mediaStream.getTracks().forEach(e => {
			e.stop();
		});
		mediaStream = null;
	});

	$("video").on('canplay', function(e) {
		if (!streaming) {
			videoA.setAttribute('width', window.innerWidth);;
			videoA.setAttribute('height', window.innerHeight);
			videoB.setAttribute('width', window.innerWidth);;
			videoB.setAttribute('height', window.innerHeight);
			streaming = true;
		}
	});

	$("button").mousedown(function() {
		$(this).addClass("iampressed");
	});

	$("button").mouseup(function() {
		$(this).removeClass("iampressed");
	});
});

var width = window.innerWidth;
var height = window.innerHeight;

var scene = new THREE.Scene();
var cameraA = new THREE.PerspectiveCamera(50, width * 2 / height, 0.1, 1000);
var cameraB = new THREE.PerspectiveCamera(50, width * 2 / height, 0.1, 1000);

var rendererA = new THREE.WebGLRenderer();
rendererA.setSize(width, height / 2);
rendererA.setClearColor(0x000000, 0);
document.body.appendChild(rendererA.domElement);

var rendererB = new THREE.WebGLRenderer();
rendererB.setSize(width, height / 2);
rendererB.setClearColor(0x000000, 0);
document.body.appendChild(rendererB.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var texture = new THREE.TextureLoader().load("textures/troll.jpg");
var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture})
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cameraA.position.z = 3;
cameraB.position.z = 2;
cameraB.position.x = 1;
cameraB.rotation.y = 1;

var render = function() {
	requestAnimationFrame(render);

	cube.rotation.x += 0.05;
	cube.rotation.y += 0.05;

	rendererA.render(scene, cameraA);
	rendererB.render(scene, cameraB);
}

render();

