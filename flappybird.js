const GAP_SIZE = 150;
const SPEED = 1

let player = { el: document.querySelector("#player"), vel: 0 }
player.el.style.top = "40%"
player.el.style.left = "300px"
player.el.style.width = "40px"
player.el.style.height = "40px"

let gameOverText = document.querySelector("#game-over")
let score = document.querySelector("#score")
score.innerHTML = 0

let walls = [];
let gameOver = false

let gameLoop = setInterval(() => {
    movePlayer()
    moveWall()
}, 10);

let wallLoop = setInterval(() => {
    createWall()
    incrementScore()
}, 1000);

function movePlayer() {
    // Player gravity
    player.vel -= 0.1
    player.vel = Math.max(player.vel, -6)

    let pos = parseFloat(player.el.style.top)
    pos -= player.vel
    pos = wrap(pos)
    player.el.style.top = pos + "px"
}

function wrap(pos) {
    if (pos > globalThis.innerHeight) pos = -1 * parseInt(player.el.style.height)
    if (pos < -1 * parseInt(player.el.style.height)) pos = globalThis.innerHeight
    return pos
}

function moveWall() {
    // Move walls to left
    for (let index = 0; index < walls.length; index++) {
        let wall = walls[index];
        let pos = parseInt(wall.style.left)
        pos -= 4
        wall.style.left = pos + "px"

        if (pos > globalThis.innerWidth) {
            walls.splice(index, 1)
            wall.parentNode.removeChild(wall)
        }

        // Collision detection
        // rect1 = { x: parseFloat(player.el.style.left), y: parseFloat(player.el.style.top), width: parseFloat(player.el.style.width), height: parseFloat(player.el.style.height) }
        rect2 = { x: parseFloat(wall.style.left), y: parseFloat(wall.style.top), width: parseFloat(wall.style.width), height: parseFloat(wall.style.height) }
        circle = {x: parseFloat(player.el.style.left) + parseFloat(player.el.style.width)/2, y: parseFloat(player.el.style.top) + parseFloat(player.el.style.height)/2, radius: 20}

        // if (boxBoxCollision(rect1, rect2)) {
        //     endGame()
        // }

        if (circleBoxCollision(circle, rect2)) {
            endGame()
        }
    }
}

function createWall() {
    // Randomize gap height
    let yPos = Math.round(Math.random() * (globalThis.innerHeight - GAP_SIZE))

    let topWall = document.createElement("div")
    document.body.appendChild(topWall)
    topWall.classList.add("wall")
    topWall.style.left = globalThis.innerWidth + "px"
    topWall.style.height = (yPos) + "px"
    topWall.style.top = "0px"
    topWall.style.width = "30px"
    walls.push(topWall)

    let botWall = document.createElement("div")
    document.body.appendChild(botWall)
    botWall.classList.add("wall")
    botWall.style.left = globalThis.innerWidth + "px"
    botWall.style.height = (globalThis.innerHeight - yPos) - (GAP_SIZE) + "px"
    botWall.style.top = (yPos + (GAP_SIZE)) + "px"
    botWall.style.width = "30px"
    walls.push(botWall)
}

function endGame() {
    clearInterval(gameLoop)
    clearInterval(wallLoop)
    gameOver = true
    gameOverText.style.display = "block"
}

function jump() {
    player.vel = 5
}

function incrementScore() {
    oldScore = parseInt(score.innerHTML)
    newScore = oldScore + 1
    score.innerHTML = newScore
}

function reset() {
    // Reset player position
    player.el.style.top = "40%"

    // Delete old walls
    while (walls.length) {
        wall = walls.pop();
        wall.parentNode.removeChild(wall)
    }

    gameLoop = setInterval(() => {
        movePlayer()
        moveWall()
    }, 10);

    wallLoop = setInterval(() => {
        createWall()
        incrementScore()
    }, 1000);

    gameOverText.style.display = "none"
    score.innerHTML = 0
    gameOver = false
}

window.addEventListener('keydown', this.keyEvents);

function keyEvents(key) {
    switch (key.keyCode) {
        case 32:
            !gameOver ? jump() : reset()
            break;
        default:
            break;
    }
}

function boxBoxCollision(box1, box2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
}

function circleBoxCollision(circle, box) {
    // temporary variables to set edges for testing
    testX = circle.x;
    testY = circle.y;
  
    // which edge is closest?
    if (circle.x < box.x)         testX = box.x;      // test left edge
    else if (circle.x > box.x+box.width) testX = box.x+box.width;   // right edge
    if (circle.y < box.y)         testY = box.y;      // top edge
    else if (circle.y > box.y+box.height) testY = box.y+box.height;   // bottom edge
  
    // get distance from closest edges
    distX = circle.x-testX;
    distY = circle.y-testY;
    distance = Math.sqrt( (distX*distX) + (distY*distY) );
  
    // if the distance is less than the radius, collision!
    if (distance <= circle.radius) {
      return true;
    }
    return false;
}
