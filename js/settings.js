//Settings FILE

var app_name = "Mobile Quiz";
var developer_url = "https://onlinemedia.com.ng";
var developer_email = "admin@onlinemedia.com.ng";
var supervisor = "Mr. Amusan D.G";


//var url = 'http://app.onlinemedia.com.ng/quiz/api.php';
var url;

var env;
env = "loca";

var base_url;
var time_rem;
var time_rem_2;

if(env == "local"){
    url = "http://freelance.in/quiz_mobile/api.php";
    base_url = "http://freelance.in/quiz_mobile/";
}else{
    base_url = "http://fpecomengmquiz.com.ng/";
    url = 'http://fpecomengmquiz.com.ng/l_api.php';
}

$(document).ready(function () {
   //myApp.alert("Hello dude");

    $(".supervisor").html(supervisor);
});


function is_login() {
    var user_id = sessionStorage.getItem("user_id");
    if(user_id == "" || user_id == null){
        return false;
    }else{
        return true;
    }
}


function remark(score) {
    if((score >=50) && (score <= 60) ){
        return "Excellent";
    }else if((score >=40) && (score < 50) ){
        return "Very Good";
    }else if((score >=30) && (score <= 39) ){
        return "Average";
    }else if((score >=25) && (score <= 29) ){
        return "Fair";
    }else{
        return "Poor";
    }
}


function show_toast(msg,color) {
    iziToast.show({
        message: msg,
        color: color,
        timeout: 7000
    });
}

