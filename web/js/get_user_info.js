function getLoaderGif(){
    return "/img/ring-alt.gif";
}

//Appends the gif into specified tag
function appendLoaderGif(selector){
    var image = $("<img>", {
        src: getLoaderGif(),
        alt: "Загрузка...",
        width: 40,
        height: 40
    });

    return $(selector).append(image);
}

function appendLoaderInTable(table_selector, colspan){
    var td = $("<td>", {
        class: "text-center",
        colspan: colspan
    });
    appendLoaderGif(td);

    var tr = $("<tr>", {
        class: "loader-row"
    });
    $(tr).append(td);

    $(table_selector).append(tr);

    return $(tr);
}

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

    var loader = appendLoaderInTable("#certificates-table", 2);
    $("#username").html(username);

    //Sending AJAX request to retrieve attached certificates
    jQuery.getJSON("/admin/attach?user_id="+user_id, function (data){
        $(loader).remove();
        data.att_certs.forEach(function(item, i){
            $("#certificates-table tr:last").after(
                "<tr class='certificate-row'>" +
                "<td>" + item.ID_certificate + "</td>" +
                "<td>" + item.CertState + "</td>" +
                "</tr>"
            );
        })
    });
}

$(document).ready(function(e){
    var certificates_to_attach = [];

    jQuery.getJSON("/admin/user_table", function (data){
        $(".loader-row").remove();
        fillUserTableWithData("#user_table tr:last", data);

        $(".attach-certificate-btn").click(attachBtnClick);
    });
});
