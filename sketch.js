const wTile = 60;
const hTile = 60;
const wCount = 8;
const hCount = 12;
const directions = {up:0, right:1, down:2, left:3}
const opposite = {up:directions.down, right:directions.left, down:directions.up, left:directions.right}
grid = [];
imageOptions = [];
stack = [];

function preload(){
  defaultImage = loadImage("Tiles/default.png");
  imageOptions[0]  = new ImageOption(loadImage("Tiles/CROSS.png"), [1,1,1,1]);
  imageOptions[1]  = new ImageOption(loadImage("Tiles/UP.png"), [1,1,0,1]);
  imageOptions[2]  = new ImageOption(loadImage("Tiles/RIGHT.png"), [1,1,1,0]);
  imageOptions[3]  = new ImageOption(loadImage("Tiles/DOWN.png"), [0,1,1,1]);
  imageOptions[4]  = new ImageOption(loadImage("Tiles/LEFT.png"), [1,0,1,1]);
  imageOptions[5]  = new ImageOption(loadImage("Tiles/NONE.png"), [0,0,0,0]);
  imageOptions[6]  = new ImageOption(loadImage("Tiles/L1.png"), [1,1,0,0]);
  imageOptions[7]  = new ImageOption(loadImage("Tiles/L2.png"), [0,1,1,0]);
  imageOptions[8]  = new ImageOption(loadImage("Tiles/L3.png"), [0,0,1,1]);
  imageOptions[9]  = new ImageOption(loadImage("Tiles/L4.png"), [1,0,0,1]);
  imageOptions[10] = new ImageOption(loadImage("Tiles/STRAIGHT1.png"), [1,0,1,0]);
  imageOptions[11] = new ImageOption(loadImage("Tiles/STRAIGHT2.png"), [0,1,0,1]);
  imageOptions[12] = new ImageOption(loadImage("Tiles/DE1.png"), [1,0,0,0]);
  imageOptions[13] = new ImageOption(loadImage("Tiles/DE2.png"), [0,1,0,0]);
  imageOptions[14] = new ImageOption(loadImage("Tiles/DE3.png"), [0,0,1,0]);
  imageOptions[15] = new ImageOption(loadImage("Tiles/DE4.png"), [0,0,0,1]);
}

class ImageOption{
  constructor(imageSource, borders){
    this.imageSource = imageSource;
    this.borders = borders
  }
} 

class Tile{
  constructor(ImageOptions){
    this.ImageOptions = imageOptions;
    this.collapsed = false;
  }
  get entropy(){
    return this.ImageOptions.length;
  }
}

function innitialiseGrid(){
  for (i = 0; i < hCount; i++){
    line = [];
    for (j = 0; j < wCount; j++){
      line.push(new Tile([imageOptions]));
    }
    grid.push(line);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function contains(coord){
  if (stack.length == 0){
    return false;
  }
  for (i = 0; i < stack.length; i++){
    if (stack[i].y == coord.y && stack[i].x == coord.x){
      return true;
    }
  }
  return false;
}

function collapseGrid(){
  stack = stack.sort((a,b) => (grid[b.y][b.x].entropy - grid[a.y][a.x].entropy)); //asc or desc?
  current = stack.pop();
  if (current != null){
    randomInt = getRandomInt(grid[current.y][current.x].entropy);
    randomOption = grid[current.y][current.x].ImageOptions[randomInt];
    grid[current.y][current.x].ImageOptions = [randomOption];
    grid[current.y][current.x].collapsed=true;

    //ABOVE
    if (current.y > 0 && !grid[current.y-1][current.x].collapsed){
      next = {y: current.y-1, x:current.x};
      currentBorder = grid[current.y][current.x].ImageOptions[0].borders[directions.up];
      grid[next.y][next.x].ImageOptions = grid[next.y][next.x].ImageOptions.filter((option) => option.borders[directions.down] == currentBorder);
      if (!contains(next)){
        stack.push(next);
      }
    }
    //BELOW
    if (current.y < hCount-1 && !grid[current.y+1][current.x].collapsed){
      next = {y: current.y+1, x: current.x};
      currentBorder = grid[current.y][current.x].ImageOptions[0].borders[directions.down];
      grid[next.y][next.x].ImageOptions = grid[next.y][next.x].ImageOptions.filter((option) => option.borders[directions.up] == currentBorder);
      if (!contains(next)){
        stack.push(next);
      }
    }
    //LEFT
    if (current.x > 0 && !grid[current.y][current.x-1].collapsed){
      next = {y: current.y, x: current.x-1};
      currentBorder = grid[current.y][current.x].ImageOptions[0].borders[directions.left];
      grid[next.y][next.x].ImageOptions = grid[next.y][next.x].ImageOptions.filter((option) => option.borders[directions.right] == currentBorder);
      if (!contains(next)){
        stack.push(next);
      }
    }
    //RIGHT
    if (current.x < wCount-1 && !grid[current.y][current.x+1].collapsed){
      next = {y: current.y,x:current.x+1};
      currentBorder = grid[current.y][current.x].ImageOptions[0].borders[directions.right];
      grid[next.y][next.x].ImageOptions = grid[next.y][next.x].ImageOptions.filter((option) => option.borders[directions.left] == currentBorder);
      if (!contains(next)){
        stack.push(next);
      }
    }
  }
}

function updateCanvas(){
  for (y = 0; y < hCount; y++){
    for (x = 0; x < wCount; x++){
      if (grid[y][x].collapsed){
        img = grid[y][x].ImageOptions[0].imageSource;
      }
      else{
        img = defaultImage;
      }
      image(img, x*wTile, y*hTile, wTile, hTile);
    }
  }
}

function setup() {
  // noLoop();
  innitialiseGrid();
  stack.push({x:0,y:0});
  createCanvas(wCount*wTile, hCount*hTile)
  // while (stack.length > 0){
  //   collapseGrid();
  //   updateCanvas();
  // }
}

function draw() {
  collapseGrid();
  updateCanvas();
}
function mousePressed(){
  redraw();
}