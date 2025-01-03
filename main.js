const config = {
    type: Phaser.AUTO, // Automatically choose WebGL or Canvas
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#0b1a33',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {

}

function update() {
    // Update logic goes here
}

function create() {
    const graphics = this.add.graphics({ fillStyle: { color: 0xffffff } });
    const circleRadius = 10;
    const rows = 5; // Number of rows in the pyramid
    const spacing = 30; // Spacing between circles

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= row; col++) {
            const x = config.width / 2 + (col - row / 2) * spacing;
            const y = config.height / 2 + row * spacing;
            const circle = new Phaser.Geom.Circle(x, y, circleRadius);
            graphics.fillCircleShape(circle);
        }
    }

    // Add PLINKO text at the top center
    const textStyle = { font: '48px Impact', fill: '#ffffff', fontWeight: 'bold' };
    const text = this.add.text(config.width / 2, 50, 'PLINKO', textStyle);
    text.setOrigin(0.5, 0.5);
}
