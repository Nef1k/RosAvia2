/**
 * Created by 166878 on 20.09.2016.
 */
function showModal(date){
    $("#chosen_date").html(date.format("DD.MM.YYYY"));
    $("#myModal").modal("show");
    var chosen_date = date.unix();
    getTimeTableData(chosen_date);
}
function fillTimeTableWithData(table_selector, data){
    console.log(data);

    if (data.length > 0) {
        for (var hour in data) {
            if (!data.hasOwnProperty(hour)) {
                continue;
            }

            var certificates_in_hour = data[hour];

            if (certificates_in_hour.length != 0) {
                //console.log($(table_selector + " tr:last"))
                /*$(table_selector + " tr:last").after(
                 "<tr>" +
                 "   <td>" + hour + ":00</td>" +
                 "   <td>sa "
                 );
                 certificates_in_hour.forEach(function (item) {
                 console.log(item.id);
                 $(table_selector + " td:last").html(
                 item.id + " | " + item.flight_type + "&nbsp;&nbsp;"
                 )
                 });
                 $(table_selector + " td:last").after(
                 "</td></tr>"
                 );*/
            }
        }
    }
    else {
        $(table_selector + " tr:last").append(
            "<tr>" +
            "   <td colspan=\"2\">На данный день нет записанных сертификатов</td>" +
            "</tr>"
        )
    }
}
function getTimeTableData(date){
    $(".day-loader").removeClass("hidden");
    jQuery.getJSON("/admin/show_day_schedule?date="+date, function (data){
        $(".day-loader").addClass("hidden");
        fillTimeTableWithData("#time_table", data);
    });
}

$(document).ajaxError(function(event, jqXHR, ajaxSettings, message){
    console.log(message);
});

$(document).ready(function(e){
    $("#some-btn").click(showModal);

    $("#calendar").fullCalendar({
        monthNames: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
        header: {
            left: 'title',
            right: 'today, prev, next'
        },
        dayClick: showModal
    });
});