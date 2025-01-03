const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
console.log(`Window Width: ${WIDTH}, Window Height: ${HEIGHT}`);

const config = {
    type: Phaser.AUTO, // Automatically choose WebGL or Canvas
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#0b1a33',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            // debug: true, // comment this out to get rid of the extra physics 
        }
    }
};
const game = new Phaser.Game(config);

window.addEventListener('resize', resizeGame);
function resizeGame() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    game.scale.resize(newWidth, newHeight);
    console.log("resized");
    //TODO: make the position and obstacles place update too
}

let obstacles = [];
const OBSTACLE_SPACING = 10;
const OBSTACLE_RADIUS = Math.trunc(WIDTH / 240);
const OBSTACLE_PAD = Math.ceil(HEIGHT / 18);
const INIT_ROW_COUNT = 3;
const FINAL_ROW_COUNT = 18;
const OBSTACLE_START = {
    x: Math.trunc((WIDTH / 2) - OBSTACLE_PAD),
    y: Math.trunc(HEIGHT - (HEIGHT * 0.9))
};

const BALL_RADIUS = OBSTACLE_RADIUS * 1.5;

const CATEGORY_BALL = 1;
const CATEGORY_OBSTACLE = 2;


function preload() {

}

function create() {
    // OBSTACLE
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1); // White color
    graphics.fillCircle(OBSTACLE_RADIUS, OBSTACLE_RADIUS, OBSTACLE_RADIUS); // Draw circle at (20, 20) with radius 20
    graphics.generateTexture('obstacle', OBSTACLE_RADIUS * 2, OBSTACLE_RADIUS * 2);
    graphics.destroy();

    let pos = OBSTACLE_START;
    for (let row = INIT_ROW_COUNT; row <= FINAL_ROW_COUNT; row++) {
        for (let col = 0; col < row; col++) {
            const obstacle = this.matter.add.image(pos.x, pos.y, 'obstacle');
            obstacle.setCircle(OBSTACLE_RADIUS);
            obstacle.setStatic(true);
            obstacle.setFriction(0.6);
            obstacle.setBounce(0);
            obstacle.body.collisionFilter.category = CATEGORY_OBSTACLE;
            obstacle.body.collisionFilter.mask = CATEGORY_BALL;

            obstacles.push(obstacle);
            pos.x += OBSTACLE_PAD;
        }
        pos.x = WIDTH - pos.x + 0.5 * OBSTACLE_PAD;
        pos.y += OBSTACLE_PAD;
    }


    // Add PLINKO text at the top left corner
    const textStyle = { font: '48px Impact', fill: '#ffffff', fontWeight: 'bold' };
    const text = this.add.text(10, 10, 'PLINKO', textStyle);
    text.setOrigin(0, 0);
    // Add Bet button
    const betButton = this.add.text(10, 70, 'Bet', { font: '32px Arial', fill: '#00ff00' })
        .setInteractive()
        .on('pointerdown', () => {
            // BALL
            const ballGraphics = this.add.graphics();
            ballGraphics.fillStyle(0xff0000, 1); // Red color
            ballGraphics.fillCircle(BALL_RADIUS, BALL_RADIUS, BALL_RADIUS); // Draw circle at (20, 20) with radius 20
            ballGraphics.generateTexture('ball', BALL_RADIUS * 2, BALL_RADIUS * 2);
            ballGraphics.destroy();
            const rand_x = Phaser.Math.Between(-20, 20);            
            const ball = this.matter.add.image(WIDTH / 2 + rand_x, -10, 'ball');
            ball.setCircle(BALL_RADIUS);
            ball.setBounce(0.3);
            ball.setDensity(10000);
            ball.setMass(1000);
            ball.body.collisionFilter.category = CATEGORY_BALL;
            ball.body.collisionFilter.mask = CATEGORY_OBSTACLE;
        });
}

function update() {


}