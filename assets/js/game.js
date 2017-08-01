import socket from "./socket"
import _ from "underscore"

let channel;

window.onload = function() {

    var game = new Phaser.Game(1024, 768, Phaser.AUTO, null, {
        preload: preload,
        create: create,
        update: update
    });

    var player, //our player
        players = {}, //this will hold the list of players
        sock, //this will be player's ws connection
        label,
        style = {
            font: "12px Arial",
            fill: "#ffffff"
        }; //styling players labels a bit

    function preload() {
        game.load.spritesheet('char', 'images/char01.png', 32, 48);
    }

    function handlePlayerMessage(player) {
        if (player.new) {
            players[player.id] = spawn(player);
        } else {
            uPosition(player);
        }
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#2d2d2d';

        player = game.add.sprite(0, 0, 'char');

        player.animations.add('down', [0, 1, 2], 10);
        player.animations.add('left', [12, 13, 14], 10);
        player.animations.add('right', [24, 25, 26], 10);
        player.animations.add('up', [36, 37, 38], 10);

        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        var pos = {
            x: player.x,
            y: player.y
        };

        channel = socket.channel("game", pos);

        channel.join()
          .receive("ok", ({players: players})  => {
            _.each(players, (player) => handlePlayerMessage(player));
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

        game.time.events.loop(Phaser.Timer.SECOND * 2, websocketHeartbeat, this);
    }


    function websocketHeartbeat() {
        console.log("Heartbeat");
        var pos = {
                x: player.x,
                y: player.y
            };
        channel.push("heartbeat", pos)
    }

    function update() {

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            player.animations.play('left');
            player.x -= 3;
            var pos = {
              x: player.x,
              y: player.y,
            };
            channel.push("move", pos)
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            player.animations.play('right');
            player.x += 3;
            var pos = {
              x: player.x,
              y: player.y,
            };
            channel.push("move", pos)
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            player.animations.play('up');
            player.y -= 3;
            var pos = {
              x: player.x,
              y: player.y,
            };
            channel.push("move", pos)

        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            player.animations.play('down');
            player.y += 3;
            var pos = {
              x: player.x,
              y: player.y,
            };
            channel.push("move", pos)
        }
    }

    function spawn(player) {
        var label = player.id.match(/(^\w*)-/i)[1];
        var p = game.add.sprite(player.x, player.y, 'char');
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
};
