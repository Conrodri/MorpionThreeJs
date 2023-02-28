import * as THREE from 'three';
import { Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


scene.add( camera );
camera.position.z = 5;


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

let boxes = []

const addNewBoxMesh = (x,y,z) => {
    const geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(x,y,z)
    boxes.push(cube)
    scene.add( cube );
}

addNewBoxMesh(-1,1,0)
addNewBoxMesh(0,1,0)
addNewBoxMesh(1,1,0)

addNewBoxMesh(-1,0,0)
addNewBoxMesh(0,0,0)
addNewBoxMesh(1,0,0)

addNewBoxMesh(-1,-1,0)
addNewBoxMesh(0,-1,0)
addNewBoxMesh(1,-1,0)

window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener( 'click', onDocumentMouseClick, false );

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let turn = 1;
let winner = 0
let textObject = []


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseClick( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0  && intersects[ 0 ].object.material.color.equals(new Color(1,1,1)) && winner == 0) {
        ChangeBoxColor(intersects[ 0 ].object)
    }
    else if (winner == 1 || turn >= 9){
        console.log('yo', winner, turn)
        ResetColors()
        winner = 0
        turn = 1
        scene.remove(textObject[0])
        textObject = []
    }
}

function ChangeBoxColor(box) {
    
    if(box.material.color.r == 1 && box.material.color.g == 1 && box.material.color.b == 1){
        if (turn % 2 == 1 && box.material.color.equals(new Color(1,1,1))) {
            box.material.color.set(0xff0000)
            CheckIfSomeoneWon()
            turn++
        }
        else if (turn % 2 == 0 && box.material.color.equals(new Color(1,1,1))){
            box.material.color.set(0x0000ff)
            CheckIfSomeoneWon()
            turn++
        }

    }
}

function CheckLine(a,b,c) {
    if (winner == 0){
        if (boxes[a].material.color.equals(boxes[b].material.color) && boxes[a].material.color.equals(boxes[c].material.color)){
            if (boxes[a].material.color.equals(new Color(1,0,0))) {
                loadFont('Red Won !', {x: -1.5, y: 1.5, z: 0}, new Color(1,0,0))
                winner = 1
            }
            else if (boxes[a].material.color.equals(new Color(0,0,1))) {
                loadFont('Blue Won !', {x: -1.5, y: 1.5, z: 0}, new Color(0,0,1))
                winner = 1
            }
            }
    }
}


function loadFont(newText, position, newColor){
    const loader = new FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
        const geometry = new TextGeometry( newText, {
            font: font,
            size: 0.5,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 0
        } );
        const material = new THREE.MeshBasicMaterial( { color: newColor } );
        const text = new THREE.Mesh( geometry, material );
        scene.add( text );
        textObject.push(text)
        text.position.set(position.x, position.y, position.z)
    } );
}

function CheckIfSomeoneWon() {
    if (turn >= 5) {
        CheckLine(0,1,2)
        CheckLine(3,4,5)
        CheckLine(6,7,8)
        CheckLine(0,3,6)
        CheckLine(1,4,7)
        CheckLine(2,5,8)
        CheckLine(0,4,8)
        CheckLine(2,4,6)
    }

    if (turn >= 9 && winner == 0) {
        loadFont('No one won !', {x: -1.5, y: 1.5, z: 0}, new Color(1,1,1))
    }
}

function ResetColors() {
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].material.color.set(0xffffff)
    }
}



function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();