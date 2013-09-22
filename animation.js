/*
 * js-side-of-the-moon
 * 
 * Copyright 2013 Davide Magrin <magrin.davide@gmail.com>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */
 
// Warning: this code needs heavy refactoring and aid to readability
 
// Variables
var CANVASHEIGHT;
var CANVASWIDTH;
var incident;
var LINESPEED = 0.8;
var INCIDENTRAYSNUMBER = 40;
var INCIDENTRAYSPREAD = 80;
var incidencepointx;
var incidencepointy;
var prismrays;
var PRISMRAYSSPREAD = 80;
var prismrayscenterx;
var prismrayscentery;
var colorentrypoints;
var colorexitpoints;
var COLORSPREAD = 300;
var COLORNUMBER = 7;
var MAXCOLORWIDTH = (COLORSPREAD/(COLORNUMBER-1))/2;
var colors = new Array("#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF","#4B0082");
//var colors = new Array("#E74C3C","#E67E22", "#F1C40F", "#2ECC71", "#3498DB", "#9B59B6");

// Controls the fading
var FADINGRESOLUTION = 20;
var FADINGPOINT = 0.8;// PERCENTAGE

// Useful variables
var thisline;
var thispoint;
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
	animate(ctx);
});

// Animation
function animate(ctx) {
	
	clear(ctx); 
	updateIncidentLines(ctx);
	printIncidentLines(ctx);
	updatePrismLines(ctx);
	printPrismLines(ctx);
	updateColors(ctx);
	printColors(ctx);
	printPrism(ctx);
	
	requestAnimationFrame(function() {animate(ctx)} );
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
		// Fugly I know.
		prismrays[i] = new line(incidencepointx, incidencepointy, incidencepointx+CANVASWIDTH/9-PRISMRAYSSPREAD/4*randommultiplier, incidencepointy-PRISMRAYSSPREAD/4*Math.sqrt(3)*randommultiplier, "#FFFFFF", 1);
		//console.log(prismrays[i]);
	}
	// The entry points for the colors
	colorentrypoints = new Array(COLORNUMBER);
	for (var i = 0; i < COLORNUMBER; i++) {
		colorentrypoints[i] = new point((incidencepointx+CANVASWIDTH/9-PRISMRAYSSPREAD/4+(PRISMRAYSSPREAD/COLORNUMBER)/2*i), (incidencepointy-PRISMRAYSSPREAD/4*Math.sqrt(3)+i*(PRISMRAYSSPREAD/COLORNUMBER)*Math.sqrt(3)/2));
	}
	
	// Defines the exit points for the colors
	colorexitpoints = new Array(COLORNUMBER);
	for (var i = 0; i < COLORNUMBER; i++) {
		colorexitpoints[i] = new point(canvas.width, CANVASHEIGHT*(2/3)-2*INCIDENTRAYSPREAD+(COLORSPREAD/COLORNUMBER)*i);
	}
}

// Print functions
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

function printColors(ctx) {

	for (var i = 0; i < COLORNUMBER-1; i++) {
		ctx.beginPath();
		ctx.fillStyle = colors[i];
		ctx.moveTo(colorentrypoints[i].x, colorentrypoints[i].y);
		ctx.lineTo(colorexitpoints[i].x, colorexitpoints[i].y);
		ctx.lineTo(colorexitpoints[i+1].x, colorexitpoints[i+1].y);
		ctx.lineTo(colorentrypoints[i+1].x, colorentrypoints[i+1].y);
		ctx.closePath();
		ctx.fill();
	}

}

function printPrism(ctx) {
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = "#FFFFFF";
	ctx.moveTo(CANVASWIDTH/3, CANVASHEIGHT*(2/3));
	ctx.lineTo(CANVASWIDTH*(2/3), CANVASHEIGHT*(2/3));
	ctx.lineTo(CANVASWIDTH/2, CANVASHEIGHT*(2/3)-CANVASWIDTH/3*(Math.sqrt(3)/2));
	ctx.closePath();
	ctx.stroke();
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

function updateColors() {
	for (var i = 0; i < COLORNUMBER; i++) {
		thispoint = colorexitpoints[i];
		thispoint.y += Math.random() * LINESPEED * thispoint.direction;
		if (thispoint.y > CANVASHEIGHT*(2/3)-2*INCIDENTRAYSPREAD+(COLORSPREAD/(COLORNUMBER-1))*i+MAXCOLORWIDTH/2)
			thispoint.direction = -1;
		if (thispoint.y < CANVASHEIGHT*(2/3)-2*INCIDENTRAYSPREAD+(COLORSPREAD/(COLORNUMBER-1))*i-MAXCOLORWIDTH/2)
			thispoint.direction = 1;
	}
}
// The point objext
function point(x, y) {
	this.x = x;
	this.y = y;
	this.direction = Math.floor(Math.random()*2)*2-1; //random moving down (1) or up (-1)
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
