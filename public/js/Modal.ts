import { Game } from './Game';

export class Modal {
    private modal: HTMLDivElement  = null;
    private closeButton: HTMLSpanElement  = null;

    public inputName: HTMLInputElement  = null;
    public modalButton: HTMLButtonElement  = null;

    public game: Game = null;

    constructor(game: Game) {
        // Get the modal
         this.__create();
         this.__Listen();
         this.game = game;
    }

    private __create():void {
        this.modal = document.createElement('div');
        this.modal.classList.add('modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // Header
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        /*let modalclose = document.createElement('span');
        modalclose.classList.add('close');
        modalclose.innerHTML = '&times;'

        this.closeButton = modalclose;
        modalHeader.appendChild(modalclose);*/
        const title = document.createElement('h2');
        title.innerHTML = 'Put a Nickname'
        modalHeader.appendChild(title);
        modalContent.appendChild(modalHeader);

        // Body
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');

        const label = document.createElement('label');
        label.innerHTML = 'Name:'
        modalBody.appendChild(label);

        this.inputName = document.createElement('input');
        this.inputName.setAttribute('placeholder', 'João Inacio');
        modalBody.appendChild(this.inputName);

        modalContent.appendChild(modalBody);


        // Footer
        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        this.modalButton = document.createElement('button');
        this.modalButton.classList.add('button-confirmar');

        this.modalButton.innerHTML = 'Entrar'
        modalFooter.appendChild(this.modalButton);

        modalContent.appendChild(modalFooter);

        this.modal.appendChild(modalContent);

        document.getElementsByTagName('body')[0].append(this.modal);
    }
    /**
     *  Abrir modal
     */
    public open():void {
        this.modal.style.display= 'flex';
        this.inputName.focus();
    }

    /**
     *  Fechar modal
     */
    public close():void {
        this.modal.style.display = 'none';
    }
    /**
     * Return name to class Game
     * @param input
     */
    private __saveName(input: HTMLInputElement ):void {
        if(input.value !==  '') {
            this.game.newConection(input.value);
        } else {
            this.game.newConection('Usuário Qualquer! (No Name)');
        }
        this.close();
    }
    /**
     *  __Listen
     */
    private  __Listen():void {
        this.modalButton.addEventListener('click',()=> {
            this.__saveName(this.inputName)
        }, false);

        this.inputName.addEventListener('keypress',(e)=> {
            if (e.key === 'Enter') {
                this.__saveName(this.inputName)
            }
        }, false);
    }

}