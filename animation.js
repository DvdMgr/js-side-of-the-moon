// Variables
var CANVASHEIGHT;
var CANVASWIDTH;
var incident;
var spread;
var INCIDENTRAYSNUMBER = 20;
var INCIDENTRAYSPREAD = 50;
var incidencepointx;
var incidencepointy;
var thisline;
// Fires when the document is fully loaded
$(document).ready(function(){
	var canvas = $("#animation").get(0);
	var ctx = canvas.getContext("2d");
	CANVASHEIGHT = canvas.height;
	CANVASWIDTH = canvas.width;
	drawPrism(ctx);
	incidencepointx = CANVASWIDTH/9+CANVASWIDTH/3;
	incidencepointy = (4*CANVASHEIGHT-Math.sqrt(3)*CANVASWIDTH)/6+CANVASWIDTH*Math.sqrt(3)/6-2*CANVASWIDTH/9*Math.sqrt(3)/2;
	initialize();
	printIncidentLines(ctx);
});

// Pretty self explainatory
function drawPrism(ctx) {
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = "#FFFFFF";
	ctx.moveTo(CANVASWIDTH/3, CANVASHEIGHT*(2/3));
	ctx.lineTo(CANVASWIDTH*(2/3), CANVASHEIGHT*(2/3));
	ctx.lineTo(CANVASWIDTH/2, CANVASHEIGHT*(2/3)-CANVASWIDTH/3*(Math.sqrt(3)/2));
	ctx.closePath();
	ctx.stroke();
}

// Initializes the various arrays needed
function initialize() {
	// The white, incident ray is composed with various lines
	incident = new Array(INCIDENTRAYSNUMBER);
	for (var i = 0; i < INCIDENTRAYSNUMBER; i++) {
		incident[i] = new line(0, Math.random()*INCIDENTRAYSPREAD+CANVASHEIGHT*(2/3)-10, incidencepointx, incidencepointy, "#FFFFFF", 1);
		//console.log(incident[i]);
	}
}

// Self explainatory
function printIncidentLines(ctx) {
	ctx.beginPath();
	for (var i = 0; i < INCIDENTRAYSNUMBER; i++) {
		thisline = incident[i];
		ctx.strokeStyle = thisline.color;
		ctx.lineWidth = thisline.width;
		ctx.moveTo(thisline.startx, thisline.starty);
		ctx.lineTo(thisline.endx, thisline.endy);
	}
	ctx.stroke();
}


// The line object
function line(startx, starty, endx, endy, color, width) {
	this.startx = startx;
	this.starty = starty;
	this.endx = endx;
	this.endy = endy;
	this.color = color;
	this.width = width;
}
