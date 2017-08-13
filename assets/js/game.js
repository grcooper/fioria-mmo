import socket from "./socket"
import _ from "underscore"

let channel;
let game;
let label;
let map;
let layer;

// our player
let player;
// this will hold the list of players
let players = {};
// styling players labels a bit
let style = {
    font: "12px Arial",
    fill: "#ffffff"
};

function preload() {
    game.load.spritesheet('char', 'images/char01.png', 32, 48);
    game.load.spritesheet('blankchar', 'images/blankchar.png', 32, 48);
    game.load.tilemap('map', 'maps/test/testmap.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'maps/test/testtiles.png');
}

function handlePlayerJoined(player_info) {
    players[player_info.id] = spawn(player_info);
}

function handlePlayerPosition(player_info){
    uPosition(player_info);
}

function handlePlayerLeft(player_id){
    players[player_id].label.destroy();
    players[player_id].destroy();
}

function create() {
    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
    map = game.add.tilemap('map', 32, 32);

    //  Now add in the tileset
    map.addTilesetImage('tiles');
    
    //  Create our layer
    layer = map.createLayer(0);

    //  Resize the world
    layer.resizeWorld();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';

    player = game.add.sprite(0, 0, 'blankchar');

    player.animations.add('down', [0, 1, 2], 10);
    player.animations.add('left', [12, 13, 14], 10);
    player.animations.add('right', [24, 25, 26], 10);
    player.animations.add('up', [36, 37, 38], 10);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

    channel = socket.channel("game");

    channel.join()
      .receive("ok", ({players: players, token: token, player: current_player})  => {
        _.each(players, (player_info) => handlePlayerJoined(player_info));
        localStorage.setItem("mmo_player_id", token);
        player.x = current_player.x;
        player.y = current_player.y;
        console.log("Joined successfully", players)
      })
      .receive("error", resp => {
        console.log("Unable to join", resp)
      })

    channel.on("player:joined", ({player_info: player_info}) => {
      handlePlayerJoined(player_info);
    })

    channel.on("player:position", ({player_info: player_info}) => {
      handlePlayerPosition(player_info);
    })

    channel.on("player:left", ({player_id: player_id}) => {
      handlePlayerLeft(player_id);
    })

    channel.on("player:validate", ({player_info: player_info}) => {
      handlePlayerValidate(player_info);
    })
}

function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        channel.push("move", 'left');
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        channel.push("move", "right");
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        channel.push("move", 'up');
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        channel.push("move", 'down');
    }
}

function spawn(player_info) {
    let label = player_info.id.match(/(^\w*)-/i)[1];
    let p = game.add.sprite(player_info.x, player_info.y, 'char');
    p.animations.add('down', [0, 1, 2], 10);
    p.animations.add('left', [12, 13, 14], 10);
    p.animations.add('right', [24, 25, 26], 10);
    p.animations.add('up', [36, 37, 38], 10);
    p.label = game.add.text(player_info.x, player_info.y - 10, label, style);
    return p;
}

function uPosition(player_info) {
    if (players[player_info.id].x > player_info.x) {
        players[player_info.id].animations.play('left');
    } else if (players[player_info.id].x < player_info.x) {
        players[player_info.id].animations.play('right');
    } else if (players[player_info.id].y > player_info.y) {
        players[player_info.id].animations.play('up');
    } else {
        players[player_info.id].animations.play('down');
    }
    players[player_info.id].x = players[player_info.id].label.x = player_info.x;
    player.x = player_info.x;
    players[player_info.id].y = player_info.y;
    player.y = player_info.y;
    players[player_info.id].label.y = player_info.y - 10;
}

window.onload = function() {
    game = new Phaser.Game(1024, 768, Phaser.AUTO, null, {
        preload: preload,
        create: create,
        update: update
    });
};
