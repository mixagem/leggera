/************************************/
/* helpcenter+ supperliggera        */
/* mambosinfinitos, 2022            */
/************************************/

let loggedinUser;
let currentUsername = document.querySelector('#username');


// ############ LANDING START ############

(function randomBG() {

    const rng = Math.floor(Math.random() * 1) + 1;
    console.log(rng);
    console.log(document.querySelector('#loading-wrapper'));

    document.querySelector('#loading-wrapper').style.backgroundImage = `url(assets/img/loading-bg-` + rng + `.png)`;
})();

(function leggeraLoading() {
    const loginWrapperFade = setTimeout(function () {

        const landingLogos = document.querySelectorAll('#loading-wrapper .animate__animated')
        for (i = 0; i < landingLogos.length; i++) {
            landingLogos[i].style.marginLeft = "0%"
        }

        const animationToTheLeft = setInterval(function () {
            let marginSize;
            for (i = 0; i < landingLogos.length; i++) {
                let tempPos = landingLogos[i].style.marginLeft.search('%');
                marginSize = landingLogos[i].style.marginLeft.slice(0, tempPos)
                let newMarginSize = Number(marginSize) - 3;
                landingLogos[i].style.marginLeft = `${newMarginSize}%`
            }
            if (Number(marginSize) <= '-150') {
                clearInterval(animationToTheLeft);
                cookieLogin();
                document.querySelector('#login-wrapper').classList = ('animate__fadeInUp animate__animated');
            }
        }, 5)

    }, 1400)
})();


const showPasswordBtn = document.querySelector('#show-password');
showPasswordBtn.addEventListener('click', wantMeToShowPassword);
const passwordInput = document.querySelector('#password');

function wantMeToShowPassword() {
    if (showPasswordBtn.classList.contains('show-password-active')) {
        showPasswordBtn.classList.remove('show-password-active');
        passwordInput.setAttribute('type', 'password');
    }
    else {
        showPasswordBtn.classList.add('show-password-active');
        passwordInput.setAttribute('type', 'text');
    }
}

document.addEventListener("keyup", enterPress);
function enterPress (e) {
    if (e.target.tagName === 'INPUT' && e.key === 'Enter') {
        leggeraLogin();
    }
}

// ############ COOKIE LOGIN ############

document.querySelector('#login-btn').addEventListener('click', leggeraLogin);
// Vai buscar a cookie à cache (caso exista)
function cookieLogin() {

    const bolachinha = localStorage.getItem('bolachinha');
    if (bolachinha == null) { return }
    else {

        $.ajax({    //create an ajax request to display.php
            type: "POST",
            url: "assets/php/cookie.php",
            dataType: "text",
            data: { cookie: bolachinha },
            success: function (response) {
                if (response.startsWith('login-failed')) {
                    localStorage.removeItem('bolachinha');
                    console.log('Token expirado')
                } else {
                    const splitPos = response.indexOf("/")
                    const splitUser = response.slice(0, splitPos)
                    const splitName = response.slice(splitPos + 1, response.length)
                    loggedinUser = splitUser;
                    leggeraLoginSucess(splitName);
                }
            }

        });

    }

}

// ############ SUBMIT LOGIN ############

const wantCookieCheckbox = document.querySelector('#cookie-checkbox')
wantCookieCheckbox.addEventListener('click', cookieCheckbox);

let wantCookie = 0
function cookieCheckbox() {
    if (wantCookie === 0) {
        wantCookie = 1;
        wantCookieCheckbox.innerText = 'check_box';
        wantCookieCheckbox.style.color = 'gold'
    } else {
        wantCookie = 0
        wantCookieCheckbox.innerText = 'check_box_outline_blank';
        wantCookieCheckbox.style.color = 'white'
    }
}

function leggeraLogin() {
    $.ajax({    //create an ajax request to display.php
        type: "POST",
        url: "assets/php/auth.php",
        dataType: "text",
        data: {
            username: currentUsername.value,
            password: document.querySelector('#password').value

        },
        success: function (response) {
            if (response.startsWith('Err')) {
                leggeraLoginFail();
            } else {
                loggedinUser = currentUsername.value;;
                leggeraLoginSucess(response);
            }
        }

    });
}


