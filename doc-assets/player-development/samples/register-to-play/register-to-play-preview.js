videojs.plugin('registerToPlay', function(options) {
    var myPlayer = this,
        // for handling the registration form
        // user info
        firstName,
        lastName,
        emailAddress,
        registered = false,
        // html for the registration form
        overlayContent = '<div id="regForm" class="registration-form"><h1 class="registration-form">To view the video, please register or login.</h1><p class="registration-form">First name: <input id="fname" type="text" size="30"></p><p>Last name: <input id="lname" type="text" size="30"></p><p class="registration-form">Email: <input id="email" type="text" size="35"></p><p class="registration-form"><button id="reg" class="registration-form">Register</button><button id="login" class="registration-form">Login</button><button id="noThanks" class="registration-form">No thanks</button></p></div><div id="regPass" class="registration-form" style="display:none;"><p class="registration-form">Choose a password: <input type="password" id="regPassword"></p><p class="registration-form"><button id="submitRegPassword" class="registration-form">Submit</button></p></div><div id="loginPass" class="registration-form" style="display:none;"><p class="registration-form">Enter your password: <input type="password" id="loginPassword"></p><p><button id="submitLoginPassword" class="registration-form">Submit</button></p></div><div id="noThanksMessage" style="display:none;"><p class="registration-form"><strong>Thanks for dropping by anyway!</strong></p></div>';


    // add the overlay content
    // change the start value to provide
    // a longer or shorter preview
    myPlayer.overlay({
        content: overlayContent,
        overlays: [
            {
                align: 'top',
                content: overlayContent,
                start: 3
            }
        ]
    });

    // get element references
    var fname = document.getElementById('fname'),
    lname = document.getElementById('lname'),
    email = document.getElementById('email'),
    reg = document.getElementById('reg'),
    login = document.getElementById('login'),
    noThanks = document.getElementById('noThanks'),
    noThanksMessage = document.getElementById('noThanksMessage'),
    regForm = document.getElementById('regForm').
    regPass = document.getElementById('regPass'),
    regPassword = document.getElementById('regPassword'),
    submitRegPassword = document.getElementById('submitRegPassword'),
    loginPass = document.getElementById('loginPass'),
    loginPassword = document.getElementById('loginPassword'),
    submitLoginPassword = document.getElementById('submitLoginPassword');

    /**
     * hides the overlay, unhides the controls, and plays the video
     * this function is called from the registration form in the iframe
     * and that is why it is defined in the global scope
     */
    playVideo = function () {
        // hide the overlay, reveal the controls, play
        myPlayer.addClass('hide-overlay'); myPlayer.removeClass('hide-controls');
        myPlayer.play();
    };

    /**
     * handles timeupdate events - when playback reaches 3 seconds
     * pause the player and hides controls to force registration
     */
    function timeupdateHandler(evt) {
        // use my player.currentTime() to get the current position
        // you can't be sure the event will fire at 5 seconds, so check for
        // when the currentTime exceeds 3
        if (myPlayer.currentTime() > 3) {
            myPlayer.pause();

            // we only want to do this once, so unload the listener
            myPlayer.off('timeupdate', timeupdateHandler);
            myPlayer.addClass('hide-controls');
        }
    }

    // pause the video when the overlay appears
    myPlayer.on('timeupdate', timeupdateHandler);

    // everything below is for handling the registration form

    // decline event listener
    noThanks.addEventListener('click', function() {
        // show the goodbye message
        noThanksMessage.setAttribute('style', 'display:block;');
    });

    // register event listener
    reg.addEventListener('click', function() {
        // here you would want to validate the field values
        //
        // show the create password form
        regPass.setAttribute('style', 'display:block;');
    });

    // login event listener
    login.addEventListener('click', function() {
        // here you would want to validate the field values
        //
        // show the create password form
        loginPass.setAttribute('style', 'display:block;');
    });

    // registration password event listener
    submitRegPassword.addEventListener('click', function() {
        // here you would want to validate the field values
        firstName = fname.value;
        lastName = lname.value;
        emailAddress = email.value;
        password = regPassword.value;

        /* here you would submit the information to your
         * backend registration system and
         * handle the response
         * here we are skipping that and will
         * just set registered to true
         */

        registered = true;

        // invoke the function on the parent page to play the video
        if (registered) {
            playVideo();
        }
    });

    // login password event listener
    submitLoginPassword.addEventListener('click', function() {
        // here you would want to validate the field values
        firstName = fname.value;
        lastName = lname.value;
        emailAddress = email.value;
        password = loginPassword.value;

        // here you would submit the information to your
        // backend authentication system

        // if authentication succeeded,
        // invoke the function on the parent page to play the video
        parent.playVideo();
    });
});
