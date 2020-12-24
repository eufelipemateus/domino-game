System.register(["./Modal.js"], function (exports_1, context_1) {
    "use strict";
    var Modal_js_1, Game;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Modal_js_1_1) {
                Modal_js_1 = Modal_js_1_1;
            }
        ],
        execute: function () {
            Game = class Game {
                constructor(io) {
                    this.Ultimo = -1;
                    this.socket = io();
                    this.listen();
                    this.modal = new Modal_js_1.Modal(this);
                }
                newCard(nums, horizontal = false, invertido = false) {
                    const n1 = nums.num1;
                    const n2 = nums.num2;
                    const dcard = document.createElement('div');
                    dcard.classList.add('card');
                    dcard.setAttribute('value', nums);
                    if (horizontal) {
                        dcard.classList.add('R90');
                    }
                    if (invertido) {
                        dcard.classList.add('R180');
                    }
                    let span = document.createElement('span');
                    span.classList.add('dice');
                    span.classList.add('dice-' + n1);
                    span.setAttribute('value', n1);
                    dcard.appendChild(span);
                    const hr = document.createElement('hr');
                    dcard.appendChild(hr);
                    span = document.createElement('span');
                    span.classList.add('dice');
                    span.classList.add('dice-' + n2);
                    span.setAttribute('value', n2);
                    dcard.appendChild(span);
                    return dcard;
                }
                isDouble(nums) {
                    if (nums.num1 == nums.num2) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                isInverted(nums) {
                    if (nums.num2 == this.Ultimo && (nums.num2 != nums.num1)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                isAllowed(nums, num) {
                    if ((num == this.Ultimo) || ((nums.num1 == 6) && (nums.num2 == 6))) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                changeUltimo(nums) {
                    let ultimo = this.Ultimo;
                    if (nums.num1 != ultimo && nums.num1 != this.Ultimo) {
                        ultimo = nums.num1;
                    }
                    if (nums.num2 != ultimo && nums.num2 != this.Ultimo) {
                        ultimo = nums.num2;
                    }
                    this.Ultimo = ultimo;
                }
                OpenToken() {
                    document.getElementById('pass').classList.add('active');
                    document.getElementById('wait').classList.add('disabled');
                    document.getElementById('status').innerHTML = 'Minha Vez!';
                }
                CloseToken() {
                    document.getElementById('pass').classList.remove('active');
                    document.getElementById('wait').classList.remove('disabled');
                    document.getElementById('status').innerHTML = 'Aguardando Vez...';
                }
                PassarVez() {
                    this.socket.emit('PASS');
                    this.CloseToken();
                }
                downTabScroll() {
                    const objDiv = document.getElementById('tabuleiro');
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
                createHand(Hand) {
                    for (const nums of Hand) {
                        const card = this.newCard(nums, false);
                        const dices = card.querySelectorAll('.dice');
                        dices.forEach((dice, index) => {
                            dice.classList.add('hand');
                            dice.addEventListener('click', (e) => {
                                // Aqui entra Função Pra selecionar Peça no tabuleiro
                                if (!this.isAllowed(nums, dice.getAttribute('value'))) {
                                    return false;
                                }
                                const clone = e.srcElement.parentElement.cloneNode(true);
                                if (this.isDouble(nums)) {
                                    clone.classList.add('R90');
                                }
                                if (this.isInverted(nums)) {
                                    clone.classList.add('R180');
                                }
                                document.getElementById('tabuleiro').appendChild(clone);
                                this.downTabScroll();
                                e.srcElement.parentElement.remove();
                                this.changeUltimo(nums);
                                this.CloseToken();
                                this.socket.emit('gaming', { value: nums, last: this.Ultimo });
                            });
                            dice.addEventListener('mouseover', (e) => {
                                if (this.isAllowed(nums, dice.getAttribute('value'))) {
                                    e.srcElement.classList.add('hoverPossible');
                                }
                                else {
                                    e.srcElement.classList.add('hoverImPossible');
                                }
                            });
                            dice.addEventListener('mouseout', (e) => {
                                e.srcElement.classList.remove('hoverPossible');
                                e.srcElement.classList.remove('hoverImPossible');
                            });
                        });
                        document.getElementById('hand').appendChild(card);
                    }
                }
                Reiniciar() {
                    document.getElementById('tabuleiro').innerHTML = '';
                    const cards = document.querySelectorAll('#hand > div:not(#wait) ');
                    cards.forEach((card) => {
                        card.parentNode.removeChild(card);
                    });
                    document.getElementById('status').innerHTML = 'Aguardando jogadores...';
                }
                newConection(name) {
                    this.socket.emit('NEW CONNECTION', name);
                }
                /*** Listen connections  ***/
                listen() {
                    this.socket.on('connect', () => {
                        if (this.Debug) {
                            console.info('conectado!!');
                        }
                        this.modal.open();
                    });
                    this.socket.on('HAND', (msg) => {
                        this.Reiniciar();
                        this.createHand(msg);
                    });
                    this.socket.on('GAMER NAME', (msg) => {
                        document.getElementById('gamerName_' + msg.gamer).innerHTML = msg.name;
                        document.getElementById('gamer_num').innerHTML = (msg.gamer + 1);
                        this.Jogador = msg.gamer;
                    });
                    this.socket.on('MOVIMENT', (msg) => {
                        const card = this.newCard(msg.value, this.isDouble(msg.value), this.isInverted(msg.value));
                        document.getElementById('tabuleiro').appendChild(card);
                        this.downTabScroll();
                        this.Ultimo = msg.last;
                    });
                    this.socket.on('TOKEN', (token) => {
                        this.CloseToken();
                        if (token == this.Jogador) {
                            this.OpenToken();
                        }
                        document.getElementById('Tokenjogador_' + token).checked = true;
                    });
                    this.socket.on('REBOOT', (msg) => {
                        alert(msg);
                        this.Reiniciar();
                    });
                    this.socket.on('INFO', (msg) => {
                        document.getElementById('gamers').innerHTML = msg.gamers;
                        document.getElementById('tab').innerHTML = msg.tab;
                        document.getElementById('cards_in_hand').innerHTML = msg.cardsInHand;
                    });
                }
            };
            exports_1("Game", Game);
        }
    };
});
