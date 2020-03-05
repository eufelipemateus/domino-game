"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Domino {
    constructor() {
        this.Gamers = Array();
        this.CartasEmMaos = Array();
        this.CartasUsadas = Array();
        this.Cartas = Array();
        this.daCartas();
    }
    emabaralhar() {
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
    primeiraJogada(card) {
        if (card.indexOf(this.Cartas[27]) > -1) {
            return true;
        }
        else {
            return false;
        }
    }
    indexOfGamers(socket) {
        return this.Gamers.indexOf(socket);
    }
    removeGamerCard(gamer, card) {
        const mIndex = this.indexOfGamerCards(gamer, card);
        if (mIndex > -1) {
            gamer.cards.splice(mIndex, 1);
        }
    }
    isGamerWinner(gamer) {
        return (gamer.cards.length == 0);
    }
    removeCardInHand(gamer, card) {
        const mIndex = this.indexOfHandCards(card);
        if (mIndex > -1) {
            gamer.CartasEmMaos.splice(mIndex, 1);
        }
    }
    daCartas() {
        let index = 0;
        for (let i = 0; i < 7; i++) {
            for (let p = 0; p < 7; p++) {
                if (p >= i) {
                    this.Cartas[index++] = [i, p];
                }
            }
        }
    }
    indexOfHandCards(card) {
        return this.CartasEmMaos.findIndex((element, index) => {
            return card === element;
        });
    }
    indexOfGamerCards(gamer, card) {
        return gamer.cards.findIndex(function (element, index) {
            return this.card === element;
        }, card);
    }
}
exports.default = new Domino();
