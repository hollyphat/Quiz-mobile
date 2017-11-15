// Initialize your app
var myApp = new Framework7({
    modalTitle: app_name,
    material: true,
    pushState : true,
    smartSelectOpenIn: 'picker'
});


//login vars

var user_id = localStorage.getItem("user_id");
var username = localStorage.getItem("username");
var full_name = sessionStorage.getItem("full_name");




// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('login-screen-embedded', function (page) {

    var image_name = "";

    // take picture from camera
    $$('#but_take').click(function(){
        navigator.camera.getPicture(onSuccess, onFail, { quality: 20,
            destinationType: Camera.DestinationType.FILE_URL
        });
    });

    // upload select
    $$("#but_select").click(function(){
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            destinationType: Camera.DestinationType.FILE_URI
        });
    });

    // Change image source and upload photo to server
    function onSuccess(imageURI) {
        // Set image source
        var image = document.getElementById('img');
        image.src = imageURI  + '?' + Math.random();

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        var params = {};
        params.value1 = "test";
        params.value2 = "param";

        options.params = params;
        options.chunkedMode = false;

        var ft = new FileTransfer();
        ft.upload(imageURI, "http://app.onlinemedia.com.ng/quiz_mobile/upload.php", function(result){
            image_source =  result.response;
        }, function(error){
            myApp.alert('error : ' + JSON.stringify(error));
        }, options);
    }
    function onFail(message) {
        alert('Failed because: ' + message);
    }

    $$("#register-form").on('submit',function(e){
        e.preventDefault();
        if(image_name == ""){
            myApp.alert("You did not upload a picture");
            return;
        }
        var matric = $$("#reg_matric").val();
        var password = $$("#reg_password").val();
        var f_name = $$("#reg_name").val();
        var email = $$("#reg_email").val();
        var gender = $$("#reg_phone").val();
        myApp.showPreloader("Signing up...");

        $$.ajax({
           url: url,
            data: {
                'register': '',
                'name': f_name,
                'matric' : matric,
                'password' : password,
                'gender': gender,
                'email': email,
                'image' : image_name
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("#username").val('');
                    $$("#name").val('');
                    $$("#password").val('');
                    $$("#email").val('');
                    $$("#phone").val('');
                }
                myApp.hidePreloader();

                myApp.addNotification({
                    message : f.msg
                });
            },
            error:function(err){
                myApp.hidePreloader();
                myApp.alert("Network error, try again");
            },
            timeout: 60000
        });
    });
});


myApp.onPageInit('password', function (page) {
    $$("#password-form").on('submit',function(e){
        e.preventDefault();
        var usern = $$("#username").val();

        var email = $$("#email").val();
        myApp.showPreloader("Resetting Password...");

        $$.ajax({
            url: url,
            data: {
                'reset_pass': '',
                'username' : usern,
                'email': email
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("#username").val('');
                    $$("#email").val('');
                }
                myApp.hidePreloader();

                myApp.addNotification({
                    message : f.msg
                });
            },
            error:function(err){
                myApp.hidePreloader();
                myApp.alert("Network error, try again");
                console.log(err.responseText);
            },
            timeout: 60000
        });
    });
});


myApp.onPageInit('main-page', function (page) {
    //console.log("okay");

    var ft = sessionStorage.getItem("ft");
    //console.log(ft);
    if((ft == null) || (ft == "")){
        //show splash
        sessionStorage.setItem("ft",1);
        document.getElementById('splash-page').style.display = "block";

        setTimeout(function(){
                show_main()
            },
            5000);
    }else{
        //show main
        show_main();
    }


    function show_main()
    {
        //console.log("hello");
        document.getElementById('splash-page').innerHTML = "";
        document.getElementById('splash-page').style.display = "none";
        $$("#splash-page").remove();
        $$("#main-page").removeClass('hide');
        document.getElementById('main-page').style.display = "block";

        //myApp.onPageInit('index');
    }
    if(is_login()){
        $$("#home").click();
    }
    $$("#login-form").on('submit',function(e){
        e.preventDefault();
        var usern = $$("#login_matric").val();
        var password = $$("#login_password").val();
        myApp.showPreloader("Login Processing,<br/>Please Wait...");

        $$.ajax({
            url: url,
            data: {
                'login': '',
                'username' : usern,
                'password' : password
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("#username_login").val('');
                    $$("#password_login").val('');


                    var info = f.record;
                    sessionStorage.setItem("username",info['username']);
                    localStorage.setItem("user_id",info['user_id']);
                    sessionStorage.setItem("full_name",info['name']);
                    myApp.hidePreloader();
                    $$("#home").click();
                }else {
                    myApp.hidePreloader();

                    myApp.addNotification({
                        message: f.msg
                    });


                }
            },
            error:function(err){
                console.log(err.responseText);
                myApp.hidePreloader();
                myApp.alert("Network error, try again");
            },
            timeout: 60000
        });
    });
}).trigger();


myApp.onPageInit('homed', function (page) {
    var username2 = localStorage.getItem("username");
    if(username2 == "" || username2 == null){
        window.location = "main.html";
    }

    update_stat();

    $$("#logout").on('click',function(){
        myApp.confirm('Are you sure you want to logout?', function () {
            sessionStorage.removeItem("user_id");
            sessionStorage.removeItem("username");

            window.location = "main.html";
        });
    });

    //console.log(inbox_l);
});




function update_stat(){

    var u_id = localStorage.getItem("user_id");

    var f_name = sessionStorage.getItem("full_name");


    $$("#full-name, .full-name").html(f_name);

    $$.ajax({
        url: url,
        data:{
            'msg_list': '',
            'user': u_id
        },
        type: 'GET',
        crossDomain : true,
        cache: false,
        dataType: 'json',
        success:function(f){
            var stats = f.stats;
            sessionStorage.setItem("inbox",stats['inbox']);
            sessionStorage.setItem("sent",stats['sent']);
            sessionStorage.setItem("read",stats['read']);

            inbox_l = sessionStorage.getItem("inbox");
            sent_l = sessionStorage.getItem("sent");
            read_l = sessionStorage.getItem("read");
            //f_name = sessionStorage.getItem("full_name");

            $$("#inbox-count, .inbox-count").html(inbox_l);
            $$("#read-count, .read-count").html(read_l);
            $$("#sent-count, .sent-count").html(sent_l);
            //$$("#full-name, .full-name").html(f_name);
        },
        error:function(err){
            myApp.addNotification({
                message: 'Unable to retrieve message count'
            });
        },
        timeout: 60000

    });

}
