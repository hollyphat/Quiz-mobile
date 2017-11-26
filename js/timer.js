/*
* TIMER FUNCTION
*/


var time_spent = 0; //initialize time spent to be zero

var time_rem = 1800; //initialize time remaining to be 7200 , 2 hours(2*60*60)
/*
var spent_hour = $$("#time_spent_hour") //get the time spent hour span
var spent_minutes = $$("#time_spent_minute"); //get the time spent minute span
var spent_seconds = $$("#time_spent_seconds"); //get the time spent second span

var counter = setInterval(spent_timer, 1000); //run the spent time function every seconds
*/

var rem_hour = $$("#time_rem_hour") //get the remaining hour
var rem_minutes = $$("#time_rem_minute"); //get the remaining minute
var rem_seconds = $$("#time_rem_seconds"); //get the remaining second

var counter2 = setInterval(rem_timer, 1000); //run the remaining function


function spent_timer(){

    if(time_spent == 1799){
        //return false;
        $("#time_spent_post").val("1800");
        myApp.alert("Time up");
        $$(".test_submit").click();
        //clearInterval(counter);
        clearInterval(counter2);
        return false;
    }

    time_spent += 1; //increase time spent by 1 (one)
    var seconds_display = checkTime(time_spent % 60); //find the remainder when time_spent is divided by 60
    var minutes_display = checkTime(Math.floor(parseInt(time_spent / 60 ))); //integer value of time_spent / 60

    if(minutes_display >= 60){
        minutes_display -= 60;
    }

    var hours_display = checkTime(Math.floor(parseInt(time_spent / 3600 ))); //integer value of time_spent / 3600 i.e 2 1 hour

    spent_seconds.html(seconds_display);
    spent_minutes.html(minutes_display);
    spent_hour.html(hours_display);

    $$("#time_spent_post").val(time_spent);
}

function rem_timer(){

    if(time_rem == 0){
        return false;
    }

    time_rem -= 1; //decrease remaing time by 1

    var seconds_display2 = checkTime(time_rem % 60); //find the remainder when time_remaining is divided by 60
    var minutes_display2 = checkTime(Math.floor(parseInt(time_rem / 60 ))); //integer value of time_rem / 60 minus 60 minutes
    if(minutes_display2 >= 60){
        minutes_display2 -= 60;
    }
    var hours_display2 = checkTime(Math.floor(parseInt(time_rem / 3600 ))); //integer value of time_rem / 3600 i.e 2 1 hour

    rem_seconds.html(seconds_display2);
    rem_minutes.html(minutes_display2);
    rem_hour.html(hours_display2);
}

function checkTime(i)
{
    if (i<10)
    {
        i="0" + i;
    }
    return i;
}