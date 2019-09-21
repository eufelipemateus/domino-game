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
				socket.emit("HAND",cards)
				domino.Gamers.push(socket);
				this.io.emit("GAMER NAME",{gamer:domino.Gamers.length,name:msg  })
		
            });
			
			socket.on('gaming', function (msg) {
				
				domino.Cartas.indexOf(msg.value);
				domino.CartasUsadas.push(msg.value);
				domino.Ultimo = msg.ultimo;
				
				this.io.emit("TOKEN");
				socket.token = false;
				
				if((domino.indexOfGamers(socket)+1)<4){
					domino.Gamers[domino.indexOfGamers(socket)+1].token = true;
				}else{
					domino.Gamers[0].token = true;
				}
				
				
				socket.broadcast.emit("MOVIMENT",msg.value)
				
				
				let mIndex = socket.cards.indexOf(msg.value);
				if (mIndex > -1) {
					socket.cards.splice(mIndex, 1);
				}
				
				if(socket.card.length == 0){
					//Reiniciar("O Jogador"+(CartasEmMaos[index]+1)+" Venceu!");
				}
				
				mIndex = socket.CartasEmMaos.indexOf(msg.value);
				if (mIndex > -1) {
					socket.CartasEmMaos.splice(mIndex, 1);
				}
					
            });
			
			socket.on('pass', function (msg) {
				if(socket.token){
					this.io.emit("TOKEN",domino.Gamers[(domino.Gamers.indexOf(socket)+1)]);					
				}		
            });
			
            socket.on('disconnect', () => {
				domino.Gamers.splice(domino.Gamers.indexOf(socket), 1);
                if(this.debug)console.info('User disconnected!');
            });
        });
    }
	private runtime(){
	
		
		setInterval(() => {
			//var Statistica = {Tab:CartasUsadas.length,Gamers:Gamers.length};
			if(domino.Gamers.length==4){		
				/*Init the Game*/
				if( (domino.CartasEmMaos.indexOf([6,6])!==1) && (domino.CartasUsadas.indexOf([6,6])!==null) ){
					broadcast((CartasEmMaos[27]+1),"token");
					//broadcast((CartasEmMaos[27]+1),"token",Gamers[CartasEmMaos[27]]);
					//sendToAll(null,"ready",Gamers[CartasEmMaos[27]])
				}	
			}
		, 1000);
	}
}

export default new App();