/**
 * Created by 166878 on 20.09.2016.
 */
function certificateToStr(certificate){
    return  "<a href='#' class='btn btn-primary' style='margin-bottom: 5px;'>" +
            "   <span class='badge'>" + certificate.id + "</span>" +
            "   " + certificate.flight_type +
            "</a> ";
}
function getHourRow(hour){
    return  "<tr class='hour-row'>" +
            "   <td valign='middle' align='center'>" + hour + ":00</td>" +
            "   <td style='padding: 10px 20px;'>" +
            "       <div class='row certificates-in-hour-" + hour + "'></div>" +
            "   </td>" +
            "</tr>";
}

function showModal(date){
    //Showing modal window with per-day schedule table
    $("#chosen_date").html(date.format("DD.MM.YYYY"));
    $("#time_tabl").find(".hour-row").remove();
    $(".day-empty").addClass("hidden");
    $("#myModal").modal("show");

    //Retrieving per-day schedule
    var chosen_date = date.unix();
    getTimeTableData(chosen_date);
}
function fillTimeTableWithData(table_selector, data){
    //If there is more than one busy hour
    if (Object.keys(data).length > 0) {

        //Iterating over the hours
        for (var hour in data) {
            //Retrieve next hour
            if (!data.hasOwnProperty(hour)) {
                continue;
            }
            var certificates_in_hour = data[hour];

            //If there is more than one flight in that hour
            if (certificates_in_hour.length != 0) {
                //Creating new hour row in table
                $(table_selector).append(getHourRow(hour));

                //Iterating over the flights in this hour and rendering them
                certificates_in_hour.forEach(function(item, i, arr){
                    $(table_selector + " .certificates-in-hour-"+hour).append(certificateToStr(item));
                });
            }
        }
    }
    //Otherwise showing the string telling the day is empty
    else {
        $(table_selector + " .day-empty").removeClass("hidden");
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