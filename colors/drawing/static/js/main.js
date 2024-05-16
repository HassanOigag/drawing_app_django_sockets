console.log('Hello World from main.js!');
let canvas = document.getElementById('board');
let ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 800;
let color = getRandomColor();

let boxWidth = 50;
let boxHeight = 50;
const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/draw/room/');

let mouse = {x: -100, y: -100};

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

//mouse is dragged
canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX - canvas.getBoundingClientRect().left;
    mouse.y = e.clientY - canvas.getBoundingClientRect().top;
    // console.log(mouse);
    chatSocket.send(JSON.stringify(mouse));
    draw();
});

canvas.addEventListener('click', function(e) {
    color = getRandomColor();
    draw();
});

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
    // ctx.fillStyle = 'red';
    // ctx.fillRect(mouse.x, mouse.y, 50, 50);
}

requestAnimationFrame(gameloop);


//websockets

chatSocket.onopen = function(e) {
    console.log('open', e);
    //send data
    chatSocket.send(JSON.stringify(mouse));
}
chatSocket.onmessage = function(e) {
    console.log(e.data);
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
}

