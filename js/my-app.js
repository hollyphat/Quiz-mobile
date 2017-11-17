// Initialize your app
var myApp = new Framework7({
    modalTitle: app_name,
    material: true,
    pushState : true,
    smartSelectOpenIn: 'picker'
});


//login vars

var user_id = sessionStorage.getItem("user_id");
var username = sessionStorage.getItem("username");
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

    $$("#register-form").on('submit',function(e){
        e.preventDefault();

        var matric = $$("#reg_matric").val();
        var password = $$("#reg_password").val();
        var f_name = $$("#reg_name").val();
        var email = $$("#reg_email").val();
        var gender = "";

        $$('select[name="reg_gender"] option:checked').each(function () {
            gender = this.value;
        });
        myApp.showPreloader("Signing up...");

        $$.ajax({
           url: url,
            data: {
                'register': '',
                'name': f_name,
                'matric' : matric,
                'password' : password,
                'gender': gender,
                'email': email
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("#reg_matric").val('');
                    $$("#reg_name").val('');
                    $$("#reg_password").val('');
                    $$("#reg_email").val('');
                    //$$("#phone").val('');
                }
                myApp.hidePreloader();

                myApp.addNotification({
                    message : f.msg
                });
            },
            error:function(err){
                console.log(err.responseText);
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

    //show_main();


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
        myApp.showPreloader("Processing,<br/>Please Wait...");

        $$.ajax({
            url: url,
            data: {
                'login': '',
                'matric' : usern,
                'password' : password
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("#login_matric").val('');
                    $$("#login_password").val('');


                    var info = f.record;
                    sessionStorage.setItem("matric",info['matric']);
                    sessionStorage.setItem("user_id",info['user_id']);
                    sessionStorage.setItem("full_name",info['name']);
                    sessionStorage.setItem("email",info['email']);
                    sessionStorage.setItem("gender",info['gender']);
                    sessionStorage.setItem("passport",info['passport']);
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


myApp.onPageInit('home', function (page) {
    var matric2 = sessionStorage.getItem("matric");
    if(matric2 == "" || matric2 == null){
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

myApp.onPageAfterAnimation('profile', function (page){
    //Page 3 arrives, we may remove Page 2 from dom and it will
    //be reloaded when you click on back link
    //$$('.page-on-left').remove();
})
myApp.onPageInit('profile',function (page) {
    var home_matric = sessionStorage.getItem("matric");
    var home_email = sessionStorage.getItem("email");
    var home_gender = sessionStorage.getItem("gender");
    var home_name = sessionStorage.getItem("full_name");

    var matric2 = sessionStorage.getItem("matric");
    if(matric2 == "" || matric2 == null){
        window.location = "main.html";
    }

    $("#profile_name").val(home_name);
    $("#profile_matric").val(home_matric);
    $("#profile_email").val(home_email);
    $("#profile_gender").val(home_gender);

    $$("#update-form").on('submit',function (e) {
        e.preventDefault();

        var profile_name = $$("#profile_name").val();
        var profile_email = $$("#profile_email").val();

        var gender = "";

        $$('select[name="reg_gender"] option:checked').each(function () {
            gender = this.value;
        });
        myApp.showPreloader("Updating profile,<br/>Please Wait...");

        $$.ajax({
            url: url,
            data: {
                'update_profile': '',
                'name' : profile_name,
                'email' : profile_email,
                'gender' : gender,
                'user_id' : sessionStorage.getItem("user_id")
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){

                    sessionStorage.setItem("full_name",profile_name);
                    sessionStorage.setItem("email",profile_email);
                    sessionStorage.setItem("gender",gender);
                    update_stat();
                    myApp.hidePreloader();
                    myApp.addNotification({
                        message: f.msg
                    });
                }else {
                    myApp.hidePreloader();



                    myApp.addNotification({
                        message: 'Unable to update profile'
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



    $$("#password-form").on('submit',function (e) {
        e.preventDefault();

        var pass = $$("#password").val();
        var c_pass = $$("#confirm_password").val();

        if(pass !== c_pass){
            myApp.alert("Password does not match");
            return false;
        }
        myApp.showPreloader("Updating password,<br/>Please Wait...");

        $$.ajax({
            url: url,
            data: {
                'update_password': '',
                'password' : pass,
                'user_id' : sessionStorage.getItem("user_id")
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    myApp.hidePreloader();
                    myApp.addNotification({
                        message: f.msg
                    });
                    $("#password").val('');
                    $("#confirm_password").val('');
                }else {
                    myApp.hidePreloader();

                    myApp.addNotification({
                        message: 'Unable to update password'
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
    })
});

myApp.onPageInit('passport',function () {
    var my_img = sessionStorage.getItem("passport");

    if(my_img == "" || my_img == null){
        $("#passport").attr("src","avatar.png");
    }else{
        var src = base_url+"/upload/"+my_img;
        $("#passport").attr("src",src);
    }

    $$("#but_take").on('click', function(event) {
        event.preventDefault();
        myApp.alert("You clicked me!");
        navigator.camera.getPicture(onSuccess, onFail, { quality: 20,
            destinationType: Camera.DestinationType.FILE_URL
        });
    });

    $$("#but_select").on('click', function () {
        event.preventDefault();
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
        var user_id_id = sessionStorage.getItem("user_id");
        var ft = new FileTransfer();
        ft.upload(imageURI, base_url+"upload.php?user="+user_id_id, function(result){
            myApp.alert('successfully uploaded ' + result.response);
        }, function(error){
            myApp,alert('error : ' + JSON.stringify(error));
        }, options);

    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
});



function update_stat(){
    //myApp.alert("I work");
    var u_id = sessionStorage.getItem("user_id");

    var f_name = sessionStorage.getItem("full_name");


    $$("#full-name, .full-name").html(f_name);


    var my_img = sessionStorage.getItem("passport");

    if(my_img == "" || my_img == null){
        $("#user-img").attr("src","avatar.png");
    }else{
        var src = base_url+"/upload/"+my_img;
        $("#user-img").attr("src",src);
    }

    var home_matric = sessionStorage.getItem("matric");
    var home_email = sessionStorage.getItem("email");
    var home_gender = sessionStorage.getItem("gender");

    $(".home-matric").html(home_matric);
    $(".home-email").html(home_email);
    $(".home-gender").html(home_gender);

}
