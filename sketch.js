var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var bullets = 70;
var score = 0;
var lives = 3;

var gameState = "fight";

var explosion_sound, lose_sound, win_sound;

function preload(){
  
  heart1Img = loadImage("heart_1.png");
  heart2Img = loadImage("heart_2.png");
  heart3Img = loadImage("heart_3.png");

  shooterImg = loadImage("shooter_2.png");
  shooter_shooting = loadImage("shooter_3.png");

  zombieImg = loadImage("zombie.png");

  bgImg = loadImage("bg.jpeg");

  explosion_sound = loadSound("explosion.mp3");
  win_sound = loadSound("win.mp3");
  lose_sound = loadSound("lose.mp3");
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = false;
   player.setCollider("circle",0,0,270)


   //creating sprites to depict lives remaining
   heart1 = createSprite(displayWidth-325,40,20,20)
   heart1.visible = false;
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-375,40,20,20)
    heart2.visible = false;
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-400,40,20,20);
    heart3.visible = false;
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4
   

    //creating groups for zombies and bullets
    bulletGroup = new Group();
    zombieGroup = new Group();
}

function draw() {
  background(0); 
  

  if(gameState === "fight"){
    if(lives === 3) {
      heart3.visible = true;
      heart2.visible = false;
      heart1.visible = false;
    }

    if(lives === 2) {
      heart3.visible = false;
      heart2.visible = true;
      heart1.visible = false;
    }

    if(lives === 1) {
      heart3.visible = false;
      heart2.visible = false;
      heart1.visible = true;
    }

    if(lives === 0) {
      heart3.visible = false;
      heart2.visible = false;
      heart1.visible = false;
    }

    //moving the player up and down and making the game mobile compatible using touches
    if(keyDown("UP_ARROW")||touches.length>0){
      player.y = player.y-30;
      touches = [];
    }
    if(keyDown("DOWN_ARROW")||touches.length>0){
      player.y = player.y+30;
      touches = [];
    }

    //release bullets and change the image of shooter to shooting position when space is pressed
    if(keyWentDown("space")){
      bullet = createSprite(displayWidth-1150,player.y-30,20,10)
      bullet.velocityX = 20
      
      bulletGroup.add(bullet)
      player.depth = bullet.depth
      player.depth = player.depth+2
      player.addImage(shooter_shooting)
      bullets = bullets-1
    }

    //player goes back to original standing image once we stop pressing the space bar
    else if(keyWentUp("space")){
      player.addImage(shooterImg)
    }

    //go to gameState "bullet" when player runs out of bullets
    if(bullets===0){
      gameState = "bullet"
    }

    if(score === 30) {
      gameState = "won";
    }

    //destroy the zombie when bullet touches it
    if(zombieGroup.isTouching(bulletGroup)){
      for(var i=0;i<zombieGroup.length;i++){     
          
      if(zombieGroup[i].isTouching(bulletGroup)){
            explosion_sound.play();
            score = score + 1;
            zombieGroup[i].destroy();
            bulletGroup.destroyEach();       
            } 
      
      }
    }

    //destroy zombie when player touches it
    if(zombieGroup.isTouching(player)){

      for(var i=0;i<zombieGroup.length;i++){     
            
        if(zombieGroup[i].isTouching(player)){
            zombieGroup[i].destroy();
            lives = lives - 1;
          } 
      
      }
      if(lives === 0) {
        gameState = "lost";
      }
    }

    //calling the function to spawn zombies
    enemy();
  }

drawSprites();
  textSize(30);
  fill("white");
  text("Score: "+score, 50,50)
  //destroy zombie and player and display a message in gameState "lost"
  if(gameState === "lost"){
    lose_sound.play();
    textSize(100)
    fill("red")
    text("You Lost ",400,400)
    zombieGroup.destroyEach();
    player.destroy();

  }

  //destroy zombie and player and display a message in gameState "won"
  else if(gameState === "won"){
    win_sound.play();
    textSize(100)
    fill("yellow")
    text("You Won ",400,400)
    zombieGroup.destroyEach();
    player.destroy();

  }

  //destroy zombie, player and bullets and display a message in gameState "bullet"
  else if(gameState == "bullet"){
  
    textSize(50)
    fill("yellow")
    text("You ran out of bullets!!!",470,410)
    zombieGroup.destroyEach();
    player.destroy();
    bulletGroup.destroyEach();

  }

}


//creating function to spawn zombies
function enemy(){
  if(frameCount%80===0){

    //giving random x and y positions for zombie to appear
    zombie = createSprite(windowWidth,random(100,500),40,40)

    zombie.addImage(zombieImg);
    zombie.scale = 0.15;
    zombie.velocityX = -(3 + frameCount/1000);
    zombie.debug= false;
    zombie.setCollider("rectangle",0,0,400,1000)
   
    zombie.lifetime = 400
   zombieGroup.add(zombie);
  }
}
