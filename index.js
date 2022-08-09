var canvas = document.querySelector('canvas')

canvas.width = 700;
canvas.height = 400;

const dinowidth = 73;
const dinoheight = 44;
const cactuswidth = 52;
const cactusheight = 54;
const init_position_x = 20;
const init_position_y = canvas.height - dinoheight;
const cactus_init_x = canvas.width - cactuswidth;
const cactus_init_y = canvas.height - cactusheight;
const dy = 25
const gravity = 2

var c = canvas.getContext('2d');
c.font = "30px Arial";

var dino_img = new Image();
dino_img.src = './images/trex.png';

var cactus_img = new Image();
cactus_img.src = './images/cactus.png';

var meteor_img = new Image();
meteor_img.src = './images/meteor.jpg';

function Dino(x,y,dy) {
    this.x = x;
    this.y = y;
    this.dy = dy;
}

function Cactus(x,y) {
    this.x = x;
    this.y = y;
}

var cactus_array = []
var distance_btw_cactus = 0;
var next_cactus_appearance = Math.floor(Math.random() * canvas.width/3);
var cactus_speed = 7;
var cactus_buffer = 30;
var speed_increase = 0
var score = 0

function create_cactus() {
    // console.log("next cactus appearance: ",next_cactus_appearance)
    if (distance_btw_cactus >= next_cactus_appearance) {
        new_cactus = new Cactus(cactus_init_x, cactus_init_y);
        cactus_array.push(new_cactus)
        distance_btw_cactus = 0;
        next_cactus_appearance = Math.floor(Math.random() * canvas.width/3);
        if (next_cactus_appearance < cactus_buffer) {
            next_cactus_appearance += cactus_buffer;
        }
    }
    distance_btw_cactus += speed_increase;
}

var speed_increased = false;

function cactus_movement() {
    for (i=0; i<cactus_array.length; i++){
        cactus_array[i].x -= cactus_speed;
        if (cactus_array[i].x + cactuswidth < 0) {
            cactus_array.splice(i, 1)
            score += 1
        } 
    }
    if(score % 5 === 0 && speed_increased === false) {
        speed_increase += 1;
        cactus_speed += 1;
        
        cactus_buffer += 20;
        console.log(cactus_buffer)
        speed_increased = true;
    }
    if (score % 5 != 0) {
        speed_increased = false
    }

    
    console.log(cactus_speed)
    


}

dino = new Dino(init_position_x, init_position_y,dy)


var game_start = false;
var run = false;
var game_over = false;
var jumping = false;

addEventListener('keydown', function (event) {
    if (event.keyCode===32) {
        jumping = true;
    }
    if (game_over === true) {
        game_over = false;
        cactus_array = [];
        dino = new Dino(init_position_x, init_position_y,dy);
        speed_increase = 0;
        cactus_speed = 7;
        cactus_buffer = 40;
        buffer_increase_rate = 10;
        speed_increased = false;


    }
    if (run === false) {
        run = true;
    }
    if (game_start === false) {
        game_start = true;
    }
})

function game_start_text() {
    if (game_start === false){
        c.fillText("Press Space to jump", 10,50);
        c.fillText("See How High You Can Score!", 10,100);

    }    
}

var highscore = 0

function highscore_text() {
    c.fillText("High score: " + highscore, 500, 50)
}

function game_over_text() {
    if (game_over === true) {
        if (score > highscore) {
            highscore = score;
        }
        score = 0
        c.fillText("Game Over", 10,50)
        c.fillText("Press Spacebar to replay", 10,90)
    }
}

function score_text() {
    if (run === true) {
        c.fillText("Score: " + score.toString(), 10 ,50)

    }
}
  
function jump() {
    dino.y -= dino.dy
    dino.dy -= gravity
    if (dino.y >= init_position_y) {
        jumping = false
        dino.dy = dy
    } 

}

const endgame_buffer = 30;

function endgame() {
    for (i=0; i<cactus_array.length; i++) {
       if (dino.x + dinowidth - endgame_buffer>= cactus_array[i].x && dino.y + dinoheight - endgame_buffer >= cactus_array[i].y && dino.x <= cactus_array[i].x + cactuswidth) {
        run = false;
        game_over = true;
       }
    }

}

function draw_rect(x,y,width,height) {
    c.beginPath();
    c.rect(x,y,width,height);
    c.stroke();
}


const size_buffer = 30

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0, innerWidth, innerHeight);
    if (run === true) {
        if (jumping === true) {
            jump();
        }
        endgame();
        create_cactus(); 
        cactus_movement();        
    }
    game_start_text();
    game_over_text();
    score_text();
    highscore_text();
    c.drawImage(dino_img, dino.x - size_buffer, dino.y - size_buffer, dinowidth + size_buffer, dinoheight + size_buffer)
    // draw_rect(dino.x, dino.y, dinowidth, dinoheight);
    for (i=0;i<cactus_array.length;i++){
        // draw_rect(cactus_array[i].x, cactus_array[i].y, cactuswidth, cactusheight)
        c.drawImage(cactus_img, cactus_array[i].x, cactus_array[i].y, cactuswidth, cactusheight)

    }
}

animate();