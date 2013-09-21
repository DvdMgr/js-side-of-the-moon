// Variables
var CANVASHEIGHT;
var CANVASWIDTH;
var incident;
var LINESPEED = 0.6;
var INCIDENTRAYSNUMBER = 60;
var INCIDENTRAYSPREAD = 70;
var incidencepointx;
var incidencepointy;
var prismrays;
var PRISMRAYSSPREAD = 80;
var prismrayscenterx;
var prismrayscentery;

// Controls the fading
var FADINGRESOLUTION = 100;
var FADINGPOINT = 0.8;// PERCENTAGE

// Useful variables
var thisline;
var randommultiplier;
var fadingpointx;
var fadingpointy;
var tractlengthx;
var tractlengthy;
var canvas;
// Fires when the document is fully loaded
$(document).ready(function(){
	canvas = $("#animation").get(0);
	var ctx = canvas.getContext("2d");
	CANVASHEIGHT = canvas.height;
	CANVASWIDTH = canvas.width;
	incidencepointx = CANVASWIDTH/9+CANVASWIDTH/3;
	// Don't ask. Trigonometry is awesome.
	incidencepointy = (4*CANVASHEIGHT-Math.sqrt(3)*CANVASWIDTH)/6+CANVASWIDTH*Math.sqrt(3)/6-2*CANVASWIDTH/9*Math.sqrt(3)/2;
	initialize();
	drawPrism(ctx);
	printIncidentLines(ctx);
	printPrismLines(ctx);
	animate(ctx);
});

// Animation
function animate(ctx) {
	clear(ctx); 
	drawPrism(ctx);
	updateIncidentLines(ctx);
	printIncidentLines(ctx);
	updatePrismLines(ctx);
	printPrismLines(ctx);
	
	requestAnimationFrame(function() {animate(ctx)} );
}

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
		incident[i] = new line(0, Math.random()*INCIDENTRAYSPREAD+CANVASHEIGHT*(2/3)-(INCIDENTRAYSPREAD/2), incidencepointx, incidencepointy, "#FFFFFF", 1);
		//console.log(incident[i]);
	}
	// The rays in the prism
	prismrays = new Array(INCIDENTRAYSNUMBER);
	for (var i = 0; i < INCIDENTRAYSNUMBER; i++) {
		randommultiplier = (Math.random()*2-1);
		// Fugly
		prismrays[i] = new line(incidencepointx, incidencepointy, incidencepointx+CANVASWIDTH/9-PRISMRAYSSPREAD/4*randommultiplier, incidencepointy-PRISMRAYSSPREAD/4*Math.sqrt(3)*randommultiplier, "#FFFFFF", 1);
		console.log(prismrays[i]);
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

function printPrismLines(ctx) {
	for (var i = 0; i < INCIDENTRAYSNUMBER; i++) {
		//ctx.beginPath();
		thisline = prismrays[i];
		// Draws the lines with fading, dividing them in multiple tracts
		fadingpointx = thisline.startx+(thisline.endx-thisline.startx)*FADINGPOINT;
		fadingpointy = thisline.starty+(thisline.endy-thisline.starty)*FADINGPOINT;
		tractlengthx = (fadingpointx - thisline.startx)/FADINGRESOLUTION;
		tractlengthy = (fadingpointy - thisline.starty)/FADINGRESOLUTION;
		for (var j = 0; j < FADINGRESOLUTION; j++) {
			ctx.beginPath();
			ctx.strokeStyle = thisline.color;
			ctx.lineWidth = thisline.width;
			ctx.globalAlpha = (FADINGRESOLUTION-j)/FADINGRESOLUTION;
			ctx.moveTo(thisline.startx+(j)*tractlengthx, thisline.starty+(j)*tractlengthy);
			ctx.lineTo(thisline.startx+(j+1)*tractlengthx, thisline.starty+(j+1)*tractlengthy);
			ctx.stroke();		
		}
	}
	// Restores globalAlpha
	ctx.globalAlpha = 1;
}

// Function to update the matrix with the next step of movement
function updateIncidentLines() {

	for (var i = 0; i < INCIDENTRAYSNUMBER; i++) {
		thisline = incident[i];
		thisline.starty += Math.random() * LINESPEED * thisline.direction;
		if (thisline.starty < CANVASHEIGHT*(2/3)-(INCIDENTRAYSPREAD/2))
			thisline.direction = 1;
		if (thisline.starty > CANVASHEIGHT*(2/3)+(INCIDENTRAYSPREAD/2))
			thisline.direction = -1;
		//console.log(incident[i]);
	}
}

function updatePrismLines() {
		for (var i = 0; i < INCIDENTRAYSNUMBER; i++) {
		thisline = prismrays[i];
		randommultiplier = Math.random();
		thisline.endy += randommultiplier * LINESPEED * thisline.direction;
		//thisline.endx += randommultiplier * LINESPEED * thisline.direction * (-1);
		if (thisline.endy < incidencepointy-PRISMRAYSSPREAD/4*Math.sqrt(3))
			thisline.direction = 1;
		if (thisline.endy > incidencepointy+PRISMRAYSSPREAD/4*Math.sqrt(3))
			thisline.direction = -1;
		//console.log(incident[i]);
	}
}
// The line object
function line(startx, starty, endx, endy, color, width) {
	this.startx = startx;
	this.starty = starty;
	this.endx = endx;
	this.endy = endy;
	this.color = color;
	this.width = width;
	this.direction = Math.floor(Math.random()*2)*2-1; //random moving down (-1) or up (1)

}

// Clears things
function clear(ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
