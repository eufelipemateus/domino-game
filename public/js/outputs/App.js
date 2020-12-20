System.register(["socket.io-client", "./Game"], function (exports_1, context_1) {
    "use strict";
    var socket_io_client_1, Game_1, App;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (socket_io_client_1_1) {
                socket_io_client_1 = socket_io_client_1_1;
            },
            function (Game_1_1) {
                Game_1 = Game_1_1;
            }
        ],
        execute: function () {
            App = /** @class */ (function () {
                function App() {
                    this.host = 'localhost:8080';
                    this.game = new Game_1.Game(socket_io_client_1["default"]());
                }
                return App;
            }());
            exports_1("default", App);
        }
    };
});
