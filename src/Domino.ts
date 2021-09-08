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

    /**
     * Embaralhar cartas
     *
     * @return Card[]
     */
    public  emabaralhar():Card[] {
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

    /**
     * Testar se é possivel fazer primeira jogadar
     *
     * @param card
     */
    public  primeiraJogada(card: Card[]):boolean {
        if (card.indexOf(this.cartas[27]) > -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Pegar o numero do index do array de gamers.
     *
     * @param socket {Socket}
     */
    public indexOfGamers(socket: Socket):number {
        return this.gamers.findIndex((gamer)=> {
            return (socket === gamer.socket)
        });
    }

    /**
     * Remover card from Array gamer
     *
     * @param gamer {Gamer}
     * @param card {Card}
     */
    public removeGamerCard(gamer: Gamer, card: Card) {
        const mIndex = this.indexOfGamerCards(gamer, card);
        if ( mIndex > -1) {
            gamer.cards.splice(mIndex, 1);
        }
    }
    /**
     * Verificar se o jogador é vencedor
     *
     * @param gamer {Gamer}
     */
    public isGamerWinner(gamer: Gamer):boolean {
        return (gamer.cards.length == 0);
    }

    /**
     * Remover card from catasEmMaos
     *
     * @param card {Card}
     */
    public removeCardInHand(card: Card) {
        const mIndex = this.indexOfHandCards(card);
        if (mIndex > -1) {
            this.cartasEmMaos.splice(mIndex, 1);
        }
    }
    /**
     * Distribuir cartas para os gamers.
     */
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
    /**
     * Retorna o index da carda no cartasEmMaos
     *
     * @param card {Card}
     */
    private  indexOfHandCards(card: Card) {
        return this.cartasEmMaos.findIndex((element: Card)=> {
            return  card === element;
        });
    }

    /**
     * Retornar Index card in gamers list
     *
     * @param gamer {Gamer}
     * @param card  {Card}
     */
    private indexOfGamerCards(gamer: Gamer, card: Card) {
        return gamer.cards.findIndex((element: Card)=> {
            return (card === element);
        });
    }
}

export default new Domino();
