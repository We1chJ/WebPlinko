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

const OBSTACLE_RADIUS = Math.trunc(WIDTH / 240);
const OBSTACLE_PAD = Math.ceil(HEIGHT / 20);
const INIT_ROW_COUNT = 3;
const FINAL_ROW_COUNT = 18;
const OBSTACLE_START = {
    x: Math.trunc((WIDTH / 2) - OBSTACLE_PAD),
    y: Math.trunc(HEIGHT - (HEIGHT * 0.9))
};


const BALL_RADIUS = OBSTACLE_RADIUS * 1.7;

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

let multiHistory = [];
const maxHistoryDisplay = 4;
let prevCnt = 0;
const MULTI_HISTORY_HEIGHT = 60;

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
            obstacle.setOnCollide((pair) => {
                const ball = pair.bodyA.gameObject === obstacle ? pair.bodyB.gameObject : pair.bodyA.gameObject;
                const shadowGraphics = this.add.graphics();
                shadowGraphics.fillStyle(0xffffff, 0.5); // White color with 50% opacity
                shadowGraphics.fillCircle(OBSTACLE_RADIUS, OBSTACLE_RADIUS, OBSTACLE_RADIUS); // Slightly larger shadow
                shadowGraphics.generateTexture('shadow', OBSTACLE_RADIUS * 2, OBSTACLE_RADIUS * 2);
                shadowGraphics.destroy();
                if (!obstacle.shadow || !obstacle.shadow.active) {
                    const shadow = this.add.image(obstacle.x, obstacle.y, 'shadow');
                    shadow.setDepth(obstacle.depth - 1); // Ensure shadow is behind the obstacle
                    obstacle.shadow = shadow;
                    this.tweens.add({
                        targets: shadow,
                        scaleX: 1.8,
                        scaleY: 1.8,
                        alpha: 0,
                        duration: 300,
                        ease: 'Power1',
                        onComplete: () => {
                            shadow.destroy();
                            obstacle.shadow = null;
                        }
                    });
                }
            });

            pos.x += OBSTACLE_PAD;
        }
        pos.x = WIDTH - pos.x + 0.5 * OBSTACLE_PAD;
        pos.y += OBSTACLE_PAD;
    }

    pos.x += OBSTACLE_PAD;
    // MULTIs
    for (let i = 0; i < NUM_MULTIS; i++) {
        const multiGraphics = this.add.graphics();
        const shadowColor = Phaser.Display.Color.Interpolate.ColorWithColor(
            new Phaser.Display.Color(MULTI_CONFIG[i].color[0], MULTI_CONFIG[i].color[1], MULTI_CONFIG[i].color[2]),
            new Phaser.Display.Color(0, 0, 0),
            100,
            50
        );
        multiGraphics.fillStyle(Phaser.Display.Color.GetColor(shadowColor.r, shadowColor.g, shadowColor.b), 1); // Shadow color with some transparency
        multiGraphics.fillRoundedRect(0, 0, MULTI_WIDTH, MULTI_HEIGHT, 5); // Draw longer shadow at the bottom
        multiGraphics.fillStyle(Phaser.Display.Color.GetColor(MULTI_CONFIG[i].color[0], MULTI_CONFIG[i].color[1], MULTI_CONFIG[i].color[2]), 1);
        multiGraphics.fillRoundedRect(0, 0, MULTI_WIDTH, MULTI_HEIGHT - 5, 5);
        multiGraphics.generateTexture(`multi${i}`, MULTI_WIDTH, MULTI_HEIGHT);
        multiGraphics.destroy();
        const multi = this.matter.add.image(pos.x, pos.y, `multi${i}`);
        multi.setRectangle(MULTI_WIDTH, MULTI_HEIGHT + 10, { chamfer: { radius: 5 } });
        multi.setStatic(true);

        // Add black text with the score corresponding
        const multiplierText = MULTI_CONFIG[i].multiplier >= 100 ? `${MULTI_CONFIG[i].multiplier}` : `${MULTI_CONFIG[i].multiplier}x`;
        const scoreText = this.add.text(pos.x, pos.y, multiplierText, { font: '15px plinko_bold', fill: '#000000', fontWeight: 'bold' });
        scoreText.setOrigin(0.5, 0.6);

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

            multiHistory.push(i);
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
            const rand_x = Phaser.Math.Between(1, 20) * (Phaser.Math.Between(0, 1) ? 1 : -1);
            const ball = this.matter.add.image(WIDTH / 2 + rand_x, -10, 'ball');
            ball.setCircle(BALL_RADIUS);
            ball.setBounce(0.3);
            ball.setDensity(10000);
            ball.setMass(1000);
            ball.body.collisionFilter.category = CATEGORY_BALL;
            ball.body.collisionFilter.mask = CATEGORY_OBSTACLE;
        });
    // Background block for multiHistory display
    const historyBackground = this.add.graphics();
    historyBackground.setDepth(10); // Set to a high depth to ensure it's on the topmost layer
    historyBackground.fillStyle(0x0b1a33, 1); // Same as background color with 50% opacity
    historyBackground.fillRect(WIDTH - 200, HEIGHT / 2 - 200 - MULTI_HISTORY_HEIGHT, MULTI_HISTORY_HEIGHT, MULTI_HISTORY_HEIGHT); // Adjust dimensions as needed

    // Carve out the shape
    const carveGraphics = this.add.graphics();
    carveGraphics.setDepth(1000); // Set to a high depth to ensure it's on the topmost layer
    carveGraphics.fillStyle(0x0b1a33, 1);
    carveGraphics.beginPath();
    carveGraphics.moveTo(WIDTH - 200, HEIGHT / 2 - 200 + 10);
    carveGraphics.arc(WIDTH - 200 + 10, HEIGHT / 2 - 200 + 10, 10, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(270), false);
    carveGraphics.lineTo(WIDTH - 200 + MULTI_HISTORY_HEIGHT - 10, HEIGHT / 2 - 200);
    carveGraphics.arc(WIDTH - 200 + MULTI_HISTORY_HEIGHT - 10, HEIGHT / 2 - 200 + 10, 10, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(360), false);
    carveGraphics.lineTo(WIDTH - 200 + MULTI_HISTORY_HEIGHT, HEIGHT / 2 - 200);
    carveGraphics.lineTo(WIDTH - 200, HEIGHT / 2 - 200);
    carveGraphics.closePath();
    carveGraphics.fillPath();

    // Background block for multiHistory display at the bottom
    const historyBackgroundBottom = this.add.graphics();
    historyBackgroundBottom.setDepth(10); // Set to a high depth to ensure it's on the topmost layer
    historyBackgroundBottom.fillStyle(0x0b1a33, 1); // Same as background color with 50% opacity
    historyBackgroundBottom.fillRect(WIDTH - 200, HEIGHT / 2 - 200 + 4 * MULTI_HISTORY_HEIGHT, MULTI_HISTORY_HEIGHT, MULTI_HISTORY_HEIGHT); // Adjust dimensions as needed

    // Carve out the shape at the bottom
    const carveGraphicsBottom = this.add.graphics();
    carveGraphicsBottom.setDepth(1000); // Set to a high depth to ensure it's on the topmost layer
    carveGraphicsBottom.fillStyle(0x0b1a33, 1);
    carveGraphicsBottom.beginPath();
    carveGraphicsBottom.moveTo(WIDTH - 200, HEIGHT / 2 - 200 + 4 * MULTI_HISTORY_HEIGHT - 10);
    carveGraphicsBottom.arc(WIDTH - 200 + 10, HEIGHT / 2 - 200 + 4 * MULTI_HISTORY_HEIGHT - 10, 10, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(90), true);
    carveGraphicsBottom.lineTo(WIDTH - 200 + MULTI_HISTORY_HEIGHT - 10, HEIGHT / 2 - 200 + 4 * MULTI_HISTORY_HEIGHT);
    carveGraphicsBottom.arc(WIDTH - 200 + MULTI_HISTORY_HEIGHT - 10, HEIGHT / 2 - 200 + 4 * MULTI_HISTORY_HEIGHT - 10, 10, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(0), true);
    carveGraphicsBottom.lineTo(WIDTH - 200 + MULTI_HISTORY_HEIGHT, HEIGHT / 2 - 200 + 4 * MULTI_HISTORY_HEIGHT);
    carveGraphicsBottom.lineTo(WIDTH - 200, HEIGHT / 2 - 200 + 4 * MULTI_HISTORY_HEIGHT);
    carveGraphicsBottom.closePath();
    carveGraphicsBottom.fillPath();
}

