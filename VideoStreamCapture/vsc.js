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
