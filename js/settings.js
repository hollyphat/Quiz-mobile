//Settings FILE

var app_name = "Mobile Quiz";
var developer_url = "https://onlinemedia.com.ng";
var developer_email = "admin@onlinemedia.com.ng";
var supervisor = "Mr. Ramoni T.A";


//var url = 'http://app.onlinemedia.com.ng/quiz/api.php';
var url;

var env;
env = "live";

var base_url;

if(env == "local"){
    url = "http://freelance.in/quiz_mobile/api.php";
    base_url = "http://freelance.in/quiz_mobile/";
}else{
    base_url = "http://app.onlinemedia.com.ng/quiz/";
    url = 'http://app.onlinemedia.com.ng/quiz/api.php';
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