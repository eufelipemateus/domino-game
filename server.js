/**Server Variaveis**/
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use(express.static(path.join(__dirname, 'public')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
const wss = new SocketServer({ server });
 
 
/*Aplication Variaveis**/ 
 
 var Cartas = daCartas();
 var CartasUsadas=Array();
 var CartasEmMaos=Array();
 
 wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.cartas = emabaralhar();
   
  send(ws.cartas,"myHand",ws);
  ws.on('close', () => console.log('Client disconnected'));
});



function broadcast(object,subject){
	wss.clients.forEach((client) => {
		send(object,subject,client);
	});
}

function send(object,subject,socket){
	var response  = {'subject':subject,"object":object};
	
	socket.send(JSON.stringify(response));
}

function daCartas(){
	var cartas=Array();
	var index=0;
	for(i=0;i<7;i++){
		for(p=0;p<7;p++){
			if(p>=i) cartas[index++]=i+"|"+p;
		}
	}
	return cartas;
}

function emabaralhar(){
	var MinhaMao = Array();
	for(index=0;index<7;index++){
		do{
			var randNumber = Math.floor((Math.random() * 27) + 0);
		
		}while(CartasEmMaos[randNumber]);
		
		CartasEmMaos[randNumber]=true;
		MinhaMao[index] = Cartas[randNumber];
	}
	return MinhaMao;
}



setInterval(() => {
	
	var Statistica = {Tab:0,Gamers:0};
	broadcast(Statistica,'Statistica');
	
}, 10000);
