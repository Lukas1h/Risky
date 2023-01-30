const firebaseConfig = {
  apiKey: "AIzaSyB0YLQco96m_eL0SAfErzjnFIoyPub5cQ8",
  authDomain: "riskygame.firebaseapp.com",
  databaseURL: "https://riskygame-default-rtdb.firebaseio.com",
  projectId: "riskygame",
  storageBucket: "riskygame.appspot.com",
  messagingSenderId: "683928782690",
  appId: "1:683928782690:web:85bd03cbfce7f838a40e3b",
  measurementId: "G-73Q0XZXSKV"
};
firebase.initializeApp(firebaseConfig);


var url_string = (window.location.href).toLowerCase();
var url = new URL(url_string);
var id = url.searchParams.get("id");
if(id != null){
    // console.log("id is" + id)
}else{
    alert("invalid id")
}
var player = url.searchParams.get("p");
if(player == null || (player != "1" && player != "2")){
    alert("invalid player")
}else{
    // console.log("id is" + id)
}


const plane = 'M55.98,80.29c-.04,.76-.09,1.52-.14,2.28-.39,5.73-.73,46.8,13.13,24.82,2.19-3.47,2.58-7.74,2.87-11.84,.42-5.97,.75-11.94,.97-17.92,9.65-2.32,18.99-5.98,27.61-10.89,4.88-2.78,9.83-6.3,11.75-11.58,.92-2.52,1.07-5.25,.96-7.92-.15-3.71-.93-7.67-3.6-10.24-3.9-3.75-10.1-3.14-15.46-2.38-7.05,1.01-14.13,1.85-21.22,2.53-.35-9.8-.96-19.59-1.84-29.36-.21-2.29-.55-4.84-2.33-6.31-2.42-2-6.35-.78-8.26,1.72s-2.33,5.79-2.63,8.92c-.87,8.77-1.14,17.54-1.22,26.31l.25-.02c-2.83,.17-5.66,.32-8.49,.45-10.93,.47-23.47-1.31-34.21,1.16-24.3,5.58-12.24,30.96,6.06,36.59,6.85,2.11,13.96,3.3,21.11,3.76,5.17,.33,10.37,.27,15.53-.16l15.32-2.43c.22-.05,.44-.1,.65-.16'
const island = "M333.59,78.97c-27.74,13.77-59.87,18.5-90.4,13.3-6.13-1.04-12.45-2.47-18.5-1-7.09,1.73-12.61,7.16-19.03,10.63-10.23,5.52-22.34,5.88-33.72,8.25-13.41,2.79-26.13,8.49-39.67,10.54-13.54,2.05-29-.4-37.67-11-1.76-2.15-3.26-4.64-5.64-6.07-2.35-1.41-5.2-1.59-7.88-2.18-9.71-2.14-17.4-9.9-27.05-12.26-4.65-1.14-9.5-.96-14.28-.77L.5,89.95V.5H333.59V78.97Z"

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

var cursor_x = -1;
var cursor_y = -1;
document.onmousemove = function(event){
 cursor_x = event.pageX;
 cursor_y = event.pageY;
}

var xPan = 0
var yPan = 0


var frame = 0
const INTERVAL = 16;


// console.log('games/'+id)
var gameRef = firebase.database().ref('games/'+id);


var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");


var players = [{
    pieces:[],
    name:"playerOne"
},{
    pieces:[],
    name:"playerTwoo"
}]

var game = {
    islands:[
        {
            start:{ x: 0,    y: canvas.height-  70},
            cp1:{ x: 0+(canvas.width*0.25),   y: canvas.height-70-10  },
            cp2:{ x: 0+(canvas.width*0.75) ,   y: canvas.height-70-20  },
            end:{ x: 0+canvas.width,   y:  canvas.height-70 },
        },
        {
            start:{ x: 0,    y: canvas.height-70  },
            cp1:{ x: 0+(canvas.width*0.25),   y: canvas.height-70-10  },
            cp2:{ x: 0+(canvas.width*0.75) ,   y: canvas.height-70-20  },
            end:{ x: 0+canvas.width,   y:  canvas.height-70 },
        },
    ],
    players:[{
        pieces:[],
        name:"playerOne",
        mode:'ple',
        placeType:"plane"
    },{
        pieces:[],
        name:"playerTwoo",
        mode:'place'
    }]
}

const mode = "place"
var placeType = "plane"


document.getElementById("plane").addEventListener("click",()=>{
    // console.log("place type plane")
    placeType = "plane"
})

document.getElementById("ship").addEventListener("click",()=>{
    // console.log("place type ship")
    placeType = "ship"
})


gameRef.on('value', (snapshot) => {

  const data = snapshot.val();
//   console.log(data)
//   console.log(JSON.parse(data))



  if(JSON.parse(data) == null){
    // console.log('creating new room')
  }else{
    game = JSON.parse(data)
  }
  render()


});


