/**
 * Created by ASUS on 21.09.2016.
 */

YesNoDialog = function(){
    this.modal_selector = "";

    this.caption = "";
    this.message = "";

    this.yes_caption = "";
    this.no_caption = "";

    this.yes_handler = function(event){};
    this.no_handler = function(event){};

    this.show = function(param_list){
        this.__setParams(param_list);
        this.__applyParams();
        $(this.modal_selector).modal("show");
    };
    this.close = function(){
        $(this.modal_selector).modal("hide");
    };

    this.setModalSelector = function(modal_selector){
        this.modal_selector = modal_selector;
    };

    this.__applyParams = function(){
        var modal = $(this.modal_selector);

        $(this.modal_selector + " .modal-caption").html(this.caption);
        $(this.modal_selector + " .modal-message").html(this.message);
        $(this.modal_selector + " .modal-yes-btn")
            .html(this.yes_caption)
            .click(this.yes_handler);
        $(this.modal_selector + " .modal-no-btn")
            .html(this.no_caption)
            .click(this.no_handler);
    };
    this.__setParams = function(param_list){
        if (param_list.caption){
            //console.log("param_set");
            this.caption = param_list.caption;
        }

        if (param_list.message){
            //console.log("param_set");
            this.message = param_list.message;
        }

        if (param_list.yes_caption){
            //console.log("param_set");
            this.yes_caption = param_list.yes_caption;
        }

        if (param_list.no_caption){
            //console.log("param_set");
            this.no_caption = param_list.no_caption;
        }

        if (param_list.yes_handler){
            //console.log("param_set");
            this.yes_handler = param_list.yes_handler;
        }

        if (param_list.no_handler){
            //console.log("param_set");
            this.no_handler = param_list.no_handler;
        }
    }
};