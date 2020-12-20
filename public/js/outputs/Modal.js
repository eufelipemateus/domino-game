System.register([], function (exports_1, context_1) {
    "use strict";
    var Modal;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Modal = /** @class */ (function () {
                function Modal() {
                    // Get the modal
                    var modal = this.__create();
                    console.log(modal);
                }
                Modal.prototype.__create = function () {
                    var modal = document.createElement('div');
                    modal.classList.add('modal');
                    var modalContent = document.createElement('div');
                    modalContent.classList.add('modal-content');
                    // Header
                    var modalHeader = document.createElement('div');
                    modalHeader.classList.add('modal-header');
                    var modalclose = document.createElement('span');
                    modalclose.classList.add('close');
                    modalclose.innerHTML = '&times;';
                    modalHeader.appendChild(modalclose);
                    var title = document.createElement('h2');
                    title.innerHTML = 'Put a Nickname';
                    modalHeader.appendChild(title);
                    modalContent.appendChild(modalHeader);
                    //Body
                    var modalBody = document.createElement('div');
                    modalBody.classList.add('modal-body');
                    modalContent.appendChild(modalBody);
                    modal.appendChild(modalContent);
                    document.getElementsByTagName("body")[0].append(modal);
                    return modal;
                };
                Modal.prototype.open = function () {
                };
                return Modal;
            }());
            exports_1("Modal", Modal);
        }
    };
});
