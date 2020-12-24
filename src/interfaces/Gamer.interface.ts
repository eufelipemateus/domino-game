import { Socket } from 'socket.io';
import { Card } from './Card.interface';

export interface Gamer {
    name: string;
    token: boolean;
    socket: Socket;
    cards: Card[];
}