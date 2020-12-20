System.register(["./Game.js"], function (exports_1, context_1) {
    "use strict";
    var Game_js_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Game_js_1_1) {
                Game_js_1 = Game_js_1_1;
            }
        ],
        execute: function () {
            window.game = new Game_js_1.Game(window.io);
        }
    };
});
