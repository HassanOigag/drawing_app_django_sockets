console.log('Hello World from main.js!');
let canvas = document.getElementById('board');
let ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 1000;
let color = getRandomColor();
let drawing = false;
let boxWidth = 50;
let boxHeight = 50;
const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/draw/room/');

let mouse = {x: -100, y: -100};

let messagesQueue = [];

function drawCircle(x, y, radius, color) {
    console.log("drawing circle", x, y);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

canvas.addEventListener('mousedown', () => {
    drawing = true;
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
}   );

//mouse is dragged
canvas.addEventListener('mousemove', function(e) {
    if (!drawing) return;
    mouse.x = e.clientX - canvas.getBoundingClientRect().left;
    mouse.y = e.clientY - canvas.getBoundingClientRect().top;
    // console.log(mouse);
    let data = {x: mouse.x, y: mouse.y, "color": color};
    console.log("sending : " + JSON.stringify(data));
    if (chatSocket.readyState === WebSocket.OPEN)
        chatSocket.send(JSON.stringify(data));
    else
        console.log("socket not open");
    draw();
});

// canvas.addEventListener('click', function(e) {
//     color = getRandomColor();
//     draw();
// });

document.addEventListener('keydown', function(e) {
    console.log(e.code);
    if (e.code === 'KeyC') {
        console.log('Clear');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (e.code === 'KeyB')
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.background = color;
    }

    //change color on space $

    if (e.code === 'Space') {
        color = getRandomColor();
    }
});

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i=0; i<6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    requestAnimationFrame(draw);
}



function draw() {
    drawCircle(mouse.x, mouse.y, 10, color);
}

requestAnimationFrame(gameloop);


//websockets

chatSocket.onopen = function(e) {
    // console.log('open', e);
    //send data
    console.log("connected to websocket");
    chatSocket.send(JSON.stringify(data));
}
chatSocket.onmessage = function(e) {
    console.log("got message", e.data);
    let data = JSON.parse(e.data);
    drawCircle(data.x, data.y, 10, data.color);
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly', e);
}

chatSocket.onerror = function(error) {
    console.error('WebSocket Error: ', error);
};
