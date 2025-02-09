// Phaser Endless Runner Game
// Name: Nelson Ngo
// Game Title: Space Runner
// Hours Spent:  Hours
// Creative Tilt: Dynamic obstacle generation with escalating difficulty



let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { 
            gravity: { y: 800 }, 
            debug: true
        }
    },
    scene: [ Menu, Play, CreditScene]
};

let game = new Phaser.Game(config)
let cursors
let { height, width } = game.config