var database;
var dog, dogImage, happyDogImage;
var foodS, foodStock;
var feedTime, lastFeed;
var feed, addFood;
var milk;

function preload(){
  dogImage = loadImage("images/dog.png");
  happyDogImage = loadImage("images/happyDog.png");
}

function setup(){
	database = firebase.database(); 
  createCanvas(1000,400);

  milk = new Food();
  
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(800,200,150,150);
  dog.addImage(dogImage);
  dog.scale = 0.25;
  
  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw(){
  background(46,139,87);
  milk.display();

  feedTime = database.ref('FeedTime');
  feedTime.on("value",function(data){
    lastFeed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFeed >= 12){
    text("Last Feed : "+lastFeed % 12+" PM",350,60);
  } else if(lastFeed == 0){
    text("Last Feed : 12 AM",350,60);
  } else {
    text("Last Feed : "+lastFeed+" AM",350,60);
  }
  drawSprites();
}

function readStock(data){
  foodS = data.val();
  milk.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDogImage);

  if (milk.getFoodStock() <= 0){
    milk.updateFoodStock(milk.getFoodStock()*0);
  } else {
    milk.updateFoodStock(milk.getFoodStock()-1);
  }    
  
  database.ref('/').update({
    Food: milk.getFoodStock(),
    FeedTime: hour()
  });
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  });
}