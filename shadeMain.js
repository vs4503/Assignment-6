  'use strict';

  // Global variables that are set and used
  // across the application
  let gl;

  // The programs
  let perVertexProgram;
  let perFragmentProgram;
  
  // VAOs for the objects
  var mySpherePerVertex = null;
  var mySpherePerFragment = null;

  // what is currently showing
  let nowShowing = 'Vertex';

//
// Creates a VAO for a given object and return it.
//
// shape is the object to be bound
// program is the program (vertex/fragment shaders) to use in this VAO
//
//
// Note that the program object has member variables that store the
// location of attributes and uniforms in the shaders.  See the function
// initProgram for details.
//
// You can see the definition of the shaders themselves in the
// HTML file assn6-shading.html.   Though there are 2 sets of shaders
// defined (one for per-vertex shading and one for per-fragment shading,
// each set does have the same list of attributes and uniforms that
// need to be set
//
function bindVAO (shape, program) {
    
    //create and bind VAO

    
    // create, bind, and fill buffer for vertex locations
    // vertex locations can be obtained from the points member of the
    // shape object.  3 floating point values (x,y,z) per vertex are
    // stored in this array.
    var size = 3;          
    var type = gl.FLOAT;   
    var normalize = false; 
    var stride = 0;       
    var offset = 0;
    var mySphere = new Sphere
    var points = mySphere.points
    var normals = mySphere.normals
    var indices = mySphere.indices

    var positionAttributeLocation = gl.getAttribLocation(program, points)
    var positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)

    var mySpherePerVertex = gl.createVertexArray()
    gl.bindVertexArray(mySpherePerVertex)

    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
    gl.enableVertexAttribArray(positionAttributeLocation)

    
    // create, bind, and fill buffer for normal values
    // normals can be obtained from the normals member of the
    // shape object.  3 floating point values (x,y,z) per vertex are
    // stored in this array.

    var normalAttributeLocation = gl.getAttribLocation(program, normals)
    var normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)

    var mySpherePerFragment = gl.createVertexArray()
    gl.bindVertexArray(mySpherePerFragment)


    gl.vertexAttribPointer(normalAttributeLocation, size, type, normalize, stride, offset)
    gl.enableVertexAttribArray(normalAttributeLocation)

    
    // Setting up element array
    // element indicies can be obtained from the indicies member of the
    // shape object.  3 values per triangle are stored in this
    // array.

    var elementBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Float32Array(indices), gl.STATIC_DRAW);


    // Do cleanup

    // return the VAO
    return mySpherePerVertex, mySpherePerFragment

}


//
// In this function, you must set up all of the uniform variables
// in the shaders required for the implememtation of the Phong
// Illumination model.
//
// Check out the source of the vertex shader in the HTML file
// assn6-shading.html taking note of the types of each of the
// uniforms.
//
// Note that the program object has member variables that store the
// location of attributes and uniforms in the shaders.  See the function
// initProgram for details.
//
//
//  You should also set up your Model transform here.

function setUpPhong(program) {
    

    // Recall that you must set the program to be current using
    // the gl useProgram function
    gl.useProgram (program);
    
    //
    // set values for all your uniform variables
    // including the model transform
    // but not your view and projection transforms as
    // they are set in setUpCamera()
    //
    var ka = 1
    var kd = 1
    var ks = 1
    var ambientColor = "rgb(52, 25, 0)"
    var diffuseColor = "rgb(204, 102, 0)"
    var specularColor = "rgb(0, 101, 179)"

    
    // set up your model transform...Add transformations
    // if you are moiving, scaling, or rotating the object.
    // Default is no transformations at all (identity matrix).
    //
    let modelMatrix = glMatrix.mat4.create();
    gl.uniformMatrix4fv (program.uModelT, false, modelMatrix);

    return ka,kd,ks,ambientColor,diffuseColor,specularColor
    
    
}

//
// set up the view and projections transformations and
// send to the program (shaders) as uniforms.
//
// Note that the program object has member variables that store the
// location of attributes and uniforms in the shaders.  See the function
// initProgram for details.
//
function setUpCamera(program) {
    
    // Recall you must set the program to be current using the gl
    // function useProgram.
     gl.useProgram (program);
    

    // set up your projection

    
    // set up your view

}

///////////////////////////////////////////////////////////////////
//
//  No need to edit below this line.
//
////////////////////////////////////////////////////////////////////

// general call to make and bind a new object based on current
// settings..Basically a call to shape specfic calls in cgIshape.js
function createShapes() {
    
    //per vertex
    mySpherePerVertex = new Sphere (20,20);
    mySpherePerVertex.VAO = bindVAO (mySpherePerVertex, perVertexProgram);
    
    // per fragment
    mySpherePerFragment = new Sphere (20,20);
    mySpherePerFragment.VAO = bindVAO (mySpherePerFragment, perFragmentProgram);
}


function drawShapes(object, program) {
    
    // set up your uniform variables for drawing
    gl.useProgram (program);

    //Bind the VAO and draw
    gl.bindVertexArray(object.VAO);
    gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT, 0);
    
}

  // Given an id, extract the content's of a shader script
  // from the DOM and return the compiled shader
  function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();

    // Assign shader depending on the type of shader
    let shader;
    if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
      return null;
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Compiling shader " + id + " " + gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  // Create a program with the appropriate vertex and fragment shaders
  function initProgram (vertexid, fragmentid) {
    // set up the per-vertex program
    const vertexShader = getShader(vertexid);
    const fragmentShader = getShader(fragmentid);

    // Create a program
    let program = gl.createProgram();
    
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
    }

    // Use this program instance
    gl.useProgram(program);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aNormal = gl.getAttribLocation(program, 'aNormal');
      
    // uniforms
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
    program.ambientLight = gl.getUniformLocation (program, 'ambientLight');
    program.lightPosition = gl.getUniformLocation (program, 'lightPosition');
    program.lightColor = gl.getUniformLocation (program, 'lightColor');
    program.baseColor = gl.getUniformLocation (program, 'baseColor');
    program.specHighlightColor = gl.getUniformLocation (program, 'specHighlightColor');
    program.ka = gl.getUniformLocation (program, 'ka');
    program.kd = gl.getUniformLocation (program, 'kd');
    program.ks = gl.getUniformLocation (program, 'ks');
    program.ke = gl.getUniformLocation (program, 'ke');
      
    return program;
  }



  
  // We call draw to render to our canvas
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    if (nowShowing == 'Vertex') {
        drawShapes(mySpherePerVertex, perVertexProgram);
    }
    if (nowShowing == 'Fragment') {
        drawShapes(mySpherePerFragment, perFragmentProgram);
    }

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }

    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    perVertexProgram = initProgram('phong-per-vertex-V', 'phong-per-vertex-F');
    perFragmentProgram = initProgram('phong-per-fragment-V', 'phong-per-fragment-F');
    
    // create and bind your current object
    createShapes();
    
    // set up your camera
    setUpCamera(perVertexProgram);
    setUpCamera(perFragmentProgram);
      
    // set up Phong parameters
    setUpPhong(perVertexProgram);
    setUpPhong(perFragmentProgram);
    
    // do a draw
    draw();
  }
