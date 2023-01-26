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


var url_string = (window.location.href).toLowerCase();
var url = new URL(url_string);
var id = url.searchParams.get("id");

if(id != null){
    console.log("id is" + id)
}else{
    alert("invalid id")
}



firebase.initializeApp(firebaseConfig);
console.log('games/'+id)
var gameRef = firebase.database().ref('games/'+id);

var pieces = []


gameRef.on('value', (snapshot) => {

  const data = snapshot.val();
  console.log(data)
  console.log(JSON.parse(data))


  pieces = JSON.parse(data)
  render()


});




const plane = 'M55.98,80.29c-.04,.76-.09,1.52-.14,2.28-.39,5.73-.73,46.8,13.13,24.82,2.19-3.47,2.58-7.74,2.87-11.84,.42-5.97,.75-11.94,.97-17.92,9.65-2.32,18.99-5.98,27.61-10.89,4.88-2.78,9.83-6.3,11.75-11.58,.92-2.52,1.07-5.25,.96-7.92-.15-3.71-.93-7.67-3.6-10.24-3.9-3.75-10.1-3.14-15.46-2.38-7.05,1.01-14.13,1.85-21.22,2.53-.35-9.8-.96-19.59-1.84-29.36-.21-2.29-.55-4.84-2.33-6.31-2.42-2-6.35-.78-8.26,1.72s-2.33,5.79-2.63,8.92c-.87,8.77-1.14,17.54-1.22,26.31l.25-.02c-2.83,.17-5.66,.32-8.49,.45-10.93,.47-23.47-1.31-34.21,1.16-24.3,5.58-12.24,30.96,6.06,36.59,6.85,2.11,13.96,3.3,21.11,3.76,5.17,.33,10.37,.27,15.53-.16l15.32-2.43c.22-.05,.44-.1,.65-.16'
const island = "M333.59,78.97c-27.74,13.77-59.87,18.5-90.4,13.3-6.13-1.04-12.45-2.47-18.5-1-7.09,1.73-12.61,7.16-19.03,10.63-10.23,5.52-22.34,5.88-33.72,8.25-13.41,2.79-26.13,8.49-39.67,10.54-13.54,2.05-29-.4-37.67-11-1.76-2.15-3.26-4.64-5.64-6.07-2.35-1.41-5.2-1.59-7.88-2.18-9.71-2.14-17.4-9.9-27.05-12.26-4.65-1.14-9.5-.96-14.28-.77L.5,89.95V.5H333.59V78.97Z"


const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)




var svg = document.getElementById("svg")
const rc = rough.svg(svg);
var mode = "place"

var cursor_x = -1;
var cursor_y = -1;
document.onmousemove = function(event)
{
 cursor_x = event.pageX;
 cursor_y = event.pageY;
}



function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}




const infoTab = document.getElementById("info")


document.getElementById("place").addEventListener("click",()=>{
    mode = "place"
})

document.getElementById("fire").addEventListener("click",()=>{
    mode = "fire"
})

document.getElementById("move").addEventListener("click",()=>{
    mode = "move"
})

var clickedPlaneFirst = false

svg.addEventListener("click",(e)=>{
    if(clickedPlaneFirst == false) {

        if(mode == "place"){
            console.log("press")
            pieces.push({
                index:pieces.length,
                pos:{
                    x:e.clientX,
                    y:e.clientY
                }
            })
            gameRef.set(JSON.stringify(pieces));
            console.log(JSON.stringify(pieces))
        }
        render()

    }else{
        clickedPlaneFirst = false
    }
    // if(mode != "move"){
    //     if(!infoTab.hasAttribute("hidden")){
    //         infoTab.setAttribute("hidden","")
    //     }
    // }

})



function click(){
    clickedPlaneFirst = true


    if(mode == "move"){

        
        infoTab.removeAttribute("hidden")
        infoTab.style.left = cursor_x + "px"
        infoTab.style.top = cursor_y + "px"
    }
}



