
var Ultimo = 6;


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
		 
	 }
	 
};


function newCard(n1,n2,horizontal){
	var dcard = document.createElement("div");
		dcard.classList.add("card");
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
	var dices = Card.querySelectorAll(".dice");
	if(dices[0].getAttribute("value")==dices[1].getAttribute("value")){  return true }else{ return false};
}
function isInverted(Card){
	var dices = Card.querySelectorAll(".dice");
	if(dices[1].getAttribute("value")==Ultimo){  return true }else{ return false};
}
function changeUltimo(Card){
	var dices = Card.querySelectorAll(".dice");
	var ultimo = Ultimo;
	dices.forEach(function(dice){
		if(parseInt(dice.getAttribute("value"))!=ultimo && parseInt(dice.getAttribute("value"))!= Ultimo ){
			ultimo= parseInt(dice.getAttribute("value"));	
			console.log(Ultimo);			
			console.log(Ultimo);			
		}
	});
	
	Ultimo = ultimo;
	console.log(Ultimo);
}


function createHand(Hand){
	for(i=0;i<Hand.length;i++){
		var nums =  Hand[i].split("|");
		 
		var card = newCard(nums[0],nums[1],false);
		var dices = card.querySelectorAll(".dice");
		dices.forEach(function(dice){
				dice.classList.add("hand");
				dice.addEventListener("click", function(e){
					//Aqui entra Função Pra selecionar Peça no tabuleiro
								
					if(e.srcElement.getAttribute("value")!=Ultimo) return false;
					var clone = e.srcElement.parentElement.cloneNode(true); 
					
					if(isDouble(clone))  clone.classList.add("R90");
					if(isInverted(clone))  clone.classList.add("R180");					
					
					document.getElementById("tabuleiro").appendChild(clone);
					e.srcElement.parentElement.remove();
					changeUltimo(clone);
					
				});
				
				dice.addEventListener("mouseover", function(e){
					if(e.srcElement.getAttribute("value")==Ultimo){
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


	