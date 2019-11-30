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
    daCartas() {
        let index = 0;
        for (let i = 0; i < 7; i++) {
            for (let p = 0; p < 7; p++) {
                if (p >= i)
                    this.Cartas[index++] = [i, p];
            }
        }
    }
    emabaralhar() {
        let MinhaMao = Array(), rand, index;
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
        if (card.indexOf(this.Cartas[27]) > -1)
            return true;
        else
            return false;
    }
    indexOfGamers(socket) {
        return this.Gamers.indexOf(socket);
    }
    indexOfGamerCards(gamer, card) {
        return gamer.cards.findIndex(function (element, index) {
            return this.card === element;
        }, card);
    }
    removeGamerCard(gamer, card) {
        let mIndex = this.indexOfGamerCards(gamer, card);
        if (mIndex > -1) {
            gamer.cards.splice(mIndex, 1);
        }
    }
    isGamerWinner(gamer) {
        return (gamer.cards.length == 0);
    }
    indexOfHandCards(card) {
        return this.CartasEmMaos.findIndex((element, index) => {
            return card === element;
        });
    }
    removeCardInHand(gamer, card) {
        let mIndex = this.indexOfHandCards(card);
        if (mIndex > -1) {
            gamer.CartasEmMaos.splice(mIndex, 1);
        }
    }
}
exports.default = new Domino();
