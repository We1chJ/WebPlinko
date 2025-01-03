const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
console.log(`Window Width: ${WIDTH}, Window Height: ${HEIGHT}`);

const config = {
    type: Phaser.AUTO, // Automatically choose WebGL or Canvas
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#0b1a33',
    autoResize: true,
    resolution: window.devicePixelRatio,
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
const OBSTACLE_RADIUS = Math.trunc(WIDTH / 240);
const OBSTACLE_PAD = Math.ceil(HEIGHT / 20);
const INIT_ROW_COUNT = 3;
const FINAL_ROW_COUNT = 18;
const OBSTACLE_START = {
    x: Math.trunc((WIDTH / 2) - OBSTACLE_PAD),
    y: Math.trunc(HEIGHT - (HEIGHT * 0.9))
};


const BALL_RADIUS = OBSTACLE_RADIUS * 1.5;

const CATEGORY_BALL = 1;
const CATEGORY_OBSTACLE = 2;
const CATEGORY_MULTI = 3;

// RGB Values for multipliers
const MULTI_CONFIG = {
    0: { multiplier: 1000, color: [255, 0, 0] },
    1: { multiplier: 130, color: [255, 30, 0] },
    2: { multiplier: 26, color: [255, 60, 0] },
    3: { multiplier: 9, color: [255, 90, 0] },
    4: { multiplier: 4, color: [255, 120, 0] },
    5: { multiplier: 2, color: [255, 150, 0] },
    6: { multiplier: 0.2, color: [255, 180, 0] },
    7: { multiplier: 0.2, color: [255, 210, 0] },
    8: { multiplier: 0.2, color: [255, 240, 0] },
    9: { multiplier: 0.2, color: [255, 210, 0] },
    10: { multiplier: 0.2, color: [255, 180, 0] },
    11: { multiplier: 2, color: [255, 150, 0] },
    12: { multiplier: 4, color: [255, 120, 0] },
    13: { multiplier: 9, color: [255, 90, 0] },
    14: { multiplier: 26, color: [255, 60, 0] },
    15: { multiplier: 130, color: [255, 30, 0] },
    16: { multiplier: 1000, color: [255, 0, 0] }
};

const NUM_MULTIS = 17;
const MULTI_WIDTH = OBSTACLE_PAD - OBSTACLE_RADIUS * 0.5;
const MULTI_HEIGHT = OBSTACLE_PAD;
const MULTI_COLLISION = HEIGHT - (MULTI_HEIGHT * 2)
const MULTI_PAD = OBSTACLE_PAD;

const maxSounds = 5; // Example: max 5 concurrent sounds
let currentSounds = 0;


function preload() {
    WebFont.load({
        custom: {
            families: ['plinko_bold', 'plinko_m'], // Add all font-family names here
        }
    });
    // Load sound effect
    this.load.audio('mouseClick', 'assets/audio/mouseClick.mp3');
    this.load.audio('ballBounce', 'assets/audio/ballBounce.mp3');
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

    // pos.y = 50;
    pos.x += OBSTACLE_PAD;
    // pos = {x : 50, y : 50};
    // MULTIs
    for (let i = 0; i < NUM_MULTIS; i++) {
        const multiGraphics = this.add.graphics();
        multiGraphics.fillStyle(Phaser.Display.Color.GetColor(MULTI_CONFIG[i].color[0], MULTI_CONFIG[i].color[1], MULTI_CONFIG[i].color[2]), 1);
        multiGraphics.fillRoundedRect(0, 0, MULTI_WIDTH, MULTI_HEIGHT, 5);
        multiGraphics.fillStyle(Phaser.Display.Color.GetColor(0, 0, 0), 0.5); // Shadow color with some transparency
        multiGraphics.fillRoundedRect(0, MULTI_HEIGHT - 5, MULTI_WIDTH, 5, { tl: 0, tr: 0, bl: 5, br: 5 }); // Draw longer shadow at the bottom
        multiGraphics.generateTexture(`multi${i}`, MULTI_WIDTH, MULTI_HEIGHT);
        multiGraphics.destroy();
        const multi = this.matter.add.image(pos.x, pos.y, `multi${i}`);
        multi.setRectangle(MULTI_WIDTH, MULTI_HEIGHT + 10, { chamfer: { radius: 5 } });
        multi.setStatic(true);

        // Add black text with the score corresponding
        const multiplierText = MULTI_CONFIG[i].multiplier >= 100 ? `${MULTI_CONFIG[i].multiplier}` : `${MULTI_CONFIG[i].multiplier}x`;
        const scoreText = this.add.text(pos.x, pos.y, multiplierText, { font: '15px plinko_bold', fill: '#000000', fontWeight: 'bold' });
        scoreText.setOrigin(0.5, 0.5);

        pos.x += MULTI_PAD;
        multi.setCollisionCategory(CATEGORY_MULTI);
        multi.setCollidesWith(CATEGORY_BALL);
        multi.setOnCollide((pair) => {
            const ball = pair.bodyA.gameObject === multi ? pair.bodyB.gameObject : pair.bodyA.gameObject;
            ball.destroy();
            if (currentSounds < maxSounds) {
                this.sound.play('ballBounce', { volume: 1.0, detune: Phaser.Math.Between(-100, 200) });
                currentSounds++;
            }
            const originalY = pos.y;
            const targetY = Math.min(multi.y + 10, originalY + 10);
            this.tweens.add({
                targets: [multi, scoreText],
                y: targetY,
                duration: 100,
                yoyo: true,
                ease: 'Power1',
                onComplete: () => {
                    multi.y = originalY;
                    scoreText.y = originalY;
                    currentSounds = Math.max(0, currentSounds - 1);
                }
            });
        });
    }

    // Add PLINKO text at the top left corner
    const textStyle = { font: '48px "plinko_bold", sans-serif', fill: '#ffffff', fontWeight: 'bold' };
    const text = this.add.text(10, 10, 'PLINKO', textStyle);
    text.setOrigin(0, 0);
    // Add Bet button
    const betButton = this.add.graphics();
    betButton.fillStyle(0x00ff00, 1); // Light green color
    betButton.fillRoundedRect(10, 70, 150, 50, 8); // Draw rounded rectangle with radius 10
    const betText = this.add.text(85, 95, 'Bet', { font: '24px "plinko_bold", sans-serif', fill: '#000000', fontWeight: 'bold' }); // Black text with bold Arial font
    betText.setOrigin(0.5, 0.5);
    betButton.setInteractive(new Phaser.Geom.Rectangle(10, 70, 150, 50), Phaser.Geom.Rectangle.Contains)
        .on('pointerdown', () => {
            // Play sound effect
            this.sound.play('mouseClick', { volume: 3.0 });

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