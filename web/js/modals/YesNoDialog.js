/**
 * Created by ASUS on 21.09.2016.
 */

YesNoDialog = {
    modal_selector: "",

    caption: "",
    message: "",

    yes_caption: "",
    no_caption: "",

    yes_handler: function(event){},
    no_handler: function(event){},

    show: function(param_list){
        this.__setParams(param_list);
        this.__applyParams();
        $(modal_selector).modal("show");
    },
    close: function(){
        $(modal_selector).modal("hide");
    },

    setModalSelector: function(modal_selector){
        this.modal_selector = modal_selector;
    },

    __applyParams: function(){
        var modal = $(this.modal_selector);

        modal.closest(".modal-caption").html(this.caption);
        modal.closest(".modal-message").html(this.message);
        modal.closest(".modal-yes-btn")
            .html(this.yes_caption)
            .click(this.yes_handler);
        modal.closest(".modal-no-btn")
            .html(this.no_caption)
            .click(this.no_handler);
    },
    __setParams: function(param_list){
        if (param_list.caption){
            this.caption = param_list.caption;
        }

        if (param_list.message){
            this.message = param_list.message;
        }

        if (param_list.yes_caption){
            this.yes_caption = param_list.yes_caption;
        }

        if (param_list.no_caption){
            this.no_caption = param_list.no_caption;
        }

        if (param_list.yes_handler){
            this.yes_handler = param_list.yes_handler;
        }

        if (param_list.no_handler){
            this.no_handler = param_list.no_handler;
        }
    }
};