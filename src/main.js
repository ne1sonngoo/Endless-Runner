// Phaser Endless Runner Game
// Name: Nelson Ngo
// Game Title: Space Runner
// Hours Spent: 20 Hours
// Creative Tilt: used pixel art of shapes and colors to give it an old school look. The sfx was done by my friend and 
// the game gets harder over time making it not one dimentional.


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