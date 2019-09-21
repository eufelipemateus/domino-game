var Ultimo;
var Jogador;

function newCard(nums,horizontal){
	let n1 = nums[0];
	let n2 = nums[1];
	
	
	let dcard = document.createElement("div");
		dcard.classList.add("card");
		dcard.setAttribute("value",nums);
		if(horizontal) dcard.classList.add("R90");
		
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

function isDouble(Card){
	let nums = Card.getAttribute("value").split("|");
	if(nums[0]==nums[1]){  return true }else{ return false};
}
function isInverted(Card){
	let nums = Card.getAttribute("value").split("|");
	if(nums[1]==Ultimo && (nums[1] != nums[0])){  return true }else{ return false};
}
function isAllowed(Dice){
	if((Dice.getAttribute("value")==Ultimo) || (Dice.parentElement.getAttribute("value")=="6|6")){return true ;} else{ return false;}
}
function changeUltimo(Card){
	let dices = Card.querySelectorAll(".dice");
	let ultimo = Ultimo;
	dices.forEach(function(dice){
		if(parseInt(dice.getAttribute("value"))!=ultimo && parseInt(dice.getAttribute("value"))!= Ultimo ){
			ultimo= parseInt(dice.getAttribute("value"));				
		}
	});
	Ultimo = ultimo;
}

function OpenToken(){
	Vez=true;
	document.getElementById("pass").classList.add("active");
	document.getElementById("wait").classList.add("disabled");
	document.getElementById("status").innerHTML = "Minha Vez!";
}

function CloseToken(){
	document.getElementById("pass").classList.remove("active");
	document.getElementById("wait").classList.remove("disabled");
	document.getElementById("status").innerHTML = "Aguardando Vez...";
	Vez=false;
}
function PassarVez(){
	if(Vez){
		ws.send(JSON.stringify({'subject':"pass"}));
		CloseToken();
	}
}
function downTabScroll(){
	let objDiv = document.getElementById("tabuleiro");
	objDiv.scrollTop = objDiv.scrollHeight;
}


function createHand(Hand){
	for(i=0;i<Hand.length;i++){
		let nums =  Hand[i];
		
		let card = newCard(nums,false);
		let dices = card.querySelectorAll(".dice");
		dices.forEach(function(dice){
				dice.classList.add("hand");
				dice.addEventListener("click", function(e){
					//Aqui entra Função Pra selecionar Peça no tabuleiro
								
					if(!isAllowed(e.srcElement)) return false;
					let clone = e.srcElement.parentElement.cloneNode(true); 
					
					if(isDouble(clone))  clone.classList.add("R90");
					if(isInverted(clone))  clone.classList.add("R180");					
					
					document.getElementById("tabuleiro").appendChild(clone);
					downTabScroll();
					e.srcElement.parentElement.remove();
					changeUltimo(clone);
					
					socket.emit("gaming",{value:nums, last:Ultimo});
					CloseToken();
				});
				
				dice.addEventListener("mouseover", function(e){
					if(isAllowed(e.srcElement)){
						e.srcElement.classList.add("hoverPossible");
					}else{
						e.srcElement.classList.add("hoverImPossible");					
					}			
				});
				
				dice.addEventListener("mouseout", function(e){
					e.srcElement.classList.remove("hoverPossible");
					e.srcElement.classList.remove("hoverImPossible")
				});
		});
		document.getElementById("hand").appendChild(card);
	}
}
/*** Listen connections  ***/
function listen(){
	socket.on('connect', () =>  {
		console.info("conctado");
		
		socket.emit("NEW CONNECTION",window.prompt("Digite seu nome:"));

	});

	socket.on('HAND', function (msg) {
		createHand(msg);		
	});
	
	socket.on('GAMER NAME', function (msg) {
		document.getElementById("gamerName_"+msg.gamer).innerHTML =msg.name ;
		Jogador=msg.gamer;
	});
	
	socket.on('MOVIMENT', function (msg) {
		
			
			var card  = newCard(response.value)
			
			if(isDouble(card))  card.classList.add("R90");
			if(isInverted(card))  card.classList.add("R180");					
			
			document.getElementById("tabuleiro").appendChild(card);
			downTabScroll();
			Ultimo= response.last;
	});
	
}
