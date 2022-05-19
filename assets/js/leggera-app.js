/************************************/
/* supperleggera                    */
/* mambosinfinitos, 2022            */
/* featurelist:
    - helpcenter preview
    - helpcenter darkmode (vista de edição, o código gerado continua 100% compatível com o helpcenter live)
    - injetor caixas texto (v2, com idons do material)
    - injetor de icons (v2, ions do material) com seletor de cor
    - injetor de buttons com seletor de tema
    - construtor de listas numeradas, não numeradas, e com links
    - construtor de tabelas, com selector de estilos e injeção dos <style> necessários 
        (inclui comentários informativos)
    - injetor de imagens
    - injetor de <hr> (separador horizontal)
    - injetor de títulos
    - construtor de links
    - editor live na vista principal 
        (atualização ao vivo do preview com a posição do cursor + com o que foi acabado de escrever + introdução de <br> ao carregar Enter)
        (limite de 100.000 caracteres, para evitar a baixa performance em tópicos muito longos)
        (inclui alerta [pulse vermelho] para icons fontawesome + topiclink [conteúdos antigos])
    - construtor/editor live de colapsáveis 
        (inclui reformatação automática dos colapsáveis de tópicos antigos, para adicionar ligação ao título do colapsável ao gravar as alterações efetuadas)
    - ligação api hilite.me c/ formatação automática para helpcenter 
        (inclui indentação json, vb.net e typescript compatível com o HelpCenter)
    - importação & conversão de tabelas 
        (remove os estilos que a tabela importada tem, e aplica o que estiver definido)
    - autosave / autoload - grava o tópico em cache quando clickamos ou escrevemos na textarea principal. 
        (ao carregar a página, vai buscar o tópico que ficou em cache caso exista)
    - quicksave / quickload 
        (segundo slot da cache, disponível através das ações respetivas)
    - userstats - mostra estatísticas do utilizador quando não foi encontrado nenhum tópico de manual
    - cleancode™ - formatação de todos os códigos injetados, de modo a adicionar quebras de linha onde justificável, de modo a tornar o código mais legível fora da aplicação 
    - titlescroller - flashback aos tempos do myspace e hi5. groovy af. 
    - gestão completa de utilizadores 
        (páginas para signup, reset password, activate account, login)
        (incluí envio de email aquando do registo [para ativar a conta] + envio de email para resetar a password)
    - cookie login (aka mantenha a sessão iniciada)
    - myManuals™ 
        (permite carregar, criar/atualizar e apagar novos tópicos)
        (incluí searchbox [v2, suporta procura incluída]) 
    
/************************************/
// Wrapper principal a ser invocado no login
function mixWrapper() {


    // ################ variáveis globais da aplicação

    const leggeraVariables = {
        // textarea principal
        textarea: document.querySelector('textarea'),
        // area de controlos
        appControls: document.querySelector('#app-controls-wrapper'),
        // preview helpcenter
        hcPreview: document.querySelector('#helpcenter-preview'),
        // arrays a serem utilizados para guardar os slices das textareas, aquando da introdução de elementos
        stringCursor: [],
        stringCursorColap: [],
        // Array onde vão ser guardados os colapsáveis existentes (.row .seccao-phcgo) a ser utilizado para a construção da vista de colapsáveis
        colapList: [],
        // variável com o valor da última textarea selecionada
        activeTextarea: '',
        // variável com o tipo de código selecionado para a construção da caixa de código HILITE.ME
        codeType: 'vbnet',
        // variável com o tipo de código selecionado para a construção da tabelas
        tableType: 'normal-table',
        // variável com a cor selecionada para introdução de icons 
        currentColor: '#000000',
        // variável com o tema selecionado para introdução de botões
        currentTheme: 'horizon',
        // variável de controlo do autosave (a ser utilizado quando temos um tópico com 100.000+ chars)
        limitExceded: 0,
        // variável com o tema atual do leggera (lightTheme vem do leggera-loading.js)
        currentLeggeraTheme: lightTheme,
        // variável com a resposta do servidor com as estatísticas do utilizador
        userInfo: '',
    }


    // ################ métodos a aplicar no preview do helpcenter (alertas + darkmode)

    const leggeraPreviewAdjustments = {
        // método principal, executa todos os métodos seguintes
        execute: function (convertedPreview) {
            if (Number(userWantAlerts) === 1) {
                convertedPreview = leggeraPreviewAdjustments.oldRelatedTopics(convertedPreview);
                convertedPreview = leggeraPreviewAdjustments.oldFontawesomeIcons(convertedPreview);
                convertedPreview = leggeraPreviewAdjustments.topicLinkAlert(convertedPreview);
            }
            convertedPreview = leggeraPreviewAdjustments.lightThemePreview(convertedPreview);
            return convertedPreview
        },
        // alerta topiclink
        topicLinkAlert: function (convertedPreview) {
            convertedPreview = convertedPreview.replaceAll('<%=', '<span class="alerta-replaceme"><%=');
            convertedPreview = convertedPreview.replaceAll('%>', '%></span>');
            return convertedPreview
        },
        // alerta icon antigo tópicos relacionados
        oldRelatedTopics: function (convertedPreview) {
            convertedPreview = convertedPreview.replaceAll('<img id="img_conteudo" src="../pimages/go/artigo.svg" alt="PHC GO" class="menu-top-logo-ptxview" style="margin-top:-5px;margin-right:2px;height:20px;width:auto;">', '<span class="alerta-replaceme"><i class="fa fa-file-text-o"></i></span>');
            return convertedPreview
        },
        // alerta icons antigos (fontawesome)
        oldFontawesomeIcons: function (convertedPreview) {
            const allFontawesomeIcons = document.querySelectorAll('.fa');
            for (i = 0; i < allFontawesomeIcons.length; i++) {
                // Como estou a fazer replace all (teve de ser, caso contrário o replace vai sempre selecionar o primeiro icon [no caso do mesmo icon surgir repetido]), dá skip caso já tenha introduzido o alerta anteriormente
                if (convertedPreview.includes(`<span class="alerta-replaceme">${allFontawesomeIcons[i].outerHTML}`)) {
                    continue;
                } else {
                    convertedPreview = convertedPreview.replaceAll(allFontawesomeIcons[i].outerHTML, `<span class="alerta-replaceme">${allFontawesomeIcons[i].outerHTML}</span>`);
                }
            }
            return convertedPreview
        },
        // método para efetuar alterações de contraste
        lightThemePreview: function (convertedPreview) {
            // só faz as alterações ao tema 0 (lightTheme[0] = Editor claro, preview escuro || lightTheme[1] = Editor escuro, preview claro)
            if (Number(lightTheme) === 0) {
                // black & white switcheroo
                convertedPreview = convertedPreview.replaceAll('rgb(0, 0, 0);" class="material-icons">', 'rgb(TEMP, TEMP, TEMP);" class="material-icons">');
                convertedPreview = convertedPreview.replaceAll('rgb(224, 224, 224);" class="material-icons">', 'rgb(40, 40, 40);" class="material-icons">');
                convertedPreview = convertedPreview.replaceAll('rgb(TEMP, TEMP, TEMP);" class="material-icons">', 'rgb(224, 224, 224);" class="material-icons">');
                // contraste no azul 
                convertedPreview = convertedPreview.replaceAll('rgb(26, 35, 126);" class="material-icons">', 'rgb(62, 112, 230);" class="material-icons">');
                // contraste no verde
                convertedPreview = convertedPreview.replaceAll('rgb(0, 77, 64);" class="material-icons">', 'rgb(0, 125, 104);" class="material-icons">');
                // contraste no <hr>
                convertedPreview = convertedPreview.replaceAll('solid rgb(238, 238, 238);', 'solid rgb(50, 50, 50);');
                // ajuste backgroudn tabelas
                convertedPreview = convertedPreview.replaceAll(';border:solid 2px #fff;', ';border:solid 2px #111;');
                // ajuste na codebox do HiliteAPI 
                convertedPreview = convertedPreview.replaceAll(';border:solid #eb8475;', ';border:solid #147b8a;');
            }
            return convertedPreview;
        }
    }


    // ################ métodos vários da aplicação 
    const leggeraMethods = {

        // document.querySelector mais curta
        quepassa: function (selector, func, tipo = 'click') {
            if (selector instanceof String) {
                return document.querySelector(selector).addEventListener(tipo, func);
            } else {
                return selector.addEventListener(tipo, func);
            }
        },
        // document.createElement, mais turbinada senão nunca mais saía daqui paixão kkkkkkkkk
        mambo: function (ele, id = '', classlist = '', inner = '') {
            const elementGenerated = document.createElement(`${ele}`);
            if (id !== '') { elementGenerated.id = `${id}` }
            if (classlist !== '') { elementGenerated.classList = `${classlist}` }
            if (inner !== '') { elementGenerated.innerHTML = `${inner}` }
            return elementGenerated
        },
        // cartão com estatísticas de utilizador, exibido quando a textarea está vazia (executado on load, e ao mudar de tema)
        getUserInfo: function () {
            $.ajax({
                type: "POST",
                url: "assets/php/userinfo.php",
                dataType: "JSON",
                data: {
                    action: 'userstats',
                    username: loggedinUser
                },
                success: function (rsp) {
                    leggeraVariables.userInfo = rsp[0];
                    userWantAlerts = rsp[1];
                },
                error: function (rsp) {
                    leggeraVariables.userInfo = rsp[0];
                    userWantAlerts = rsp[1];
                }
            })
        },
        // método principal para injetar o código HTML do elemento selecionado, na última posição do cursor
        escreveNaTextarea: function (outerHTML) {
            let novoSourceCode;
            // babyproof
            if (leggeraVariables.activeTextarea === '') { alert('Coloca o cursor numa área de texto antes de adicionar conteúdos.'); return }
            // O array stringCursor é composto por duas string, antes e depois do cursor
            // O novoSourceCode faz o concat das string, com o elemento a ser escrito na posição do cursor.
            novoSourceCode = `${leggeraVariables.stringCursor[0]}` + "\n" + `${outerHTML}` + "\n" + `${leggeraVariables.stringCursor[1]}`;
            if (leggeraVariables.activeTextarea.id === 'textarea') {
                // se foi uma quebra de linha, troca a ordem de introdução das cenas (a quebra de linha vem depois do br)
                // if (outerHTML === '<br>') { novoSourceCode = `${leggeraVariables.stringCursor[0]}` + `${outerHTML}` + "\n" + `${leggeraVariables.stringCursor[1]}`; return }
                // Atualiza a textarea
                leggeraVariables.textarea.value = novoSourceCode;
                // Atualiza o preview
                leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(novoSourceCode);
                // Atualiza a vista de colapsáveis
                appControlsColap();
                // Guarda as alterações em cache
                leggeraMethods.autosave2JSON();
            }
            // caso seja as textareas da vista de collaps 
            else {
                // o array stringCursorColap funciona de igual maneira ao stringCursor
                novoSourceCode = `${leggeraVariables.stringCursorColap[0]}` + "\n" + `${outerHTML}` + "\n" + `${leggeraVariables.stringCursorColap[1]}`;
                // Atualiza a textarea
                leggeraVariables.activeTextarea.value = novoSourceCode;
                //  Atualiza o preview respetivo á textbox selecionada
                let inputPreview = leggeraVariables.activeTextarea.parentElement.nextElementSibling.children[1];
                inputPreview.innerHTML = novoSourceCode;
            }
        },
        // método para guardar na cache do browser o código HTML do tópico presente na textarea
        autosave2JSON: function () {
            let textarea2JSON = JSON.stringify(leggeraVariables.textarea.value);
            localStorage.setItem('textarea', textarea2JSON);
        },
        // método para obter a posição do cursor
        getCursorPos: function (e) {
            let eTarget = e.target;
            let cursorPos = eTarget.selectionStart;
            return cursorPos
        },
        // método para ancorar o cabeçalho do editor
        stickyTop: function () {
            const header = document.querySelector('.header');
            const ancoraBtn = document.querySelector('#ancora-btn');
            if (header.classList.contains('sticky-top')) {
                header.classList.remove('sticky-top');
                ancoraBtn.classList.replace('btn-info', 'btn-light');
            } else {
                header.classList.add('sticky-top');
                ancoraBtn.classList.replace('btn-light', 'btn-info');
            }
        },
        // método para injetar um <br> ao carregar Enter
        newBr: function (e) {
            if (e.target.tagName === 'TEXTAREA' && e.key === 'Enter') {
                leggeraMethods.escreveNaTextarea('<br>');
            }
        },
        // método para atualiza o preview, textarea e os previews manualmente (a ser utilizado quando o tópico tem 100.000+ chars)
        saveByPreviewBtn: function () {
            // altera a textarea utilizada
            leggeraVariables.activeTextarea = leggeraVariables.textarea;
            let novoSourceCode = leggeraVariables.textarea.value;
            // Atualiza o preview
            leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(novoSourceCode);
            // Atualiza a vista de colapsáveis
            appControlsColap();
            // Guarda as alterações em cache
            leggeraMethods.autosave2JSON();
        },
        // método do auto-scroller
        titleScrol: setInterval(function () {
            let tituloPagina = document.title.toString();
            const updatedTituloPagina1 = tituloPagina.slice(0, 1)
            const updatedTituloPagina2 = tituloPagina.slice(1, tituloPagina.length)
            document.title = updatedTituloPagina2 + updatedTituloPagina1
        }, 500),
        // método para atualizar o tipo de código selecionado (Hilite.me API)
        updateCodeType: function (e) {

            leggeraVariables.codeType = e.target.id
            console.log(leggeraVariables.codeType)
        },
        // método para atualizar o tipo de tabela selecionado
        updateTableType: function (e) {
            leggeraVariables.tableType = e.target.id
        },
        // método para guardar o tópico num segundo slot da chache
        quickSave: function () {
            const textarea2JSON = JSON.stringify(leggeraVariables.textarea.value);
            localStorage.setItem('quickSave', textarea2JSON);
            leggeraVariables.textarea.value = '';
            // caso a textarea esteja vazia, adiciona o cartão com estatísticas do utilizador
            leggeraVariables.hcPreview.innerHTML = '';
            leggeraMethods.displayUserStats();
            appControlsColap();
            leggeraVariables.stringCursor = ['', ''];
            // Guarda as alterações em cache
            leggeraMethods.autosave2JSON();
        },
        // método para carregar o tópico presente no segundo slot da chache
        quickLoad: function () {
            const getTextareaFromJSON = localStorage.getItem('quickSave');
            // Atualiza a textarea
            leggeraVariables.textarea.value = JSON.parse(getTextareaFromJSON);
            // Atualiza o preview
            leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
            // Atualiza a vista de colapsáveis
            appControlsColap();
            // Guarda as alterações em cache
            leggeraMethods.autosave2JSON();
        },
        // método para limpar a área de controlos, e iniciar o contador de páginas da área selecionada
        appControlsChange: function () {
            // Limpar o div dos appControls
            leggeraVariables.appControls.innerHTML = '';
            // Iniciar contador paginador (a ser utilizado no futuro, caso os elementos não caibam todos numa só página de appControls)
            return pag = 1;
        },
        // método para atualizar o botão do menu conforme a área de controlos selecioanda
        updateWhereIAm: function (e) {
            let eTarget = e.target;
            const menus = document.querySelectorAll('.main-menu');
            // estamos a colocar todos os botões no tema light
            for (menu of menus) { menu.classList = 'btn btn-light main-menu' }
            // babyproof para quando carregamos exatamente no icon do botão
            if (eTarget.tagName === "I") { eTarget = eTarget.parentElement }
            // alterar o tema do botão carregado para o tema info
            eTarget.classList = 'btn btn-info main-menu'
        },
        // método para fazer logout
        logout: function () {
            localStorage.removeItem('bolachinha');
            localStorage.removeItem('lightTheme');
            location.reload();
        },
        // método para alterar o tema da aplicação
        changeLeggeraTheme: function () {
            if (Number(lightTheme) === 0) { lightTheme = 1; }
            else { lightTheme = 0; }
            document.querySelector('#theme-css').setAttribute('href', `assets/css/style${lightTheme}.css`);
            document.querySelector('#my-manuals-css').setAttribute('href', `assets/css/mymanuals${lightTheme}.css`);
            document.querySelector('#hc-preview-css').setAttribute('href', `assets/css/helpcenter-preview${lightTheme}.css`);
            if (!document.querySelector('.hc-preview').classList.contains('no-display')) {
                leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
            }
            // caso a textarea esteja vazia, adiciona o cartão com estatísticas do utilizador
            if (leggeraVariables.hcPreview.innerHTML == '') {
                leggeraMethods.displayUserStats();
            }
            // atualiza o appControls do menu ativo, para mostrar as alterações de contraste 
            if (document.querySelector('.btn.btn-info.main-menu') !== null) { document.querySelector('.btn.btn-info.main-menu').click(); };
            // atualiza o tema do utilizador
            $.ajax({
                type: "POST",
                url: "assets/php/userinfo.php",
                dataType: "JSON",
                data: {
                    action: 'theme-update',
                    username: loggedinUser,
                    theme: lightTheme
                },
                success: function (rsp) {
                    leggeraVariables.hcPreview.innerHTML = '';
                    leggeraMethods.displayUserStats();
                },
                error: function (rsp) {
                    leggeraVariables.hcPreview.innerHTML = '';
                    leggeraMethods.displayUserStats();
                }
            })
        },
        updateWantAlerts: function () {
            if (Number(userWantAlerts) === 1) {
                console.log(`só lá, eu tinha o want alerts a: ${userWantAlerts}`)
                userWantAlerts = 0;
                console.log(`só lá, eu agora tenho o want alerts a: ${userWantAlerts}`)
                $.ajax({
                    type: "POST",
                    url: "assets/php/userinfo.php",
                    dataType: "JSON",
                    data: {
                        action: 'alerts-update',
                        username: loggedinUser,
                        alerts: userWantAlerts
                    },
                    success: function (rsp) {
                        leggeraVariables.hcPreview.innerHTML = '';
                        leggeraMethods.displayUserStats();
                    },
                    error: function (rsp) {
                        leggeraVariables.hcPreview.innerHTML = '';
                        leggeraMethods.displayUserStats();
                    }
                })
            } else {
                console.log(`só lá, eu tinha o want alerts a: ${userWantAlerts}`)
                userWantAlerts = 1;
                console.log(`só lá, eu agora tenho o want alerts a: ${userWantAlerts}`)
                $.ajax({
                    type: "POST",
                    url: "assets/php/userinfo.php",
                    dataType: "JSON",
                    data: {
                        action: 'alerts-update',
                        username: loggedinUser,
                        alerts: userWantAlerts
                    },
                    success: function (rsp) {
                        leggeraVariables.hcPreview.innerHTML = '';
                        leggeraMethods.displayUserStats();
                    },
                    error: function (rsp) {
                        leggeraVariables.hcPreview.innerHTML = '';
                        leggeraMethods.displayUserStats();
                    }
                })
            }
        },
        displayUserStats: function () {
            // caso a textarea esteja vazia, adiciona o cartão com estatísticas do utilizador
            const userPanelWrapper = leggeraVariables.hcPreview.appendChild(leggeraMethods.mambo('div', 'user-panel-container', '', `${leggeraVariables.userInfo}`));
            const userOptions = userPanelWrapper.appendChild(leggeraMethods.mambo('div', 'user-options', '', 'Alerta conteúdos antigos&nbsp;&nbsp;&nbsp;&nbsp;'));
            let alertToggle;
            let wantAlertsOption;
            let wantAlertsOptionBG;

            switch (Number(userWantAlerts)) {
                case 0:
                    alertToggle = userOptions.appendChild(leggeraMethods.mambo('span', 'alerts-toggle', `mix-toggle-${userWantAlerts}`));
                    wantAlertsOption = alertToggle.appendChild(leggeraMethods.mambo('span', 'wantalerts-radio-option', 'material-icons animate__animated animate__slideInRight', 'cancel'));
                    wantAlertsOption.style.color = 'rgb(104, 1, 1)'
                    wantAlertsOptionBG = alertToggle.appendChild(leggeraMethods.mambo('span', 'wantalerts-radio-option-bg', 'animate__animated animate__slideInRight'));
                    alertToggle.addEventListener('click', leggeraMethods.updateWantAlerts)
                    break;
                case 1:
                    alertToggle = userOptions.appendChild(leggeraMethods.mambo('span', 'alerts-toggle', `mix-toggle-${userWantAlerts}`));
                    wantAlertsOption = alertToggle.appendChild(leggeraMethods.mambo('span', 'wantalerts-radio-option', 'material-icons animate__animated animate__slideInLeft', 'check_circle'));
                    wantAlertsOption.style.color = 'rgb(1, 100, 1)'
                    wantAlertsOptionBG = alertToggle.appendChild(leggeraMethods.mambo('span', 'wantalerts-radio-option-bg', 'animate__animated animate__slideInLeft'));
                    alertToggle.addEventListener('click', leggeraMethods.updateWantAlerts)
                    break;
            }

            const userOptions2 = userPanelWrapper.appendChild(leggeraMethods.mambo('div', 'user-options-2', '', 'Tema escuro&nbsp;&nbsp;&nbsp;&nbsp;'));

            switch (Number(lightTheme)) {
                case 1:
                    alertToggle = userOptions2.appendChild(leggeraMethods.mambo('span', 'darktheme-toggle', `mix-toggle-0`));
                    wantAlertsOption = alertToggle.appendChild(leggeraMethods.mambo('span', 'wantalerts-radio-option-2', 'material-icons animate__animated animate__slideInRight', 'cancel'));
                    wantAlertsOption.style.color = 'rgb(104, 1, 1)'
                    wantAlertsOptionBG = alertToggle.appendChild(leggeraMethods.mambo('span', 'wantalerts-radio-option-bg-2', 'animate__animated animate__slideInRight'));
                    alertToggle.addEventListener('click', leggeraMethods.changeLeggeraTheme)
                    break;
                case 0:
                    alertToggle = userOptions2.appendChild(leggeraMethods.mambo('span', 'darktheme-toggle', `mix-toggle-1`));
                    wantAlertsOption = alertToggle.appendChild(leggeraMethods.mambo('span', 'wantalerts-radio-option-2', 'material-icons animate__animated animate__slideInLeft', 'check_circle'));
                    wantAlertsOption.style.color = 'rgb(1, 100, 1)'
                    wantAlertsOptionBG = alertToggle.appendChild(leggeraMethods.mambo('span', 'wantalerts-radio-option-bg-2', 'animate__animated animate__slideInLeft'));
                    alertToggle.addEventListener('click', leggeraMethods.changeLeggeraTheme)
                    break;
            }
        }
    }


    // ################ métodos para atualizar o preview com o cursor laranja/azul
    const leggeraUpdatePreviews = {
        execute: function (e) {
            // babyproof caso existam alterações pendentes na vista colapsáveis
            if (botaoVistaColap.classList.contains('btn-info')) {
                leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');
                for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                    let saveBtn = document.querySelector(`#colap-save-btn-${i}`);
                    if (saveBtn.classList.contains('no-display') == false) {
                        alert(`Não é possível aceder à textarea principal, enquanto existirem alterações pendentes.`); return
                    }
                }
            }
            // obtem a textarea selecionada
            leggeraVariables.activeTextarea = e.target;
            let inputText = leggeraVariables.textarea.value;
            // caso o tópico seja curto, atualiza on-the-fly o preview, e guarda em cache
            if (inputText.length <= 100000) {
                document.querySelector('#preview-btn').classList.add('no-display')
                leggeraVariables.limitExceded = 0;
                let cursorPos = leggeraMethods.getCursorPos(e);
                let inputTextString1 = inputText.slice(0, cursorPos)
                let inputTextString2 = inputText.slice(cursorPos, inputText.length)
                let inputTextWithCursor = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;
                leggeraVariables.stringCursor[0] = inputTextString1;
                leggeraVariables.stringCursor[1] = inputTextString2;
                leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(inputTextWithCursor);
                appControlsColap();
                leggeraMethods.autosave2JSON();
                // caso contrário, não atualiza on-the-fly o preview, nem guarda em cache
            } else {
                // on-time warning
                if (leggeraVariables.limitExceded === 0) {
                    document.querySelector('#preview-btn').classList.remove('no-display');
                    alert(`Foi excedido o limite máximo de caractéres aceites pelo Autosave.\nPara pre-visualizar e guardar em cache as alterações efetuadas, carrega em "Preview", localizado ao lado esquerdo do botão "QuickSave".`)
                }
                leggeraVariables.limitExceded = 1;
                let cursorPos = leggeraMethods.getCursorPos(e);
                let inputTextString1 = inputText.slice(0, cursorPos);
                let inputTextString2 = inputText.slice(cursorPos);
                leggeraVariables.stringCursor[0] = inputTextString1;
                leggeraVariables.stringCursor[1] = inputTextString2;
            }
        }
    }


    // ################ myManuals
    const leggeraManuais = {
        manuaisUtilizador: [],
        // método para buscar os manuais que o utilizador tem em BD
        getManuals: function () {
            $.ajax({
                type: "POST",
                url: "assets/php/manualslist.php",
                dataType: "JSON",
                data: { username: loggedinUser },
                success: function (rsp) {
                    // Modal com os manuais recebidos de BD
                    leggeraManuais.myManuals(rsp);
                    // variável com o número de manuais do utilizador
                    leggeraManuais.manuaisUtilizador = rsp[1];
                    for (i = 0; i < rsp.length; i++) {
                        // por cada manual, manda o código dos manuais para array, a ser utilizada para a procura contida
                        // quando só existia um manual o gajo estava a mandar erro, nao tava a perceber por isso adicionei o try
                        try { leggeraManuais.manuaisUtilizador[i] = (rsp[i].code.toString()); }
                        catch { }
                    }
                },
                error: function (rsp) {
                    // Modal com os manuais recebidos de BD
                    leggeraManuais.myManuals(rsp);
                    // variável com o número de manuais do utilizador
                    leggeraManuais.manuaisUtilizador = rsp[1];
                    for (i = 0; i < rsp.length; i++) {
                        // por cada manual, manda o código dos manuais para array, a ser utilizada para a procura contida
                        // quando só existia um manual o gajo estava a mandar erro, nao tava a perceber por isso adicionei o try
                        try { leggeraManuais.manuaisUtilizador[i] = (rsp[i].code.toString()); }
                        catch { }
                    }
                }
            })
        },
        // método para a caixa de procura dos manuais
        myManualsFilterResults: function () {
            const keyword = document.querySelector('#save-manual-input').value.toLowerCase().split(" ");
            const numManuais = document.querySelector('#modal-container tbody').childElementCount;
            if (document.querySelector('#procura-contida').checked) {
                for (i = 1; i <= numManuais; i++) {
                    for (x = 0; x < keyword.length; x++) {
                        if (leggeraManuais.manuaisUtilizador[i - 1].toLowerCase().includes(keyword[x])) {
                            document.querySelector('#modal-container tbody').children[i - 1].classList.remove('no-display');
                        } else {
                            document.querySelector('#modal-container tbody').children[i - 1].classList.add('no-display');
                            break
                        }
                    }
                }
            } else {
                for (i = 1; i <= numManuais; i++) {
                    for (x = 0; x < keyword.length; x++) {
                        if (document.querySelector('#modal-container tbody').children[i - 1].children[0].innerText.toLowerCase().includes(keyword[x])) {
                            document.querySelector('#modal-container tbody').children[i - 1].classList.remove('no-display');
                        } else {
                            document.querySelector('#modal-container tbody').children[i - 1].classList.add('no-display');
                            break
                        }
                    }
                };
            }
        },
        // Constroi a modal com os manuais recebidos da DB
        myManuals: function (rsp) {
            // oculta a app
            const sectionsArray = document.querySelectorAll('section');
            for (i = 0; i < sectionsArray.length; i++) {
                if (!sectionsArray[i].classList.contains('no-display')) { sectionsArray[i].classList.add('no-display') }
            }
            const modal = document.querySelector('body').appendChild(leggeraMethods.mambo('div', 'manuals-modal', '', ''));
            const saveManualModal = modal.appendChild(leggeraMethods.mambo('div', 'savemanual-container', 'row', ''));
            const leftWrapper = saveManualModal.appendChild(leggeraMethods.mambo('div', '', 'col-md-8 text-left', ''));
            leftWrapper.appendChild(leggeraMethods.mambo('h1', '', '', 'Nome do manual'));
            leftWrapper.appendChild(leggeraMethods.mambo('input', 'save-manual-input', '', ''));
            leftWrapper.lastChild.addEventListener('keyup', leggeraManuais.myManualsFilterResults);
            const midWrapper = saveManualModal.appendChild(leggeraMethods.mambo('div', '', 'col-md-2 text-left', ''));
            midWrapper.appendChild(leggeraMethods.mambo('button', 'save-manual-btn', 'btn btn-success', "<i class='lni lni-save'></i>&nbsp;&nbsp;Guardar Manual"));
            midWrapper.lastChild.addEventListener('click', leggeraManuais.saveManual)
            const rightWrapper = saveManualModal.appendChild(leggeraMethods.mambo('div', 'close-myManuals-wrapper', 'col-md-2 text-right', ''));
            rightWrapper.appendChild(leggeraMethods.mambo('button', 'save-manual-btn', 'btn btn-light', '<i class="lni lni-reply"></i>&nbsp;&nbsp;Voltar ao editor'));
            rightWrapper.lastChild.addEventListener('click', leggeraManuais.backHome)
            leftWrapper.appendChild(leggeraMethods.mambo('div', 'contida-wrapper', '', ''));
            const procuraContida = leftWrapper.lastChild.appendChild(leggeraMethods.mambo('input', 'procura-contida', '', ''));
            procuraContida.setAttribute('type', 'checkbox');
            leftWrapper.lastChild.innerHTML = leftWrapper.lastChild.innerHTML + '&nbsp;&nbsp;&nbsp;Procura contida?';
            const manualsWrapper = modal.appendChild(leggeraMethods.mambo('div', 'my-manuals-wrapper', '', ''));
            const modalTable = manualsWrapper.appendChild(leggeraMethods.mambo('table', 'modal-container', '', ''));
            const modalHeader = modalTable.appendChild(leggeraMethods.mambo('thead', '', '', ''));
            modalHeader.appendChild(leggeraMethods.mambo('th', '', '', 'Título do Manual'))
            modalHeader.appendChild(leggeraMethods.mambo('th', '', 'text-right', 'Última atualização'))
            modalHeader.appendChild(leggeraMethods.mambo('th', '', '', ''))
            modalHeader.appendChild(leggeraMethods.mambo('th', '', '', ''))
            const modalBody = modalTable.appendChild(leggeraMethods.mambo('tbody', '', '', ''));
            for (i = 0; i < rsp.length; i++) {
                let modalRow = modalBody.appendChild(leggeraMethods.mambo('tr', `manual-${i + 1}`, `animate__animated animate__fadeInUp`, ''))
                if (i % 2 === 0) { modalRow.classList.add('manual-impar') } else { modalRow.classList.add('manual-par') }
                modalRow.setAttribute('style', `--animate-delay: ${(i + 1) * 0.2}s`)
                modalRow.appendChild(leggeraMethods.mambo('td', '', '', rsp[i].title))
                modalRow.lastChild.addEventListener('click', function (e) {
                    leggeraManuais.getManualCode(e, rsp);
                });
                let data = new Date(Number(rsp[i].timestamp));
                modalRow.appendChild(leggeraMethods.mambo('td', '', '', `${data.toLocaleDateString('pt-PT', { dateStyle: 'short' })} @ ${data.toLocaleTimeString('pt-PT', { timeStyle: 'short' })}`))
                modalRow.appendChild(leggeraMethods.mambo('td', '', '', `<i class="lni lni-save"></i>`))
                modalRow.lastChild.addEventListener('click', leggeraManuais.saveManual);
                modalRow.appendChild(leggeraMethods.mambo('td', '', '', `<i class="lni lni-eraser"></i>`))
                modalRow.lastChild.addEventListener('click', leggeraManuais.deleteManual);
            }
        },
        // Vai buscar o código HTML do código selecionado
        getManualCode: function (e, rsp) {
            const manualID = e.target.parentElement.id;
            // mostra a app
            const sectionsArray = document.querySelectorAll('section');
            for (i = 0; i < sectionsArray.length; i++) {
                sectionsArray[i].classList.remove('no-display')
            }
            document.querySelector('#manuals-modal').remove();
            leggeraVariables.textarea.value = rsp[Number(manualID.slice(7, manualID.length)) - 1].code;
            // Atualiza o preview
            leggeraVariables.hcPreview.innerHTML = leggeraVariables.textarea.value;
            leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
            appControlsColap();
            // Guarda as alterações em cache
            leggeraMethods.autosave2JSON();
        },
        saveManual: function (e) {
            let manualName = document.querySelector('#save-manual-input').value;
            if (e.target.tagName === "TD") { manualName = e.target.parentElement.firstChild.innerText };
            if (e.target.tagName === "I") { manualName = e.target.parentElement.parentElement.firstChild.innerText };
            $.ajax({
                type: "POST",
                url: "assets/php/manualsupdate.php",
                dataType: "text",
                data: {
                    username: loggedinUser,
                    manual: manualName,
                    timestamp: Date.now(),
                    action: 'save',
                    code: document.querySelector('#textarea').value
                },
                success: function (rsp) {
                    if (rsp.startsWith('Err')) { console.log('fudeu') }
                    else if (rsp.includes('atual')) {
                        alert('tópico atualizado com sucesso');
                        // mostra a app
                        const sectionsArray = document.querySelectorAll('section');
                        for (i = 0; i < sectionsArray.length; i++) { sectionsArray[i].classList.remove('no-display') }
                        document.querySelector('#manuals-modal').remove();
                    } else {
                        alert('tópico criado com sucesso');
                        // mostra a app
                        const sectionsArray = document.querySelectorAll('section');
                        for (i = 0; i < sectionsArray.length; i++) { sectionsArray[i].classList.remove('no-display') }
                        document.querySelector('#manuals-modal').remove();
                    }
                }
            })
        },
        backHome: function () {
            const sectionsArray = document.querySelectorAll('section');
            for (i = 0; i < sectionsArray.length; i++) { sectionsArray[i].classList.remove('no-display') }
            document.querySelector('#manuals-modal').remove();
        },
        deleteManual: function (e) {
            let eTarget = e.target;
            // babyproof para quando carregamos exatamente no icon do botão
            if (e.target.tagName === "I") { eTarget = e.target.parentElement; }
            const wantToDelete = prompt(`Para excluír o tópico ${eTarget.parentElement.firstChild.innerText}, escreve "apagar":`);
            if (wantToDelete === 'apagar') {
                $.ajax({
                    type: "POST",
                    url: "assets/php/manualsupdate.php",
                    dataType: "text",
                    data: {
                        username: loggedinUser,
                        manual: eTarget.parentElement.firstChild.innerText,
                        timestamp: Date.now(),
                        action: 'delete'
                    },
                    success: function (rsp) {
                        if (rsp.startsWith('Err')) { console.log('fudeu') }
                        else {
                            alert('tópico removido com sucesso');
                            const sectionsArray = document.querySelectorAll('section');
                            for (i = 0; i < sectionsArray.length; i++) { sectionsArray[i].classList.remove('no-display') }
                            document.querySelector('#manuals-modal').remove();
                        }
                    }
                })
            } else { return }
        }
    }


    // ################ go assets 

    const leggeraGOAssets = {
        // arrays para guardar os assets do GO
        iconsFromDB: [],
        textboxesFromDB: [],
        buttonsFromDB: [],
        // vai buscar os assets todos
        grabThemAll: function () {
            $.ajax({
                type: "POST",
                url: "assets/php/assetsgo.php",
                dataType: "JSON",
                data: { action: 'icons' },
                success: function (rsp) { for (i = 0; i < rsp.length; i++) { leggeraGOAssets.iconsFromDB[i] = rsp[i]; } }
            })
            $.ajax({
                type: "POST",
                url: "assets/php/assetsgo.php",
                dataType: "JSON",
                data: { action: 'textboxes' },
                success: function (rsp) { for (i = 0; i < rsp.length; i++) { leggeraGOAssets.textboxesFromDB[i] = rsp[i]; } }
            })
            $.ajax({
                type: "POST",
                url: "assets/php/assetsgo.php",
                dataType: "JSON",
                data: { action: 'buttons' },
                success: function (rsp) { leggeraGOAssets.buttonsFromDB = rsp; }
            })
        }
    }


    // ################ método para chamadas API c/ Hilite.me

    const leggeraHiliteAPI = {
        post: function () {
            // Babyproof
            if (document.querySelector('#hilite-textarea').value.length <= 0) { alert('A textarea para o código hilite.me está vazia.'); return }
            const code = document.querySelector('#hilite-textarea').value.toString();
            let wantLines;
            if (document.querySelector('#line-numbers').checked) { wantLines = 'true'; }
            $.ajax({
                type: "POST",
                url: "http://hilite.me/api",
                dataType: "text",
                data: {
                    code: code,
                    style: 'monokai',
                    lexer: leggeraVariables.codeType,
                    divstyles: 'border:solid #eb8475;border-width:.1em .1em .1em .8em;padding:.2em .6em;',
                    linenos: wantLines
                },
                success: function (response) { leggeraHiliteAPI.hiliteFormater(response); }
            })
        },
        // Formatar a resposta obtida
        hiliteFormater: function (novosource) {
            let fixedHilite = String(novosource).replaceAll("\n", '<br>' + "\n");
            // 4 spaces
            fixedHilite = fixedHilite.replaceAll('    ', '<div style="display:inline-block;width:20px;"></div>')
            // tab
            fixedHilite = fixedHilite.replaceAll('	', '<div style="display:inline-block;width:20px;"></div>')
            // compatibilidade helpcenter
            fixedHilite = fixedHilite.replaceAll('<pre style="', '<pre style="background:transparent;border:0px;');
            fixedHilite = fixedHilite.replaceAll('<tr><td><pre style="background:transparent;border:0px;', '<tr><td><pre style="background:transparent;border:0px;color:#eb8475; ');

            leggeraMethods.escreveNaTextarea(fixedHilite);
        }
    }


    // ################ app start

    window.onload = (function () {
        // vai buscar os assets do phc GO
        leggeraGOAssets.grabThemAll();
        // vai buscar as estatísticas do utilizador
        leggeraMethods.getUserInfo();
        // vai buscar o último tópico de manual à cache (caso exista)
        try {
            const getTextareaFromJSON = localStorage.getItem('textarea');
            leggeraVariables.textarea.value = JSON.parse(getTextareaFromJSON);
        }
        catch { }
        // atualiza o hcPreview, conforme tenha encontrado ou não cache 
        if (leggeraVariables.textarea.value === '') {
            setTimeout(function () {
                leggeraMethods.displayUserStats();
            }, 200);
        } else {
            leggeraVariables.hcPreview.appendChild(leggeraMethods.mambo('span', '', '', 'Encontrei um tópico em cache. A carregar...'));
            setTimeout(function () {
                leggeraVariables.hcPreview.innerHTML = leggeraVariables.textarea.value;
                leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
            }, 1000);
        }
    })();


    // ################ textboxes

    const leggeraTextboxes = {
        // método para atualizar o appControls com as textboxes
        displayControls: function () {
            // limpa o appControls + inicia paginador
            leggeraVariables.appControls.innerHTML = '';
            // anexar o wrapper ao appControls 
            const textboxControls = leggeraVariables.appControls.appendChild(leggeraMethods.mambo('div', 'textbox-wrapper', `row`));
            // anexa as textboxes ao wrapper
            for (i = 1; i <= leggeraGOAssets.textboxesFromDB.length; i++) {
                textboxControls.appendChild(leggeraMethods.mambo('div', `textbox-${i}`, 'col-md-4 helpcenter-textbox', leggeraGOAssets.textboxesFromDB[i - 1]));
                leggeraMethods.quepassa(textboxControls.lastChild, leggeraTextboxes.write)
            }
        },
        // Função para escrever as textboxes na textarea
        write: function (e) {
            // textbox selecionada
            let textbox = e.target;
            // corrige a textbox selecionada quando se carrega exatamente nos icons
            if (textbox.tagName === "IMG"
                || textbox.tagName === "I"
                || textbox.tagName === "SPAN") { textbox = textbox.parentElement.parentElement };
            // Corrige a textbox quando se carrega no título da textbox
            if (textbox.classList.contains('novoalerta-titulo')
                || textbox.classList.contains('novoalerta-contido')) { textbox = textbox.parentElement };
            // Corrige a textbox quando se carrega fora das textboxes
            if (textbox.classList.contains('helpcenter-textbox')) { textbox = textbox.firstChild };
            // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leggera
            textbox = textbox.outerHTML.toString().replace('<div class="novoalerta-titulo">', '<div class="novoalerta-titulo">' + "\n")
            textbox = textbox.replace('<br>', '<br>' + "\n")
            textbox = textbox.replace('<ul>', '<ul>' + "\n")
            textbox = textbox.replace('</li>', '</li>' + "\n")
            leggeraMethods.escreveNaTextarea(textbox);
        }
    }


    // ################ icons

    const leggeraIcons = {
        // método para atualizar a cor selecionada para os icons
        changeCurrentColor: function (e) {
            // obtem a opção selecionada
            let eTarget = e.target
            // corrigir o etarger quando carregamos exatamente na checkmark da opção 
            if (eTarget.tagName === 'I') { eTarget = eTarget.parentElement }
            leggeraVariables.currentColor = eTarget.value;
            // selecionar todas as opções
            const colorBottons = document.querySelectorAll('.color-pick')
            // retirar a seleção de todas as opções
            for (color of colorBottons) { color.classList.remove('selected-color') }
            // adicionar a selecção á opção escolhida
            eTarget.classList.add('selected-color')
        },
        // método para mostrar os icons no appControls 
        displayControls: function () {
            // reseta a opção selecionada
            leggeraVariables.currentColor = '#000000'
            // Limpa o appControls
            leggeraVariables.appControls.innerHTML = '';
            // Declaração de variáveis necessárias para efetuar o loop      
            let nWrapper = 1;
            let nSubWrapper = 1;
            // Anexar ao appControls o wrapper de icons principal
            const appControlsIcons = leggeraVariables.appControls.appendChild(leggeraMethods.mambo('div', '', `row`));
            // Anexar o wrapper de icons (row 24 icons) ao wrapper principal
            let appControlsIconsMainWrapper = appControlsIcons.appendChild(leggeraMethods.mambo('div', '', `row icon-row-wrapper icon-row-${nWrapper}`));
            // Anexar um sub-wrapper de icons (col 12 icons)
            let appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(leggeraMethods.mambo('div', '', `col-md-6 icon-sub-row-${nSubWrapper}`));
            for (i = 1; i <= leggeraGOAssets.iconsFromDB.length; i++) {
                // A cada 24 interações, cria uma nova row de 24 icons
                if ((i % 24) === 0) {
                    appControlsIconsSubWrapper.appendChild(leggeraMethods.mambo('div', `icon-${i}`, 'col-md-1 phcgo-icon', leggeraGOAssets.iconsFromDB[i - 1]));
                    leggeraMethods.quepassa(appControlsIconsSubWrapper.lastChild, leggeraIcons.writeIcon);
                    nSubWrapper = 1;
                    nWrapper++;
                    appControlsIconsMainWrapper = appControlsIcons.appendChild(leggeraMethods.mambo('div', '', `row icon-row-wrapper icon-row-${nWrapper}`));
                    appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(leggeraMethods.mambo('div', '', `col-md-6 icon-sub-row-${nSubWrapper}`));
                }
                // A cada 12 interações, cria um novo row de 12 icons
                else if ((i % 12) === 0) {
                    appControlsIconsSubWrapper.appendChild(leggeraMethods.mambo('div', `icon-${i}`, 'col-md-1 phcgo-icon', leggeraGOAssets.iconsFromDB[i - 1]));
                    leggeraMethods.quepassa(appControlsIconsSubWrapper.lastChild, leggeraIcons.writeIcon);
                    nSubWrapper++;
                    appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(leggeraMethods.mambo('div', '', `col-md-6 icon-sub-row-${nSubWrapper}`));
                }
                else {
                    appControlsIconsSubWrapper.appendChild(leggeraMethods.mambo('div', `icon-${i}`, 'col-md-1 phcgo-icon', leggeraGOAssets.iconsFromDB[i - 1]));
                    leggeraMethods.quepassa(appControlsIconsSubWrapper.lastChild, leggeraIcons.writeIcon);
                }
            }
            const colorPickerRow = appControlsIcons.appendChild(leggeraMethods.mambo('div', 'color-picker'));
            const colorTable = ['#000000', '#e0e0e0', '#1a237e', '#b70505', '#ff8f00', '#004d40']
            for (i = 1; i <= colorTable.length; i++) {
                if (i === 1) {
                    colorPickerRow.appendChild(leggeraMethods.mambo('div', `icon-color-${i}`, 'color-pick selected-color', '<i class="lni lni-checkmark unselected-i"></i>'))
                } else {
                    colorPickerRow.appendChild(leggeraMethods.mambo('div', `icon-color-${i}`, 'color-pick', '<i class="lni lni-checkmark unselected-i"></i>'))
                }
                colorPickerRow.lastChild.value = colorTable[i - 1];
                leggeraMethods.quepassa(colorPickerRow.lastChild, leggeraIcons.changeCurrentColor);
            }
        },
        // Função para introduzir o icon no manual
        writeIcon: function (e) {
            let icon = e.target;
            // Corrige o etarget quando não carregamos exatamente no icon 
            if (icon.classList.contains('phcgo-icon')) { icon = icon.firstChild };
            // altera a cor do icon, de acordo com a cor selecionada
            icon.style.color = leggeraVariables.currentColor;
            leggeraMethods.escreveNaTextarea(icon.outerHTML);
            // volta a alterar a cor do icon para a cor do tema
            if (lightTheme == 1) { icon.style.color = '#fff' }
            else { icon.style.color = '#000' };
        }
    }


    // ################ botões & chips

    const leggeraButtons = {
        // Função para alterar os botões de acordo com o tema selecionado
        changeCurrentTheme: function (e) {
            let eTarget = e.target
            if (eTarget.tagName === 'I') { eTarget = eTarget.parentElement }
            leggeraVariables.currentTheme = eTarget.value;
            switch (eTarget.id) {
                case 'theme-1': leggeraButtons.displayControls(e, 1);
                    break
                case 'theme-2': leggeraButtons.displayControls(e, 2);
                    break
                case 'theme-3': leggeraButtons.displayControls(e, 3);
                    break
                case 'theme-4': leggeraButtons.displayControls(e, 4);
            }
        },

        // Função para mostrar o appControls de botoes e etiquetas
        displayControls: function (e, control = 1) {
            if (control === 1) { leggeraVariables.currentTheme = 'horizon' } // hotfix para quando escolhemos um outro tema, e voltamos a aceder ao menu (é precisao alterar para o tema principal)
            // Limpa o appControls + inicia paginador
            let pag = leggeraMethods.appControlsChange();
            // Anexar ao appControls o wrapper principal
            let appControlsButton = leggeraVariables.appControls.appendChild(leggeraMethods.mambo('div', '', `row page-${pag}`));
            // Anexar ao wrapper principal uma linha de 4 buttons
            let appControlsButtonWrapper = appControlsButton.appendChild(leggeraMethods.mambo('div', '', 'row phc-buttons'));
            for (i = 1; i <= 15; i++) {
                // A cada 5buttons, cria uma nova linha
                if (i % 5 === 0) {
                    appControlsButtonWrapper.appendChild(leggeraMethods.mambo('div', `botao-${leggeraVariables.currentTheme}-${i}`, 'botao col-md-2', leggeraGOAssets.buttonsFromDB[control - 1][i - 1]));
                    appControlsButtonWrapper.lastChild.addEventListener('click', leggeraButtons.writeButton)
                    //regras de contraste no beat
                    if (Number(lightTheme) !== 0) {
                        if (control !== 3 && (i >= 5 && i <= 10)) { appControlsButtonWrapper.lastChild.lastChild.style.borderColor = 'hsla(0,0%,100%,.12)' }
                        if (control !== 3 && (i === 7 || i === 10)) { appControlsButtonWrapper.lastChild.lastChild.style.color = 'hsla(0,0%,100%,.12)' }
                        if (i === 9 || i === 10) { appControlsButtonWrapper.lastChild.lastChild.style.background = 'hsla(0,0%,100%,.12)' }
                    } else {
                        if (control == 3 && (i >= 5 && i <= 10)) { appControlsButtonWrapper.lastChild.lastChild.style.borderColor = 'hsla(0,0%,0%,.12)' }
                        if (control == 3 && (i === 7 || i === 10)) { appControlsButtonWrapper.lastChild.lastChild.style.color = 'hsla(0,0%,0%,.26)' }
                    }
                    appControlsButtonWrapper = appControlsButton.appendChild(leggeraMethods.mambo('div', '', 'row phc-buttons'));
                } else {
                    appControlsButtonWrapper.appendChild(leggeraMethods.mambo('div', `botao-${leggeraVariables.currentTheme}-${i}`, 'botao col-md-2', leggeraGOAssets.buttonsFromDB[control - 1][i - 1]));
                    appControlsButtonWrapper.lastChild.addEventListener('click', leggeraButtons.writeButton)
                    if (Number(lightTheme) !== 0) {
                        //regras de contraste no beat
                        if (control !== 3 && (i >= 5 && i <= 10)) { appControlsButtonWrapper.lastChild.lastChild.style.borderColor = 'hsla(0,0%,100%,.12)' }
                        if (control !== 3 && (i === 7 || i === 10)) { appControlsButtonWrapper.lastChild.lastChild.style.color = 'hsla(0,0%,100%,.12)' }
                        if (i === 9 || i === 10) { appControlsButtonWrapper.lastChild.lastChild.style.background = 'hsla(0,0%,100%,.12)' }
                    } else {
                        if (control == 3 && (i >= 5 && i <= 10)) { appControlsButtonWrapper.lastChild.lastChild.style.borderColor = 'hsla(0,0%,0%,.12)' }
                        if (control == 3 && (i === 7 || i === 10)) { appControlsButtonWrapper.lastChild.lastChild.style.color = 'hsla(0,0%,0%,.26)' }
                    }
                }
            }
            const themePickerRow = leggeraVariables.appControls.firstChild.appendChild(leggeraMethods.mambo('div', 'theme-picker', 'row'));
            const themeTable = ['horizon', 'forest', 'dark', 'light']
            for (i = 1; i <= 4; i++) {
                if (i === control) {
                    themePickerRow.appendChild(leggeraMethods.mambo('div', `theme-${i}`, 'theme-pick selected-theme', `<i class="lni lni-checkmark unselected-i"></i>`))
                }
                else {
                    themePickerRow.appendChild(leggeraMethods.mambo('div', `theme-${i}`, 'theme-pick', `<i class="lni lni-checkmark unselected-i"></i>`))
                }
                themePickerRow.lastChild.addEventListener('click', leggeraButtons.changeCurrentTheme)
                themePickerRow.lastChild.value = themeTable[i - 1];
            }
        },
        // Função para adicionar um botão ao código do tópico
        writeButton: function (e) {
            let button = e.target;
            // Corrige o etarget quando carregamos ao lado do botão/etiqueta
            if (button.classList.length > 0) { button = button.firstChild };
            const themeID = ['horizon', 'forest', 'dark', 'light'];
            const currentThemeID = themeID.indexOf(leggeraVariables.currentTheme);
            // Vai buscar o número do botão e vai buscar ao array dos botões o código original 
            button = leggeraGOAssets.buttonsFromDB[currentThemeID][String(button.parentElement.id).replace(`botao-${leggeraVariables.currentTheme}-`, '') - 1];
            leggeraMethods.escreveNaTextarea(button);
        }
    }


    // ############ APPCONTROLS LISTS & TABLES ############


    // Função para mostrar o appControls de Listas e Tabela
    const leggeraListsAndTables = {
        displayControls: function () {
            // ########## Listas ##########
            let pag = leggeraMethods.appControlsChange();
            let appControlsListsAndTables = leggeraVariables.appControls.appendChild(leggeraMethods.mambo('div', '', `row page-${pag}`));
            const appControlsLists = appControlsListsAndTables.appendChild(leggeraMethods.mambo('div', 'listas-wrapper', 'col-md-5'));
            let row = appControlsLists.appendChild(leggeraMethods.mambo('div', 'header-listas', 'row', '<i class="lni lni-list gold"></i>&nbsp;&nbsp;Gerador de listas'));
            row = appControlsLists.appendChild(leggeraMethods.mambo('div', '', 'row'));
            let col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-8'));
            const tipoListaSpan = col.appendChild(leggeraMethods.mambo('span', 'tipo-lista-span', '', 'Tipo de lista'));
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-4'));
            const numItensSpan = col.appendChild(leggeraMethods.mambo('span', 'num-itens-span', '', '# Itens'));
            row = appControlsLists.appendChild(leggeraMethods.mambo('div', '', 'row'));
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-8'));
            let tipoListaDropdown = col.appendChild(leggeraMethods.mambo('select', 'tipo-lista-dropdown'));
            tipoListaDropdown.addEventListener('change', leggeraListsAndTables.listPreview)
            tipoListaDropdown.appendChild(leggeraMethods.mambo('option', '', '', '&nbsp;Não ordenada'));
            tipoListaDropdown.lastChild.value = 'ul'; // Valor a se passado para a função construtora de lista
            tipoListaDropdown.appendChild(leggeraMethods.mambo('option', '', '', '&nbsp;Ordenada numérica'));
            tipoListaDropdown.lastChild.value = 'ol-1';
            tipoListaDropdown.appendChild(leggeraMethods.mambo('option', '', '', '&nbsp;Ordenada alfabética'));
            tipoListaDropdown.lastChild.value = 'ol-a';
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-2'));// Filler row
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-2'));
            let numItensInput = col.appendChild(leggeraMethods.mambo('input', 'num-itens-input'));
            numItensInput.setAttribute('type', 'number')
            row = appControlsLists.appendChild(leggeraMethods.mambo('div', '', 'row'));
            col = row.appendChild(leggeraMethods.mambo('div', 'preview-list-row', 'col-md-8'));
            let previewList = col.appendChild(leggeraMethods.mambo('ul'));
            previewList.style.listStylePosition = 'inside';
            for (i = 1; i <= 3; i++) {
                previewList.appendChild(leggeraMethods.mambo('li', '', '', `<b>Item ${i}:</b> Lorem Ipsum`));
            }
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-4'));
            const wantLinks = col.appendChild(leggeraMethods.mambo('input', 'want-links-checkbox'));
            wantLinks.setAttribute('type', 'checkbox')
            const wantLinksSpan = col.appendChild(leggeraMethods.mambo('span', 'want-links-span', '', '&nbsp;&nbsp;&nbsp;Links?'));
            let criarListaButton = col.appendChild(leggeraMethods.mambo('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir lista'));
            criarListaButton.addEventListener('click', leggeraListsAndTables.writeList)
            // ########## Separador Horizontal ##########
            const novoSeparadorWrapper = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-12 novo-separador'));
            novoSeparadorWrapper.appendChild(leggeraMethods.mambo('span', '', '', '<i class="lni lni-page-break gold"></i> Separador horizontal<br>'));
            const novaQuebraBtn = novoSeparadorWrapper.appendChild(leggeraMethods.mambo('button', 'nova-quebra-btn', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir separador horizontal'));
            novaQuebraBtn.addEventListener('click', leggeraListsAndTables.writeHR);
            // ########## Tabelas ##########
            leggeraVariables.tableType = 'normal-table'
            const novaTabelaWrapper = appControlsListsAndTables.appendChild(leggeraMethods.mambo('div', 'tabelas-wrapper', 'col-md-7'));
            row = novaTabelaWrapper.appendChild(leggeraMethods.mambo('div', 'header-tabelas', 'row', '<i class="lni lni-layout gold"></i>&nbsp;&nbsp;Gerador de tabelas'));
            row = novaTabelaWrapper.appendChild(leggeraMethods.mambo('div', '', 'row'));
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-1')); // Filler col
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-3'));
            const numLinhasSpan = col.appendChild(leggeraMethods.mambo('span', 'num-linhas-span', '', '# de linhas'));
            const numLinhasInput = col.appendChild(leggeraMethods.mambo('input', 'num-linhas-input'));
            numLinhasInput.setAttribute('type', 'number')
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-3'));
            let numColunasSpan = col.appendChild(leggeraMethods.mambo('span', 'num-colunas-span', '', '# de colunas'));
            const numColunasInput = col.appendChild(leggeraMethods.mambo('input', 'num-colunas-input'));
            numColunasInput.setAttribute('type', 'number')
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-1'));   // Filler col
            col = row.appendChild(leggeraMethods.mambo('div', 'import-table-btn', 'col-md-3'));
            let converterTabela = col.appendChild(leggeraMethods.mambo('button', '', 'btn btn-warning', '<i class="lni lni-code"></i>&nbsp;&nbsp;Importar tabela'));
            converterTabela.addEventListener('click', leggeraListsAndTables.convertTable);
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-1')); //  Filler Col
            row = novaTabelaWrapper.appendChild(leggeraMethods.mambo('div', '', 'row'));
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-1')); //  Filler Col
            col = row.appendChild(leggeraMethods.mambo('div', 'cria-tabela-checkbox-wrapper', 'col-md-7'));
            const checkbox1 = col.appendChild(leggeraMethods.mambo('input', 'normal-table'));
            checkbox1.type = 'radio'
            checkbox1.name = 'tablestyle'
            checkbox1.setAttribute('checked', 'true'); // Ativa a checkbox por omissão
            checkbox1.addEventListener('click', leggeraMethods.updateTableType)
            const checkboxLabel1 = col.appendChild(leggeraMethods.mambo('span', '', '', '&nbsp;&nbsp;Normal'));
            const checkbox2 = col.appendChild(leggeraMethods.mambo('input', 'modern-table'));
            checkbox2.type = 'radio'
            checkbox2.name = 'tablestyle'
            checkbox2.addEventListener('click', leggeraMethods.updateTableType)
            const checkboxLabel2 = col.appendChild(leggeraMethods.mambo('span', '', '', '&nbsp;&nbsp;Moderna'));
            const checkbox3 = col.appendChild(leggeraMethods.mambo('input', 'modern-table-blue'));
            checkbox3.type = 'radio'
            checkbox3.name = 'tablestyle'
            checkbox3.addEventListener('click', leggeraMethods.updateTableType)
            const checkboxLabel3 = col.appendChild(leggeraMethods.mambo('span', '', '', '&nbsp;&nbsp;Moderna Azul'));
            col = row.appendChild(leggeraMethods.mambo('div', 'cria-tabela-btn-div', 'col-md-3'));
            let criarTabela = col.appendChild(leggeraMethods.mambo('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir tabela'));
            criarTabela.addEventListener('click', leggeraListsAndTables.writeTable);
            col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-1')); //  Filler Col
            // ########## Injetor de imagens base64 ##########
            const novaImagemWrapper = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-12 nova-imagem'));
            novaImagemWrapper.appendChild(leggeraMethods.mambo('span', 'imageb64-span', '', '<i class="lni lni-gallery gold"></i>&nbsp;&nbsp;Carregar imagem<br>'));
            const fileUplaodForm = novaImagemWrapper.appendChild(leggeraMethods.mambo('form', 'upload-form'));
            fileUplaodForm.setAttribute('method', 'post');
            fileUplaodForm.setAttribute('enctype', 'multipart/form-data');
            const file2Upload = fileUplaodForm.appendChild(leggeraMethods.mambo('input', 'file-upload-input', '', ''));
            file2Upload.setAttribute('type', 'file')
            file2Upload.setAttribute('name', 'file-upload-input')
            const imagemCentradaCheckbox = novaImagemWrapper.appendChild(leggeraMethods.mambo('input', 'imagem-centrada', '', ''));
            imagemCentradaCheckbox.setAttribute('type', 'checkbox');
            const imagemCentradaLabel = novaImagemWrapper.appendChild(leggeraMethods.mambo('span', 'imagem-centrada-span', '', '&nbsp;&nbsp;&nbsp;Centrada?'));
            const fileUploadBtn = novaImagemWrapper.appendChild(leggeraMethods.mambo('button', 'nova-quebra-btn', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir imagem'));
            fileUploadBtn.addEventListener('click', leggeraListsAndTables.writeImage);
        },

        // Função para atualizar com o tipo de lista selecionada
        listPreview: function () {
            const valorTipoLista = document.querySelector('#tipo-lista-dropdown').value;
            let previewWrapper = document.querySelector('#preview-list-row');
            switch (valorTipoLista) {
                case 'ul':
                    previewWrapper.innerHTML = '';
                    novaListaPreview = previewWrapper.appendChild(leggeraMethods.mambo('ul', 'preview-list'));
                    novaListaPreview.style.listStylePosition = "inside";
                    for (i = 1; i <= 3; i++) {
                        novoItemPreview = novaListaPreview.appendChild(leggeraMethods.mambo('li', '', 'preview-item', `<b>Item ${i}:</b> Lorem Ipsum`));
                    }
                    break
                case 'ol-1':
                    previewWrapper.innerHTML = '';
                    novaListaPreview = previewWrapper.appendChild(leggeraMethods.mambo('ol', 'preview-list'));
                    novaListaPreview.setAttribute('type', '1')
                    novaListaPreview.style.listStylePosition = "inside";
                    for (i = 1; i <= 3; i++) {
                        novoItemPreview = novaListaPreview.appendChild(leggeraMethods.mambo('li', '', 'preview-item', `<b>Item ${i}:</b> Lorem Ipsum`));
                    }
                    break
                case 'ol-a':
                    previewWrapper.innerHTML = '';
                    novaListaPreview = previewWrapper.appendChild(leggeraMethods.mambo('ol', 'preview-list'));
                    novaListaPreview.setAttribute('type', 'a');
                    novaListaPreview.style.listStylePosition = "inside";
                    for (i = 1; i <= 3; i++) {
                        novoItemPreview = novaListaPreview.appendChild(leggeraMethods.mambo('li', '', 'preview-item', `<b>Item ${i}:</b> Lorem Ipsum`));
                    }
                    break
            }
        },
        // Adicionar a lista ao manual
        writeList: function () {
            // Obter os parâmetros para a lista
            const tipo = document.querySelector('#tipo-lista-dropdown').value;
            const n = document.querySelector('#num-itens-input').value;
            const wantLinks = document.querySelector('#want-links-checkbox').checked;
            // Babyproof
            if ((isNaN(n)) === true
                || n <= 0) { alert('O valor para o número de itens não é válido (só aceito números positivos, acima de zero).'); return }
            // Declarar variávis para o Switch
            let novaLista = '';
            switch (tipo) {
                case 'ul':
                    novaLista = leggeraMethods.mambo('ul');
                    novaLista.style.listStylePosition = 'inside';
                    for (i = 1; i <= n; i++) {
                        if (wantLinks) { novaLista.appendChild(leggeraMethods.mambo('li', '', '', `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                            novaLista.appendChild(leggeraMethods.mambo('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                    }
                    // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
                    novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                    leggeraMethods.escreveNaTextarea(novaLista);
                    break;
                case 'ol-1':
                    novaLista = leggeraMethods.mambo('ol');
                    novaLista.setAttribute('type', '1');
                    novaLista.style.listStylePosition = "inside";
                    for (i = 1; i <= n; i++) {
                        if (wantLinks) { novaLista.appendChild(leggeraMethods.mambo('li', '', '', `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                            novaLista.appendChild(leggeraMethods.mambo('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                    }
                    novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                    leggeraMethods.escreveNaTextarea(novaLista);
                    break;
                case 'ol-a':
                    novaLista = leggeraMethods.mambo('ol');
                    novaLista.setAttribute('type', 'a');
                    novaLista.style.listStylePosition = 'inside';
                    for (i = 1; i <= n; i++) {
                        if (wantLinks) { novaLista.appendChild(leggeraMethods.mambo('li', '', '', `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                            novaLista.appendChild(leggeraMethods.mambo('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                    }
                    novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                    leggeraMethods.escreveNaTextarea(novaLista);
                    break;
            }
        },
        // Estilos a serem utilizados para formatação das tabelas
        normalTableStyle: '<style>.phcgo-old-table>tbody>tr>td{text-align:left;background-color:#fff;padding:20px 10px;border:solid 1px #000}.phcgo-old-table>tbody>tr:nth-child(1)>td{background-color:rgb(255, 225, 189)!important;border:solid 1px #000!important;font-size:16px!important;font-weight:700}',
        modernTableStyle: '<style>.phcgo-new-table>tbody>tr>td{border-radius:20px;border:solid 2px #fff;background-color:#f2f2f2;color:#000;padding:5px 20px}.phcgo-new-table>tbody>tr:nth-child(1)>td{border-radius:20px;border:solid 2px #fff;background-color:rgb(255, 225, 189);color:#000;padding:4px 20px;font-size:20px}',
        modernTableStyleBlue: '<style>.phcgo-new-table-blue>tbody>tr>td{border-radius:20px;border:solid 2px #fff;background-color:#f2f2f2;color:#000;padding:5px 20px}.phcgo-new-table-blue>tbody>tr:nth-child(1)>td{border-radius:20px;border:solid 2px #fff;background-color:#3fa8f6;color:#fff;padding:4px 20px;font-size:20px}',
        // necessário para o injetor de estilos de largura
        colunas: 0,
        estilosExtra: '',
        // Função para adicionar uma tabela ao tópico de manual
        writeTable: function () {
            // Obter os parâmetros para a ligação
            const numLinhas = document.querySelector('#num-linhas-input').value;
            const numColunas = document.querySelector('#num-colunas-input').value;
            // Babyproof
            if ((isNaN(numLinhas)) === true
                || numLinhas <= 0) { alert('O valor para o número de linhas não é válido (só aceito números positivos, acima de zero).'); return }
            if ((isNaN(numColunas)) === true
                || numColunas <= 0) { alert('O valor para o número de colunas não é válido (só aceito números positivos, acima de zero).'); return }
            let novaTabela;
            switch (leggeraVariables.tableType) {
                case 'normal-table': novaTabela = leggeraMethods.mambo('table', '', 'phcgo-old-table'); break
                case 'modern-table': novaTabela = leggeraMethods.mambo('table', '', 'phcgo-new-table'); break
                case 'modern-table-blue': novaTabela = leggeraMethods.mambo('table', '', 'phcgo-new-table-blue'); break
            }
            novaTabela.style.display = 'flex';
            novaTabela.style.justifyContent = 'center';
            const tBody = novaTabela.appendChild(leggeraMethods.mambo('tbody'));
            const novoCabecalho = leggeraMethods.mambo('tr');
            for (i = 1; i <= numColunas; i++) {
                let novaColuna = novoCabecalho.appendChild(leggeraMethods.mambo('td', '', '', `Cabeçalho ${i}`));
            }
            tBody.appendChild(novoCabecalho);
            // adiciona as restantes linhas á tabela
            for (iLinhas = 1; iLinhas <= numLinhas; iLinhas++) {
                const novaLinha = leggeraMethods.mambo('tr');
                for (iColunas = 1; iColunas <= numColunas; iColunas++) {
                    let novaColuna = novaLinha.appendChild(leggeraMethods.mambo('td', '', '', `Linha ${iLinhas} Coluna ${iColunas}`));
                }
                tBody.appendChild(novaLinha);
            }
            // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
            novaTabela = (novaTabela.outerHTML.toString().replaceAll('<tr>', "\n" + '<tr>'));
            novaTabela = (novaTabela.toString().replaceAll('</td><td>', '</td>' + "\n" + '<td>'));
            novaTabela.replaceAll('</tbody>', "\n" + '</tbody>');
            // gerador estilos para redimensionar larguras 
            function tableWidthLegoo(cla) {
                let tablewidth = prompt(`Introduz as larguras das colunas ( ${numColunas} ), separadas por vírgua (20px, 400px).\n\nCaso vazio, estas ficaram adaptadas de acordo com o HelpCenter live.`);
                if (tablewidth === null || tablewidth === '') { return }
                else {
                    //transforma as medidas recebidas em  em array 
                    tablewidth = tablewidth.replaceAll(' ', '').split(',');
                    leggeraListsAndTables.estilosExtra = '';
                    for (i = 1; i <= numColunas; i++) {
                        leggeraListsAndTables.estilosExtra = leggeraListsAndTables.estilosExtra + `.${cla}>tbody>tr>td:nth-child(${i}){width:${tablewidth[i - 1]};}`
                    }
                }
            }
            // Anexar o <style> necessário, de acordo com a tabela selecionada
            switch (leggeraVariables.tableType) {
                case 'normal-table':
                    novaTabela.classList = 'phcgo-old-table';
                    tableWidthLegoo('phcgo-old-table');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.normalTableStyle + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
                case 'modern-table':
                    novaTabela.classList = 'phcgo-new-table';
                    tableWidthLegoo('phcgo-new-table');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyle + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
                case 'modern-table-blue':
                    novaTabela.classList = 'phcgo-new-table-blue';
                    tableWidthLegoo('phcgo-new-table-blue');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyleBlue + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
            }
            leggeraMethods.escreveNaTextarea(novaTabela);
        },
        // Função para converter tabelas
        convertTable: function () {
            // publicar a tabela recebida
            let nome;
            switch (leggeraVariables.tableType) {
                case 'normal-table': nome = 'Normal'; break
                case 'modern-table': nome = 'Moderna'; break
                case 'modern-table-blue': nome = 'Moderna Azul'; break
            }
            let tablecode = prompt(`Introduz o código da tua tabela.\n\nEsta será convertida no estilo atualmente selecionado ( ${nome} )`);
            if (tablecode === null || tablecode === '') { return }
            if (leggeraVariables.activeTextarea === '') { alert('Coloca o cursor numa área de texto antes de adicionar conteúdos.'); return }
            // tabela temporária
            leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('div', 'tempTable', '', tablecode).outerHTML);
            let novaTabela;
            switch (leggeraVariables.tableType) {
                case 'normal-table': novaTabela = leggeraMethods.mambo('table', '', 'phcgo-old-table'); break
                case 'modern-table': novaTabela = leggeraMethods.mambo('table', '', 'phcgo-new-table'); break
                case 'modern-table-blue': novaTabela = leggeraMethods.mambo('table', '', 'phcgo-new-table-blue'); break
            }
            novaTabela.style.display = 'flex';
            novaTabela.style.justifyContent = 'center';
            novaTabela.innerHTML = leggeraListsAndTables.convertTableEngine();
            // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
            novaTabela = (novaTabela.outerHTML.toString().replaceAll('<tr>', "\n" + '<tr>'));
            novaTabela = (novaTabela.toString().replaceAll('</td><td>', '</td>' + "\n" + '<td>'));
            novaTabela = (novaTabela.toString().replaceAll('</tbody>', "\n" + '</tbody>'));
            // gerador estilos para redimensionar larguras 
            function tableWidthLegoo(cla) {
                let tablewidth = prompt(`Introduz as larguras das colunas ( ${leggeraListsAndTables.colunas} ), separadas por vírgua (20px, 400px).\n\nCaso vazio, estas ficaram adaptadas de acordo com o HelpCenter live.`);
                if (tablewidth === null || tablewidth === '') { return }
                else {
                    //transforma as medidas recebidas em  em array 
                    tablewidth = tablewidth.replaceAll(' ', '').split(',');
                    leggeraListsAndTables.estilosExtra = '';
                    for (i = 1; i <= leggeraListsAndTables.colunas; i++) {
                        leggeraListsAndTables.estilosExtra = leggeraListsAndTables.estilosExtra + `.${cla}>tbody>tr>td:nth-child(${i}){width:${tablewidth[i - 1]};}`
                    }
                    leggeraListsAndTables.estilosExtra = leggeraListsAndTables.estilosExtra + '</style>'
                }
            }
            // Anexar o <style> necessário, de acordo com a tabela selecionada
            switch (leggeraVariables.tableType) {
                case 'normal-table':
                    novaTabela.classList = 'phcgo-old-table';
                    tableWidthLegoo('phcgo-old-table');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.normalTableStyle + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
                case 'modern-table':
                    novaTabela.classList = 'phcgo-new-table';
                    tableWidthLegoo('phcgo-new-table');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyle + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
                case 'modern-table-blue':
                    novaTabela.classList = 'phcgo-new-table-blue';
                    tableWidthLegoo('phcgo-new-table-blue');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyleBlue + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
            }
            leggeraMethods.escreveNaTextarea(novaTabela);
        },
        // Função que pega na tabela temporária, envia os conteúdos para array, e devolve uma nova tabela, sem estilos nem classes
        convertTableEngine: function () {
            const itemsParaConverter = [];
            const numLinhas = document.querySelectorAll('#tempTable tr').length
            itemsParaConverter.push(document.querySelectorAll(`#tempTable th`));
            for (i = 1; i <= numLinhas; i++) {
                itemsParaConverter.push(document.querySelectorAll(`#tempTable tr:nth-child(${i}) td`))
            }
            // número de colunas
            if (itemsParaConverter[0].length !== 0) {
                leggeraListsAndTables.colunas = itemsParaConverter[0].length
            } else { leggeraListsAndTables.colunas = itemsParaConverter[1].length }
            let tabelaConvertida = leggeraMethods.mambo('table')
            for (i = 0; i <= numLinhas; i++) {
                tabelaConvertida.appendChild(leggeraMethods.mambo('tr'));
                for (x = 0; x < itemsParaConverter[i].length; x++) {
                    tabelaConvertida.lastChild.appendChild(leggeraMethods.mambo('td', '', '', itemsParaConverter[i][x].innerText))
                    let colspan = itemsParaConverter[i][x].attributes.colspan;
                    try { tabelaConvertida.lastChild.lastChild.setAttribute('colspan', colspan.value) }
                    catch { }
                    let rowspan = itemsParaConverter[i][x].attributes.rowspan;
                    try { tabelaConvertida.lastChild.lastChild.setAttribute('rowspan', rowspan.value) }
                    catch { }
                }
            }
            tabelaConvertida = tabelaConvertida.outerHTML.toString().replace('<tr></tr>', '');
            return tabelaConvertida
        },
        // Função para adicionar um seprador horizontal <hr> código do tópico
        writeHR: function () {
            let novoSeparador = leggeraMethods.mambo('hr');
            novoSeparador.style.borderTop = '3px solid #eee';
            novoSeparador = novoSeparador.outerHTML
            leggeraMethods.escreveNaTextarea(novoSeparador);
        },
        writeImage: function () {
            const formData = new FormData();
            const files = $('#file-upload-input')[0].files;
            // Check file selected or not
            if (files.length > 0) {
                formData.append('file', files[0]);
                $.ajax({
                    url: 'assets/php/file-upload.php',
                    type: 'post',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response != 0) {
                            let uploadedImagem = `<span style="display:flex;justify-content:center;align-self:center;"><img style="max-width:100%;height:auto;"\nsrc="${response}"></span>`
                            if (document.querySelector('#imagem-centrada').checked === false) {
                                uploadedImagem = `<img style="max-width:100%;height:auto;"\nsrc="${response}">`
                            }
                            leggeraMethods.escreveNaTextarea(uploadedImagem)
                        } else { alert('file not uploaded'); }
                    },
                });
            } else { alert("Please select a file."); }
        }
    }


    // ############ APPCONTROLS TITLES & LINKS ############
    // Função para mostrar a modal de Títulos e Ligações
    function appControlsTitulosELigacoes() {
        // Limpa o appControls + inicia paginador
        let pag = leggeraMethods.appControlsChange();
        // Anexar ao appControls o wrapper principal
        let appControlsLinksAndTitles = leggeraVariables.appControls.appendChild(leggeraMethods.mambo('div', '', `row page-${pag}`));
        // Anexar ao wrapper principal, o Wrapper da secção da esquerda
        const novoVariosWrapperLeft = appControlsLinksAndTitles.appendChild(leggeraMethods.mambo('div', 'left-wrapper', 'col-md-8'));
        // Anexar ao wrapper principal, o Wrapper da secção da direita
        const geradorTitulosWrapper = novoVariosWrapperLeft.appendChild(leggeraMethods.mambo('div', 'gerador-titulos', 'row', '<i class="lni lni-pilcrow gold"></i>&nbsp;Gerador de títulos'));
        // Row 1
        row = geradorTitulosWrapper.appendChild(leggeraMethods.mambo('div', '', 'row'));
        let col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-1')); // Filler col
        // Col 1
        col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-11'));
        // Span Tipo Lista
        let tipoListaSpan = col.appendChild(leggeraMethods.mambo('span', 'tipo-lista-span', '', 'Tipo de título'));
        // Row 2 
        row = geradorTitulosWrapper.appendChild(leggeraMethods.mambo('div', '', 'row'));
        col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-1')); // Filler col
        // Col 1
        col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-7'));
        // Dropdown para "Tipo de título"
        let tipoTituloDropdown = col.appendChild(leggeraMethods.mambo('select', 'tipo-titulo-dropdown'));
        tipoTituloDropdown.addEventListener('change', previewTitle)
        // Opção 4
        tipoTituloDropdown.appendChild(leggeraMethods.mambo('option', '', '', '&nbsp;Título H1'));
        tipoTituloDropdown.lastChild.value = 'old1' // Valor a se passado para a função construtora de lista
        // Opção 5
        tipoTituloDropdown.appendChild(leggeraMethods.mambo('option', '', '', '&nbsp;Título H2'));
        tipoTituloDropdown.lastChild.value = 'old2'
        // Opção 6
        tipoTituloDropdown.appendChild(leggeraMethods.mambo('option', '', '', '&nbsp;Título H3'));
        tipoTituloDropdown.lastChild.value = 'old3'
        // Opção 1    
        tipoTituloDropdown.appendChild(leggeraMethods.mambo('option', '', '', '&nbsp;Título H1 (alternativo)'));
        tipoTituloDropdown.lastChild.value = 'default1' // Valor a se passado para a função construtora de lista
        // Opção 2
        tipoTituloDropdown.appendChild(leggeraMethods.mambo('option', '', '', '&nbsp;Título H2 (alternativo)'));
        tipoTituloDropdown.lastChild.value = 'default2'
        // Opção 3
        tipoTituloDropdown.appendChild(leggeraMethods.mambo('option', '', '', '&nbsp;Título H3 (alternativo)'));
        tipoTituloDropdown.lastChild.value = 'default3'
        col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-1'));   //Filler col
        // Col Button criar título
        row.appendChild(leggeraMethods.mambo('div', 'cria-lista-btn-div', 'col-md-2'));
        // Button "Criar título"
        let criarTituloButton = col.appendChild(leggeraMethods.mambo('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir título'));
        criarTituloButton.addEventListener('click', writeTitle)
        col = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-1'));   //Filler col
        row = geradorTitulosWrapper.appendChild(leggeraMethods.mambo('div', '', 'row'));
        // Col 1 (pre-view do título)
        col = row.appendChild(leggeraMethods.mambo('div', 'preview-heading-row', 'col-md-12'));
        row.lastChild.appendChild(leggeraMethods.mambo('h1', '', 'manuais', 'Título/Heading 1'))
        row = novoVariosWrapperLeft.appendChild(leggeraMethods.mambo('div', '', 'row title-link-filler'));         // Filler Row
        // Wrapper da secção das ligações
        const novaLigacaoWrapper = novoVariosWrapperLeft.appendChild(leggeraMethods.mambo('div', '', 'row gerador-links-wrapper'));
        // Col 0
        col = novaLigacaoWrapper.appendChild(leggeraMethods.mambo('div', 'gerador-links-h1', 'col-md-12', '<i class="lni lni-website gold"></i>&nbsp;&nbsp;Gerador de links'));
        // Col 1
        col = novaLigacaoWrapper.appendChild(leggeraMethods.mambo('div', '', 'col-md-3 text-left'));
        // Span 'Descrição da ligação'
        const spanDescricao = col.appendChild(leggeraMethods.mambo('span', 'nome-span', '', 'Descrição da ligação:'));
        // Col 2
        col = novaLigacaoWrapper.appendChild(leggeraMethods.mambo('div', '', 'col-md-6'));
        // Input 'Descrição da ligação'
        const inputDescricao = col.appendChild(leggeraMethods.mambo('input', 'nome-input'));
        // Col 3
        col = novaLigacaoWrapper.appendChild(leggeraMethods.mambo('div', '', 'col-md-2 nova-ligacao-btn-col'));
        // Button Criar ligação
        const criarLigacao = col.appendChild(leggeraMethods.mambo('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir ligação'));
        criarLigacao.addEventListener('click', writeLink);
        // Col 4
        col = novaLigacaoWrapper.appendChild(leggeraMethods.mambo('div', '', 'col-md-3 text-left'));
        // Span 'URL'
        const spanURL = col.appendChild(leggeraMethods.mambo('span', 'link-span', '', 'URL da ligação:'));
        // Col 5
        col = novaLigacaoWrapper.appendChild(leggeraMethods.mambo('div', '', 'col-md-6'));
        // Input 'URL'
        const inputURL = col.appendChild(leggeraMethods.mambo('input', 'link-input'));
        // Wrapper da secção dos extras
        const novoVariosWrapperRight = appControlsLinksAndTitles.appendChild(leggeraMethods.mambo('div', 'hilite-wrapper', 'col-md-4'));
        // Row 0
        row = novoVariosWrapperRight.appendChild(leggeraMethods.mambo('div', 'hilite-subwrapper', 'row', '<i class="lni lni-skipping-rope gold"></i>&nbsp;&nbsp;Hilite.me API'));
        // Row 1
        row = novoVariosWrapperRight.appendChild(leggeraMethods.mambo('div', '', 'row'));
        // Wrapper Hilite.me
        const hiliteWrapper = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-12'));
        // Button para formatar hilite.me
        const hiliteTextarea = hiliteWrapper.appendChild(leggeraMethods.mambo('textarea', 'hilite-textarea'));
        const novaHiliteCheckboxesRow = hiliteWrapper.appendChild(leggeraMethods.mambo('div', 'hilite-checkboxes-row', 'row'));
        leggeraVariables.codeType = 'vbnet' //reset ao trocar de página
        let miniWrapper1 = novaHiliteCheckboxesRow.appendChild(leggeraMethods.mambo('div', '', 'col-md-3'))
        miniWrapper1.appendChild(leggeraMethods.mambo('input', 'vbnet'));
        miniWrapper1.lastChild.type = 'radio'
        miniWrapper1.lastChild.name = 'hilite'
        miniWrapper1.lastChild.setAttribute('checked', 'true');
        miniWrapper1.addEventListener('change', leggeraMethods.updateCodeType)
        miniWrapper1.appendChild(leggeraMethods.mambo('span', '', '', '&nbsp;&nbsp;VB'));
        let miniWrapper2 = novaHiliteCheckboxesRow.appendChild(leggeraMethods.mambo('div', '', 'col-md-3'))
        miniWrapper2.appendChild(leggeraMethods.mambo('input', 'ts'));
        miniWrapper2.lastChild.type = 'radio'
        miniWrapper2.lastChild.name = 'hilite'
        miniWrapper2.addEventListener('change', leggeraMethods.updateCodeType)
        miniWrapper2.appendChild(leggeraMethods.mambo('span', '', '', '&nbsp;&nbsp;TS'));
        let miniWrapper3 = novaHiliteCheckboxesRow.appendChild(leggeraMethods.mambo('div', '', 'col-md-3'))
        miniWrapper3.appendChild(leggeraMethods.mambo('input', 'json'));
        miniWrapper3.lastChild.type = 'radio'
        miniWrapper3.lastChild.name = 'hilite'
        miniWrapper3.addEventListener('change', leggeraMethods.updateCodeType)
        miniWrapper3.appendChild(leggeraMethods.mambo('span', '', '', '&nbsp;&nbsp;JSON'));
        let miniWrapper4 = novaHiliteCheckboxesRow.appendChild(leggeraMethods.mambo('div', '', 'col-md-3'))
        miniWrapper4.appendChild(leggeraMethods.mambo('input', 'sql'));
        miniWrapper4.lastChild.type = 'radio'
        miniWrapper4.lastChild.name = 'hilite'
        miniWrapper4.addEventListener('change', leggeraMethods.updateCodeType)
        miniWrapper4.appendChild(leggeraMethods.mambo('span', '', '', '&nbsp;&nbsp;SQL'));
        let miniWrapper5 = novaHiliteCheckboxesRow.appendChild(leggeraMethods.mambo('div', '', 'col-md-12'))
        miniWrapper5.appendChild(leggeraMethods.mambo('input', 'line-numbers'));
        miniWrapper5.lastChild.type = 'checkbox'
        miniWrapper5.appendChild(leggeraMethods.mambo('span', '', '', '&nbsp;&nbsp;Linhas numeradas ?'));
        const novaHiliteBtn = hiliteWrapper.appendChild(leggeraMethods.mambo('button', '', 'btn btn-warning', '<i class="lni lni-code"></i>&nbsp;&nbsp;Introduzir código'));
        novaHiliteBtn.addEventListener('click', leggeraHiliteAPI.post);
    }
    // Função para mostrar uma preview do título selecionado na secção dos títulos
    function previewTitle() {
        let dropdownTitulos = document.querySelector('#tipo-titulo-dropdown');
        let titulosPreview = document.querySelector('#preview-heading-row');
        titulosPreview.innerHTML = '';
        switch (dropdownTitulos.value) {
            // Opção 1
            case 'default1':
                titulosPreview.appendChild(leggeraMethods.mambo('h1', '', 'manuais', 'Título/Heading 1'))
                break;
            case 'default2':
                titulosPreview.appendChild(leggeraMethods.mambo('h2', '', 'manuais', 'Título/Heading 2'))
                break;
            case 'default3':
                titulosPreview.appendChild(leggeraMethods.mambo('h3', '', 'manuais', 'Título/Heading 3'))
                break;
            case 'old1':
                titulosPreview.appendChild(leggeraMethods.mambo('h1', '', '', 'Título/Heading 1'));
                break;
            case 'old2':
                titulosPreview.appendChild(leggeraMethods.mambo('h2', '', '', 'Título/Heading 2'))
                break;
            case 'old3':
                titulosPreview.appendChild(leggeraMethods.mambo('h3', '', '', 'Título/Heading 3'))
                break;
        }
    }
    // Função para adicionar o título ao tópico de manual
    function writeTitle() {
        let dropdownTitulos = document.querySelector('#tipo-titulo-dropdown');
        switch (dropdownTitulos.value) {
            // Opção 1
            case 'default1':
                leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h1', '', 'manuais', 'Título/Heading 1').outerHTML)
                break;
            case 'default2':
                leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h2', '', 'manuais', 'Título/Heading 2').outerHTML)
                break;
            case 'default3':
                leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h3', '', 'manuais', 'Título/Heading 3').outerHTML)
                break;
            case 'old1':
                leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h1', '', '', 'Título/Heading 1').outerHTML)
                break;
            case 'old2':
                leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h2', '', '', 'Título/Heading 2').outerHTML)
                break;
            case 'old3':
                leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h3', '', '', 'Título/Heading 3').outerHTML)
                break;
        }
    }
    // Função para adicionar uma ligação ao código do tópico
    function writeLink() {
        // Obter os parâmetros para a ligação
        const nome = document.querySelector('#nome-input').value;
        const getlink = document.querySelector('#link-input').value;
        const link = getlink.toLowerCase();
        // babyproof
        if (link.slice(0, 4) !== 'http') {
            if (link.slice(0, 1) !== '#') {
                alert('A ligação tem de começar por "#" (para ligações no mesmo tópico)\nou http (para ligações fora do tópico).')
                return
            }
        }
        let novaLigacao = leggeraMethods.mambo('a', '', 'manuais', nome);
        novaLigacao.setAttribute('href', link);
        novaLigacao.setAttribute('target', '_blank');
        novaLigacao = novaLigacao.outerHTML
        leggeraMethods.escreveNaTextarea(novaLigacao);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Collapsables (ainda tenho de fazer review)

    // Variáveis globais
    const colaphcPreview = document.querySelector('#colapsables-wrapper');
    const botaoVistaColap = document.querySelector('#colap-btn');
    botaoVistaColap.addEventListener('click', toogleColapsablesappControls);

    // Função ao carregar no botão Vista Colapsavel    
    function toogleColapsablesappControls() {
        const helpcenterPreviewWrapper = document.querySelector('.hc-preview');
        //babyproof - reset à activeTextarea
        leggeraVariables.activeTextarea = '';
        if (colaphcPreview.classList.contains('no-display') === true) {
            botaoVistaColap.classList.replace('btn-light', 'btn-info');
            document.querySelector('#helpcenter-preview').innerHTML = document.querySelector('#textarea').value;
            colaphcPreview.classList.remove('no-display');
            helpcenterPreviewWrapper.classList.add('no-display');
            appControlsColap();
        } else {
            leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');
            for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                let saveBtn = document.querySelector(`#colap-save-btn-${i}`);
                if (saveBtn.classList.contains('no-display') == false) {
                    alert(`Não é possível retornar à vista principal, enquanto existirem alterações pendentes.`); return
                }
            }
            botaoVistaColap.classList.replace('btn-info', 'btn-light');        // a ordem invertida do getcollaps é importante, não sei porque nao me lembra
            appControlsColap();
            colaphcPreview.classList.add('no-display');
            helpcenterPreviewWrapper.classList.remove('no-display');
            leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.hcPreview.innerHTML);
        }
    }
    // Função para mostrar a appControls dos colapsáveis
    function appControlsColap() {
        // Array com todos os colapsáveis do tópico
        leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');
        // Limpa a appControls
        colaphcPreview.innerHTML = '';
        // Wrapper (row)
        let colapWrapper = colaphcPreview.appendChild(leggeraMethods.mambo('div', '', `page-1`));
        if (leggeraVariables.colapList.length !== 0) {
            // Loop para cada item do Array
            for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                // Row 1
                let row = colapWrapper.appendChild(leggeraMethods.mambo('div', '', 'row'));
                (i % 2 === 0) ? row.classList.add('par') : row.classList.add('impar');
                let wrapperLeft = row.appendChild(leggeraMethods.mambo('div', `inputs-${i}`, 'col-md-5 inputs-wrapper'));
                let wrapperRight = row.appendChild(leggeraMethods.mambo('div', '', 'col-md-7'));
                // Col 1 (inputs)
                // Input 1
                wrapperLeft.appendChild(leggeraMethods.mambo('span', '', 'colap-id', 'ID do colapsável (minúsculas, sem acentuação, sem espaçamento)'));
                let idInput = wrapperLeft.appendChild(leggeraMethods.mambo('input', '', `colap-input-id-${i}`));
                idInput.value = leggeraVariables.colapList[i - 1].nextElementSibling.id;
                idInput.addEventListener('keyup', updateColapPreviewByID)
                // Input 2
                wrapperLeft.appendChild(leggeraMethods.mambo('span', '', 'colap-h2', 'Título do colapsável'));
                let h2Input = wrapperLeft.appendChild(leggeraMethods.mambo('input', '', `colap-input-h2-${i}`));
                let h2Trim = leggeraVariables.colapList[i - 1].innerText.trim().split('	');     // trim para ficar direitinho
                h2Input.value = h2Trim[0];
                h2Input.addEventListener('keyup', updateColapHeading)
                //hotfix, estava a aparecer no input dos novos manuais.;
                while (h2Input.value.includes('Abrir/Fechar'))
                    h2Input.value = h2Input.value.replace('Abrir/Fechar', '');
                //hotfix, estava a aparecer no input dos novos manuais.;
                while (h2Input.value.includes('Mostrar/Ocultar'))
                    h2Input.value = h2Input.value.replace('Mostrar/Ocultar', '');
                // Input 3
                wrapperLeft.appendChild(leggeraMethods.mambo('span', '', 'colap-body', 'Corpo do colapsável'));
                let bodyInput = wrapperLeft.appendChild(leggeraMethods.mambo('textarea', '', `colap-input-body-${i}`));
                bodyInput.addEventListener('keyup', colapTextAreaEventsSlim)
                bodyInput.addEventListener('click', colapTextAreaEvents)
                let bodyTempInput = leggeraVariables.colapList[i - 1].nextElementSibling.innerHTML;
                // Remove o cursor laranja ao passar para os collaps
                bodyInput.value = String(bodyTempInput).replace('<span id="pulse">|</span>', '');
                // Guardar alterações Button
                let updateCollaps = wrapperLeft.appendChild(leggeraMethods.mambo('button', `colap-save-btn-${i}`, 'btn btn-success no-display', `<i class="lni lni-save"></i> Guardar alterações`));
                updateCollaps.addEventListener('click', gerarColapsaveis)
                // Rejeitar alterações Button
                let dropCollaps = wrapperLeft.appendChild(leggeraMethods.mambo('button', `colap-drop-btn-${i}`, 'btn btn-danger no-display', `<i class="lni lni-cross-circle"></i> Descartar alterações`));
                dropCollaps.addEventListener('click', appControlsColap)
                // filler div para padding
                wrapperLeft.appendChild(leggeraMethods.mambo('div', '', 'save-padding'));
                // Col 2 (display)
                wrapperRight.appendChild(leggeraMethods.mambo('div', '', `colap-display-h2-${i}`));
                wrapperRight.lastChild.innerText = h2Trim[0];
                //hotfix, estava a aparecer "Abrir/Fechar" várias vezes nos preview
                while (wrapperRight.lastChild.innerText.includes('Abrir/Fechar')) {
                    wrapperRight.lastChild.innerText = wrapperRight.lastChild.innerText.replace('Abrir/Fechar', '');
                }
                wrapperRight.appendChild(leggeraMethods.mambo('div', '', `colap-display-body-${i}`, leggeraVariables.colapList[i - 1].nextElementSibling.innerHTML));
            }
            // adicionar novo collap
            row = colapWrapper.appendChild(leggeraMethods.mambo('div', '', 'row'));
            col = row.appendChild(leggeraMethods.mambo('div', 'add-new-collap'));
            const newCollapBtn = col.appendChild(leggeraMethods.mambo('button', '', "btn btn-info", '<i class="lni lni-circle-plus"></i>&nbsp;&nbsp;Adicionar um novo colapsável'));
            newCollapBtn.addEventListener('click', novoColapsavel)
            const scrollToTop = col.appendChild(leggeraMethods.mambo('button', '', "btn btn-info", '<i class="lni lni-arrow-up-circle"></i>&nbsp;&nbsp;Voltar ao início'));
            scrollToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); })
        } else {
            let geradorColapWrapper = colaphcPreview.appendChild(leggeraMethods.mambo('div', 'gerador-colaps-wrapper', 'row'));
            let col = geradorColapWrapper.appendChild(leggeraMethods.mambo('div', '', 'gerador-colaps-1', ''));
            col.appendChild(leggeraMethods.mambo('span', 'no-colaps-span', '', 'Não foi encontrado nenhum colapsável.'));
            geradorColapWrapper.appendChild(leggeraMethods.mambo('div', '', 'flex-br', ''));
            let geradornewCollapBtn = geradorColapWrapper.appendChild(leggeraMethods.mambo('button', '', "btn btn-info", '<i class="lni lni-circle-plus"></i>&nbsp;&nbsp;Adicionar um novo colapsável'));
            geradornewCollapBtn.addEventListener('click', novoColapsavel)
            col.appendChild(leggeraMethods.mambo('div'));
        }
    }
    // Função para mostrar o savebutton ao atualizar o ID dos colapsáveis
    function updateColapPreviewByID(e) {
        // Mostra o save button
        const saveButton = e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
        saveButton.classList.remove('no-display');
        const cancelButton = saveButton.nextElementSibling
        cancelButton.classList.remove('no-display');
    }
    // Função para atualizar o prewview dos colapsáveis (H2)
    function updateColapHeading(e) {
        leggeraVariables.activeTextarea = e.target;
        let inputText = leggeraVariables.activeTextarea.value;
        let cursorappControlsPos = leggeraMethods.getCursorPos(e);
        // divide o input em duas partes (até ao cursor, e após o curos)
        let inputColapTextStrings = [];
        inputColapTextStrings.push([inputText.slice(0, cursorappControlsPos)]);
        inputColapTextStrings.push([inputText.slice(cursorappControlsPos)]);
        // introduz o cursor laranja
        let inputColapTextWithCursor = `${inputColapTextStrings[0]}<span id="pulse">|</span>${inputColapTextStrings[1]}`;
        leggeraVariables.stringCursorColap[0] = inputColapTextStrings[0];
        leggeraVariables.stringCursorColap[1] = inputColapTextStrings[1];
        // Preview do input
        let inputPreview = e.target.parentElement.nextElementSibling.children[0];
        inputPreview.innerHTML = inputColapTextWithCursor;
        // Mostra o save button
        const saveButton = e.target.nextElementSibling.nextElementSibling.nextElementSibling
        saveButton.classList.remove('no-display');
        const cancelButton = saveButton.nextElementSibling
        cancelButton.classList.remove('no-display');
    }
    // função para atualizar o preview do body
    function colapTextAreaEventsSlim(e) {
        // Atualiza a active textarea
        leggeraVariables.activeTextarea = e.target;
        let inputText = leggeraVariables.activeTextarea.value;
        let cursorappControlsPos = leggeraMethods.getCursorPos(e);
        // divide o input em duas partes (até ao cursor, e após o curos)
        let inputColapTextStrings = [];
        inputColapTextStrings.push([inputText.slice(0, cursorappControlsPos)]);
        inputColapTextStrings.push([inputText.slice(cursorappControlsPos)]);
        // introduz o cursor laranja
        let inputColapTextWithCursor = `${inputColapTextStrings[0]}<span id="pulse">|</span>${inputColapTextStrings[1]}`;
        leggeraVariables.stringCursorColap[0] = inputColapTextStrings[0];
        leggeraVariables.stringCursorColap[1] = inputColapTextStrings[1];
        // Preview do input
        let inputPreview = e.target.parentElement.nextElementSibling.children[1];
        inputPreview.innerHTML = inputColapTextWithCursor;
        // Mostra o save button
        const saveButton = e.target.nextElementSibling
        saveButton.classList.remove('no-display');
        const cancelButton = saveButton.nextElementSibling
        cancelButton.classList.remove('no-display');
    }
    // função para atualizar o preview do body
    function colapTextAreaEvents(e) {
        // Atualiza a active textarea
        leggeraVariables.activeTextarea = e.target;
        let inputText = leggeraVariables.activeTextarea.value;
        let cursorappControlsPos = leggeraMethods.getCursorPos(e);
        let inputColapTextStrings1;
        let inputColapTextStrings2;
        // babyproof para quando colocamos o cursor numa tag, ele se mostrado for da tag (para não partir o prewview)
        novoColapsCursorPos = cursorappControlsPos;
        if (inputText[cursorappControlsPos] === '>') {
            inputColapTextStrings = inputText.slice(0, cursorappControlsPos)
            inputColapTextStrings = inputText.slice(cursorappControlsPos, inputText.length)
        } else {
            (function rotinaCursor() {
                switch (inputText[novoColapsCursorPos]) {
                    case '<':
                        inputColapTextStrings1 = inputText.slice(0, novoColapsCursorPos)
                        inputColapTextStrings2 = inputText.slice(novoColapsCursorPos, inputText.length)
                        break
                    case '>':
                        inputColapTextStrings1 = inputText.slice(0, cursorappControlsPos)
                        inputColapTextStrings2 = inputText.slice(cursorappControlsPos, inputText.length)
                        break
                    case undefined:
                        inputColapTextStrings1 = inputText.slice(0, cursorappControlsPos)
                        inputColapTextStrings2 = inputText.slice(cursorappControlsPos, inputText.length)
                        break
                    default:
                        novoColapsCursorPos--
                        rotinaCursor()
                }
                // introduz o cursor laranja
                let inputColapTextWithCursor = `${inputColapTextStrings1}<span id="pulse">|</span>${inputColapTextStrings2}`;
                leggeraVariables.stringCursorColap[0] = inputColapTextStrings1;
                leggeraVariables.stringCursorColap[1] = inputColapTextStrings2;
                // Preview do input
                let inputPreview = e.target.parentElement.nextElementSibling.children[1];
                inputPreview.innerHTML = inputColapTextWithCursor;
                // Mostra o save button
                const saveButton = e.target.nextElementSibling
                saveButton.classList.remove('no-display');
                const cancelButton = saveButton.nextElementSibling
                cancelButton.classList.remove('no-display');
            })();
        }
    }
    function gerarColapsaveis(e) {
        leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');
        let newCollapFinal = '';
        let newCollapseArray = [[], [], []];
        for (i = 1; i <= leggeraVariables.colapList.length; i++) {
            newCollapseArray[0][i - 1] = document.querySelector(`.colap-input-id-${i}`).value;
            newCollapseArray[1][i - 1] = document.querySelector(`.colap-input-h2-${i}`).value;
            newCollapseArray[2][i - 1] = document.querySelector(`.colap-input-body-${i}`).value;
            // wrapper do collapsavel
            let newCollap = leggeraMethods.mambo('div', '', 'row seccao-phcgo');
            // título
            let newCollapColTitulo = newCollap.appendChild(leggeraMethods.mambo('div', '', 'col-xs-8'));
            //link do h2
            let h2Link = newCollapColTitulo.appendChild(leggeraMethods.mambo('a'));
            h2Link.setAttribute('href', `#${newCollapseArray[0][i - 1]}`)
            h2Link.setAttribute('data-toggle', 'collapse');
            //h2
            let newtituloH2 = h2Link.appendChild(leggeraMethods.mambo('h2', '', 'manuais', newCollapseArray[1][i - 1]))
            newtituloH2.style.fontWeight = 'normal';
            //abrir/fechar
            let newCollapCol1 = newCollap.appendChild(leggeraMethods.mambo('div', '', 'col-xs-4 text-right'))
            //link do abrir/fechar
            let link = newCollapCol1.appendChild(leggeraMethods.mambo('a', '', '', 'Abrir/Fechar'));
            link.setAttribute('href', `#${newCollapseArray[0][i - 1]}`)
            link.setAttribute('data-toggle', "collapse")
            link.style.display = 'block'
            // wrapper do conteudo
            let newCollapConteudo = leggeraMethods.mambo('div', newCollapseArray[0][i - 1], 'collapse multi-collapse', newCollapseArray[2][i - 1]);
            newCollapFinal = newCollapFinal + `<!-- Início do Colapsável #${i} -->` + "\n" + (newCollap.outerHTML.toString() + "\n\n" + newCollapConteudo.outerHTML.toString() + "\n" + `<!-- Fim do Colapsável #${i} -->` + "\n")
        }
        // função para obter o texto antes do primeiro collap
        function topicoAntesColapsaveis() {
            let charCountAntes = leggeraVariables.textarea.value.search('<!-- Início do Colapsável #1 -->');
            // compatibilidade para tópicos pre-LEGGERA
            if (charCountAntes < 0) { charCountAntes = leggeraVariables.textarea.value.search('<div class="row seccao-phcgo">') }
            return textoAntesCollaps = leggeraVariables.textarea.value.slice(0, charCountAntes);
        }
        newCollapFinal = topicoAntesColapsaveis() + newCollapFinal;
        leggeraVariables.textarea.value = newCollapFinal;
        leggeraVariables.hcPreview.innerHTML = newCollapFinal;
        //obtem a nossa localização vertical ao gravar
        const whereWasI = document.querySelector('body').getBoundingClientRect().bottom;
        const totalHeight = document.querySelector('body').getBoundingClientRect().height;
        appControlsColap();
        leggeraMethods.autosave2JSON();
        // volta-nos a posicionar onde estávamos aquando da gravação (é necessário, porque o ecrã é re-escrito ao gravar)
        window.scrollTo(0, totalHeight - whereWasI);
    }
    function singleColapsavel() {
        // wrapper do collapsavel
        let newCollap = leggeraMethods.mambo('div');
        newCollap.classList = 'row seccao-phcgo';
        // título
        let newCollapColTitulo = newCollap.appendChild(leggeraMethods.mambo('div'))
        newCollapColTitulo.classList = 'col-xs-8'
        //link do h2
        let h2Link = newCollapColTitulo.appendChild(leggeraMethods.mambo('a'));
        h2Link.setAttribute('href', `#novo-colapsavel`)
        h2Link.setAttribute('data-toggle', 'collapse');
        //h2
        let newtituloH2 = h2Link.appendChild(leggeraMethods.mambo('h2'))
        newtituloH2.classList = 'manuais'
        newtituloH2.innerText = 'Novo colapsável'
        //abrir/fechar
        let newCollapCol1 = newCollap.appendChild(leggeraMethods.mambo('div'))
        newCollapCol1.classList = 'col-xs-4 text-right'
        //link do abrir/fechar
        let link = newCollapCol1.appendChild(leggeraMethods.mambo('a'));
        link.setAttribute('href', `#novo-colapsavel`)
        link.setAttribute('data-toggle', "collapse")
        link.innerText = 'Abrir/Fechar'
        // wrapper do conteudo
        let newCollapConteudo = leggeraMethods.mambo('div');
        newCollapConteudo.classList = 'collapse multi-collapse'
        newCollapConteudo.id = 'novo-colapsavel'
        newCollapConteudo.innerHTML = 'Conteúdo do novo colapsável aqui!'
        newCollapFinal = newCollap.outerHTML + newCollapConteudo.outerHTML
        return newCollapFinal
    }
    function novoColapsavel() {
        if (leggeraVariables.colapList.length === 0) {
            const abrirTodosDiv = '<br><a id="colapse-all-a" style="display: block;text-align: right;" data-toggle="collapse" data-target=".multi-collapse" href="#" role="button" aria-expanded="false"">Abrir Todos</a></p>'
            leggeraVariables.textarea.value = leggeraVariables.textarea.value + "\n" + abrirTodosDiv + "\n" + '<!-- Início do Colapsável #1 -->' + "\n" + (singleColapsavel().toString() + "\n" + '<!-- Fim do Colapsável #1 -->');
            leggeraVariables.textarea.value = leggeraVariables.textarea.value.replaceAll('<div class="collapse', "\n" + "\n" + '<div class="collapse')
            leggeraVariables.hcPreview.innerHTML = leggeraVariables.textarea.value;
            leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
            appControlsColap();
        } else {
            // babyproof, não deixa adicionar colapsável sem gravar alterações
            for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                let saveBtn = document.querySelector(`#colap-save-btn-${i}`);
                if (saveBtn.classList.contains('no-display') == false) {
                    alert(`Não é possível adicionar um novo colapsável, enquanto existirem alterações pendentes.`); return
                }
            }
            leggeraVariables.textarea.value = leggeraVariables.textarea.value + "\n" + '<!-- Início do Colapsável #' + (leggeraVariables.colapList.length + 1) + ' -->' + "\n" + (singleColapsavel().toString() + "\n" + '<!-- Fim do Colapsável #' + (leggeraVariables.colapList.length + 1) + ' -->');
            leggeraVariables.textarea.value = leggeraVariables.textarea.value.replaceAll('><div class="collapse', '>' + "\n" + "\n" + '<div class="collapse ')
            leggeraVariables.hcPreview.innerHTML = leggeraVariables.textarea.value;
            leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
            appControlsColap();
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
    //############ event listeners
    // Atualizar o botão dos menus conforme o menu onde estamos 
    const menus = document.querySelectorAll('.main-menu');
    for (menu of menus) { menu.addEventListener('click', leggeraMethods.updateWhereIAm) };
    document.querySelector('#quicksave-btn').addEventListener('click', leggeraMethods.quickSave);
    document.querySelector('#quickload-btn').addEventListener('click', leggeraMethods.quickLoad);
    document.querySelector('#logout-btn').addEventListener('click', leggeraMethods.logout);
    document.querySelector('#preview-btn').addEventListener('click', leggeraMethods.saveByPreviewBtn)
    document.querySelector('#ancora-btn').addEventListener('click', leggeraMethods.stickyTop);
    document.querySelector('#botoes-btn').addEventListener('click', leggeraButtons.displayControls);
    document.querySelector('#logos-btn').addEventListener('click', leggeraIcons.displayControls);
    document.querySelector('#textbox-btn').addEventListener('click', leggeraTextboxes.displayControls);
    document.querySelector('#listas-tabelas-btn').addEventListener('click', leggeraListsAndTables.displayControls);
    document.querySelector('#titulos-ligacoes-btn').addEventListener('click', appControlsTitulosELigacoes);
    document.querySelector('#manuals-btn').addEventListener('click', leggeraManuais.getManuals);
    // document.querySelector('#theme-btn').addEventListener('click', leggeraMethods.changeLeggeraTheme);
    document.addEventListener("keyup", leggeraMethods.newBr);
    leggeraVariables.textarea.addEventListener('keyup', leggeraUpdatePreviews.execute);
    leggeraVariables.textarea.addEventListener('click', leggeraUpdatePreviews.execute);

}