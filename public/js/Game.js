var Game = /** @class */ (function () {
    function Game(io) {
        this.Ultimo = -1;
        this.socket = io();
        this.listen();
    }
    Game.prototype.newCard = function (nums, horizontal, invertido) {
        if (horizontal === void 0) { horizontal = false; }
        if (invertido === void 0) { invertido = false; }
        var n1 = nums[0];
        var n2 = nums[1];
        var dcard = document.createElement("div");
        dcard.classList.add("card");
        dcard.setAttribute("value", nums);
        if (horizontal)
            dcard.classList.add("R90");
        if (invertido)
            dcard.classList.add("R180");
        var span = document.createElement("span");
        span.classList.add("dice");
        span.classList.add("dice-" + n1);
        span.setAttribute("value", n1);
        dcard.appendChild(span);
        var hr = document.createElement("hr");
        dcard.appendChild(hr);
        span = document.createElement("span");
        span.classList.add("dice");
        span.classList.add("dice-" + n2);
        span.setAttribute("value", n2);
        dcard.appendChild(span);
        return dcard;
    };
    Game.prototype.isDouble = function (nums) {
        if (nums[0] == nums[1]) {
            return true;
        }
        else {
            return false;
        }
        ;
    };
    Game.prototype.isInverted = function (nums) {
        if (nums[1] == this.Ultimo && (nums[1] != nums[0])) {
            return true;
        }
        else {
            return false;
        }
        ;
    };
    Game.prototype.isAllowed = function (nums, num) {
        if ((num == this.Ultimo) || ((nums[0] == 6) && (nums[1] == 6))) {
            return true;
        }
        else {
            return false;
        }
    };
    Game.prototype.changeUltimo = function (nums) {
        var _this = this;
        var ultimo = this.Ultimo;
        nums.forEach(function (num) {
            if (num != ultimo && num != _this.Ultimo) {
                ultimo = num;
            }
        });
        this.Ultimo = ultimo;
    };
    Game.prototype.OpenToken = function () {
        document.getElementById("pass").classList.add("active");
        document.getElementById("wait").classList.add("disabled");
        document.getElementById("status").innerHTML = "Minha Vez!";
    };
    Game.prototype.CloseToken = function () {
        document.getElementById("pass").classList.remove("active");
        document.getElementById("wait").classList.remove("disabled");
        document.getElementById("status").innerHTML = "Aguardando Vez...";
    };
    Game.prototype.PassarVez = function () {
        this.socket.emit("PASS");
        this.CloseToken();
    };
    Game.prototype.downTabScroll = function () {
        var objDiv = document.getElementById("tabuleiro");
        objDiv.scrollTop = objDiv.scrollHeight;
    };
    Game.prototype.createHand = function (Hand) {
        var _this = this;
        var _loop_1 = function (i) {
            var nums = Hand[i];
            var card = this_1.newCard(nums, false);
            var dices = card.querySelectorAll(".dice");
            dices.forEach(function (dice, index) {
                dice.classList.add("hand");
                dice.addEventListener("click", function (e) {
                    //Aqui entra Função Pra selecionar Peça no tabuleiro
                    if (!_this.isAllowed(nums, nums[index]))
                        return false;
                    var clone = e.srcElement.parentElement.cloneNode(true);
                    if (_this.isDouble(nums))
                        clone.classList.add("R90");
                    if (_this.isInverted(nums))
                        clone.classList.add("R180");
                    document.getElementById("tabuleiro").appendChild(clone);
                    _this.downTabScroll();
                    e.srcElement.parentElement.remove();
                    _this.changeUltimo(nums);
                    _this.CloseToken();
                    _this.socket.emit("gaming", { value: nums, last: _this.Ultimo });
                });
                dice.addEventListener("mouseover", function (e) {
                    if (_this.isAllowed(nums, nums[index])) {
                        e.srcElement.classList.add("hoverPossible");
                    }
                    else {
                        e.srcElement.classList.add("hoverImPossible");
                    }
                });
                dice.addEventListener("mouseout", function (e) {
                    e.srcElement.classList.remove("hoverPossible");
                    e.srcElement.classList.remove("hoverImPossible");
                });
            });
            document.getElementById("hand").appendChild(card);
        };
        var this_1 = this;
        for (var i = 0; i < Hand.length; i++) {
            _loop_1(i);
        }
    };
    Game.prototype.Reiniciar = function () {
        document.getElementById("tabuleiro").innerHTML = "";
        var cards = document.querySelectorAll("#hand > div:not(#wait) ");
        cards.forEach(function (card) {
            card.parentNode.removeChild(card);
        });
        document.getElementById("status").innerHTML = "Aguardando jogadores...";
    };
    /*** Listen connections  ***/
    Game.prototype.listen = function () {
        var _this = this;
        this.socket.on('connect', function () {
            if (_this.Debug)
                console.info("conectado!!");
            _this.socket.emit("NEW CONNECTION", window.prompt("Digite seu nome:"));
        });
        this.socket.on('HAND', function (msg) {
            _this.Reiniciar();
            _this.createHand(msg);
        });
        this.socket.on('GAMER NAME', function (msg) {
            document.getElementById("gamerName_" + msg.gamer).innerHTML = msg.name;
            document.getElementById("gamer_num").innerHTML = (msg.gamer + 1);
            _this.Jogador = msg.gamer;
        });
        this.socket.on('MOVIMENT', function (msg) {
            var horizontal = false, invertido = false;
            if (_this.isDouble(msg.value))
                horizontal = true;
            if (_this.isInverted(msg.value))
                invertido = true;
            var card = _this.newCard(msg.value, horizontal, invertido);
            document.getElementById("tabuleiro").appendChild(card);
            _this.downTabScroll();
            _this.Ultimo = msg.last;
        });
        this.socket.on('TOKEN', function (token) {
            _this.CloseToken();
            if (token == _this.Jogador) {
                _this.OpenToken();
            }
            document.getElementById("Tokenjogador_" + token).checked = true;
        });
        this.socket.on('REBOOT', function (msg) {
            alert(msg);
            _this.Reiniciar();
        });
        this.socket.on('INFO', function (msg) {
            document.getElementById("gamers").innerHTML = msg.Gamers;
            document.getElementById("tab").innerHTML = msg.Tab;
            document.getElementById("cards_in_hand").innerHTML = msg.CardsInHand;
        });
    };
    return Game;
}());
