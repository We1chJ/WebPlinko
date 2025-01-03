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
            debug: true, // comment this out to get rid of the extra physics 
            setBounds: {
                left: true,
                right: true,
                top: true,
                bottom: true
            }
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
const OBSTACLE_RADIUS = 8;

const BALL_RADIUS = 16;

function preload() {

}

function create() {
    // OBSTACLE
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1); // White color
    graphics.fillCircle(OBSTACLE_RADIUS, OBSTACLE_RADIUS, OBSTACLE_RADIUS); // Draw circle at (20, 20) with radius 20
    graphics.generateTexture('obstacle', OBSTACLE_RADIUS*2, OBSTACLE_RADIUS*2);
    graphics.destroy();

    const obstacle = this.matter.add.image(WIDTH / 2, 200, 'obstacle');
    obstacle.setCircle(OBSTACLE_RADIUS);
    obstacle.setStatic(true); // Make the obstacle static so it doesn't move
    // obstacle.setInteractive();

    // BALL
    const ballGraphics = this.add.graphics();
    ballGraphics.fillStyle(0xff0000, 1); // Red color
    ballGraphics.fillCircle(BALL_RADIUS, BALL_RADIUS, BALL_RADIUS); // Draw circle at (20, 20) with radius 20
    ballGraphics.generateTexture('ball', BALL_RADIUS*2, BALL_RADIUS*2);
    ballGraphics.destroy();

    const ball = this.matter.add.image(WIDTH / 2, 0, 'ball');
    ball.setCircle(BALL_RADIUS);
    ball.setBounce(0.8); // Make the ball bounce when it hits the obstacle
    // const randomVelocityX = Phaser.Math.Between(-5, 5);
    const randomVelocityY = Phaser.Math.Between(-5, 5);
    ball.setVelocity(0, randomVelocityY);

    // Detect collision between the ball and obstacle
    this.matter.world.on('collisionstart', (event) => {
        const pairs = event.pairs;
        pairs.forEach(pair => {
            if ((pair.bodyA === ball.body && pair.bodyB === obstacle.body) || 
                (pair.bodyA === obstacle.body && pair.bodyB === ball.body)) {
                triggerObstacleAnimation();
            }
        });
    });

    // Add PLINKO text at the top center
    const textStyle = { font: '48px Impact', fill: '#ffffff', fontWeight: 'bold' };
    const text = this.add.text(config.width / 2, 50, 'PLINKO', textStyle);
    text.setOrigin(0.5, 0.5);
}

function update() {
    // Update logic goes here
}

// Trigger the animation for the obstacle when it is hit by the ball
function triggerObstacleAnimation() {
    // Animate obstacle (e.g., scale it up and then back down)
    // this.tweens.add({
    //     targets: obstacle,
    //     scaleX: 1.5, // Increase width
    //     scaleY: 1.5, // Increase height
    //     duration: 300, // Duration of the animation
    //     yoyo: true, // Shrink back after scaling up
    //     repeat: 0, // Only run once
    //     ease: 'Sine.easeInOut' // Smooth easing
    // });
}