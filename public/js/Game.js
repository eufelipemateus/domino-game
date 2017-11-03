
var Ultimo = null;
var Vez = false;
var Jogador = null;

var HOST = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(HOST);
var el = document.getElementById('tabuleiro');

ws.onmessage = function (event) {
     var response = JSON.parse(event.data);
	 
	 switch(response.subject){
		case 'myHand' :
			createHand(response.object);
		break;
		case 'Statistica':
			document.getElementById("gamers").innerHTML = response.object.Gamers;
			document.getElementById("tab").innerHTML = response.object.Tab;
		break;
		case 'token' :
<<<<<<< HEAD
			CloseToken();	
=======
>>>>>>> 0742a833ed1551189557f3be6a3d11603f0e2621
			if(response.object==Jogador){
				OpenToken();
			}
			document.getElementById("Tokenjogador_"+response.object).checked =true;
		break;
		case 'Moviment' :

			var response = response.object;
			
			var card  = newCard(response.value)
			
			if(isDouble(card))  card.classList.add("R90");
			if(isInverted(card))  card.classList.add("R180");					
			
			document.getElementById("tabuleiro").appendChild(card);
			downTabScroll();
			Ultimo= response.last;
		break;
		case 'gamer_num':
			document.getElementById("gamer_num").innerHTML = response.object;
			Jogador=response.object;
		break;
		case 'reboot' :	 
			alert(response.object);
			Reiniciar();
		break;
		default :
			console.log(response.object);
		break; 
	 }
};

function newCard(nums,horizontal){
	var n1 = nums.split("|")[0];
	var n2 = nums.split("|")[1];
	
	var dcard = document.createElement("div");
		dcard.classList.add("card");
		dcard.setAttribute("value",nums);
		if(horizontal) dcard.classList.add("R90");
		
		var span = document.createElement("span");
			span.classList.add("dice");
			span.classList.add("dice-"+n1);
			span.setAttribute("value",n1);
			
		dcard.appendChild(span);
		
		var hr = document.createElement("hr");
		dcard.appendChild(hr);
		
		var span = document.createElement("span");
			span.classList.add("dice");
			span.classList.add("dice-"+n2);
			span.setAttribute("value",n2);
		dcard.appendChild(span);
		
	return dcard;	
}

function isDouble(Card){
	var nums = Card.getAttribute("value").split("|");
	if(nums[0]==nums[1]){  return true }else{ return false};
}
function isInverted(Card){
	var nums = Card.getAttribute("value").split("|");
	if(nums[1]==Ultimo && (nums[1] != nums[0])){  return true }else{ return false};
}
function isAllowed(Dice){
	if((Dice.getAttribute("value")==Ultimo) || (Dice.parentElement.getAttribute("value")=="6|6")){return true ;} else{ return false;}
}
function changeUltimo(Card){
	var dices = Card.querySelectorAll(".dice");
	var ultimo = Ultimo;
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
	var objDiv = document.getElementById("tabuleiro");
	objDiv.scrollTop = objDiv.scrollHeight;
}

function createHand(Hand){
	for(i=0;i<Hand.length;i++){
		var nums =  Hand[i];
		 
		var card = newCard(nums,false);
		var dices = card.querySelectorAll(".dice");
		dices.forEach(function(dice){
				dice.classList.add("hand");
				dice.addEventListener("click", function(e){
					//Aqui entra Função Pra selecionar Peça no tabuleiro
								
					if(!isAllowed(e.srcElement)) return false;
					var clone = e.srcElement.parentElement.cloneNode(true); 
					
					if(isDouble(clone))  clone.classList.add("R90");
					if(isInverted(clone))  clone.classList.add("R180");					
					
					document.getElementById("tabuleiro").appendChild(clone);
					downTabScroll();
					e.srcElement.parentElement.remove();
					changeUltimo(clone);
												
					ws.send(JSON.stringify({'subject':"gaming","object":{"value":clone.getAttribute("value"), "last":Ultimo}}));
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

function Reiniciar(){
	document.getElementById("tabuleiro").innerHTML = "";
	var cards = document.querySelectorAll("#hand > div:not(#wait) ");
	cards.forEach( function(card){
		card.parentNode.removeChild( card );
	});
<<<<<<< HEAD
	document.getElementById("status").innerHTML = "Aguardando jogadores...";
=======
	CloseToken();
>>>>>>> 0742a833ed1551189557f3be6a3d11603f0e2621
}