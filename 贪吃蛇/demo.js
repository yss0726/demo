//点击开始游戏，startpage消失，游戏开始
//随机出现食物，三节蛇开始运动
//上下左右，改变运动方向
//判断迟到食物，食物消失，蛇加一
//判断游戏结束，弹出框
var startBtn = document.getElementById('startBtn');
var contect = document.getElementById('contect');
var startPage = document.getElementById('startPage');
var scoreBox = document.getElementById('score');
var lose = document.getElementById('lose');
var loseScore = document.getElementById('loseScore');
var close = document.getElementById('close');
var startP = document.getElementById('startP');
var startGameBool = true;
var startPaushBool = true;
var timer;
init();
//startGame();
function init() {
    //地图属性
    this.mapW = parseInt(getComputedStyle(contect).width);
    this.mapH = parseInt(getComputedStyle(contect).height);
    this.mapDiv = contect;
    //食物属性
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0;
    this.foodY = 0;
    //蛇属性
    this.snakeW = 20;
    this.snakeH = 20;
    this.snakeBody = [[3, 1, 'head'], [2, 1, 'body'], [1, 1, 'body']];

    //游戏属性
    this.direct = 'right';
    this.right = false;//加锁判断是否能够改变,当蛇头方向向右的时候，则无法向左跟右运动
    this.left = false;
    this.top = true;
    this.down = true;
    this.score = 0;
    bindEvent();

}

