import { Socket } from 'socket.io';
import {Card} from './interfaces/Card.interface';
import { Gamer } from './interfaces/Gamer.interface';
class Domino {

    public gamers:Gamer[] = [];
    public cartasEmMaos:Card[] = [];
    public cartasUsadas:Card[] = [];
    public cartas:Card[] = [];
    public ultimo: any;

    constructor() {
        this.daCartas();
    }

    public  emabaralhar() {
        const minhaMao: Card[] = [];
        let rand: Card;
        let index: number;

        for (index = 0; index < 7; index++) {
            do {
                rand = this.cartas[Math.floor((Math.random() * 28))];
            } while (this.cartasEmMaos.indexOf(rand) !== -1);

            this.cartasEmMaos.push(rand);
            minhaMao.push(rand);
        }
        return minhaMao;
    }

    public  primeiraJogada(card: Card[]) {
        if (card.indexOf(this.cartas[27]) > -1) {
            return true;
        } else {
            return false;
        }
    }

    public indexOfGamers(socket: Socket) {
        return this.gamers.findIndex((gamer)=>{
            return (socket === gamer.socket)
        });
    }

    public removeGamerCard(gamer: Gamer, card: Card) {
        const mIndex = this.indexOfGamerCards(gamer, card);
        if ( mIndex > -1) {
            gamer.cards.splice(mIndex, 1);
        }
    }

    public isGamerWinner(gamer: Gamer) {
        return (gamer.cards.length == 0);
    }

    public removeCardInHand(card: any) {
        const mIndex = this.indexOfHandCards(card);
        if (mIndex > -1) {
            this.cartasEmMaos.splice(mIndex, 1);
        }
    }

    private  daCartas() {
        let index = 0;
        for (let i = 0; i < 7; i++) {
            for (let p = 0; p < 7; p++) {
                if ( p >= i) {
                    this.cartas[index++] = {num1:i, num2:p};
                }
            }
        }
    }

    private  indexOfHandCards(card: any) {
        return this.cartasEmMaos.findIndex((element: Card)=> {
            return  card === element;
        });
    }

    private indexOfGamerCards(gamer: Gamer, card: Card) {
        return gamer.cards.findIndex((element: Card)=> {
            return (card === element);
        });
    }
}

export default new Domino();