function leggeraLoginFail() {
    document.querySelector('#loading-gif').classList = 'animate__animated animate__fadeOut margin-animation-complete';

    const newTitle = document.createElement('div');
    newTitle.classList = 'animate__animated animate__fadeIn animate__delay-1s alert-label';
    newTitle.id = 'loading-title';
    newTitle.innerText = String('Credenciais inválidas').toLocaleUpperCase();
    newTitle.style.marginLeft = '-150%'

    document.querySelector('#loading-title').replaceWith(newTitle);

    const revertGifTimer = setTimeout(function () {

        document.querySelector('#loading-gif').classList = 'animate__animated animate__fadeIn margin-animation-complete';

        const revertedTitle = document.createElement('div');
        revertedTitle.classList = 'animate__animated animate__fadeIn animate__delay-1s';
        revertedTitle.id = 'loading-title';
        revertedTitle.innerText = String('Superleggera').toLocaleUpperCase();
        revertedTitle.style.marginLeft = '-150%'


        // serve para dar fix no desync entre uma tentativa errada e certa
        if (document.querySelector('#loading-title').innerText.startsWith('CREDENCIAIS INVÁLIDAS')) {
            document.querySelector('#loading-title').replaceWith(revertedTitle);
        }
    }, 4000);
}

function leggeraLoginSucess(rsp) {



    if (wantCookie === 1) {
        const fornoBolachinha = Math.random().toString(36).slice(2, 16) + Math.random().toString(36).slice(2, 16) + Math.random().toString(36).slice(2, 16);
        const novaBolachinha = JSON.stringify(fornoBolachinha);
        $.ajax({    //create an ajax request to display.php
            type: "POST",
            url: "assets/php/savecookie.php",
            dataType: "text",
            data: {
                username: document.querySelector('#username').value,
                cookie: novaBolachinha
            },
            success: function (response) {
                if (response.startsWith('cookie-login-sucessfull')) {
                    console.log('token gerado com sucesso')
                    localStorage.setItem('bolachinha', novaBolachinha)
                } else {
                    console.log('Problema ao gerar um novo token de acesso direto')
                }
            }

        });

    }


    const landingLogos = document.querySelectorAll('#loading-wrapper .animate__animated')
    const landingLogosArray = Array.from(landingLogos);

    // remover o log-in wrapper da secelção
    landingLogosArray.pop();

    // animação fadeOut para o wrapper de login
    document.querySelector('#login-wrapper').classList = ('animate__fadeOutDown animate__animated');

    // voltar a colocar o gif/título no centro da página, com delay
    setTimeout(function () {

        let marginSize;
        let newMarginSize;

        const animationToTheRight = setInterval(function () {

            for (i = 0; i < landingLogosArray.length; i++) {
                let tempPos = landingLogosArray[i].style.marginLeft.search('%');
                marginSize = landingLogosArray[i].style.marginLeft.slice(0, tempPos)
                newMarginSize = Number(marginSize) + 3;
                landingLogosArray[i].style.marginLeft = `${newMarginSize}%`;
            }

            if (Number(newMarginSize) >= '0') {
                clearInterval(animationToTheRight);
            }
        }, 5)

    }, 800)

    setTimeout(function () {
        const welcomeTitle = document.createElement('div');
        welcomeTitle.innerText = `Welcome back ${rsp}`;
        welcomeTitle.id = 'loading-title';
        welcomeTitle.classList = 'animate__animated animate__fadeIn animate__delay';
        welcomeTitle.innerText = String(welcomeTitle.innerText).toLocaleUpperCase();
        document.querySelector('#loading-title').replaceWith(welcomeTitle);
    }, 1200)

    setTimeout(function () {

        $.ajax({    //create an ajax request to display.php
            type: "GET",
            url: "assets/php/app.php",
            dataType: "text",
            success: function (rsp) {
                document.querySelector('body').innerHTML = rsp;
            }
        })
    }, 3200)

    setTimeout(function () {

        // leggera-app.js
        mixWrapper();

    }, 3500)
}