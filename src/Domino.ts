class Domino{
	
	public Gamers=Array();
	public CartasEmMaos=Array();
	public CartasUsadas=Array();
	public Cartas=Array();
	public Ultimo;
	
	constructor(){
		this.daCartas();
	}
	private  daCartas(){
		let index=0;
		for(let i=0;i<7;i++){
			for(let p=0;p<7;p++){
				if(p>=i) this.Cartas[index++]=[i,p];
			}
		}
	}
	public  emabaralhar(){
		let MinhaMao = Array(),rand,index;
		for(index=0;index<7;index++){
			do{
				rand = this.Cartas[Math.floor((Math.random() * 28))];
			}while(this.CartasEmMaos.indexOf(rand)!==-1);
			
			this.CartasEmMaos.push(rand);
			MinhaMao.push(rand);
		}
		return MinhaMao;
	}
	public  primeiraJogada(card){
		if(card.indexOf(this.Cartas[27]) > -1)
			return true;
		else
			return false;
	}
	public indexOfGamers (socket){
	  return this.Gamers.indexOf(socket);
	}
	
	private indexOfGamerCards(gamer,card){
		return gamer.cards.findIndex(function(element,index){
			return  this.card === element;
		},card)
	}
	
	public removeGamerCard(gamer,card){
		let mIndex = this.indexOfGamerCards(gamer,card)
		if ( mIndex > -1) {
			gamer.cards.splice(mIndex, 1);
		}
	}
	
	public isGamerWinner(gamer){
		return (gamer.cards.length == 0);
	}

	private  indexOfHandCards(card){//not working
		return this.CartasEmMaos.findIndex((element,index)=>{
			return  card === element;
		})		
	}
	
	public removeCardInHand(gamer,card){//not working
		let mIndex = this.indexOfHandCards(card);
		if (mIndex > -1) {
			gamer.CartasEmMaos.splice(mIndex, 1);
		}
	}
}

export default new Domino();
