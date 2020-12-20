System.register([], function (exports_1, context_1) {
    "use strict";
    var Modal;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Modal = class Modal {
                constructor(game) {
                    this.modal = null;
                    this.closeButton = null;
                    this.inputName = null;
                    this.modalButton = null;
                    this.game = null;
                    // Get the modal
                    this.__create();
                    this.__Listen();
                    this.game = game;
                }
                __create() {
                    this.modal = document.createElement('div');
                    this.modal.classList.add('modal');
                    let modalContent = document.createElement('div');
                    modalContent.classList.add('modal-content');
                    // Header
                    var modalHeader = document.createElement('div');
                    modalHeader.classList.add('modal-header');
                    /*let modalclose = document.createElement('span');
                    modalclose.classList.add('close');
                    modalclose.innerHTML = '&times;'
            
                    this.closeButton = modalclose;
                    modalHeader.appendChild(modalclose);*/
                    let title = document.createElement('h2');
                    title.innerHTML = 'Put a Nickname';
                    modalHeader.appendChild(title);
                    modalContent.appendChild(modalHeader);
                    //Body
                    let modalBody = document.createElement('div');
                    modalBody.classList.add('modal-body');
                    let label = document.createElement('label');
                    label.innerHTML = "Name:";
                    modalBody.appendChild(label);
                    this.inputName = document.createElement('input');
                    this.inputName.setAttribute('placeholder', 'João Inacio');
                    modalBody.appendChild(this.inputName);
                    modalContent.appendChild(modalBody);
                    //Footer
                    let modalFooter = document.createElement('div');
                    modalFooter.classList.add('modal-footer');
                    this.modalButton = document.createElement('button');
                    this.modalButton.innerHTML = "Confirmar Nome";
                    modalFooter.appendChild(this.modalButton);
                    modalContent.appendChild(modalFooter);
                    this.modal.appendChild(modalContent);
                    document.getElementsByTagName("body")[0].append(this.modal);
                    return this.modal;
                }
                /**
                 *  Abrir modal
                 */
                open() {
                    this.modal.style.display = "block";
                }
                /**
                 *  Fechar modal
                 */
                close() {
                    this.modal.style.display = 'none';
                }
                /**
                 *
                 * @param input
                 */
                __saveName(input) {
                    this.game.newConection(input.value);
                    this.close();
                }
                /**
                 *  __Listen
                 */
                __Listen() {
                    this.modalButton.addEventListener("click", () => {
                        this.__saveName(this.inputName);
                    }, false);
                    this.inputName.addEventListener("keypress", (e) => {
                        if (e.key === 'Enter') {
                            this.__saveName(this.inputName);
                        }
                    }, false);
                }
            };
            exports_1("Modal", Modal);
        }
    };
});