const planeImg = new Image();
planeImg.src = "icons/plane1.png"


const shipImg = new Image();
shipImg.src = "icons/boat.png"


const groundImg = new Image();
groundImg.src = "icons/forest_tiles.png"

var pattern = ctx.createPattern(groundImg, "repeat");

groundImg.onload = () => { // Only use the image after it's loaded
  pattern = ctx.createPattern(groundImg, "repeat");
};

waterFrame = 1

const waterImg1 = new Image();
waterImg1.src = "icons/water1.png"
const waterImg2 = new Image();
waterImg2.src = "icons/water2.png"
const waterImg3 = new Image();
waterImg3.src = "icons/water3.png"

var waterPattern1 = ctx.createPattern(waterImg1, "repeat");
var waterPattern2 = ctx.createPattern(waterImg2, "repeat");
var waterPattern3 = ctx.createPattern(waterImg3, "repeat");

waterImg1.onload = () => { // Only use the image after it's loaded
  waterPattern1 = ctx.createPattern(waterImg1, "repeat");
};
waterImg2.onload = () => { // Only use the image after it's loaded
  waterPattern2 = ctx.createPattern(waterImg2, "repeat");
};

waterImg3.onload = () => { // Only use the image after it's loaded
  waterPattern3 = ctx.createPattern(waterImg3, "repeat");
};

var justDraggin = false


function getWindowToCanvas(x, y) {
  var rect = canvas.getBoundingClientRect();
  var screenX = (x - rect.left) * (canvas.width / rect.width);
  var screenY = (y - rect.top) * (canvas.height / rect.height);
  var transform = ctx.getTransform();
  if (transform.isIdentity) {
    return {
      x: screenX,
      y: screenY
    };
  } else {
    //   console.log(transform.invertSelf()); //don't invert twice!!
    const invMat = transform.invertSelf();

    return {
      x: Math.round(screenX * invMat.a + screenY * invMat.c + invMat.e),
      y: Math.round(screenX * invMat.b + screenY * invMat.d + invMat.f)
    };
  }
}


function handelClick(x,y){

    if(player == 1){
        game.players[player-1].pieces.push({
            pos:{
                x:getWindowToCanvas(x,y).x,
                y:getWindowToCanvas(x,y).y
            },
            rot:0,
            type:placeType
        })
        gameRef.set(JSON.stringify(game))
    }

    if(player == 2){
        game.players[player-1].pieces.push({
            pos:{
                x:getWindowToCanvas(x,y).x,
                y:getWindowToCanvas(x,y).y
            },
            rot:180,
            type:placeType
        })
        gameRef.set(JSON.stringify(game))
    }
}


function render(){


    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawWater()
    drawIsland(0,100)

    drawIsland(0,-1200)
    // drawIslandP1()
    // drawIslandP2()
    

    for(var playerNum = 1; playerNum<=2;playerNum++){
        game.players[playerNum-1].pieces.forEach((piece,index)=>{
            // console.log("drawing, ", piece.type)
            drawPieceAtNonBiased(piece.pos.x,piece.pos.y,piece.type,piece.rot)
            
        })
    }

}

function isPointOnSide(px,py){

    return !(canvas.height - py > 150)
}



function renderUI(){
    ctx.font = "20px Arial";
    ctx.fillText(player == 1 ? "Player One" : "Player Two", 10, 20);
}

function drawPieceAtNonBiased(xOffset, yOffset,type,rot) {



    if(type == "plane"){
        // console.log("type is ",typee)
        drawImage(ctx,planeImg,xOffset-25,yOffset-25,50,50,rot);
    }
    if(type == "ship"){
        drawImage(ctx,shipImg,xOffset-25,yOffset-25,50,50,rot + 180);
    }




}



function drawImage(ctx, image, x, y, w, h, degrees){
  ctx.save();
  ctx.translate(x+w/2, y+h/2);
  ctx.rotate(degrees*Math.PI/180.0);
  ctx.translate(-x-w/2, -y-h/2);
  ctx.drawImage(image, x, y, w, h);
  ctx.restore();
}

