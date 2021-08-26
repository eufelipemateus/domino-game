import { Game } from './Game.js'

declare global {
    interface Window { game: Game; io: any }
}

 window.addEventListener('load', () => {
    window.game =  new Game(window.io);
});
