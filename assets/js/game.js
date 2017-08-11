import socket from "./socket"
import _ from "underscore"

import Messages from "../../priv/messages";

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
    game.load.tilemap('map', 'maps/test/testmap.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'maps/test/testtiles.png');
}

function handlePlayerMessage(player) {
    if (player.new) {
        players[player.id] = spawn(player);
    } else {
        uPosition(player);
    }
}

function create() {
    debugger;
    Messages.Player.Create;
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

    player = game.add.sprite(0, 0, 'char');

    player.animations.add('down', [0, 1, 2], 10);
    player.animations.add('left', [12, 13, 14], 10);
    player.animations.add('right', [24, 25, 26], 10);
    player.animations.add('up', [36, 37, 38], 10);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    channel = socket.channel("game");

    channel.join()
      .receive("ok", ({players: players, token: token, player: current_player})  => {
        _.each(players, (player) => handlePlayerMessage(player));
        localStorage.setItem("mmo_player_id", token);
        player.x = current_player.x;
        player.y = current_player.y;
        console.log("Joined successfully", players)
      })
      .receive("error", resp => {
        console.log("Unable to join", resp)
      })

    channel.on("player:joined", ({player: player}) => {
      handlePlayerMessage(player);
    })

    channel.on("player:position", ({player: player}) => {
      handlePlayerMessage(player);
    })

    channel.on("player:left", ({player: player_id}) => {
      players[player_id].label.destroy();
      players[player_id].destroy();
    })
}

function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        player.animations.play('left');
        player.x -= 3;
        channel.push("move", 'left')
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        player.animations.play('right');
        player.x += 3;
        channel.push("move", "right");
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        player.animations.play('up');
        player.y -= 3;
        channel.push("move", 'up')
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        player.animations.play('down');
        player.y += 3;
        channel.push("move", 'down')
    }
}

function spawn(player) {
    let label = player.id.match(/(^\w*)-/i)[1];
    let p = game.add.sprite(player.x, player.y, 'char');
    p.animations.add('down', [0, 1, 2], 10);
    p.animations.add('left', [12, 13, 14], 10);
    p.animations.add('right', [24, 25, 26], 10);
    p.animations.add('up', [36, 37, 38], 10);
    p.label = game.add.text(player.x, player.y - 10, label, style);
    return p;
}

function uPosition(player) {
    if (players[player.id].x > player.x) {
        players[player.id].animations.play('left');
    } else if (players[player.id].x < player.x) {
        players[player.id].animations.play('right');
    } else if (players[player.id].y > player.y) {
        players[player.id].animations.play('up');
    } else {
        players[player.id].animations.play('down');
    }
    players[player.id].x = players[player.id].label.x = player.x;
    players[player.id].y = player.y;
    players[player.id].label.y = player.y - 10;
}

window.onload = function() {
    game = new Phaser.Game(1024, 768, Phaser.AUTO, null, {
        preload: preload,
        create: create,
        update: update
    });
};