function render(){
    svg.innerHTML = ""
    // svg.append(rc.rectangle(0, 0, 1000, 1000, { roughness: 1, fill: 'blue', fillStyle:"cross-hatch",   seed: 1, hachureAngle:45,hachureGap:10,fillWeight:0.2}))

    iWidth = 336.36


    islandNode = rc.path(island, {roughness: 0.8,fill:"rgba(0,0,0,0.1)",combineNestedSvgPaths: true,seed:1})
    
    islandNode.firstChild.setAttribute("vector-effect","non-scaling-stroke")
    islandNode.firstChild.setAttribute('transform', `scale(${(vw / iWidth) + 0.1},1) translate(-5,-5)`);
    
    islandNode.children[1].setAttribute('stroke-width', `2`);
    islandNode.children[1].setAttribute("vector-effect","non-scaling-stroke")
    islandNode.children[1].setAttribute('transform', `scale(${(vw / iWidth) + 0.1},1) translate(-5,-5)`);


    islandNode2 = rc.path(island, {roughness: 0.8,fill:"rgba(0,0,0,0.1)",combineNestedSvgPaths: true,seed:1})
    
    islandNode2.firstChild.setAttribute("vector-effect","non-scaling-stroke")
    islandNode2.firstChild.setAttribute('transform', `scale(${(vw / iWidth) + 0.1},1)  rotate(180) translate(${-iWidth},${-vh})`);
    
    islandNode2.children[1].setAttribute('stroke-width', `2`);
    islandNode2.children[1].setAttribute("vector-effect","non-scaling-stroke")
    islandNode2.children[1].setAttribute('transform', `scale(${(vw / iWidth) + 0.1},1)  rotate(180) translate(${-iWidth +5},${-vh})`);




    svg.append(islandNode) 
    svg.append(islandNode2)

    pieces.forEach((pieceInfo)=>{
        var planeNode = moveSection(pieceInfo.pos.x, pieceInfo.pos.y)

        planeNode.setAttribute("onclick","click()")
        planeNode.setAttribute("myAttr",pieceInfo.index)

        const divMove = (e)=>{
            if("touches" in e){
                console.log("TOUCHHH")
                divMoveM({clientX:e.touches[0].clientX, clientY:e.touches[0].clientY})
            }else{
                console.log("NO TOUCHHH",e)
                divMoveM(e)
            }
        }

        const divMoveM = (e)=>{
            var id = pieceInfo.index

            console.log('dray')

            console.log(pieces[pieceInfo.index].pos.x - e.clientX )

            const maxDis = 60

            var transX
            if(Math.abs(pieces[pieceInfo.index].pos.x - e.clientX) < maxDis ){
                transX = e.clientX+25
            }else{
                if(pieces[pieceInfo.index].pos.x - e.clientX < 0){
                    transX = pieces[pieceInfo.index].pos.x+25 + maxDis
                }else{
                    transX = pieces[pieceInfo.index].pos.x+25 - maxDis
                }
            }

            var transY
            if(Math.abs(pieces[pieceInfo.index].pos.y - e.clientY) < maxDis ){
                transY = e.clientY+25
            }else{
                if(pieces[pieceInfo.index].pos.y - e.clientY < 0){
                    transY = pieces[pieceInfo.index].pos.y+25 + maxDis
                }else{
                    transY = pieces[pieceInfo.index].pos.y+25 - maxDis
                }
            }


            var transformAttr = ' translate(' + ( transX ) + ',' + ( transY ) + ')';

            planeNode.setAttribute('transform', transformAttr + "rotate(180)" + "scale(0.4)");


        }

        planeNode.addEventListener('mousedown', (e)=>{

            clickedPlaneFirst = true
            window.addEventListener('mousemove',divMove, true);
        }, false);

         planeNode.addEventListener('mouseup', (e)=>{
            window.removeEventListener('mousemove', divMove, true);

            pieces[pieceInfo.index].pos.x = e.clientX
            pieces[pieceInfo.index].pos.y = e.clientY
        }, false);


        // planeNode.addEventListener('mouseup', (e)=>{
        //     window.removeEventListener('mousemove', divMove, true);
        //     console.log("ending",cursor_x)
        //     pieces[pieceInfo.index].pos.x = e.clientX
        //     pieces[pieceInfo.index].pos.y = e.clientY
        // }, false);





        const divMoveT = (e)=>{
            console.log(e.touches[0])
            var id = pieceInfo.index

            console.log('dray')

            var transformAttr = ' translate(' + ( e.touches[0].clientX+25 ) + ',' + ( e.touches[0].clientY+25 ) + ')';

            planeNode.setAttribute('transform', transformAttr + "rotate(180)" + "scale(0.4)");
            pieces[pieceInfo.index].pos.x = e.touches[0].clientX
            pieces[pieceInfo.index].pos.y = e.touches[0].clientY

        }

        planeNode.addEventListener('touchstart', ()=>{
            clickedPlaneFirst = true
            window.addEventListener('touchmove',divMove, true);
        }, false);


        window.addEventListener('touchend', ()=>{
            window.removeEventListener('touchmove', divMove, true);
        }, false);
        svg.append(planeNode)
    })
}


// setInterval(render,150)


function moveSection(xOffset, yOffset) {

    var planeNode = rc.path(plane, {roughness: 1.2,fillStyle: 'solid',fill:"lightgrey",combineNestedSvgPaths: true,fillWeight: 1,seed:1});

    var transformAttr = ' translate(' + (xOffset+25) + ',' + (yOffset+25) + ')';
    planeNode.setAttribute('transform', transformAttr + "rotate(180)" + "scale(0.4)");

    planeNode.style.position = 'absolute';
    planeNode.style.top = yOffset + 'px';
    planeNode.style.left = xOffset + 'px';

    return (planeNode)

}


function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
  window.addEventListener('mousemove', divMove, true);
}


render()


