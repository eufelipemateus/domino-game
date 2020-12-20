export class Modal{
    constructor() {
        // Get the modal
        var modal = this.__create();
        console.log(modal);
    }

    private __create(){
        var modal = document.createElement('div');
        modal.classList.add('modal');

        var modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // Header
        var modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        var modalclose = document.createElement('span');
        modalclose.classList.add('close');
        modalclose.innerHTML = '&times;'
        modalHeader.appendChild(modalclose);
        var title = document.createElement('h2');
        title.innerHTML = 'Put a Nickname'
        modalHeader.appendChild(title);
        modalContent.appendChild(modalHeader);

        //Body
        var modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        modalContent.appendChild(modalBody);

        modal.appendChild(modalContent);
        document.getElementsByTagName("body")[0].append(modal);
        return modal;
    }


    private open(){

    }

}