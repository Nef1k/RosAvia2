/**
 * Created by ASUS on 20.09.2016.
 */

function createModalNoBtn(event){
    closeYesNoModal();
}
function createModalYesBtn(event) {
    closeYesNoModal();
}

function getCertificateListCaption(event){

}

function getCertificatesCaption(event){
    var modal = $(this);


}

function createBtnClick(){
    var yesNoDialog = new YesNoDialog();
    yesNoDialog.show({
        caption: "Создание сертификатов",
        message: "Будут созданы сертификаты %certificates%. Вы уверены?",

        yes_caption: "Да",
        no_caption: "Нет",

        yesHandler: createModalYesBtn,
        noHandler: createModalNoBtn
    });
}

$(document).ready(function(event){
    $("#create_certs").click(createBtnClick);
});

