/**
 * Created by 166878 on 20.09.2016.
 */
function showModal(date){
    $("#chosen_date").html(date.format("DD.MM.YYYY"));
    $("#myModal").modal("show");
    var chosen_date = UTC(date);
    getTimeTableData(chosen_date);
}
function fillTimeTableWithData(table_selector, data){
    data.time_list.forEach(function(item, i){
        var count = 0;
        if (item.length != 0){
            count += 1;
            $(table_selector + " tr:last").after(
                "<tr><td>" + i + ".00</td>"+"<td>"
            );
            item.cert_list.forEach(function(item){
                $(table_selector + " tr:last").after(
                    "<div>" + item.id + "|" + item.flight_type + "</div>"
                )
            });
            $(table_selector + " div:last").after(
                "</td></tr>"
            );
        }
        if (count==0){
            $(table_selector + " tr:last").after(
                "<tr><td colspan=\"2\">На данный день нет записанных сертификатов</td></tr>"
            )
        }
    })

}
function getTimeTableData(date){
    jQuery.getJSON("/admin/show_day_schedule?date="+date, function (data){
        $(".loader-row").remove();
        fillTimeTableWithData("#time_table", data);
    });
}

$(document).ready(function(e){
    $("#some-btn").click(showModal);

    $("#calendar").fullCalendar({
        monthNames: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
        header: {
            left: 'title',
            right: 'agendaDay,today, prev, next'
        },
        dayClick: showModal
    });
});