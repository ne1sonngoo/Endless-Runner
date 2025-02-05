class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('background', 'assets/background.png'); 
        this.load.image('menu', 'assets/mainmenu.png');
        this.load.audio('startSound', 'assets/woof.mp3');
    }

    create() {
        this.add.image(0, 0, 'menu').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height);
        this.add.text(400, 200, 'Space Runner', { fontSize: '32px', fill: '#FFFF00' }).setOrigin(0.5);
        this.add.text(400, 300, 'Press W to Play', { fontSize: '24px', fill: '#FFFF00' }).setOrigin(0.5);
        this.add.text(400, 550, 'Move with WASD and dodge the obstacles', { fontSize: '20px', fill: '#FFFFFF' }).setOrigin(0.5);

        this.input.keyboard.on('keydown-W', () => {
            this.sound.play('startSound');
            this.scene.start('Play'); 
        });
    }
}
