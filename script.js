let canvas; // Для canvas
let context; // Для контекста canvas
let position_x = screen.width; // координата x для движущихся холмов, изначально они не видны
let position_y = 0; // координата y для движущихся холмов
let speed = 2; // скорость движения холмов(на сколько будет изменяться position_x)
let timer; // Для setTimeout()
let direction; // Направление движения, задается стрелками клавиатуры
let up = 0; // насколько дракон переместился вверх
let dragon_x = 100; // координата x дракона
let dragon_h = 46;
let dragon_y = 100;
let grass_y = 205;

const startButt = document.querySelector('#start-butt');
startButt.addEventListener('click', () => location.reload());

// Направления движения, задаются стрелками клавиатуры
let directions = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowRight: "right",
  ArrowDown: "down",
};

let dragon_image = new Image();
dragon_image.src = "images/dragon.png";

function drawDragon(context, x, y) {
  dragon_y = y - 46 + up;
  context.drawImage(dragon_image, x, dragon_y);
}

// Трава
function drawGrass(context) {
  context.beginPath();
  context.strokeStyle = "#0f0";
  context.lineWidth = 1;
  context.moveTo(0, grass_y);
  context.lineTo(canvas.width, grass_y);
  context.stroke();
}

const getRandInt = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;
let hills = {
  "height": [],
  "width": [],
  "x": []
};

const createNewHills = () => {
  for (const key in hills) {
    hills[key] = [];
  }
  for (let i = 0; i < 3; i++) {
    hills.height.push(getRandInt(50, 20));
    hills.width.push(getRandInt(20, 40));
    if (i === 0) {
      hills.x.push(getRandInt(150, 250));
    } else {
      hills.x.push(hills.x[i - 1] + getRandInt(120, 200));
    }
  }
}

createNewHills();

// Холмы
function drawHill(context, x, num) {
  w = hills.width[num - 1];
  h = hills.height[num - 1];
  checkCollision(dragon_x, x, w);
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 1;
  context.moveTo(x, grass_y);
  context.lineTo(x + w / 4, grass_y - h);
  context.lineTo(x + (w * 3) / 4, grass_y - h);
  context.lineTo(x + w, grass_y);
  context.stroke();
}

function animateDragon(context, canvas, speed) {
  //context = canvas.getContext("2d");
  // Очистить холст
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawDragon(context, dragon_x, grass_y); // Рисуем дракона
  drawGrass(context); // Рисуем траву
  // Рисуем холмы
  for (let i = 1; i <= 3; i++) {
    drawHill(context, position_x + hills.x[i - 1], i);
  }

  if (position_x + 490 + 50 > 0) {
    position_x -= speed;
  } else {
    position_x = canvas.width;
    createNewHills();
  }
  // console.log(position_x);
}
function stop() {
  clearInterval(timer);
}

function start(canvas, context) {
  stop();
  timer = setInterval(animateDragon, 10, context, canvas, speed);
}

function checkCollision(coord1, coord2, width) {
  if (coord1 > coord2 && coord1 < coord2 + width && up == 0) {
    alert("Game over");
    stop();
    return;
  }
}

window.onload = function () {
  canvas = document.getElementById("dragon");
  let context = canvas.getContext("2d");
  canvas.width = screen.width;
  if (canvas && context) {
    start(canvas, context);
  }
};

addEventListener("keydown", (event) => {
  direction = directions[event.key];
  if (direction == "up" && up === 0) {
    let jumpInterval = setInterval(() => {
      up -= 1;
    }, 1);
    setTimeout(() => {
      clearInterval(jumpInterval);
      let fallInterval = setInterval(() => {
        up += 1;
      }, 1);
      setTimeout(() => {
        clearInterval(fallInterval);
        up = 0;
      }, 350);
    }, 350);
  }
});