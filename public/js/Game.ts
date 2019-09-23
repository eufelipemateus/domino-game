
class Game{
	
	private Ultimo=-1;
	private Jogador;
	private Debug;
	private socket;
	
	constructor(io){	
		this.socket = io();
		this.listen();
	}
	
	private newCard(nums,horizontal=false,invertido=false){
		let n1 = nums[0];
		let n2 = nums[1];
		let dcard = document.createElement("div");
			dcard.classList.add("card");
			dcard.setAttribute("value",nums);
			if(horizontal) dcard.classList.add("R90");
			if(invertido)  dcard.classList.add("R180");					
			
			let span = document.createElement("span");
				span.classList.add("dice");
				span.classList.add("dice-"+n1);
				span.setAttribute("value",n1);
			dcard.appendChild(span);
			
			let hr = document.createElement("hr");
			dcard.appendChild(hr);
			
				span = document.createElement("span");
				span.classList.add("dice");
				span.classList.add("dice-"+n2);
				span.setAttribute("value",n2);
			dcard.appendChild(span);
			
		return dcard;	
	}

	private isDouble(nums){
		if(nums[0]==nums[1]){  return true }else{ return false};
	}
	private isInverted(nums){
		if(nums[1]==this.Ultimo && (nums[1] != nums[0])){  return true }else{ return false};
	}
	private isAllowed(nums,num){
		 if((num==this.Ultimo) || ((nums[0]==6) && (nums[1]==6))){return true ;} else{ return false;}
	}
	private changeUltimo(nums){
		let ultimo = this.Ultimo;
		nums.forEach((num)=>{
			if(num!=ultimo && num!= this.Ultimo){
				ultimo=num;
			}
		});		
		this.Ultimo = ultimo;
	}
	private OpenToken(){
		document.getElementById("pass").classList.add("active");
		document.getElementById("wait").classList.add("disabled");
		document.getElementById("status").innerHTML = "Minha Vez!";
	}

	private CloseToken(){
		document.getElementById("pass").classList.remove("active");
		document.getElementById("wait").classList.remove("disabled");
		document.getElementById("status").innerHTML = "Aguardando Vez...";
	}
	private PassarVez(){
		this.socket.emit("PASS");
		this.CloseToken();
	}
	private downTabScroll(){
		let objDiv = document.getElementById("tabuleiro");
		objDiv.scrollTop = objDiv.scrollHeight;
	}

	private createHand(Hand){
		for(let i=0;i<Hand.length;i++){
			let nums =  Hand[i];
			
			let card = this.newCard(nums,false);
			let dices = card.querySelectorAll(".dice");
			dices.forEach((dice,index)=>{
					dice.classList.add("hand");
					dice.addEventListener("click",(e)=>{
						//Aqui entra Função Pra selecionar Peça no tabuleiro
									
						if(!this.isAllowed(nums,nums[index])) return false;
						let clone = (<Element>e.srcElement).parentElement.cloneNode(true); 
						
						if(this.isDouble(nums))  (<Element>clone).classList.add("R90");
						if(this.isInverted(nums))  (<Element>clone).classList.add("R180");					
						
						document.getElementById("tabuleiro").appendChild(clone);
						this.downTabScroll();
						(<Element>e.srcElement).parentElement.remove();
						
						this.changeUltimo(nums);
						
						this.CloseToken();
						this.socket.emit("gaming",{value:nums , last:this.Ultimo});

					});
					
					dice.addEventListener("mouseover", (e)=>{
						if(this.isAllowed(nums,nums[index])){
							(<Element>e.srcElement).classList.add("hoverPossible");
						}else{
							(<Element>e.srcElement).classList.add("hoverImPossible");					
						}			
					});

					dice.addEventListener("mouseout", function(e){
						(<Element>e.srcElement).classList.remove("hoverPossible");
						(<Element>e.srcElement).classList.remove("hoverImPossible");
					});
			});
			document.getElementById("hand").appendChild(card);
		}
	}

	private Reiniciar(){
		document.getElementById("tabuleiro").innerHTML = "";
		var cards = document.querySelectorAll("#hand > div:not(#wait) ");
		cards.forEach( function(card){
			card.parentNode.removeChild( card );
		});
		document.getElementById("status").innerHTML = "Aguardando jogadores...";
	}

	/*** Listen connections  ***/
	private listen(){
		this.socket.on('connect', () =>  {
			 if(this.Debug)console.info("conectado!!");
			this.socket.emit("NEW CONNECTION",window.prompt("Digite seu nome:"));

		});
		this.socket.on('HAND', (msg)=> {
			this.Reiniciar();
			this.createHand(msg);		
		});
		this.socket.on('GAMER NAME', (msg)=> {
			document.getElementById("gamerName_"+msg.gamer).innerHTML =msg.name ;
			document.getElementById("gamer_num").innerHTML = (msg.gamer+1);
			this.Jogador=msg.gamer;
		});
		this.socket.on('MOVIMENT', (msg)=> {
			let horizontal=false,invertido=false;
					
			if(this.isDouble(msg.value))  horizontal=true;
			if(this.isInverted(msg.value))  invertido=true;		

			let card  = this.newCard(msg.value,horizontal,invertido);		
			
			document.getElementById("tabuleiro").appendChild(card);
			this.downTabScroll();
			this.Ultimo= msg.last;
		});	
		this.socket.on('TOKEN', (token)=> {
			this.CloseToken();	
			if(token==this.Jogador){
				this.OpenToken();
			}
			(<HTMLInputElement >document.getElementById("Tokenjogador_"+token)).checked =true;		
		});
		this.socket.on('REBOOT', (msg)=> {
			alert(msg);
			this.Reiniciar();		
		});
		this.socket.on('INFO',(msg)=>{
			document.getElementById("gamers").innerHTML = msg.Gamers;
			document.getElementById("tab").innerHTML = msg.Tab;
			document.getElementById("cards_in_hand").innerHTML = msg.CardsInHand;
		});
	}
}