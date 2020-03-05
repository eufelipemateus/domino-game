class Domino {

    public Gamers = Array();
    public CartasEmMaos = Array();
    public CartasUsadas = Array();
    public Cartas = Array();
    public Ultimo;

    constructor() {
        this.daCartas();
    }

    public  emabaralhar() {
        const MinhaMao = Array();
        let rand;
        let index;

        for (index = 0; index < 7; index++) {
            do {
                rand = this.Cartas[Math.floor((Math.random() * 28))];
            } while (this.CartasEmMaos.indexOf(rand) !== -1);

            this.CartasEmMaos.push(rand);
            MinhaMao.push(rand);
        }
        return MinhaMao;
    }

    public  primeiraJogada(card) {
        if (card.indexOf(this.Cartas[27]) > -1) {
            return true;
        } else {
            return false;
        }
    }

    public indexOfGamers(socket) {
        return this.Gamers.indexOf(socket);
    }

    public removeGamerCard(gamer, card) {
        const mIndex = this.indexOfGamerCards(gamer, card);
        if ( mIndex > -1) {
            gamer.cards.splice(mIndex, 1);
        }
    }

    public isGamerWinner(gamer) {
        return (gamer.cards.length == 0);
    }

    public removeCardInHand(gamer, card) {// not working
        const mIndex = this.indexOfHandCards(card);
        if (mIndex > -1) {
            gamer.CartasEmMaos.splice(mIndex, 1);
        }
    }

    private  daCartas() {
        let index = 0;
        for (let i = 0; i < 7; i++) {
            for (let p = 0; p < 7; p++) {
                if ( p >= i) {
                    this.Cartas[index++] = [i, p];
                }
            }
        }
    }

    private  indexOfHandCards(card) {// not working
        return this.CartasEmMaos.findIndex((element, index) => {
            return  card === element;
        });
    }

    private indexOfGamerCards(gamer, card) {
        return gamer.cards.findIndex(function(element, index) {
            return  this.card === element;
        }, card);
    }
}

export default new Domino();
