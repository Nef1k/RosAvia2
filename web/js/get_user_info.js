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