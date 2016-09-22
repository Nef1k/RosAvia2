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

function isInvalid(value){
    return isNaN(value) || value == "";
}

function generateRange(from, to){
    var result = [];
    for (var i = from; i <= to; i++){
        result.push(i);
    }

    return result;
}
function generateAmount(offset, count){
    var result = [];

    for (var i = offset; i <= offset + count - 1; i++){
        result.push(i);
    }

    return result;
}

function parseCertificateList(){
    var ID_Certificate = $("[name='ID_Certificate']").val();
    var range = {
        from: parseInt($("[name='range_from']").val()),
        to: parseInt($("[name='range_to']").val())
    };
    var amount = {
        from: parseInt($("[name='amount_from']").val()),
        count: parseInt($("[name='amount_count']").val())
    };

    if (!isInvalid(ID_Certificate)){
        return {
            type: "single",
            certificates: [ID_Certificate]
        };
    }

    if (!isInvalid(range.from) && !isInvalid(range.to)){
        return {
            "type": "range",
            "certificates": generateRange(range.from, range.to)
        }
    }

    if (!isInvalid(amount.from) && !isInvalid(amount.count)){
        return {
            "type": "amount",
            "certificates": generateAmount(amount.from, amount.count)
        };
    }
}

function createBtnClick(){
    var userInput = parseCertificateList();
    var certificateListStr = (userInput) ? userInput.certificates.join(", ") : "undefined";

    var msg = (userInput) ?
        "Будут созданы сертификаты со следующими ID: <code>"+ certificateListStr +"</code>. Вы уверены?" :
        "Неправильно заполнены поля";

    yesNoDialog.setModalSelector("#yes-no-modal");
    yesNoDialog.show({
        caption: "Создание сертификатов",
        message: msg,

        yes_caption: "Да",
        no_caption: "Нет",

        yes_handler: createModalYesBtn,
        no_handler: createModalNoBtn
    });
}

$(document).ready(function(event){
    $("#create_certs").click(createBtnClick);
});

