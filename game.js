var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var bird_img = new Image();
var bg_img = new Image();
var fg_img = new Image();
var pipeUp_img = new Image();
var pipeBottom_img = new Image();

bird_img.src = "img/flappy_bird_bird.png";
bg_img.src = "img/flappy_bird_bg.png";
fg_img.src = "img/flappy_bird_fg.png";
pipeUp_img.src = "img/flappy_bird_pipeUp.png";
pipeBottom_img.src = "img/flappy_bird_pipeBottom.png";

// Звуковые файлы
var fly = new Audio();
var score_audio = new Audio();

fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";

var score = {
    score: 0,

    draw: function() {
        ctx.fillStyle = "#000";
        ctx.font = "24px Verdana";
        ctx.fillText("Счет: " + this.score, 10, canvas.height - 20);
    },

    addScore: function() {
        this.score++;
    }
}

var bird = {

    bird_src: bird_img,
    x: 30,
    y: 200,
    vel: 0,
    rad: -10,

    draw: function() {
        ctx.save();
        ctx.translate(this.x + this.bird_src.width, this.y + this.bird_src.height);
        ctx.rotate(this.rad * Math.PI / 180);
        ctx.drawImage(this.bird_src, 0, 0);
        ctx.restore();
    },

    default: function () {
        this.x = 30;
        this.y = 200;
        this.rad = -50;
    }
}

var bg = {

    bg_src: bg_img,
    x: 0,
    y: -20,

    draw: function() {
        ctx.drawImage(this.bg_src, this.x, this.y, 288, 550);
    }


}
class pipe {
    constructor() {
        this.pipeB = pipeBottom_img;
        this.pipeU = pipeUp_img;
        this.x = 288;
        this.y1 = Math.floor(Math.random() * (400 - 350)) + 350;
        this.y2 = Math.floor(Math.random() * (100 - 50)) - 50;

        this.draw = function () {
            
            ctx.drawImage(this.pipeB, this.x, this.y1);
            ctx.drawImage(this.pipeU, this.x, this.y2);
        };
    }
}
var fg1 = {

    fg_src: fg_img,
    x: 0,
    y: 420,
    
    moveFg: function() {
        if (this.x <= -288 + spead) {this.x = 288 - spead};
        ctx.drawImage(this.fg_src, this.x, this.y, 288, 92);
    }
}
var fg2 = {

    fg_src: fg_img,
    x: 288,
    y: 420,
    
    moveFg: function() {
        if (this.x <= -288 + spead) {this.x = 288 - spead};
        ctx.drawImage(this.fg_src, this.x, this.y, 288, 92);
    }
}

var spead = 1;
var pipeList = [];
var count = 0;
var isGame = false;
function Game() {

    requestAnimationFrame(Game);

    bg.draw();
    bird.draw();
    pipeList.forEach(function(pipe) {
        pipe.draw();
    })
    bird.draw();
    fg1.moveFg();
    fg2.moveFg();
    score.draw();
    fg1.x -= 1 * spead;
    fg2.x -= 1 * spead;
    bg.y = -(bird.y / 100) * 3;

    if (!isGame) {return};

    if(count++ > 180 / spead){
        pipeList.unshift(new pipe);
        count = 0;
    }

    pipeList.forEach(function(pipe, index) {
        if (pipe.x < -50) {
            pipeList.splice(index, 1);
        } else {
            pipe.x -= 1 * spead;
        }
    })

    if (bird.vel < 1) {bird.vel += 0.1;}

    if (bird.rad > 50) {
        bird.y += bird.vel * 5;
    } else if (bird.rad > 30) {
        bird.y += bird.vel * 3.5;
    } else if (bird.rad > 0) {
        bird.y += bird.vel * 1.5;
    } else {
        bird.y += bird.vel * 1;
    };
    if (bird.rad < 60) {bird.rad += 2};
    if ((bird.y < 0) || (bird.y + bird.bird_src.height > canvas.height-125)) {
        isGame = false;
        score.score = 0;
        spead = 0;
        document.getElementById("msg").textContent = "Game over";
        document.getElementById("msg").style.opacity = "1";
    };
    pipeList.forEach(function(pipe) {
        if (((bird.y + bird.bird_src.height * 2 > pipe.y1) && 
            ((bird.x + bird.bird_src.width > pipe.x) && (bird.x + bird.bird_src.width < pipe.x + pipe.pipeB.width)))
        || ((bird.y + bird.bird_src.height < pipe.y2 + pipe.pipeU.height) && 
            ((bird.x + bird.bird_src.width * 2 > pipe.x) && (bird.x + bird.bird_src.width * 2 < pipe.x + pipe.pipeU.width)))) {
            isGame = false;
            score.score = 0;
            spead = 0;
            document.getElementById("msg").textContent = "Game over";
            document.getElementById("msg").style.opacity = "1";
        }
    })
    pipeList.forEach(function(pipe) {
        if ((pipe.x < bird.x) && (pipe.x + 2 * spead > bird.x)) {
            score.addScore();
            spead = 1 + Math.round(score.score / 20);
            score_audio.play();
        }
    })
}

document.addEventListener("pointerdown", function(){
    if (isGame) {
        bird.rad = -50;
        bird.vel = -3;
        fly.play();
    } else {
        bird.default();
        pipeList.splice(0, pipeList.length);
        spead = 1;
        isGame = true;
        document.getElementById("msg").style.opacity = "0";
    }
});

requestAnimationFrame(Game);