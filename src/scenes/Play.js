class Play extends Phaser.Scene {
    constructor() {
        super("Play");
        this.isAlive = true;
    }

    preload() {
        this.load.spritesheet('character', './assets/character.png', { frameWidth: 48 });
        this.load.image('wall', './assets/walls.png');
        this.load.audio('bgm', './assets/bgm.mp3');
        this.load.audio('restartSound', 'assets/again.mp3');
        this.load.audio('wallHitSound', 'assets/bruh.mp3');
        this.load.audio('timerSound', 'assets/hooray.mp3');
    }

    create() {
        this.bgm = this.sound.add('bgm', { loop: true, volume: 0.15 });
        if (!this.sound.locked) {
            this.bgm.play();
        }
        this.input.on('pointerdown', () => {
            if (this.sound.locked) {
                this.sound.unlock();
                this.bgm.play();
            }
        });
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'background').setOrigin(0, 0);
        this.player = this.physics.add.sprite(width / 2, height / 2, 'character', 1)
            .setScale(2)
            .setCollideWorldBounds(true);
        const playerBodyWidth = this.player.width * 0.6;
        const playerBodyHeight = this.player.height * 0.6;
        this.player.body.setSize(playerBodyWidth, playerBodyHeight)
            .setOffset((this.player.width - playerBodyWidth) / 2, (this.player.height - playerBodyHeight) / 2 + 12);
        this.wallBodyWidth = 60;
        this.wallBodyHeight = 80;
        this.wallBodyOffsetX = 20;
        this.wallBodyOffsetY = 10;
        this.timeElapsed = 0;
        this.timerText = this.add.text(16, 16, 'Time: 0', { fontSize: '32px', fill: '#FFF' });
        this.restartText = this.add.text(width / 2, height / 2, 'Press R to Restart', { fontSize: '48px', fill: '#FF0000' })
            .setOrigin(0.5)
            .setVisible(false);
        this.walls = this.physics.add.group({
            defaultKey: 'wall',
            createCallback: (wall) => {
                wall.setOrigin(0.5)
                    .setImmovable(true)
                    .body.setAllowGravity(false)
                    .setSize(this.wallBodyWidth, this.wallBodyHeight)
                    .setOffset(this.wallBodyOffsetX, this.wallBodyOffsetY);
            }
        });
        this.wallSpeedMultiplier = 1;
        this.nextSpeedIncreaseTime = 20;
        const sectionHeight = height / 3;
        for (let i = 0; i < 3; i++) {
            const minY = i * sectionHeight + 50;
            const maxY = (i + 1) * sectionHeight - 50;
            this.createWall(Phaser.Math.Between(minY, maxY));
        }
        this.physics.add.overlap(this.player, this.walls, this.handleDeath, null, this);
        this.cursors = this.input.keyboard.addKeys({
            'W': Phaser.Input.Keyboard.KeyCodes.W,
            'A': Phaser.Input.Keyboard.KeyCodes.A,
            'S': Phaser.Input.Keyboard.KeyCodes.S,
            'D': Phaser.Input.Keyboard.KeyCodes.D,
            'R': Phaser.Input.Keyboard.KeyCodes.R
        });
    }

    handleDeath = () => {
        if (this.isAlive) {
            this.isAlive = false;
            this.sound.play('wallHitSound', { volume: 0.1 });
            this.player.setTint(0xff0000);
            this.player.body.stop();
            this.walls.getChildren().forEach(wall => wall.setVelocityX(0));
            this.restartText.setVisible(true);
        }
    }

    createWall(yPosition) {
        const baseSpeed = Phaser.Math.Between(150, 250);
        const wall = this.walls.get(Phaser.Math.Between(width, width * 1.5), yPosition);
        if (wall) {
            wall.originalSpeed = baseSpeed;
            wall.setActive(true)
                .setVisible(true)
                .setVelocityX(-baseSpeed * this.wallSpeedMultiplier);
            wall.body.updateFromGameObject();
        }
    }

    update() {
        if (this.cursors.R.isDown) {
            if (this.bgm) {
                this.bgm.stop();
            }
            this.restartGame();
        }
        if (!this.isAlive) return;
        this.timeElapsed += this.game.loop.delta / 1000;
        let seconds = Math.floor(this.timeElapsed);
        this.timerText.setText('Time: ' + seconds);
        if (seconds % 10 === 0 && seconds !== 0 && this.lastPlayedTime !== seconds) {
            this.sound.play('timerSound', { volume: 0.1 });
            this.lastPlayedTime = seconds;
        }
        if (this.timeElapsed >= this.nextSpeedIncreaseTime) {
            this.wallSpeedMultiplier *= 1.5;
            this.nextSpeedIncreaseTime += 20;
            this.walls.getChildren().forEach(wall => {
                if (wall.active) {
                    wall.setVelocityX(-wall.originalSpeed * this.wallSpeedMultiplier);
                }
            });
        }
        this.bg.tilePositionX += 2;
        this.walls.getChildren().forEach(wall => {
            if (wall.x < -wall.displayWidth * 2) {
                const newBaseSpeed = Phaser.Math.Between(150, 250);
                wall.originalSpeed = newBaseSpeed;
                wall.setVelocityX(-newBaseSpeed * this.wallSpeedMultiplier);
                wall.x = Phaser.Math.Between(width, width * 1.5);
                wall.y = Phaser.Math.Between(50, height - 50);
                wall.body.updateFromGameObject();
            }
        });
        const speed = 200;
        this.player.setVelocity(0);
        if (this.cursors.W.isDown) this.player.setVelocityY(-speed);
        if (this.cursors.S.isDown) this.player.setVelocityY(speed);
        if (this.cursors.A.isDown) this.player.setVelocityX(-speed);
        if (this.cursors.D.isDown) this.player.setVelocityX(speed);
    }

    restartGame() {
        if (this.bgm && !this.bgm.isPlaying) {
            this.bgm.play();
        }
        this.sound.play('restartSound', { volume: 0.1 });
        if (this.bgm) {
            this.bgm.stop();
        }
        this.isAlive = true;
        this.scene.restart();
    }
}
