// import { Game } from './Game';

export class Alert {
    private modal: HTMLDivElement  = null;
    private closeButton: HTMLSpanElement  = null;
    
    private modalBody:HTMLDivElement = null;  
    public modalButton: HTMLButtonElement  = null;

    //public game: Game = null;

    constructor() {
         this.__create();
         this.__Listen();
    }

    private __create():void {
        this.modal = document.createElement('div');
        this.modal.classList.add('modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // Header
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        const modalclose = document.createElement('span');
        modalclose.classList.add('close');
        modalclose.innerHTML = '&times;'

        this.closeButton = modalclose;
        modalHeader.appendChild(modalclose);
        const title = document.createElement('h2');
        title.innerHTML = 'INFO!!!'
        modalHeader.appendChild(title);
        modalContent.appendChild(modalHeader);

        // Body
        this.modalBody = document.createElement('div');
        this.modalBody.classList.add('modal-body');      
        modalContent.appendChild(this.modalBody);

        // Footer
        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        this.modalButton = document.createElement('button');
        this.modalButton.classList.add('button-confirmar');

        this.modalButton.innerHTML = 'Reinciar'
        modalFooter.appendChild(this.modalButton);

        modalContent.appendChild(modalFooter);

        this.modal.appendChild(modalContent);

        document.getElementsByTagName('body')[0].append(this.modal);
    }
    /**
     *  Open Alert
     */
    public open(msg):void {
        this.modal.style.display= 'flex';
        this.modalBody.innerHTML = msg;
    }

    /**
     *   Close Alert
     */
    private close():void {
        this.modal.style.display = 'none';
    }
   
    /**
     *  __Listen
     */
    private  __Listen():void {
        this.modalButton.addEventListener('click',()=> {
            this.close()
        }, false);

        this.closeButton.addEventListener('click',()=> {
            this.close();
        }, false);
    }

}