function drawIsland(xoff, yoff) {
    var xmul = 1.3
    var ymul = 2
  ctx.beginPath();
      ctx.moveTo(39 * xmul + xoff, 300 * ymul + yoff);
    ctx.bezierCurveTo(21 * xmul + xoff, 234 * ymul + yoff, 59 * xmul + xoff, 203 * ymul + yoff, 204 * xmul + xoff, 193 * ymul + yoff)
    ctx.bezierCurveTo(223.95260656845966 * xmul + xoff, 191.62395816769245 * ymul + yoff, 288 * xmul + xoff, 180 * ymul + yoff, 390 * xmul + xoff, 229 * ymul + yoff)
    ctx.bezierCurveTo(452 * xmul + xoff, 274 * ymul + yoff, 475 * xmul + xoff, 211 * ymul + yoff, 569 * xmul + xoff, 191 * ymul + yoff)
    ctx.bezierCurveTo(686 * xmul + xoff, 175 * ymul + yoff, 634 * xmul + xoff, 156 * ymul + yoff, 764 * xmul + xoff, 170 * ymul + yoff)
    ctx.bezierCurveTo(920 * xmul + xoff, 193 * ymul + yoff, 969 * xmul + xoff, 199 * ymul + yoff, 970 * xmul + xoff, 253 * ymul + yoff)
    ctx.bezierCurveTo(971 * xmul + xoff, 362 * ymul + yoff, 837 * xmul + xoff, 456 * ymul + yoff, 745 * xmul + xoff, 456 * ymul + yoff)
    ctx.bezierCurveTo(649 * xmul + xoff, 453 * ymul + yoff, 464 * xmul + xoff, 415 * ymul + yoff, 387 * xmul + xoff, 414 * ymul + yoff)
    ctx.bezierCurveTo(286 * xmul + xoff, 416 * ymul + yoff, 148 * xmul + xoff, 464 * ymul + yoff, 96 * xmul + xoff, 449 * ymul + yoff)
    ctx.bezierCurveTo(76.7835281763821 * xmul + xoff, 443.4567869739564 * ymul + yoff, 62 * xmul + xoff, 432 * ymul + yoff, 44 * xmul + xoff, 377 * ymul + yoff)
  ctx.closePath()
  ctx.fillStyle = pattern
  ctx.fill()

}


function drawWater(){

    ctx.fillStyle = waterPattern1
    ctx.fillRect(-3000,-3000, 6000, 6000);


}


let cameraOffset = { x: (window.innerWidth/2) - 300, y: (window.innerHeight/2)- 300 }
let cameraZoom = 1
let MAX_ZOOM = 1
let MIN_ZOOM = 0.3
let SCROLL_SENSITIVITY = 0.0005


function draw()
{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
    ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    ctx.scale(cameraZoom, cameraZoom)
    ctx.translate( -window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y )
 
    if(player == 2){
        ctx.rotate(Math.PI)
        ctx.translate(-canvas.width,-canvas.height)
    }
    ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
    render()
    
    // if(player == 2){
    //     ctx.translate(canvas.width,canvas.height)
    //     ctx.rotate(Math.PI)
    // }
    // renderUI()
    
    requestAnimationFrame( draw )
}



// Gets the relevant location from a mouse or single touch event
function getEventLocation(e)
{
    if (e.touches && e.touches.length == 1)
    {
        return { x:e.touches[0].clientX, y: e.touches[0].clientY }
    }
    else if (e.clientX && e.clientY)
    {
        return { x: e.clientX, y: e.clientY }        
    }
}


let isDragging = false
let dragStart = { x: 0, y: 0 }
justDraggin = false 
function onPointerDown(e)
{
    isDragging = true
    justDraggin = false
    dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x
    dragStart.y = getEventLocation(e).y/cameraZoom - cameraOffset.y
}

function onPointerUp(e)
{
    isDragging = false
    initialPinchDistance = null
    lastZoom = cameraZoom

    if(justDraggin == false){
        handelClick(e.clientX,e.clientY)
    }
    justDraggin = false
}

function onPointerMove(e)
{
    justDraggin = true
    if (isDragging)
    {
        cameraOffset.x = getEventLocation(e).x/cameraZoom - dragStart.x
        cameraOffset.y = getEventLocation(e).y/cameraZoom - dragStart.y
    }
}

function handleTouch(e, singleTouchHandler)

{
    if ( e.touches.length == 1 )
    {
        singleTouchHandler(e)
    }
    else if (e.type == "touchmove" && e.touches.length == 2)
    {
        isDragging = false
        handlePinch(e)
    }
}

let initialPinchDistance = null
let lastZoom = cameraZoom

function handlePinch(e)
{
    e.preventDefault()
    
    let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
    
    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2
    
    if (initialPinchDistance == null)
    {
        initialPinchDistance = currentDistance
    }
    else
    {
        adjustZoom( null, currentDistance/initialPinchDistance )
    }
}

function adjustZoom(zoomAmount, zoomFactor)
{
    if (!isDragging)
    {
        if (zoomAmount)
        {
            cameraZoom += zoomAmount
        }
        else if (zoomFactor)
        {
            cameraZoom = zoomFactor*lastZoom
        }
        
        cameraZoom = Math.min( cameraZoom, MAX_ZOOM )
        cameraZoom = Math.max( cameraZoom, MIN_ZOOM )
        
    }
}

canvas.addEventListener('mousedown', onPointerDown)
canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
canvas.addEventListener('mouseup', onPointerUp)
canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
canvas.addEventListener('mousemove', onPointerMove)
canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
canvas.addEventListener( 'wheel', (e) => adjustZoom(e.deltaY*SCROLL_SENSITIVITY))

// Ready, set, go
draw()

