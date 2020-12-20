import { Game } from './Game.js'

declare global {
    interface Window { game: Game; }
}

window.game =  new Game(window.io);