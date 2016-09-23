function fillUserTableWithData(table_selector, data){
    $("#unattached_certs_count").html(data.unattached_certs);
    data.users.forEach(function(item, i){
        $(table_selector).after(
            "<tr>" +
            "<td>" + item.ID_User + "</td>" +
            "<td><a href='"+ item.userInfoLink +"'>" + item.username + "</a></td>" +
            "<td>" +
            "<button data-toggle='modal' data-target='#attach-certificate-modal' class=\"btn btn-xs btn-default attach-certificate-btn\" data-user_id=\""+ item.ID_User +"\" data-username=\""+item.username+"\">" +
            "<span class='glyphicon glyphicon-link'></span>" +
            "</button>" +
            "</td>" +
            "<td>" + item.role + "</td>" +
            "<td><a href=\"mailto:"+ item.email +"\">" + item.email + "</a></td>" +
            "</tr>"
        );
    });
}

function attachBtnClick(event){
    var user_id = $(this).data("user_id");
    var username = $(this).data("username");
    //Clearing up previous certificates
    $(".certificate-row").remove();
    $(".unatt_btn").remove();
   // $(".attach-helper").remove();

    //var loader = appendLoaderInTable("#certificates-table", 2);
    //var certificates_loader = appendLoaderGif("#unattached_certs");
    $("#username").html(username);

    //Sending AJAX request to retrieve attached certificates
    jQuery.getJSON("/admin/attach?user_id="+user_id, function (data){
        $(loader).remove();
        $(certificates_loader).remove();
        if (data.att_certs.length == 0){
            $("#certificates-table tr:last").after(
                "<tr class='certificate-row'><td colspan=\"2\">Нет привязанных сертификатов</td>"
            );
        }
        else {
            data.att_certs.forEach(function(item, i){
                $("#certificates-table tr:last").after(
                    "<tr class='certificate-row'>" +
                    "<td>" + item.ID_certificate + "</td>" +
                    "<td>" + item.CertState + "</td>" +
                    "</tr>"
                 );
            });
        }
        if (data.unatt_certs.length == 0){
            $("#certificates-table tr:last").after(
                "Нет доступных сертификатов"
            );
        }
        else {
            data.unatt_certs.forEach(function (item, i) {
                $("#unattached_certs h4").after(
                    "<button class=\"unatt_btn btn btn-default col-md-3\" id=\"" + item.ID_certificate + "\">" + item.ID_certificate + "</button>"
                );
            });
        }
    });
}



$(document).ready(function(e){
    var certificates_to_attach = [];


});
