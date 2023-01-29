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
    console.log("id is" + id)
}else{
    alert("invalid id")
}
var player = url.searchParams.get("p");
if(player == null || (player != "1" && player != "2")){
    alert("invalid player")
}else{
    console.log("id is" + id)
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


var frame = {
  start: null,
  delta: null,
  count: 0
};

const INTERVAL = 16;


console.log('games/'+id)
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
    console.log("place type plane")
    placeType = "plane"
})

document.getElementById("ship").addEventListener("click",()=>{
    console.log("place type ship")
    placeType = "ship"
})


gameRef.on('value', (snapshot) => {

  const data = snapshot.val();
  console.log(data)
  console.log(JSON.parse(data))



  if(JSON.parse(data) == null){
    console.log('creating new room')
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
  render()
};


canvas.addEventListener("click",(e)=>{

    if(mode == "place"){
        if(placeType == "plane" && isPointOnSide(cursor_x,cursor_y-50)){
            game.players[player-1].pieces.push({
                pos:{
                    x:cursor_x,
                    y:cursor_y-50,
                },
                type:placeType
            })
        }

        if(placeType == "ship" && !isPointOnLand(cursor_x,cursor_y-50) && isPointOnSide(cursor_x,cursor_y-50)){
            game.players[player-1].pieces.push({
                pos:{
                    x:cursor_x,
                    y:cursor_y-50,
                },
                type:placeType
            })
        }


        gameRef.set(JSON.stringify(game))
        render()
    }else{
        console.log(mode)
    }
})




function render(){
     ctx.clearRect(0, 0, canvas.width, canvas.height); 


    renderUI()
    drawIslandP1()
    drawIslandP2()
    

    for(var playerNum = 1; playerNum<=2;playerNum++){
        game.players[playerNum-1].pieces.forEach((piece,index)=>{
            console.log("drawing, ", piece.type)
            drawPieceAt(piece.pos.x,piece.pos.y,playerNum,piece.type)
            
        })
    }

}

function isPointOnSide(px,py){

    return !(canvas.height - py > 150)
}

function isPointOnLand(px,py){


    let start = game.islands[0].start
    let cp1 =   game.islands[0].cp1
    let cp2 =   game.islands[0].cp2
    let end =   game.islands[0].end

    let x = start.x
    let y = start.y

    let curves = [
        [start.x, start.y, cp1.x , cp1.y],
        [cp2.x, cp2.y, end.x, end.y]
    ]

    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < curves.length; i++) {
        let c = curves[i];
        ctx.quadraticCurveTo(c[0], c[1], c[2], c[3]);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);

    return ctx.isPointInPath(px , py)


}

function checkPoint(x, y, curves, canvasColor, strokeStyle) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 0; i < curves.length; i++) {
    let c = curves[i];
    ctx.quadraticCurveTo(c[0], c[1], c[2], c[3]);
  }
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);

  ctx.fillStyle = pattern;
  ctx.fill();

}




function drawCurve(x, y, curves, canvasColor, strokeStyle) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 0; i < curves.length; i++) {
    let c = curves[i];
    ctx.quadraticCurveTo(c[0], c[1], c[2], c[3]);
  }
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);

  ctx.fillStyle = pattern;
  ctx.fill();
}


function drawCurve2(x, y, curves, canvasColor, strokeStyle) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 0; i < curves.length; i++) {
    let c = curves[i];
    ctx.quadraticCurveTo(c[0], c[1], c[2], c[3]);
  }
  ctx.lineTo(0, 0);
  ctx.lineTo(canvas.width, 0);

  ctx.fillStyle = pattern;
  ctx.fill();
}





function drawIslandP1(){

  let start = game.islands[0].start
  let cp1 =   game.islands[0].cp1
  let cp2 =   game.islands[0].cp2
  let end =   game.islands[0].end


  console.log(start,cp1,cp2,end)
    drawCurve(
        start.x,
        start.y, [
            [start.x, start.y, cp1.x , cp1.y],
            [cp2.x, cp2.y, end.x, end.y]
        ],
        pattern
    );
}



function drawIslandP2(){
    let start = game.islands[1].start
    let cp1 =   game.islands[1].cp1
    let cp2 =   game.islands[1].cp2
    let end =   game.islands[1].end

    ctx.beginPath();
    ctx.moveTo(canvas.width - start.x, canvas.height - start.y); //canvas.height - start.y
    ctx.bezierCurveTo(canvas.width - cp1.x, canvas.height - cp1.y, canvas.width - cp2.x, canvas.height - cp2.y, canvas.width - end.x, canvas.height - end.y);
    ctx.stroke();

    drawCurve2(
        canvas.width - start.x,
        canvas.height - start.y, [
            [canvas.width - start.x, canvas.height - start.y, canvas.width - cp1.x ,canvas.height -  cp1.y],
            [canvas.width - cp2.x, canvas.height - cp2.y, canvas.width - end.x, canvas.height - end.y]
        ],
        pattern
    );
}



function renderUI(){
    ctx.font = "20px Arial";
    ctx.fillText(player == 1 ? "Player One" : "Player Two", 10, 20);
}


function drawPieceAt(xOffset, yOffset,p,typee) {

    if(p == player){
        if(typee == "plane"){
            console.log("type is ",typee)
            drawImage(ctx,planeImg,xOffset-25,yOffset-25,50,50,0);
        }
        if(typee == "ship"){
            drawImage(ctx,shipImg,xOffset-25,yOffset-25,50,50,180);
        }
    }else{
        var x = canvas.width - xOffset
        var y = canvas.height - yOffset
        console.log("type is ",typee)
        if(typee == "plane"){
            drawImage(ctx,planeImg,canvas.width-xOffset-25,canvas.height-yOffset-25,50,50,180);
        }
        if(typee == "ship"){
            drawImage(ctx,shipImg,canvas.width-xOffset-25,canvas.height-yOffset-25,50,50,0);
        }
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