'use strict';

import { guid } from './utils';
import { EventEmitter } from 'events';

const MODAL_TEMPLATE =  `<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                                        <h4 class="modal-title" id="myModalLabel" data-bind="text: title"></h4>
                                    </div>
                                    <div class="modal-body clearfix" data-bind="template: { name: template(), data: model }">
                                    </div>
                                    <div class="modal-footer" data-bind="visible: actions().length > 0, foreach: actions">
                                        <!-- ko if: typeof(enabled) == "undefined" -->
                                        <button type="button" class="btn" data-bind="css: css, text: label, click: onClick"></button>
                                        <!-- /ko -->
                                        <!-- ko if: typeof(enabled) != "undefined" -->
                                        <button type="button" class="btn" data-bind="css: css, text: label, click: onClick, enable: enabled"></button>
                                        <!-- /ko -->
                                    </div>
                                </div>
                            </div>
                        </div>`;

class ModalViewModel {
    constructor() {
        this.options = {};

        this.title = ko.observable();
        this.template = ko.observable();
        this.model = ko.observable();
        this.actions = ko.observableArray();
    }

    setup(options) {
        this.options = options;
        this.template('');

        this.title(options.title);
        this.model(options.vm);
        this.template(options.template);

        // ensure properties are present for binding
        options.actions = (options.actions || []).map(action => {
            return $.extend({ css: '' }, action);
        });

        this.actions(options.actions);
    }
}

class ModalViewPort extends EventEmitter {
    constructor() {
        super(); 

        this._id = guid();

        this.$container = $('body');

        this.$modal = $(MODAL_TEMPLATE).attr('id', this._id);
        this.$modalDialog = this.$modal.find('.modal-dialog');
        this.$modalContent = this.$modal.find('modal-content');
        
        this.$header = this.$modal.find('.modal-header');
        this.$body = this.$modal.find('.modal-body');
        this.$footer = this.$modal.find('.modal-footer');

        this.isOpen = false;
        this.isBound = false;

        this.draw();
        this.bind();        
    }

    draw() {
        this.$container.append(this.$modal);
    }

    bind() {
        try {
            this.$modal.on('hidden.bs.modal', (e) => { 
                this.isOpen = false; 
                this.emit('hidden');
            });
            this.$modal.on('shown.bs.modal', (e) => { 
                this.isOpen = true; 
                this.emit('shown');
            });
        }
        catch (e) {
            this.$modal.live('hidden.bs.modal', (e) => { 
                this.isOpen = false; 
                this.emit('hidden');
            });
            this.$modal.live('shown.bs.modal', (e) => { 
                this.isOpen = true; 
                this.emit('shown');
            });
        }

        this.isBound = true;        
    }

    show() {
        this.$modal.modal('show');
    }

    hide() {
        this.$modal.modal('hide');
    }
}

class ModalController {
    constructor() {
        this.options = {};

        this._viewport = new ModalViewPort();
        this._vm = new ModalViewModel();

        this._segueStack = [];

        this._bindings();

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    _bindings() {
        this._viewport.on('shown', () => {});
        this._viewport.on('hidden', () => { this.teardown(); });

        ko.applyBindings(this._vm, this._viewport.$modal[0]);
    }

    setup(options) {
        this.options = options || {};
    }

    teardown() {
        this._segueStack = [];
    }

    show(options = {}) {
        if(this._viewport.isOpen) {
            this._segueStack.push(this._vm.options);
        }
        
        this._vm.setup(options);
        this._viewport.show();
    }

    hide() {
        if(!this._segueStack.length)
            return this._viewport.hide();

        this._vm.setup(this._segueStack.pop());
    }
}

ko.Modal = new ModalController();