navigator.getUserMedia = (
	navigator.getUserMedia || 
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia
);

var video = document.querySelector('video');
var width = 480;
var height = 0;
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
				video.mozSrcObject = stream;
			} else {
				var url = window.URL || window.webkitURL;
				video.src = url ? url.createObjectURL(stream) : stream;
			}
			mediaStream = stream;
			video.play();
		},
		function(error) {
			console.log("ERROR: " + error);
		});
	});

	$("#stop_button").click(function(e) {
		video.pause();
		mediaStream.getTracks().forEach(e => {
			e.stop();
		});
		mediaStream = null;
	});

	$("body").on('click', "#capture_button", function(e) {
		var canvas = $("<canvas>").addClass("canvas");
		height = video.videoHeight / (video.videoWidth / width);
		canvas[0].setAttribute('width', width);
		canvas[0].setAttribute('height', height);
		canvas[0].getContext("2d").drawImage(video, 0, 0, width, height);
		canvas.appendTo("body");

		setTimeout(() => canvas.addClass("active"), 0);
	});

	$("video").on('canplay', function(e) {
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth / width);
			video.setAttribute('width', width);
			video.setAttribute('height', height);
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
