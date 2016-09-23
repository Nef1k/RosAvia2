/**
 * Created by Nef1k on 18.09.2016.
 *
 * Requires CertificateList
 */

var certificateToAttach = new CertificateList();

var attachModalSelector = "#attach-certificate-modal";

function attachBtnClick(event){
    var user_id = $(this).data("user_id");
    var username = $(this).data("username");

    $(attachModalSelector).data("user_id", user_id);
    $(attachModalSelector).data("username", username);
}

function onModalLoad(event){
    var user_id = $(this).data("user_id");
    var username = $(this).data("username");

    //Clearing up previous
    $(".attached-certificates-empty").addClass("hidden");
    $(".unattached-certificates-empty").addClass("hidden");
    $(".certificate-row").remove();
    $(".unatt_btn").remove();
    // $(".attach-helper").remove();

    var attached_loader = $(".attached-certificates-loader").removeClass("hidden");
    var unattached_loader = $(".unattached-certificates-loader").removeClass("hidden");
    $("#username").html(username);

    //Sending AJAX request to retrieve attached certificates
    jQuery.getJSON("/admin/attach?user_id="+user_id, function (data){
        var attached_loader = $(".attached-certificates-loader").addClass("hidden");
        var unattached_loader = $(".unattached-certificates-loader").addClass("hidden");
        if (data.att_certs.length == 0){
            $(".attached-certificates-empty").removeClass("hidden");
        }
        else {
            data.att_certs.forEach(function(item, i){
                $("#certificates-table tr:last").after(
                    "<tr class='certificate-row'>" +
                    "   <td>" + item.ID_certificate + "</td>" +
                    "   <td>" + item.CertState + "</td>" +
                    "</tr>"
                );
            });
        }
        if (data.unatt_certs.length == 0){
            $(".unattached-certificates-empty").removeClass("hidden");
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

$(document).ready(function(event){
    $(attachModalSelector).on("show.bs.modal", onModalLoad);
});