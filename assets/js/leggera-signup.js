/************************************/
/* helpcenter+ supperliggera        */
/* mambosinfinitos, 2022            */
/************************************/
window.onload = setTimeout(leggeraLoading);
document.querySelector('#login-btn').addEventListener('click', leggeraSignup);
function leggeraLoading() {
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
                document.querySelector('#login-wrapper').classList = ('animate__fadeInUp animate__animated');
            }
        }, 5)
    }, 1400)
}
let userImage;
function leggeraSignup() {
    imgUpload();
    const delayForImage = setTimeout(function () {
        $.ajax({    //create an ajax request to display.php
            type: "POST",
            url: "assets/php/signup.php",
            dataType: "text",
            data: {
                username: document.querySelector('#username').value,
                password: document.querySelector('#password').value,
                nome: document.querySelector('#nome').value,
                email: document.querySelector('#email').value,
                image: userImage
            },
            success: function (response) {
                if (response.includes('reservado')) {
                    leggeraLoginFail('Utilizador reservado');
                } else if (response.toString().includes('Mailer')) {
                    leggeraLoginFail('Erro ao enviar email');
                } else if (response.toString().includes('Erro')) {
                    leggeraLoginFail('Erro de comunicação');
                } else {
                    leggeraLoginSucess('Utilizador registado');
                }
            },

            error: function (response) {
                if (response.toString().includes('reservado')) {
                    leggeraLoginFail('Utilizador reservado');
                } else if (response.toString().includes('Mailer')) {
                    leggeraLoginFail('Erro ao enviar email');
                } else {
                    leggeraLoginFail('Erro de comunicação');
                }
            }
        });
    }, 2000);
}
function leggeraLoginFail(rsp) {
    document.querySelector('#loading-gif').classList = 'animate__animated animate__fadeOut margin-animation-complete';
    const newTitle = document.createElement('div');
    newTitle.classList = 'animate__animated animate__fadeIn animate__delay-1s alert-label';
    newTitle.id = 'loading-title';
    newTitle.innerText = String(rsp).toLocaleUpperCase();
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
        if (document.querySelector('#loading-title').innerText.startsWith(rsp)) {
            document.querySelector('#loading-title').replaceWith(revertedTitle);
        }
    }, 4000);
}
function leggeraLoginSucess(rsp) {
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
        welcomeTitle.innerText = `${rsp}`;
        welcomeTitle.id = 'loading-title';
        welcomeTitle.classList = 'animate__animated animate__fadeIn animate__delay';
        welcomeTitle.innerText = String(welcomeTitle.innerText).toLocaleUpperCase();
        document.querySelector('#loading-title').replaceWith(welcomeTitle);
    }, 1200)


}

function imgUpload() {
    const formData = new FormData();
    const files = $('#file-upload-input')[0].files;
    formData.append('file', files[0]);
    $.ajax({
        url: 'assets/php/file-upload.php',
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response != 0) {
                return userImage=response;
            } else { return '' }
        }
    });
}