function update() {
    if (prevCnt != multiHistory.length) {
        prevCnt = multiHistory.length;

        const historyX = WIDTH - 200;
        const historyY = HEIGHT / 2 - 200;
        const historyWidth = MULTI_HISTORY_HEIGHT;
        const historyHeight = MULTI_HISTORY_HEIGHT;

        const historyToShow = multiHistory.slice(-maxHistoryDisplay);
        console.log(multiHistory.length);
        for (let i = historyToShow.length - 1; i >= 0; i--) {
            const multiIndex = historyToShow[i];
            const x = historyX;
            const y = historyY + (historyHeight) * i;
            const color = MULTI_CONFIG[multiIndex].color;
            const multiplierText = `${MULTI_CONFIG[multiIndex].multiplier}x`;
            const historyGraphics = this.add.graphics();
            historyGraphics.fillStyle(Phaser.Display.Color.GetColor(color[0], color[1], color[2]), 1);

            // Determine if it's the first or last one to make rounded
            const isFirst = i === 0 && historyToShow.length <= 4;
            const isLast = i === historyToShow.length - 1 && historyToShow.length <= 4;
            const radius = 10;

            if (isFirst || isLast) {
                historyGraphics.fillRoundedRect(x, y, historyWidth, historyHeight, { tl: isFirst ? radius : 0, tr: isFirst ? radius : 0, bl: isLast ? radius : 0, br: isLast ? radius : 0 });
            } else {
                historyGraphics.fillRect(x, y, historyWidth, historyHeight);
            }

            const historyText = this.add.text(x + historyWidth / 2, y + historyHeight / 2, multiplierText, { font: '15px plinko_bold', fill: '#000000', fontWeight: 'bold' });
            historyText.setOrigin(0.5, 0.5);

            if (multiHistory.length > 4) {
                this.tweens.add({
                    targets: [historyText, historyGraphics],
                    y: `-=${historyHeight}`,
                    duration: 100,
                    ease: "Linear",
                    onComplete: () => {
                        if (historyText.y < historyY) {
                            historyGraphics.destroy();
                            historyText.destroy();
                        } else {
                            historyGraphics.fillRect(x, y, historyWidth, historyHeight);
                        }
                    }
                });
            }
        }

        if (multiHistory.length > 4) {
            multiHistory = multiHistory.slice(-4);
            prevCnt = 4;
        }
    }
}