function init(){
  //Create color palette
  var Colors = {
    cyan: 0x248079,
    brown: 0xA98F78,
    redWood: 0x8C4734,
    green: 0x136F0C,
    greenLight: 0x17940D,
    blue:0x6BC6FF
  };

  var scene = new THREE.Scene();
  var h = window.innerHeight,
      w = window.innerWidth;
  var aspectRatio = w / h,
      fieldOfView = 25,
      nearPlane = .1,
      farPlane = 1000; 
  var camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane);
  var renderer = new THREE.WebGLRenderer({canvas:canvas,alpha: true, antialias: true});

  const dpi = window.devicePixelRatio;
  renderer.setSize( w*dpi, h*dpi );
  const theCanvas = document.getElementById('canvas');
  theCanvas.style.width = `${w}px`;
  theCanvas.style.height = `${h}px`;

  renderer.shadowMapEnabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild( renderer.domElement );
  camera.position.set(-5,6,8);
  camera.lookAt(new THREE.Vector3(0,0,0));


  //Ambient light
  var light = new THREE.AmbientLight( 0xffffff ,.5);

  var shadowLight = new THREE.DirectionalLight(0xffffff, .5);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;

  var backLight = new THREE.DirectionalLight(0xffffff, .2);
  backLight.position.set(-100, 200, 50);
  backLight.castShadow = true;
  scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);

  // grassland left
  var geometry_left = new THREE.BoxGeometry( 2, .2, 2 );
  var material_grass = new THREE.MeshLambertMaterial( { color: Colors.greenLight } );
  var ground_left = new THREE.Mesh( geometry_left, material_grass );
  ground_left.position.set(-1,0.1,0);
  scene.add( ground_left );
  customizeShadow(ground_left,.25) // mess, opacity

  //river
// Define the material for the river
var material_river = new THREE.MeshLambertMaterial({ color: Colors.blue });

// Create the river geometry
var geometry_river = new THREE.BoxGeometry(1, .1, 2);
var river = new THREE.Mesh(geometry_river, material_river);
river.position.set(.5, .1, 0);
scene.add(river);
customizeShadow(river, .08); // mess, opacity

// Define the material for the river stripes
var material_stripe = new THREE.MeshLambertMaterial({ color: 0xffffff });

