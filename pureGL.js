//pureGL.js

var vertices = [], indices = [], nVertices = 0, gl;

function perspective(fovy, aspect, near, far) {
	var out=[]
    var f = 1.0 / Math.tan(fovy / 2),
        nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;

    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
	return out;
  }

function lookAt(eye, center, up) {
	var out;
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);

    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);

    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
	out=[x0,y0,z0,0,x1,y1,z1,0,x2,y2,z2,0,-(x0 * eyex + x1 * eyey + x2 * eyez),-(y0 * eyex + y1 * eyey + y2 * eyez),-(z0 * eyex + z1 * eyey + z2 * eyez),1];
	return out;
  }
  
function rotateX(m,a){
	var c=Math.cos(a);
	var s=Math.sin(a);
	var mv1=m[1],mv5=m[5],mv9=m[9];
	m[1]=m[1]*c-m[2]*s;
	m[5]=m[5]*c-m[6]*s;
	m[9]=m[9]*c-m[10]*s;
	m[2]=m[2]*c+mv1*s;
	m[6]=m[6]*c+mv5*s;
	m[10]=m[10]*c+mv9*s;
}
function rotateY(m,a){
	var c=Math.cos(a);
	var s=Math.sin(a);
	var mv0=m[0],mv4=m[4],mv8=m[8];
	m[0]=c*m[0]+s*m[2];
	m[4]=c*m[4]+s*m[6];
	m[8]=c*m[8]+s*m[10];
	m[2]=c*m[2]-s*mv0;
	m[6]=c*m[6]-s*mv4;
	m[10]=c*m[10]-s*mv8;
}

function makeCube(center,dimensions,rotations,rgb) {
	var L = nVertices;
	nVertices += 8;
	vertices.push(center[0]-dimensions[0]/2,center[1]-dimensions[1]/2,center[2]-dimensions[2]/2,rgb[0],rgb[1],rgb[2],
				center[0]+dimensions[0]/2,center[1]-dimensions[1]/2,center[2]-dimensions[2]/2,rgb[0],rgb[1],rgb[2],
				center[0]+dimensions[0]/2,center[1]+dimensions[1]/2,center[2]-dimensions[2]/2,rgb[0],rgb[1],rgb[2],
				center[0]-dimensions[0]/2,center[1]+dimensions[1]/2,center[2]-dimensions[2]/2,rgb[0],rgb[1],rgb[2],
				center[0]-dimensions[0]/2,center[1]-dimensions[1]/2,center[2]+dimensions[2]/2,rgb[0],rgb[1],rgb[2],
				center[0]+dimensions[0]/2,center[1]-dimensions[1]/2,center[2]+dimensions[2]/2,rgb[0],rgb[1],rgb[2],
				center[0]+dimensions[0]/2,center[1]+dimensions[1]/2,center[2]+dimensions[2]/2,rgb[0],rgb[1],rgb[2],
				center[0]-dimensions[0]/2,center[1]+dimensions[1]/2,center[2]+dimensions[2]/2,rgb[0],rgb[1],rgb[2]);
	indices.push(L+0, L+2, L+1,
				L+0, L+3, L+2,
				L+4, L+5, L+6,
				L+4, L+6, L+7,
				L+1, L+2, L+6,
				L+1, L+6, L+5,
				L+4, L+7, L+3,
				L+4, L+3, L+0,
				L+0, L+1, L+5,
				L+0, L+5, L+4,
				L+2, L+3, L+7,
				L+2, L+7, L+6);
}

function makeCustom(verts,inds) {
	var L = nVertices;
	console.log("----",nVertices)
	nVertices += verts.length / 6;
	for (var i = 0; i < verts.length; i++) {
		vertices.push(verts[i]);
	}
	for (var i = 0; i < inds.length; i++) {
		indices.push(inds[i]+ L);
	}
}

function pureGL(canvas) {

	gl = canvas.getContext('webgl');

	var vertex_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	var index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	var vertexShaderSource = `
	precision mediump float;
	attribute vec3 coords;
	attribute vec3 color;
	uniform mat4 mWorld;
	uniform mat4 mView;
	uniform mat4 mProj;
	varying vec3 col;
	void main(void) {
		gl_Position = mProj*mView*mWorld*vec4(coords, 1.);
		col = color;
	}
	`;

	var fragmentShaderSource = `
	precision mediump float;
	varying vec3 col;
	void main(void) {
		gl_FragColor = vec4(col, 1.);
	}
	`;

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.compileShader(vertexShader);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentShaderSource);
	gl.compileShader(fragmentShader);

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);

	var coords = gl.getAttribLocation(shaderProgram, 'coords');
	gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(coords);
	var color = gl.getAttribLocation(shaderProgram, 'color');
	gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
	gl.enableVertexAttribArray(color);
	
	gl.enable(gl.DEPTH_TEST);
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor( 0, 0, 0, 1);
	
	matWorldUniformLocation = gl.getUniformLocation(shaderProgram, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(shaderProgram, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(shaderProgram, 'mProj');

	viewMatrix = new Float32Array(16);
	projMatrix = new Float32Array(16);
	
	viewMatrix=lookAt([0,0,-100],[0,0,0],[0,1,0]);
	projMatrix=perspective(Math.PI/4,canvas.clientWidth/canvas.clientHeight,0.1,1000.0);

	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	a1=0;
	a2=0;
	
	var drag=false;
	var old_x,old_y;
	var dX=0,dY=0;
	var mouseDown=function(e){
		drag=true;
		old_x=e.pageX,old_y=e.pageY;
		e.preventDefault();
		return false;
	};
	var mouseUp=function(e){drag=false};
	var mouseMove=function(e){
		if(!drag) return false;
		dX=(e.pageX-old_x)*2*Math.PI/canvas.width,
		dY=(e.pageY-old_y)*2*Math.PI/canvas.height;
		a2+=dY;
		if((Math.abs(a2)%(2*Math.PI)<(Math.PI/2))||(Math.abs(a2)%(2*Math.PI)>(3*Math.PI/2))){a1+=dX}
		else{a1-=dX}
		old_x=e.pageX,old_y=e.pageY;
		e.preventDefault();
	};
	var touchDown=function(e){
		drag=true;
		old_x=e.changedTouches[0].pageX,old_y=e.changedTouches[0].pageY;
		e.preventDefault();
		return false;
	};
	var touchMove=function(e){
		if(!drag) return false;
		dX=(e.changedTouches[0].pageX-old_x)*2*Math.PI/canvas.width,
		dY=(e.changedTouches[0].pageY-old_y)*2*Math.PI/canvas.height;
		a2+=dY;
		if((Math.abs(a2)%(2*Math.PI)<(Math.PI/2))||(Math.abs(a2)%(2*Math.PI)>(3*Math.PI/2))){a1+=dX}
		else{a1-=dX}
		old_x=e.changedTouches[0].pageX,old_y=e.changedTouches[0].pageY;
		e.preventDefault();
	};
	
	
	canvas.addEventListener("mousedown",mouseDown,false);
	canvas.addEventListener("mouseup",mouseUp,false);
	canvas.addEventListener("mouseout",mouseUp,false);
	canvas.addEventListener("mousemove",mouseMove,false);
	canvas.addEventListener("touchstart",touchDown,false);
	canvas.addEventListener("touchend",mouseUp,false);
	canvas.addEventListener("touchmove",touchMove,false);


	requestAnimationFrame(loop);
}

function loop() {
	
	var mo_matrix=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
	rotateY(mo_matrix,a1);
	rotateX(mo_matrix,-a2);
	gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,mo_matrix);
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	requestAnimationFrame(loop);
}
