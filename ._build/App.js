"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const socketIo = require("socket.io");
const Domino_1 = require("./Domino");
class App {
    constructor() {
        this.debug = false;
        this.routes();
        this.sockets();
        this.listen();
        this.runtime();
    }
    routes() {
        this.app = express();
        this.app.use(express.static('public'));
    }
    sockets() {
        this.server = http_1.createServer(this.app);
        this.io = socketIo(this.server);
    }
    listen() {
        this.io.on('connection', (socket) => {
            if (this.debug) {
                console.info('A user connected!');
            }
            socket.on('NEW CONNECTION', (msg) => {
                const cards = Domino_1.default.emabaralhar();
                socket.cards = cards;
                socket.name = msg;
                socket.token = Domino_1.default.primeiraJogada(cards);
                socket.emit('HAND', cards);
                Domino_1.default.Gamers.push(socket);
                Domino_1.default.Gamers.forEach((s, index) => {
                    socket.emit('GAMER NAME', { gamer: index, name: s.name });
                });
            });
            socket.on('gaming', (msg) => {
                socket.cards.splice(Domino_1.default.Cartas.indexOf(msg.value), 1);
                Domino_1.default.CartasUsadas.push(msg.value);
                Domino_1.default.Ultimo = msg.last;
                if (this.debug) {
                    console.info('User play!', msg.value);
                }
                socket.token = false;
                if ((Domino_1.default.indexOfGamers(socket) + 1) < 4) {
                    Domino_1.default.Gamers[Domino_1.default.indexOfGamers(socket) + 1].token = true;
                }
                else {
                    Domino_1.default.Gamers[0].token = true;
                }
                socket.broadcast.emit('MOVIMENT', msg);
                Domino_1.default.removeGamerCard(socket, msg.value);
                if (Domino_1.default.isGamerWinner(socket)) {
                    this.reboot('O Jogador' + (Domino_1.default.indexOfGamers(socket) + 1) + ' Venceu!');
                    if (this.debug) {
                        console.info('User Winner!');
                    }
                }
                Domino_1.default.removeCardInHand(socket, msg.value);
            });
            socket.on('PASS', (msg) => {
                if (socket.token) {
                    socket.token = false;
                    if ((Domino_1.default.indexOfGamers(socket) + 1) < 4) {
                        Domino_1.default.Gamers[Domino_1.default.indexOfGamers(socket) + 1].token = true;
                    }
                    else {
                        Domino_1.default.Gamers[0].token = true;
                    }
                    if (this.debug) {
                        console.info('User Pass!');
                    }
                }
            });
            socket.on('disconnect', () => {
                const gamer = Domino_1.default.Gamers.indexOf(socket);
                Domino_1.default.Gamers.splice(gamer, 1);
                if (this.debug) {
                    console.info('User disconnected!');
                }
                this.reboot(`O Jogador ${(gamer) + 1} desconectou! `);
            });
        });
    }
    runtime() {
        setInterval(() => {
            this.io.emit('INFO', {
                Tab: Domino_1.default.CartasUsadas.length,
                Gamers: Domino_1.default.Gamers.length,
                CardsInHand: Domino_1.default.CartasEmMaos.length,
            });
            if (Domino_1.default.Gamers.length == 4) {
                Domino_1.default.Gamers.forEach((socket, index) => {
                    if (socket.token) {
                        this.io.emit('TOKEN', index);
                    }
                });
            }
        }, 1000);
    }
    reboot(msg) {
        Domino_1.default.CartasUsadas = Array();
        Domino_1.default.CartasEmMaos = Array();
        Domino_1.default.Gamers.forEach((client, index) => {
            client.emit('REBOOT', msg);
            const cards = Domino_1.default.emabaralhar();
            client.cards = cards;
            client.token = Domino_1.default.primeiraJogada(cards);
            client.emit('HAND', cards);
            client.emit('GAMER NAME', { gamer: index, name: client.name });
        });
        if (this.debug) {
            console.info('Game Reboot!');
        }
    }
}
exports.default = new App();
