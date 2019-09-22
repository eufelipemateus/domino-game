import * as express from "express";
import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';
import domino from './Domino';

class App {
    public app: express.Application;
    public server: Server;
    private io: SocketIO.Server;
    public PORT: number = 8080;
	public debug:boolean=false;
	

    constructor() {
        this.routes();
        this.sockets();
        this.listen();
		this.runtime();
    }

    routes() {
        this.app = express();
        this.app.use(express.static('public'));
    }

    private sockets(): void {
        this.server = createServer(this.app);
        this.io = socketIo(this.server);
    }

    private listen(): void {

        this.io.on('connection', (socket: any) => {
            if(this.debug)console.info('A user connected!');

            socket.on('NEW CONNECTION', (msg)=> {

				let cards = domino.emabaralhar();
				socket.cards = cards ;
				socket.name = msg;
				socket.token = domino.primeiraJogada(cards);
				socket.emit("HAND",cards);
				domino.Gamers.push(socket);
				
				domino.Gamers.forEach((s,index)=>{
					socket.emit("GAMER NAME",{gamer:index,name:s.name  });
				});

            });
			
			socket.on('gaming',(msg)=>{
				
				domino.Cartas.indexOf(msg.value);
				domino.CartasUsadas.push(msg.value);
				domino.Ultimo = msg.ultimo;
				
				socket.token = false;
				
				if((domino.indexOfGamers(socket)+1)<4){
					domino.Gamers[domino.indexOfGamers(socket)+1].token = true;
				}else{
					domino.Gamers[0].token = true;
				}
	
				socket.broadcast.emit("MOVIMENT",msg)
								
				let mIndex = socket.cards.indexOf(msg.value);
				if (mIndex > -1) {
					socket.cards.splice(mIndex, 1);
				}
				
				if(socket.cards.length == 0){
					//Reiniciar("O Jogador"+(CartasEmMaos[index]+1)+" Venceu!");
				}
				
				mIndex = domino.CartasEmMaos.indexOf(msg.value);
				if (mIndex > -1) {
					socket.CartasEmMaos.splice(mIndex, 1);
				}
					
            });
			
			socket.on('PASS', function (msg) {
				console.log(socket.token);
				if(socket.token){
					socket.token = false;
					if((domino.indexOfGamers(socket)+1)<4){
						domino.Gamers[domino.indexOfGamers(socket)+1].token = true;
					}else{
						domino.Gamers[0].token = true;
					}				
				}		
            });
			
            socket.on('disconnect', () => {
				domino.Gamers.splice(domino.Gamers.indexOf(socket), 1);
                if(this.debug)console.info('User disconnected!');
				this.reboot();
            });
        });
    }
	private runtime(){
		
		setInterval(() => {
			
			this.io.emit("INFO", {Tab:domino.CartasUsadas.length,Gamers:domino.Gamers.length});

			if(domino.Gamers.length==4){		
				domino.Gamers.forEach((socket,index)=>{
					if(socket.token)
						this.io.emit("TOKEN",index);
				});			
			}
		}, 1000);
	}
	private reboot(){
		domino.CartasUsadas=Array();
		domino.CartasEmMaos=Array();

		domino.Gamers.forEach((client,index) => {
			client.emit("REBOOT");
			let cards = domino.emabaralhar();
			client.cards = cards ;
			client.token = domino.primeiraJogada(cards);
			client.emit("HAND",cards);	
		});	
	}
}

export default new App();