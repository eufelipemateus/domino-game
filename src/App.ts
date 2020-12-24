import * as express from 'express';
import { createServer, Server } from 'http';
import { Socket } from 'socket.io';
import socketIo = require('socket.io');
import domino from './Domino';
import { Gamer } from './interfaces/Gamer.interface';
import {Gaming} from './interfaces/Gaming.interface';
class App {
    public app: express.Application;
    public server: Server;
    public debug= false;
    private io: socketIo.Server

    constructor() {
        this.routes();
        this.sockets();
        this.listen();
        this.runtime();
    }
    /**
     * Http ROutes
     */
    private routes() {
        this.app = express();
        this.app.use(express.static('./public'));
    }
    /**
     * Socket http
     */
    private sockets(): void {
        this.server = createServer(this.app);
        this.io = new socketIo.Server(this.server);
    }

    /**
     * Listen the connection
     */
    private listen(): void {

        this.io.on('connection', (socket: Socket) => {

            if (this.debug) {
                console.info('A user connected!');
            }

            socket.on('NEW CONNECTION', (msg: string) => {
                const cards = domino.emabaralhar();
                const gamer: Gamer = {
                    name: msg,
                    socket,
                    cards,
                    token: domino.primeiraJogada(cards),
                }

                socket.emit('HAND', cards);
                domino.gamers.push(gamer);

                domino.gamers.map((s, index) => {
                    socket.emit('GAMER NAME', {gamer: index, name: s.name});
                });
            });
            socket.on('gaming', (msg: Gaming) => {
                const gamerIndex:number = domino.indexOfGamers(socket);

                domino.gamers[gamerIndex].cards.splice(domino.cartas.indexOf(msg.value), 1);
                domino.cartasUsadas.push(msg.value);
                domino.ultimo = msg.last;

                if (this.debug) {
                    console.info('User play!', msg.value);
                }

                domino.gamers[gamerIndex].token = false;

                if ((domino.indexOfGamers(socket) + 1) < 4) {
                    domino.gamers[gamerIndex + 1].token = true;
                } else {
                    domino.gamers[0].token = true;
                }
                socket.broadcast.emit('MOVIMENT', msg);
                domino.removeGamerCard(domino.gamers[gamerIndex], msg.value);
                if (domino.isGamerWinner(domino.gamers[gamerIndex])) {
                    this.reboot('O Jogador ' + (gamerIndex +1) +  ' -  "' + domino.gamers[gamerIndex].name + '" Venceu!');
                    if (this.debug) {
                        console.info('User Winner!');
                    }
                }
                domino.removeCardInHand( msg.value);
            });
            socket.on('PASS', (msg) => {
                const gamerIndex:number = domino.indexOfGamers(socket);

                if (domino.gamers[gamerIndex].token) {
                    domino.gamers[gamerIndex].token = false;
                    if ((gamerIndex + 1) < 4) {
                        domino.gamers[gamerIndex + 1].token = true;
                    } else {
                         domino.gamers[0].token = true;
                    }
                    if (this.debug) {
                        console.info('User Pass!');
                    }
                }
            });
            socket.on('disconnect', () => {
                const gamerIndex:number = domino.indexOfGamers(socket);
                domino.gamers.splice(gamerIndex, 1);
                if (this.debug) {
                    console.info('User disconnected!');
                }
                this.reboot(`O Jogador ${(gamerIndex) + 1} desconectou! ` );
            });
        });
    }

    /**
     * Runtime
     */
    private runtime() {
        setInterval(() => {
            this.io.emit('INFO', {
                'tab': domino.cartasUsadas.length,
                'gamers': domino.gamers.length,
                'cardsInHand': domino.cartasEmMaos.length,
            });
            if (domino.gamers.length == 4) {
                domino.gamers.map((gamer, index) => {
                    if (gamer.token) {
                        this.io.emit('TOKEN', index);
                    }
                });
            }
        }, 1000);
    }
    /**
     * Reboot the Game
     *
     * @param msg
     */
    private reboot(msg) {
        domino.cartasUsadas = [];
        domino.cartasEmMaos =  [];

        domino.gamers.map((gamer, index) => {
            gamer.socket.emit('REBOOT', msg);
            const cards = domino.emabaralhar();
            gamer.cards = cards;
            gamer.token = domino.primeiraJogada(cards);
            gamer.socket.emit('HAND', cards);
            gamer.socket.emit('GAMER NAME', {gamer: index, name: gamer.name});
        });
        if (this.debug) {
 console.info('Game Reboot!');
}
    }
}

export default new App();
