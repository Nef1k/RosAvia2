/**
 * Created by ASUS on 20.09.2016.
 */

function showYesNoDialog(modal_params){
    $("#modal-caption").html(modal_params.caption);
    $("#modal-message").html(modal_params.message);
    $("#modal-yes-btn").click(modal_params.yesHandler);
    $("#modal-no-btn").click(modal_params.noHandler);

    if (modal_params.yes_caption){
        $("#modal-yes-btn").html(modal_params.yes_caption);
    }

    if (modal_params.no_caption){
        $("#modal-no-btn").html(modal_params.no_caption);
    }

    $("#yes-no-modal").modal({
        show: true
    });
}

function closeYesNoModal(){
    $("#yes-no-dialog").modal({
        show: false
    });
}

function createModalNoBtn(event){
    closeYesNoModal();
}

function createModalYesBtn(event) {
    closeYesNoModal();
    alert("Туц");
}

function createBtnClick(){
    showYesNoDialog({
        caption: "Создание сертификатов",
        message: "Будут созданы сертификаты %certificates%. Вы уверены?",

        yesCaption: "Да",
        noCaption: "Нет",

        yesHandler: createModalYesBtn,
        noHandler: createModalNoBtn
    });
}

$(document).ready(function(event){
    $("#create_certs").click(createBtnClick);
});

