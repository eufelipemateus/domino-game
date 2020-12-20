import io from 'socket.io-client';
import {Game} from './Game';

export default class App {
    private game ;
    constructor() {
       this.game = new Game(io());
    }
}
