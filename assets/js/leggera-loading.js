/************************************/
/* helpcenter+ supperliggera        */
/* mambosinfinitos, 2022            */
/************************************/
let lightTheme = 1;
let userWantAlerts;
const getThemeFromCache = localStorage.getItem('lightTheme');
if (getThemeFromCache !== null) {
    lightTheme = JSON.parse(getThemeFromCache);
}
document.querySelector('#theme-css').setAttribute('href', `assets/css/style${lightTheme}.css`);
document.querySelector('#my-manuals-css').setAttribute('href', `assets/css/mymanuals${lightTheme}.css`);
document.querySelector('#hc-preview-css').setAttribute('href', `assets/css/helpcenter-preview${lightTheme}.css`);
let loggedinUser;
let currentUsername = document.querySelector('#username');
// ############ LANDING START ############
(function randomBG() {

    const rng = Math.floor(Math.random() * 1) + 1;

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
function enterPress(e) {
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
            dataType: "JSON",
            data: { cookie: bolachinha },
            success: function (response) {
                if (response.includes('Erro')) {
                    localStorage.removeItem('bolachinha');
                } else {
                    lightTheme = response[1];
                    loggedinUser = response[2];
                    localStorage.setItem('session', response[3]);
                    leggeraLoginSucess(response);
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
        if (Number(lightTheme) === 0) { wantCookieCheckbox.style.color = 'rgb(81, 63, 255)' }
        else { wantCookieCheckbox.style.color = 'gold' }
    } else {
        wantCookie = 0
        wantCookieCheckbox.innerText = 'check_box_outline_blank';
        if (Number(lightTheme) === 0) { wantCookieCheckbox.style.color = 'black' }
        else { wantCookieCheckbox.style.color = 'white' }
    }
}
function leggeraLogin() {
    $.ajax({    //create an ajax request to display.php
        type: "POST",
        url: "assets/php/auth.php",
        dataType: "JSON",
        data: {
            action: "auth",
            username: currentUsername.value,
            password: document.querySelector('#password').value
        },
        success: function (response) {
            if (response.includes('Conta inativa')) {
                leggeraLoginFail('Conta inativa');
            } else if (response.includes('Erro')) {
                leggeraLoginFail('Credenciais inválidas');
            } else {
                loggedinUser = currentUsername.value;
                lightTheme = response[1];
                let saveTheme2Cache = JSON.stringify(lightTheme);
                localStorage.setItem('lightTheme', saveTheme2Cache);
                localStorage.setItem('session', response[2]);
                leggeraLoginSucess(response);
            }
        },
        error: function (response) {
            if (response.responseText.includes('Conta inativa')) {
                leggeraLoginFail('Conta inativa');
            } else {
                leggeraLoginFail('Credenciais inválidas');
            }
        }
    });
}
function leggeraLoginFail(status) {
    document.querySelector('#loading-gif').classList = 'animate__animated animate__fadeOut margin-animation-complete';
    const newTitle = document.createElement('div');
    newTitle.classList = 'animate__animated animate__fadeIn animate__delay-1s alert-label';
    newTitle.id = 'loading-title';
    newTitle.innerText = String(status).toLocaleUpperCase();
    newTitle.style.marginLeft = '-150%'
    document.querySelector('#loading-title').replaceWith(newTitle);
    const revertGifTimer = setTimeout(function () {
        document.querySelector('#loading-gif').classList = 'animate__animated animate__fadeIn margin-animation-complete';
        const revertedTitle = document.createElement('div');
        revertedTitle.classList = 'animate__animated animate__fadeIn animate__delay-1s';
        revertedTitle.id = 'loading-title';
        revertedTitle.innerText = String('Superleggera').toLocaleUpperCase();
        revertedTitle.style.marginLeft = '-150%'
        document.querySelector('#loading-title').replaceWith(revertedTitle);
        // serve para dar fix no desync entre uma tentativa errada e certa
        if (document.querySelector('#loading-title').innerText.startsWith(status)) {
            document.querySelector('#loading-title').replaceWith(revertedTitle);
        }
    }, 4000);
}
function leggeraLoginSucess(rsp) {
    lightTheme = rsp[1];
    document.querySelector('#theme-css').setAttribute('href', `assets/css/style${lightTheme}.css`);
    document.querySelector('#my-manuals-css').setAttribute('href', `assets/css/mymanuals${lightTheme}.css`);
    document.querySelector('#hc-preview-css').setAttribute('href', `assets/css/helpcenter-preview${lightTheme}.css`);
    if (Number(lightTheme)===0 && Number(wantCookie)===1) {wantCookieCheckbox.style.color = 'rgb(81, 63, 255)'}
    const fornoBolachinha = Math.random().toString(36).slice(2, 16) + Math.random().toString(36).slice(2, 16) + Math.random().toString(36).slice(2, 16);
    const novaBolachinha = JSON.stringify(fornoBolachinha);

    if (wantCookie === 1) {
        $.ajax({    
            type: "POST",
            url: "assets/php/savecookie.php",
            dataType: "text",
            data: {
                username: document.querySelector('#username').value,
                cookie: novaBolachinha
            },
            success: function (response) {
                if (response.includes('Erro')) { console.log('Erro ao gerar cookie, login automático inativo.') }
                else { localStorage.setItem('bolachinha', novaBolachinha) }
            }
        }
        );
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
        // const rng = Math.random() * (max - min) + min+1;
        const welcomeArray = ['Mekieeee', 'Ora Boas', 'Como é que estamos', 'Vai trabalhar', 'Bora bora', 'Manuais? Aguenta', 'Grandes vidas']
        const rng = Number(Math.floor(Math.random() * 7));
        console.log(rng)
        const userFullName = rsp[0].split(' ');
        const welcomeTitle = document.createElement('div');
        welcomeTitle.innerText = `${welcomeArray[rng]} ${userFullName[0]}`;
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