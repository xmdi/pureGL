var canvas = document.getElementById('GL-canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;



/*for (i=0; i<500; i++) {
	makeCube([Math.random()*100-50,Math.random()*100-50,Math.random()*100-50],[Math.random()*10,Math.random()*10,Math.random()*10],0,[Math.random(),Math.random(),Math.random()]);
}*/


function interp(xs, ys, x) {
	if (xs.indexOf(x)>=0)
		return ys[xs.indexOf(x)];
	for (var i = 1; i < xs.length; i++)
		if (x<xs[i] && x>xs[i-1])
			return ys[i-1]+(x-xs[i-1])*(ys[i]-ys[i-1])/(xs[i]-xs[i-1]);
}

function makeFuselage(crossSectionLocations, heights, aspectRatio, tailStart, tailHeight, rudderLength, rudderThickness, color, canopyStart, canopyLength, canopyHeight, colorCanopy) {
	var verts = [], inds = [], sideHeights = [];
	// front center point
	verts.push(0, 0, 0, color[0], color[1], color[2]);
	for (var i = 0; i < crossSectionLocations.length; i++) {
		// top
		verts.push(0, heights[i]/2, crossSectionLocations[i], color[0], color[1], color[2]); 
		// top right
		verts.push(heights[i]/(4*aspectRatio), Math.sqrt(Math.pow(heights[i]/2,2)-Math.pow(heights[i]/(4*aspectRatio),2)*Math.pow(aspectRatio,2)), crossSectionLocations[i], color[0], color[1], color[2]); 
		// right
		verts.push(heights[i]/(2*aspectRatio), 0, crossSectionLocations[i], color[0], color[1], color[2]); 
		// bot right
		verts.push(heights[i]/(4*aspectRatio), -Math.sqrt(Math.pow(heights[i]/2,2)-Math.pow(heights[i]/(4*aspectRatio),2)*Math.pow(aspectRatio,2)), crossSectionLocations[i], color[0], color[1], color[2]); 
		// bot
		verts.push(0, -heights[i]/2, crossSectionLocations[i], color[0], color[1], color[2]); 
		// bot left
		verts.push(-heights[i]/(4*aspectRatio), -Math.sqrt(Math.pow(heights[i]/2,2)-Math.pow(heights[i]/(4*aspectRatio),2)*Math.pow(aspectRatio,2)), crossSectionLocations[i], color[0], color[1], color[2]); 
		// left
		verts.push(-heights[i]/(2*aspectRatio), 0, crossSectionLocations[i], color[0], color[1], color[2]); 
		// top left
		verts.push(-heights[i]/(4*aspectRatio), Math.sqrt(Math.pow(heights[i]/2,2)-Math.pow(heights[i]/(4*aspectRatio),2)*Math.pow(aspectRatio,2)), crossSectionLocations[i], color[0], color[1], color[2]); 
		sideHeights.push(Math.sqrt(Math.pow(heights[i]/2,2)-Math.pow(heights[i]/(4*aspectRatio),2)*Math.pow(aspectRatio,2)));
	}
	// back center point
	verts.push(0, 0, crossSectionLocations[crossSectionLocations.length-1], color[0], color[1], color[2]);
	
	inds.push(0, 2, 1, // front face
			0, 3, 2,
			0, 4, 3,
			0, 5, 4,
			0, 6, 5,
			0, 7, 6,
			0, 8, 7,
			0, 1, 8);
	for (var i = 0; i < crossSectionLocations.length - 1; i++) {
		for (var j = 0; j < 8; j ++) {
			inds.push(i*8+1+j, (i+1)*8+2+j-8*(j==7), (i+1)*8+1+j,
						i*8+1+j, i*8+2+j-8*(j==7), (i+1)*8+2+j-8*(j==7));
		}
	}
		
	// canopy
	var L = verts.length/6;
	verts.push(0,interp(crossSectionLocations,heights,canopyStart)/2, canopyStart, colorCanopy[0], colorCanopy[1], colorCanopy[2]) // point A
	verts.push(interp(crossSectionLocations,heights,canopyStart + canopyLength/3)/(4*aspectRatio), interp(crossSectionLocations,sideHeights,canopyStart + canopyLength/3), canopyStart + canopyLength/3, colorCanopy[0], colorCanopy[1], colorCanopy[2]) // point B
	verts.push(interp(crossSectionLocations,heights,canopyStart + 2*canopyLength/3)/(4*aspectRatio), interp(crossSectionLocations,sideHeights,canopyStart + 2*canopyLength/3), canopyStart + 2*canopyLength/3, colorCanopy[0], colorCanopy[1], colorCanopy[2]) // point C
	verts.push(0, interp(crossSectionLocations,heights,canopyStart + canopyLength)/2, canopyStart + canopyLength, colorCanopy[0], colorCanopy[1], colorCanopy[2]) // point D
	verts.push(-interp(crossSectionLocations,heights,canopyStart + 2*canopyLength/3)/(4*aspectRatio), interp(crossSectionLocations,sideHeights,canopyStart + 2*canopyLength/3), canopyStart + 2*canopyLength/3, colorCanopy[0], colorCanopy[1], colorCanopy[2]) // point E
	verts.push(-interp(crossSectionLocations,heights,canopyStart + canopyLength/3)/(4*aspectRatio), interp(crossSectionLocations,sideHeights,canopyStart + canopyLength/3), canopyStart + canopyLength/3, colorCanopy[0], colorCanopy[1], colorCanopy[2]) // point F
	verts.push(0, interp(crossSectionLocations,heights,canopyStart + canopyLength/3)/2 + canopyHeight, canopyStart + canopyLength/3, colorCanopy[0], colorCanopy[1], colorCanopy[2]) // point G
	verts.push(0, interp(crossSectionLocations,heights,canopyStart + 2*canopyLength/3)/2 + canopyHeight, canopyStart + 2*canopyLength/3, colorCanopy[0], colorCanopy[1], colorCanopy[2]) // point H	
	
	inds.push(L+0,L+5,L+6);
	inds.push(L+1,L+0,L+6);
	inds.push(L+7,L+6,L+5);
	inds.push(L+7,L+1,L+6);
	inds.push(L+4,L+7,L+5);
	inds.push(L+7,L+2,L+1);
	inds.push(L+3,L+7,L+4);
	inds.push(L+3,L+2,L+7);

	// vertical tail
	var L = verts.length/6;
	verts.push(0, interp(crossSectionLocations,heights,tailStart)/2, tailStart, color[0], color[1], color[2]); // A
	verts.push(0-rudderThickness, tailHeight, crossSectionLocations[crossSectionLocations.length-1], color[0], color[1], color[2]); // B
	verts.push(0-rudderThickness, 0, crossSectionLocations[crossSectionLocations.length-1], color[0], color[1], color[2]); // C
	verts.push(0+rudderThickness, tailHeight, crossSectionLocations[crossSectionLocations.length-1], color[0], color[1], color[2]); // D
	verts.push(0+rudderThickness, 0, crossSectionLocations[crossSectionLocations.length-1], color[0], color[1], color[2]); // E
	verts.push(0, tailHeight, crossSectionLocations[crossSectionLocations.length-1]+rudderLength, color[0], color[1], color[2]); // F
	verts.push(0, 0, crossSectionLocations[crossSectionLocations.length-1]+rudderLength, color[0], color[1], color[2]); // G
	
	inds.push(L+0,L+2,L+1);
	inds.push(L+0,L+3,L+4);
	inds.push(L+0,L+1,L+3);
	inds.push(L+5,L+3,L+1);
	inds.push(L+6,L+2,L+4);
	inds.push(L+1,L+6,L+5);
	inds.push(L+1,L+2,L+6);
	inds.push(L+5,L+6,L+4);
	inds.push(L+5,L+4,L+3);
	
	// horizontal tail

	makeCustom(verts,inds);
	
}

function makeWing(wingStart, spanPoints, chords, thickness, vertOffset, flapStart, flapLength, color) {
	var verts = [], inds = [];
	for (var i = 0; i < spanPoints.length; i++) { // right side
		verts.push(spanPoints[i], vertOffset, wingStart, color[0], color[1], color[2]); // leading edge
		verts.push(spanPoints[i], vertOffset+thickness*chords[i]/2, wingStart+.25*chords[i], color[0], color[1], color[2]); // top, 25%-chord
		verts.push(spanPoints[i], vertOffset+thickness*chords[i]/2, wingStart+chords[i]-flapLength, color[0], color[1], color[2]); // top, aft
		verts.push(spanPoints[i], vertOffset, wingStart+chords[i], color[0], color[1], color[2]); // trailing edge
		verts.push(spanPoints[i], vertOffset-thickness*chords[i]/2, wingStart+chords[i]-flapLength, color[0], color[1], color[2]); // bot, aft
		verts.push(spanPoints[i], vertOffset-thickness*chords[i]/2, wingStart+.25*chords[i], color[0], color[1], color[2]); // bot, 25%-chord
	}
	for (var i = 1; i < spanPoints.length; i++) { // left side
		verts.push(-spanPoints[i], vertOffset, wingStart, color[0], color[1], color[2]); // leading edge
		verts.push(-spanPoints[i], vertOffset+thickness*chords[i]/2, wingStart+.25*chords[i], color[0], color[1], color[2]); // top, 25%-chord
		verts.push(-spanPoints[i], vertOffset+thickness*chords[i]/2, wingStart+chords[i]-flapLength, color[0], color[1], color[2]); // top, aft
		verts.push(-spanPoints[i], vertOffset, wingStart+chords[i], color[0], color[1], color[2]); // trailing edge
		verts.push(-spanPoints[i], vertOffset-thickness*chords[i]/2, wingStart+chords[i]-flapLength, color[0], color[1], color[2]); // bot, aft
		verts.push(-spanPoints[i], vertOffset-thickness*chords[i]/2, wingStart+.25*chords[i], color[0], color[1], color[2]); // bot, 25%-chord
	}
	
	for (var i = 1; i < spanPoints.length; i++) { // right side
		for (var j = 0; j < 6; j++) {
			inds.push(6*i+j, 6*(i-1)+j, 6*i+1+j-6*(j==5));
			inds.push(6*i+1+j-6*(j==5), 6*(i-1)+j, 6*(i-1)+1+j-6*(j==5));
		}
	}
	
	// right outboard face
	var L = 6 * (spanPoints.length - 1);
	inds.push(L+0,L+1,L+5);
	inds.push(L+1,L+2,L+4);
	inds.push(L+1,L+4,L+5);
	inds.push(L+2,L+3,L+4);
	
	L = 6 * (spanPoints.length); // left inner side
	for (var j = 0; j < 6; j++){ 
		inds.push(j, j+1-6*(j==5), L+j);
		inds.push(j+1-6*(j==5), L+j+1-6*(j==5), L+j);
	}
	L = 6 * (spanPoints.length-1);
	for (var i = 2; i < spanPoints.length; i++) { // left side
		for (var j = 0; j < 6; j++) {
			inds.push(L+6*(i-1)+j, L+6*(i-1)+j+1-6*(j==5), L+6*i+j);
			inds.push(L+6*(i-1)+j+1-6*(j==5), L+6*i+j+1-6*(j==5), L+6*i+j);
		}
	}
	
	// left outboard face
	var L = 6 * (2*spanPoints.length - 2);
	inds.push(L+0,L+1,L+5);
	inds.push(L+1,L+2,L+4);
	inds.push(L+1,L+4,L+5);
	inds.push(L+2,L+3,L+4);
	
	makeCustom(verts,inds);
}





makeFuselage([0, 10, 25, 30, 40], [7, 9, 6, 5, 0], 1.2, 35, 7, 3, .2, [0, .8, 0], 10, 10, 1.5, [.8, 0, 0])
makeWing(8, [0, 10, 20], [10, 9, 5], .12, -2, 10, 1.5, [0,0.9,0.3])



pureGL(canvas);



/*
document.addEventListener('keydown', logKey);
function logKey(e) {
  console.log(e.code);
}*/