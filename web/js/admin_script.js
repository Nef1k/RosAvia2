/**
 * Created by ASUS on 20.09.2016.
 */

var yesNoDialog = new YesNoDialog;

function isDefined(varible){
    return (typeof varible !== "undefined");
}

function createModalNoBtn(event){
    yesNoDialog.close();
}
function createModalYesBtn(event) {
    yesNoDialog.close();
}

function getCertificateListCaption(event){

}

function getCertificatesCaption(event){
    var modal = $(this);


}

function isInvalid(value){
    return isNaN(value) || value == "";
}

function parseCertificateList(){
    var ID_Certificate = $("[name='ID_Certificate']").val();
    var range = {
        from: $("[name='range_from']").val(),
        to: $("[name='range_to']").val()
    };
    var amount = {
        from: $("[name='amount_from']").val(),
        count: $("[name='amount_count']").val()
    };

    console.log(isInvalid(ID_Certificate));

    if (!isInvalid(ID_Certificate)){
        return {
            type: "single",
            certificates: [ID_Certificate]
        };
    }

    if (!isInvalid(range.from) && !isInvalid(range.to)){
        return {
            "type": "range",
            "certificates": Array(range.to - range.from + 1).map(function(value, index, certificates){
                return range.from + index;
            })
        }
    }

    if (!isInvalid(amount.from) && !isInvalid(amount.count)){
        return {
            "type": "amount",
            "certificates": Array(amount.count).map(function(value, index, certificates){
                return amount.from + index;
            })
        };
    }
}

function createBtnClick(){
    console.log(parseCertificateList().certificates);
    yesNoDialog.setModalSelector("#yes-no-modal");
    yesNoDialog.show({
        caption: "Создание сертификатов",
        message: "Будут созданы сертификаты %certificates%. Вы уверены?",

        yes_caption: "Да",
        no_caption: "Нет",

        yes_handler: createModalYesBtn,
        no_handler: createModalNoBtn
    });
}

$(document).ready(function(event){
    $("#create_certs").click(createBtnClick);
});