function startGame() {
   
    startPage.style.display = 'none';
    startP.style.display = 'block';
    food();
    snake();

   
}
function food() {
    var food = document.createElement('div');
    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';
    food.style.position = 'absolute';
    this.foodX = Math.floor(Math.random() * (this.mapW) / 20);
    this.foodY = Math.floor(Math.random() * (this.mapH) / 20);
    food.style.left = this.foodX * 20 + 'PX';
    food.style.top = this.foodY * 20 + 'px';
    this.mapDiv.appendChild(food).setAttribute('class', 'food');
}
function snake() {
    for (var i = 0; i < this.snakeBody.length; i++) {
        var snake = document.createElement('div');
        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';
        snake.style.position = 'absolute';
        snake.style.left = this.snakeBody[i][0] * 20 + 'px';
        snake.style.top = this.snakeBody[i][1] * 20 + 'px';
        snake.classList.add(this.snakeBody[i][2]);//classlist是给第二位添加类名
        this.mapDiv.appendChild(snake).classList.add('snake');

        switch (this.direct) {          //改变方向时则判断方向，假如为左则x-1，上y-1，下y+1，右x+1；
            case 'left':
                snake.style.transform = 'rotate(180deg)';
                break;
            case 'right':
                break;
            case 'top':
                snake.style.transform = 'rotate(270deg)';
                break;
            case 'down':
                snake.style.transform = 'rotate(90deg)';
                break;
            default:
                break;
        }
    }

}
function move() {//先水平竖直移动，，然后改变方向，删除蛇，重新渲染蛇
    for (var i = this.snakeBody.length - 1; i > 0; i--) {
        this.snakeBody[i][0] = this.snakeBody[i - 1][0];//蛇身的后一节继承前一节的位置
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
    }
    switch (this.direct) {          //改变方向时则判断方向，假如为左则x-1，上y-1，下y+1，右x+1；
        case 'left':
            this.snakeBody[0][0] -= 1;
            break;
        case 'right':
            this.snakeBody[0][0] += 1;
            break;
        case 'top':
            this.snakeBody[0][1] -= 1;
            break;
        case 'down':
            this.snakeBody[0][1] += 1;
            break;
        default:
            break;
    }
    removeClass('snake');//每移动一下，就删除原来的蛇
    snake();//重新渲染一条新的蛇
    if (this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY) {
        var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];//求出最后一位的x跟y
        var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
        switch (this.direct) {
            case 'left':
                this.snakeBody.push([snakeEndX - 1, snakeEndY, 'body']);//如果在左运动时吃到，则y等于snakeEndY,X+1
                break;
            case 'right':
                this.snakeBody.push([snakeEndX + 1, snakeEndY, 'body']);//若在右吃到，则y不变，x+1
                break;
            case 'top':
                this.snakeBody.push([snakeEndX, snakeEndY - 1, 'body'])//如果在上吃到，则x=snakeEndX,Y-1；
                break;
            case 'down':
                this.snakeBody.push([snakeEndX, snakeEndY + 1, 'body'])//若在下吃到，x=snakeEndX,Y+1
                break;
            default:
                break;
        }
        this.score += 1;
        scoreBox.innerHTML = this.score;
        removeClass('food');
        food();
    }
    if (snakeBody[0][0] < 0 || snakeBody[0][0] >= this.mapW / 20) {   //如果蛇头的x坐标小于零或者大于content宽的最大值，则失败
        relodGame();
    }
    if (snakeBody[0][1] < 0 || snakeBody[0][1] >= this.mapH / 20) { //如果蛇头的y坐标小于零或者大于content的高的最大值，则失败
        relodGame();
    }
    var snakeHX = this.snakeBody[0][0];//蛇头的横坐标
    var snakeHY = this.snakeBody[0][1];//蛇头的纵坐标
    for (var i = 1; i < this.snakeBody.length; i++) {
        if (snakeHX == snakeBody[i][0] && snakeHY == snakeBody[i][1]) {   //如果蛇头的横坐标或者纵坐标跟身体的横坐标或者纵坐标相等，则撞到，失败
            relodGame();
        }
    }
}
function relodGame() {   //游戏失败，重新加载游戏
    removeClass('food');
    removeClass('snake');
    clearInterval(timer);
    this.snakeBody = [[3, 1, 'head'], [2, 1, 'body'], [1, 1, 'body']];
    this.direct = 'right';
    this.right = false;//加锁判断是否能够改变,当蛇头方向向右的时候，则无法向左跟右运动
    this.left = false;
    this.top = true;
    this.down = true;
    lose.style.display = 'block';
    loseScore.innerHTML = this.score;
    this.score = 0;
    scoreBox.innerHTML = this.score;
   startGameBool = true;
    startPaushBool = true;
    startP.setAttribute('src', './imgs/start.png')

}
function removeClass(className) {
    var ele = document.getElementsByClassName(className);
    while (ele.length > 0) {
        ele[0].parentNode.removeChild(ele[0]);
    }
}
function setDirect(code) {
    switch (code) {
        case 37:
            if (this.left) {
                this.direct = 'left';
                this.left = false;
                this.right = false;
                this.top = true;
                this.down = true;
               
            }
            break;
        case 38:
            if (this.top) {
                this.direct = 'top';
                this.top = false;
                this.down = false;
                this.left = true;
                this.right = true;

            }
            break;
        case 39:
            if (this.right) {
                this.direct = 'right';
                this.right = false;
                this.left = false;
                this.top = true;
                this.down = true;

            }
            break;
        case 40:
            if (this.down) {
                this.direct = 'down';
                this.down = false;
                this.top = false;
                this.left = true;
                this.right = true;

            }
            break;
        default:
            break;

    }
}
//绑定键盘事件
function bindEvent() {
   
    close.onclick = function () {
        lose.style.display = 'none';
    }
    startBtn.onclick = function() {
        startAndPaush();
    }
    startP.onclick = function() {
        startAndPaush();
    }
}
function  startAndPaush() {
    if (startPaushBool) {
        if (startGameBool) {
            startGame();
            startGameBool = false;
        }
        startP.setAttribute('src', './imgs/pause.png');
        document.onkeydown = function (e) {
            var code = e.keyCode
            setDirect(code);
        }
         timer = setInterval(function () {
            move();//每隔两百毫秒就调用一次move进行移动
        }, 200)
        startPauseBool = false;

    } else {
        startP.setAttribute('src', './imgs/start.png');
        clearInterval(timer);
        document.onkeydown = function (e) {
            e.returnValue = false;
            return false;
        };
        startPaushBool = true;
    }
}