// Create and position the river stripes
for (var i = 0; i < 4; i++) {
    var stripeWidth = 0.01; // Width of each stripe
    var stripeGeometry = new THREE.BoxGeometry(stripeWidth, .1, 2); // Height and depth match the river
    var stripe = new THREE.Mesh(stripeGeometry, material_stripe);
    stripe.position.set(.5 - 0.5 + i * 0.25, .1, 0); // Adjust x position to create stripes
    scene.add(stripe);
    customizeShadow(stripe, .08); // mess, opacity
}

  //river bed
  var geometry_bed = new THREE.BoxGeometry( 1, .05, 2 );
  var bed = new THREE.Mesh( geometry_bed , material_grass );
  bed.position.set(.5,.025,0);
  scene.add( bed );

  //grassland right
  var geometry_right = new THREE.BoxGeometry( 1, .2, 2 );
  var ground_right = new THREE.Mesh( geometry_right, material_grass );
  ground_right.position.set(1.5,0.1,0);
  scene.add( ground_right );
  customizeShadow(ground_right,.25) // mess, opacity


  var tree = function(x, z) {
    this.x = x;
    this.z = z;

    // Trunk
    var material_trunk = new THREE.MeshLambertMaterial({ color: Colors.redWood });
    var geometry_trunk = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    var trunk = new THREE.Mesh(geometry_trunk, material_trunk);
    trunk.position.set(this.x, 0.275, this.z);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    scene.add(trunk);

    // Leaves
    var numLayers = 5; // Number of layers for the pine tree
    var layerHeight = 0.1; // Height of each layer
    var layerRadius = 0.2; // Radius of the bottom layer
    var geometry_leaves, material_leaves, leaves, yPos;

    for (var i = 0; i < numLayers; i++) {
        yPos = 0.2 + (i * layerHeight) + (0.4 / 2);
        geometry_leaves = new THREE.ConeGeometry(layerRadius, layerHeight, 4); 
        material_leaves = new THREE.MeshLambertMaterial({ color: Colors.green });
        leaves = new THREE.Mesh(geometry_leaves, material_leaves);
        leaves.position.set(this.x, yPos, this.z);
        leaves.castShadow = true;
        customizeShadow(leaves, 0.25); // mess, opacity
        scene.add(leaves);

        layerRadius -= 0.03; // Decrease radius for each layer
    }
  }


  //left
  tree(-1.75,-.85);
  tree(-1.75,-.15);
  tree(-1.5,-.5);
  tree(-1.5,.4);
  tree(-1.25,-.85);
  tree(-1.25,.75);
  tree(-.75,-.85);
  tree(-.75,-.25);
  tree(-.25,-.85);
  
  //right
  tree(1.25,-.85);
  tree(1.25,.75);
  tree(1.5,-.5);
  tree(1.75,-.85);
  tree(1.75,.35);
  tree(1.5,-0.1);

  function customizeShadow(t,a){ //opacity, target mesh
    var material_shadow = new THREE.ShadowMaterial({opacity:a});
    var mesh_shadow = new THREE.Mesh( t.geometry, material_shadow );
    mesh_shadow.position.set(t.position.x,t.position.y,t.position.z);
    mesh_shadow.receiveShadow = true;
    scene.add( mesh_shadow );
  }


  var material_wood = new THREE.MeshLambertMaterial({ color: Colors.brown  });

  //bridge - wood block
  for (var i=0;i<6;i++){
    var geometry_block = new THREE.BoxGeometry( .15, .02, .4 );
    var block = new THREE.Mesh( geometry_block, material_wood );
    block.position.set(0+.2*i,.21,.2);
    block.castShadow = true;
    block.receiveShadow = true;
    scene.add( block );
  }

  // Create an instance of the OBJLoader
  var objLoader = new THREE.OBJLoader();
  objLoader.load('slug.obj', function(object) {
    // Inside the OBJLoader load callback function
    console.log('Slug object loaded');
    object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({ color: 'yellow' });
            child.castShadow = true;
            child.receiveShadow = true;
            child.name = 'BananaSlug';

            console.log('Adding event listener to the slug mesh:', child);
            
            child.addEventListener('click', function() {
                console.log('Clicked on the slug');
                window.location.href = 'https://www.google.com';
            });
        }
    });

    var scaleFactor = 0.1; // Adjust the scale factor as needed
    object.scale.set(scaleFactor, scaleFactor, scaleFactor);
    object.position.set(-0.3, 0.2, 0);
    object.rotation.x = -Math.PI / 2;
    scene.add(object);
  }
  );


  // Create a raycaster
  var raycaster = new THREE.Raycaster();

  // Listen for mouse move events
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('click', onMouseClick, false);

  function onMouseMove(event) {
      // Calculate mouse position in normalized device coordinates
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster's position
      raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
  }

  function onMouseClick(event) {
      // Calculate mouse position in normalized device coordinates
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster's position
      raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);

      // Check for intersections
      var intersects = raycaster.intersectObjects(scene.children, true);

      // Iterate through intersected objects
      for (var i = 0; i < intersects.length; i++) {
          var intersectedObject = intersects[i].object;

          // Check if the intersected object is the slug mesh
          if (intersectedObject.name === 'BananaSlug') {
              // Redirect to google.com when slug is clicked
              console.log('Clicked on the slug');
              // window.location.href = 'https://www.ucsc.edu';
              window.open('https://www.ucsc.edu', '_blank');
              return; // Exit the loop after handling the click event
          }
      }
  }


  var Drop = function() {
    this.geometry = new THREE.BoxGeometry(.1, .1, .1);
    // Randomly choose between white and blue color
    var color = Math.random() < 0.5 ? Colors.blue : 0xffffff;
    this.material = new THREE.MeshLambertMaterial({ color: color });
    this.drop = new THREE.Mesh(this.geometry, this.material);
    this.drop.position.set(Math.random(.1, .9), 0.1, 1 + (Math.random() - .5) * .1);
    scene.add(this.drop);
    this.speed = 0;
    this.lifespan = (Math.random() * 50) + 50;

    this.update = function() {
        this.speed += .0007;
        this.lifespan--;
        this.drop.position.x += (.5 - this.drop.position.x) / 70;
        this.drop.position.y -= this.speed;
    }
}

  var drops=[];

  var count=0;
  var render = function() {
    requestAnimationFrame( render );
    if(count%3==0){
      for(var i=0;i<5;i++){
        drops.push(new Drop());
      }
    }
    count++;
    for(var i=0;i<drops.length;i++){
      drops[i].update();
      if(drops[i].lifespan<0){
        scene.remove(scene.getObjectById(drops[i].drop.id));
        drops.splice(i,1);
      }
    }
    renderer.render( scene, camera );
  }
  render();
}

function onWindowResize() {
  // Adjust canvas size here
  // For example, you can set the canvas width and height to match the window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Call any other resizing functions if needed
}

// Event listener for window resize
window.addEventListener('resize', onWindowResize, false);

// Call the init function when the page loads
window.onload = init;
