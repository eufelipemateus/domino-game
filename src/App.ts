import * as express from 'express';
import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';
import domino from './Domino';

class App {
    public app: express.Application;
    public server: Server;
    public debug= false;
    private io: SocketIO.Server;

    constructor() {
        this.routes();
        this.sockets();
        this.listen();
        this.runtime();
    }

    private routes() {
        this.app = express();
        this.app.use(express.static('public'));
    }

    private sockets(): void {
        this.server = createServer(this.app);
        this.io = socketIo(this.server);
    }

    private listen(): void {

        this.io.on('connection', (socket: any) => {
            if (this.debug) { console.info('A user connected!'); }

            socket.on('NEW CONNECTION', (msg) => {
                const cards = domino.emabaralhar();
                socket.cards = cards;
                socket.name = msg;
                socket.token = domino.primeiraJogada(cards);
                socket.emit('HAND', cards);
                domino.Gamers.push(socket);

                domino.Gamers.forEach((s, index) => {
                    socket.emit('GAMER NAME', {gamer: index, name: s.name});
                });
            });
            socket.on('gaming', (msg) => {
                socket.cards.splice(domino.Cartas.indexOf(msg.value), 1);
                domino.CartasUsadas.push(msg.value);
                domino.Ultimo = msg.last;

                if (this.debug) { console.info('User play!', msg.value); }

                socket.token = false;

                if ((domino.indexOfGamers(socket) + 1) < 4) {
                    domino.Gamers[domino.indexOfGamers(socket) + 1].token = true;
                }else {
                    domino.Gamers[0].token = true;
                }
                socket.broadcast.emit('MOVIMENT', msg);
                domino.removeGamerCard(socket, msg.value);
                if (domino.isGamerWinner(socket)) {
                    this.reboot('O Jogador' + (domino.indexOfGamers(socket) + 1) + ' Venceu!');
                    if (this.debug) {
                        console.info('User Winner!');
                    }
                }
                domino.removeCardInHand(socket, msg.value);
            });
            socket.on('PASS', (msg) => {
                if (socket.token) {
                    socket.token = false;
                    if ((domino.indexOfGamers(socket) + 1) < 4) {
                        domino.Gamers[domino.indexOfGamers(socket) + 1].token = true;
                    } else {
                         domino.Gamers[0].token = true;
                    }
                    if (this.debug) { console.info('User Pass!'); }
                }
            });
            socket.on('disconnect', () => {
                const gamer = domino.Gamers.indexOf(socket);
                domino.Gamers.splice(gamer, 1);
                if (this.debug) { console.info('User disconnected!'); }
                this.reboot(`O Jogador ${(gamer) + 1} desconectou! ` );
            });
        });
    }
    private runtime() {
        setInterval(() => {
            this.io.emit('INFO', {
                Tab: domino.CartasUsadas.length,
                Gamers: domino.Gamers.length,
                CardsInHand: domino.CartasEmMaos.length,
            });
            if (domino.Gamers.length == 4) {
                domino.Gamers.forEach((socket, index) => {
                    if (socket.token) {
                        this.io.emit('TOKEN', index);
                    }
                });
            }
        }, 1000);
    }
    private reboot(msg) {
        domino.CartasUsadas = Array();
        domino.CartasEmMaos = Array();

        domino.Gamers.forEach((client, index) => {
            client.emit('REBOOT', msg);
            const cards = domino.emabaralhar();
            client.cards = cards;
            client.token = domino.primeiraJogada(cards);
            client.emit('HAND', cards);
            client.emit('GAMER NAME', {gamer: index, name: client.name});
        });
        if (this.debug) { console.info('Game Reboot!'); }
    }
}

export default new App();
