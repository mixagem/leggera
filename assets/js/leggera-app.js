/************************************/
/* supperleggera                    */
/* mambosinfinitos, 2022            */
/* featurelist:
    - helpcenter preview
    - helpcenter darkmode 
        (apenas vista de edição, o código gerado continua 100% compatível com o helpcenter live)
    - injetor caixas texto 
        (v2, com icons do material)
    - injetor de icons 
        (v2, icons do material e com seletor de cor)
    - injetor de buttons 
        (v2, com seletor de tema)
    - construtor de listas 
        (numeradas, não numeradas, e com links)
    - construtor de tabelas, com selector de estilos e injeção dos <style> necessários 
        (v3, com selector de estilos, inecção de <styles> e <!-- comentários informativos -->)
    - injetor de imagens
    - injetor de separador horizontal <hr>
    - injetor de títulos
        (v2, com preview to título)
    - construtor de links
    - editor live
        (atualização ao vivo do preview com a posição do cursor + com o que foi acabado de escrever + introdução de <br> ao carregar Enter)
        (limite de 100.000 caracteres, para evitar a baixa performance em tópicos muito longos)
        (inclui alerta [pulse vermelho] para icons fontawesome + topiclink [conteúdos antigos])
    - construtor de colapsáveis 
        (v4, inclui reformatação automática dos colapsáveis de tópicos antigos, para adicionar ligação ao título do colapsável ao gravar as alterações efetuadas)
    - ligação api hilite.me c/ formatação automática para helpcenter 
        (v3, json, vb.net, sql e typescript + identação + linhas numeradas)
    - importação & conversão de tabelas 
        (v3, remove os estilos que a tabela importada tem, e aplica o que estiver definido)
    - autosave / autoload - vai gravando o tópico em cache quando clickamos ou escrevemos na textarea principal (até 100.000 caracteres). 
        (ao carregar a página, vai buscar o tópico que ficou em cache caso exista)
    - quicksave / quickload 
        (segundo slot da cache, disponível através das ações respetivas)
    - userstats 
        (estatísticas do utilizador quando não foi encontrado nenhum tópico de manual)
        (v2, incluí preferências do utilizador)
    - cleancode™
        (formatação de todos os códigos injetados, de modo a adicionar quebras de linha onde justificável, de modo a tornar o código mais legível fora da aplicação)
    - titlescroller
        (flashback aos tempos do myspace e hi5. groovy af.) 
    - gestão completa de utilizadores 
        (páginas para signup, reset password, activate account, login)
        (incluí envio de email aquando do registo [para ativar a conta] + envio de email para resetar a password)
    - cookie login 
        (manter a sessão iniciada)
    - myManuals™ 
        (permite carregar, criar/atualizar e apagar novos tópicos)
        (incluí searchbox [v2, suporta procura incluída])

/************************************/
// Wrapper principal a ser invocado no login
function mixWrapper() {
    // ################ variáveis da aplicação
    const leggeraVariables = {
        // constante com o caminho da textarea principal
        textarea: document.querySelector('textarea'),
        // constante com o caminho da area de controlos
        appControls: document.querySelector('#app-controls-wrapper'),
        // constante com o caminho do preview helpcenter
        hcPreview: document.querySelector('#helpcenter-preview'),
        // constante com o caminho do wrapper dos colapsáveis
        colapHCPreview: document.querySelector('#colapsables-wrapper'),
        // constante com o caminho do botao da vista de colapsáveis
        botaoVistaColap: document.querySelector('#colap-btn'),
        // arrays variáveis a serem utilizados para guardar os slices das textareas, aquando da introdução de elementos
        stringCursor: [],
        stringCursorColap: [],
        // arrays variáveis onde vão ser guardados os colapsáveis existentes (.row .seccao-phcgo) a ser utilizado para a construção da vista de colapsáveis
        colapList: [],
        // variável com o valor da última textarea selecionada
        activeTextarea: '',
        // variável com o tipo de código selecionado para a construção da caixa de código HILITE.ME
        codeType: 'vbnet',
        // variável com o tipo de código selecionado para a construção da tabelas
        tableType: 'normal-table',
        // variável com o id da tabela 
        tableID: '',
        // variável com a cor selecionada para introdução de icons 
        currentColor: '#000000',
        // variável com o tema selecionado para introdução de botões
        currentTheme: 'horizon',
        // variável de controlo do autosave (a ser utilizado quando temos um tópico com 100.000+ chars)
        limitExceded: 0,
        // variável com a resposta do servidor com as estatísticas do utilizador
        userInfo: ''
    }
    // ################ funções para o preview do helpcenter (alertas + darkmode)
    const leggeraPreviewAdjustments = {
        // executa todas funções seguintes
        execute: function (convertedPreview) {
            if (Number(userWantAlerts) === 1) {
                convertedPreview = leggeraPreviewAdjustments.oldRelatedTopics(convertedPreview);
                convertedPreview = leggeraPreviewAdjustments.oldFontawesomeIcons(convertedPreview);
                convertedPreview = leggeraPreviewAdjustments.topicLinkAlert(convertedPreview);
            }
            convertedPreview = leggeraPreviewAdjustments.lightThemePreview(convertedPreview);
            convertedPreview = leggeraPreviewAdjustments.funkyBookmarks(convertedPreview);
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
        // alterações de contraste
        lightThemePreview: function (convertedPreview) {
            // só faz as alterações ao tema 0 (lightTheme[0] = Editor claro, preview escuro || lightTheme[1] = Editor escuro, preview claro) e quando fora da vista de colapsáveis
            if (Number(lightTheme) === 0 && (!leggeraVariables.botaoVistaColap.classList.contains('btn-info'))) {
                // black & white switcheroo
                convertedPreview = convertedPreview.replaceAll('rgb(224, 224, 224);" class="material-icons">', 'rgb(40, 40, 40);" class="material-icons">');
                convertedPreview = convertedPreview.replaceAll('rgb(0, 0, 0);" class="material-icons">', 'rgb(224, 224, 224);" class="material-icons">');
                // contraste no azul 
                convertedPreview = convertedPreview.replaceAll('rgb(26, 35, 126);" class="material-icons">', 'rgb(62, 112, 230);" class="material-icons">');
                // contraste no verde
                convertedPreview = convertedPreview.replaceAll('rgb(0, 77, 64);" class="material-icons">', 'rgb(0, 125, 104);" class="material-icons">');
                // contraste no <hr>
                convertedPreview = convertedPreview.replaceAll('solid rgb(238, 238, 238);', 'solid rgb(50, 50, 50);');
                // ajuste tabelas novas
                convertedPreview = convertedPreview.replaceAll(';border:solid 2px #fff;', ';border:solid 2px #111;');
                // ajuste tabelas antigas
                convertedPreview = convertedPreview.replaceAll('ext-align:left;background-color:#fff;padding:20px 10px;border:solid 1px #000', 'ext-align:left;background-color:transparent;padding:20px 10px;border:solid 1px #666');
                convertedPreview = convertedPreview.replaceAll('(1)>td{background-color:rgb(255, 225, 189)', '(1)>td{color:#000;background-color:rgb(255, 225, 189)');
                // ajuste na codebox do HiliteAPI 
                convertedPreview = convertedPreview.replaceAll(';border:solid #eb8475;', ';border:solid #147b8a;');
            }
            return convertedPreview;
        },
        // visibilidade dos marcaores 
        funkyBookmarks: function (convertedPreview) {
            convertedPreview = convertedPreview.replaceAll('<div id="marcador-', '<div class="funky-bookmarks" id="marcador-');
            convertedPreview = convertedPreview.replaceAll(' style="display: none;"></div>', '>### marcador ###</div>');

            return convertedPreview
        }
    }
    // ################ funções várias da aplicação
    const leggeraMethods = {
        // document.createElement, mais turbinada para reduzir umas quantas linhas de código
        mambo: function (ele, id = '', cla = '', inn = '', type = '', href = '', dt = '', tar = '') {
            const mambito = document.createElement(`${ele}`);
            if (id !== '') { mambito.id = `${id}` }
            if (cla !== '') { mambito.classList = `${cla}` }
            if (inn !== '') { mambito.innerHTML = `${inn}` }
            if (type !== '') { mambito.type = `${type}` }
            if (href !== '') { mambito.setAttribute('href', `${href}`) }
            if (dt !== '') { mambito.setAttribute('data-toggle', `${dt}`) }
            if (tar !== '') { mambito.setAttribute('target', `${tar}`) }
            return mambito
        },
        // obtem as estatísticas e preferências do utilizador
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
                    leggeraVariables.userInfo = rsp[0]; // cartão com as estatísticas do utilizador
                    userWantAlerts = rsp[1]; // rsp = 0 ou 1
                }
            })
        },
        // injetar o código HTML do elemento selecionado, na última posição do cursor
        escreveNaTextarea: function (outerHTML) {
            let novoSourceCode;
            // babyproof
            if (leggeraVariables.activeTextarea === '') { alert('Coloca o cursor numa área de texto antes de adicionar conteúdos.'); return }
            // O array stringCursor é composto por duas string, antes e depois do cursor
            // O novoSourceCode faz o concat das string, com o elemento a ser escrito na posição do cursor.
            novoSourceCode = `${leggeraVariables.stringCursor[0]}` + "\n" + `${outerHTML}` + "\n" + `${leggeraVariables.stringCursor[1]}`;
            if (leggeraVariables.activeTextarea.id === 'textarea') {
                // Atualiza a textarea
                leggeraVariables.textarea.value = novoSourceCode;
                // Atualiza o preview
                leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(novoSourceCode);
                // Atualiza a vista de colapsáveis
                leggeraCollapsables.appControlsColap();
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
        // guardar na cache do browser o código HTML do tópico presente na textarea
        autosave2JSON: function () {
            let textarea2JSON = JSON.stringify(leggeraVariables.textarea.value);
            localStorage.setItem('textarea', textarea2JSON);
        },
        // obtem a posição do cursor
        getCursorPos: function (e) {
            let eTarget = e.target;
            let cursorPos = eTarget.selectionStart;
            return cursorPos
        },
        // ancora para o cabeçalho do editor
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
        // escrever o <br> ao carregar Enter
        newBr: function (e) {
            if (e.target.tagName === 'TEXTAREA' && e.key === 'Enter' && e.target.id !== 'hilite-textarea') {
                leggeraMethods.escreveNaTextarea('<br>');
            }
        },
        //  atualizar o preview e guardar em cache manualmente (a ser utilizado quando o tópico tem 100.000+ chars)
        saveByPreviewBtn: function () {
            // altera a textarea utilizada
            leggeraVariables.activeTextarea = leggeraVariables.textarea;
            let novoSourceCode = leggeraVariables.textarea.value;
            // Atualiza o preview
            leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(novoSourceCode);
            // Atualiza a vista de colapsáveis
            leggeraCollapsables.appControlsColap();
            // Guarda as alterações em cache
            leggeraMethods.autosave2JSON();
        },
        // título da página auto-scroller
        titleScrol: setInterval(function () {
            let tituloPagina = document.title.toString();
            const updatedTituloPagina1 = tituloPagina.slice(0, 1)
            const updatedTituloPagina2 = tituloPagina.slice(1, tituloPagina.length)
            document.title = updatedTituloPagina2 + updatedTituloPagina1
        }, 500),
        // atualiza o tipo de código selecionado (Hilite.me API)
        updateCodeType: function (e) {
            leggeraVariables.codeType = e.target.id
        },
        // atualiza o tipo de tabela selecionado
        updateTableType: function (e) {
            leggeraVariables.tableType = e.target.id
        },
        // guarda o tópico num segundo slot da chache
        quickSave: function () {
            // babyproof
            if (leggeraVariables.textarea.value == '' || leggeraVariables.textarea.value == ' ') { return }
            const textarea2JSON = JSON.stringify(leggeraVariables.textarea.value);
            localStorage.setItem('quickSave', textarea2JSON);
            leggeraVariables.textarea.value = '';
            // caso a textarea esteja vazia, adiciona o cartão com estatísticas do utilizador
            leggeraVariables.hcPreview.innerHTML = '';
            leggeraMethods.displayUserStats();
            leggeraCollapsables.appControlsColap(); // refresh dos colapsáveis
            leggeraVariables.stringCursor = ['', '']; // reset à posição do cursor
            // Guarda as alterações em cache
            leggeraMethods.autosave2JSON();
        },
        // carrega o tópico presente no segundo slot da chache
        quickLoad: function () {
            const getTextareaFromJSON = localStorage.getItem('quickSave');
            // Atualiza a textarea
            leggeraVariables.textarea.value = JSON.parse(getTextareaFromJSON);
            // Atualiza o preview
            leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(JSON.parse(getTextareaFromJSON));
            // Atualiza a vista de colapsáveis
            leggeraCollapsables.appControlsColap();
            // Guarda as alterações em cache
            leggeraMethods.autosave2JSON();
            // Atualiza o preview outra vez (backup para quando a resposta do post não vem a tempo da primeira passagem)
            leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
        },
        // limpa a área de controlos, e preenche esta conforme a template selecioanda
        appControlsChange: function (template = '') {
            leggeraVariables.appControls.innerHTML = template;
        },
        // atualiza o botão do menu conforme a área de controlos selecioanda
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
        // logout
        logout: function () {
            localStorage.removeItem('bolachinha');
            localStorage.removeItem('lightTheme');
            localStorage.removeItem('session');
            location.reload();
        },
        // altera o tema da aplicação
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
                leggeraMethods.displayUserStats('opcao-tema');
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
                    leggeraMethods.displayUserStats('opcao-tema');
                },
                error: function (rsp) {
                    leggeraVariables.hcPreview.innerHTML = '';
                    leggeraMethods.displayUserStats('opcao-tema');
                }
            })
        },
        // ativar/desativar os alertas
        updateWantAlerts: function () {
            if (Number(userWantAlerts) === 1) {
                userWantAlerts = 0;
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
                        leggeraMethods.displayUserStats('opcao-alertas');
                    },
                    error: function (rsp) {
                        leggeraVariables.hcPreview.innerHTML = '';
                        leggeraMethods.displayUserStats('opcao-alertas');
                    }
                })
            } else {
                userWantAlerts = 1;
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
                        leggeraMethods.displayUserStats('opcao-alertas');
                    },
                    error: function (rsp) {
                        leggeraVariables.hcPreview.innerHTML = '';
                        leggeraMethods.displayUserStats('opcao-alertas');
                    }
                })
            }
        },
        // mostrar o painel de estatísticas do utilizador
        displayUserStats: function (action = 'no-change') {
            // user-stats
            const userPanelWrapper = leggeraVariables.hcPreview.appendChild(leggeraMethods.mambo('div', id = 'user-panel-container', cla = '', inn = `${leggeraVariables.userInfo}`));

            // user-options
            const userOptions = userPanelWrapper.appendChild(leggeraMethods.mambo('div', id = 'user-options', cla = '', inn = 'Alerta conteúdos antigos&nbsp;&nbsp;&nbsp;&nbsp;'));

            // ### Alerta conteúdos antigos
            const alertToggle = userOptions.appendChild(leggeraMethods.mambo('span', id = 'alerts-toggle', cla = `mix-toggle-${userWantAlerts}`));
            const wantAlertsOption = alertToggle.appendChild(leggeraMethods.mambo('span', id = 'wantalerts-radio-option', cla = 'material-icons'));
            const wantAlertsOptionBG = alertToggle.appendChild(leggeraMethods.mambo('span', id = 'wantalerts-radio-option-bg'));
            alertToggle.addEventListener('click', leggeraMethods.updateWantAlerts)

            // ### darktheme
            let lightThemeFix;
            if (Number(lightTheme) === 1) { lightThemeFix = '0' } else { lightThemeFix = '1' }
            const userOptions2 = userPanelWrapper.appendChild(leggeraMethods.mambo('div', id = 'user-options-2', cla = '', inn = 'Tema escuro&nbsp;&nbsp;&nbsp;&nbsp;'));
            const themeToggle = userOptions2.appendChild(leggeraMethods.mambo('span', id = 'darktheme-toggle', cla = `mix-toggle-${lightThemeFix}`));
            const changeThemeOption = themeToggle.appendChild(leggeraMethods.mambo('span', id = 'wantalerts-radio-option-2', cla = 'material-icons'));
            const changeThemeOptionBG = themeToggle.appendChild(leggeraMethods.mambo('span', id = 'wantalerts-radio-option-bg-2'));
            themeToggle.addEventListener('click', leggeraMethods.changeLeggeraTheme)

            function toogleStatus(toogle, status) {
                switch (status) {
                    case 'true':
                        toogle.innerHTML = 'check_circle';
                        toogle.style.color = 'rgb(1, 100, 1)'
                        break;
                    case 'false':
                        toogle.innerHTML = 'cancel'
                        toogle.style.color = 'rgb(104, 1, 1)'
                        break;
                }
            }

            // switch para as animações das opções menu (está totil ineficiente. kinda.)
            switch (action) {
                // default, quando não é alterado nada
                case 'no-change':
                    // opção alerta conteudos antigos 
                    switch (Number(userWantAlerts)) {
                        case 0:
                            toogleStatus(wantAlertsOption, 'false')
                            break;
                        case 1:
                            toogleStatus(wantAlertsOption, 'true')
                            break;
                    }
                    // opção tema escuro
                    switch (Number(lightTheme)) {
                        case 1:
                            toogleStatus(changeThemeOption, 'false')
                            break;
                        case 0:
                            toogleStatus(changeThemeOption, 'true')
                            break;
                    }
                    leggeraListeners.allEvents();
                    break;
                //  quando é alterado os alertas
                case 'opcao-alertas':
                    // opção alerta conteudos antigos 
                    switch (Number(userWantAlerts)) {
                        case 0:
                            toogleStatus(wantAlertsOption, 'false')
                            wantAlertsOption.classList = 'material-icons animate__animated animate__slideInRight';
                            wantAlertsOptionBG.classList = 'animate__animated animate__slideInRight';
                            break;
                        case 1:
                            toogleStatus(wantAlertsOption, 'true')
                            wantAlertsOption.classList = 'material-icons animate__animated animate__slideInLeft';
                            wantAlertsOptionBG.classList = 'animate__animated animate__slideInLeft';
                            break;
                    }
                    // opção tema escuro
                    switch (Number(lightTheme)) {
                        case 1:
                            toogleStatus(changeThemeOption, 'false')
                            break;
                        case 0:
                            toogleStatus(changeThemeOption, 'true')
                            break;
                    }
                    leggeraListeners.allEvents();
                    break;
                //  quando é alterado os temas
                case 'opcao-tema':
                    switch (Number(userWantAlerts)) {
                        case 0:
                            toogleStatus(wantAlertsOption, 'false')
                            break;
                        case 1:
                            toogleStatus(wantAlertsOption, 'true')
                            break;
                    }
                    switch (Number(lightTheme)) {
                        case 1:
                            toogleStatus(changeThemeOption, 'false');
                            changeThemeOption.classList = 'material-icons animate__animated animate__slideInRight';
                            changeThemeOptionBG.classList = 'animate__animated animate__slideInRight';
                            break;
                        case 0:
                            toogleStatus(changeThemeOption, 'true');
                            changeThemeOption.classList = 'material-icons animate__animated animate__slideInLeft';
                            changeThemeOptionBG.classList = 'animate__animated animate__slideInLeft';
                            break;
                    }
                    leggeraListeners.allEvents();
                    break;
            }
        },
    }
    // ################ funções para atualizar o preview com o cursor laranja/azul
    const leggeraUpdatePreviews = {
        execute: function (e) {

            // babyproof caso existam alterações pendentes na vista colapsáveis
            if (leggeraVariables.botaoVistaColap.classList.contains('btn-info')) {
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
                leggeraCollapsables.appControlsColap();
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
            // guarda num array as keywords
            const keyword = document.querySelector('#save-manual-input').value.toLowerCase().split(" ");
            // obtem o numero de manuais do utilizador
            const numManuais = document.querySelector('#modal-container tbody').childElementCount;
            // para procura contida
            if (document.querySelector('#procura-contida').checked) {
                for (i = 1; i <= numManuais; i++) {
                    for (x = 0; x < keyword.length; x++) {
                        // procura as keywords no texto do manual
                        if (leggeraManuais.manuaisUtilizador[i - 1].toLowerCase().includes(keyword[x])) {
                            document.querySelector('#modal-container tbody').children[i - 1].classList.remove('no-display');
                        } else {
                            document.querySelector('#modal-container tbody').children[i - 1].classList.add('no-display');
                            break
                        }
                    }
                }
                // para procura normal
            } else {
                for (i = 1; i <= numManuais; i++) {
                    for (x = 0; x < keyword.length; x++) {
                        // procura as keywords no título do manual
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
            if (!document.querySelector('.app-grid').classList.contains('no-display')) { document.querySelector('.app-grid').classList.add('no-display') }
            // cabeçalho
            const myManualsModal = document.querySelector('body').appendChild(leggeraMethods.mambo('div', id = 'manuals-modal', cla = '', inn = leggeraTemplates.myManualsHeader));
            document.querySelector('#save-manual-input').addEventListener('keyup', leggeraManuais.myManualsFilterResults);
            document.querySelector('#save-manual-btn').addEventListener('click', leggeraManuais.saveManual);
            document.querySelector('#back-home-btn').addEventListener('click', leggeraManuais.backHome);
            // secção com os manuais    
            const manualsWrapper = myManualsModal.appendChild(leggeraMethods.mambo('div', id = 'my-manuals-wrapper'));
            // tabela para manuais
            const modalTable = manualsWrapper.appendChild(leggeraMethods.mambo('table', id = 'modal-container'));
            const modalHeader = modalTable.appendChild(leggeraMethods.mambo('thead'));
            modalHeader.appendChild(leggeraMethods.mambo('th', id = '', cla = '', inn = 'Título do Manual'))
            modalHeader.appendChild(leggeraMethods.mambo('th', id = '', cla = 'text-right', inn = 'Última atualização'))
            modalHeader.appendChild(leggeraMethods.mambo('th')) // para o save btn
            modalHeader.appendChild(leggeraMethods.mambo('th')) // para o delete btn
            const modalBody = modalTable.appendChild(leggeraMethods.mambo('tbody'));
            // loop para manuais
            for (i = 0; i < rsp.length; i++) {
                let modalRow = modalBody.appendChild(leggeraMethods.mambo('tr', id = `manual-${i + 1}`, cla = `animate__animated animate__fadeInUp`))
                if (i % 2 === 0) { modalRow.classList.add('manual-impar') } else { modalRow.classList.add('manual-par') }
                // nome do manual
                modalRow.appendChild(leggeraMethods.mambo('td', id = '', cla = '', inn = rsp[i].title))
                modalRow.lastChild.addEventListener('click', function (e) { leggeraManuais.getManualCode(e, rsp); });
                // timestamp
                let data = new Date(Number(rsp[i].timestamp));
                modalRow.appendChild(leggeraMethods.mambo('td', id = '', cla = '', inn = `${data.toLocaleDateString('pt-PT', { dateStyle: 'short' })} @ ${data.toLocaleTimeString('pt-PT', { timeStyle: 'short' })}`))
                // save btn
                modalRow.appendChild(leggeraMethods.mambo('td', id = '', cla = '', inn = `<i class="lni lni-save"></i>`))
                modalRow.lastChild.addEventListener('click', leggeraManuais.saveManual);
                // delete btn
                modalRow.appendChild(leggeraMethods.mambo('td', id = '', cla = '', inn = `<i class="lni lni-eraser"></i>`))
                modalRow.lastChild.addEventListener('click', leggeraManuais.deleteManual);
            }
        },
        // Vai buscar o código HTML do manual selecionado
        getManualCode: function (e, rsp) {
            const promptValue = window.prompt('Tens a certeza que queres carregar este tópico? O tópico presente no editor será discartado e não poderá ser recuperado.\n\nCarrega OK para continuar, ou Cancelar para abortar a operação. ');
            if (promptValue !== null) {
                const manualID = e.target.parentElement.id;
                // mostra a app
                document.querySelector('.app-grid').classList.remove('no-display');
                document.querySelector('#manuals-modal').remove();                                                                                                              // 01234567    
                leggeraVariables.textarea.value = rsp[Number(manualID.slice(7, manualID.length)) - 1].code;// este 7 serve para selecionar o inicio da string que vem do manualID (manual-1)
                // Atualiza o preview
                leggeraVariables.hcPreview.innerHTML = leggeraVariables.textarea.value;
                leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
                leggeraCollapsables.appControlsColap();
                // Guarda as alterações em cache
                leggeraMethods.autosave2JSON();
            }
        },
        // cria/atualiza o manual
        saveManual: function (e) {
            // caso novo manual, vai buscar o nome do input da searchbox
            let manualName = document.querySelector('#save-manual-input').value;

            // caso a função seja invocada através do botão save, o nome é o que está exibido na linha (bom misclick correction)
            if (e.target.tagName === "TD" || e.target.tagName === "I") {
                if (e.target.tagName === "TD") { manualName = e.target.parentElement.firstChild.innerText };
                if (e.target.tagName === "I") { manualName = e.target.parentElement.parentElement.firstChild.innerText };
                let promptValue = window.prompt(`Tens a certeza que queres atualizar o tópico "${manualName}"?\n\nCarrega OK para continuar, ou Cancelar para abortar a operação. `);
            } else { let promptValue = ""; }

            if (leggeraManuais.promptValue !== null) {
                // babyproof para guardar em BD em problemas
                let manualText = document.querySelector('#textarea').value;
                manualText = manualText.replaceAll("'", '&apos;')
                manualText = manualText.replaceAll("“", '"')
                manualText = manualText.replaceAll("”", '"')
                $.ajax({
                    type: "POST",
                    url: "assets/php/manualsupdate.php",
                    dataType: "text",
                    data: {
                        username: loggedinUser,
                        manual: manualName,
                        timestamp: Date.now(),
                        action: 'save',
                        code: manualText
                    },
                    success: function (rsp) {
                        if (rsp.startsWith('Err')) { console.log('fudeu') }
                        else if (rsp.includes('atual')) {
                            alert('tópico atualizado com sucesso');
                            // mostra a app
                            document.querySelector('.app-grid').classList.remove('no-display');
                            document.querySelector('#manuals-modal').remove();
                        } else {
                            alert('tópico criado com sucesso');
                            // mostra a app
                            document.querySelector('.app-grid').classList.remove('no-display');
                            document.querySelector('#manuals-modal').remove();
                        }
                    }
                })
            }
        },
        // volta para o editor
        backHome: function () {

            // caso a textarea esteja vazia, mostra as estatísticas do utilizador
            if (leggeraVariables.activeTextarea.value === '') {
                leggeraVariables.hcPreview.innerHTML = '';
                leggeraMethods.displayUserStats();
            }
            // mostra a app
            document.querySelector('.app-grid').classList.remove('no-display');
            document.querySelector('#manuals-modal').remove();
        },
        deleteManual: function (e) {
            let eTarget = e.target;
            // babyproof para misclicks
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
                            document.querySelector('.app-grid').classList.remove('no-display');
                            document.querySelector('#manuals-modal').remove();
                        }
                    }
                })
            }
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
            // quebra de linha
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
        const userinfoDelay = setTimeout(function () {
            if (leggeraVariables.textarea.value === '') {
                leggeraMethods.displayUserStats();
            } else {
                leggeraVariables.hcPreview.innerHTML = '';
                leggeraVariables.hcPreview.appendChild(leggeraMethods.mambo('span', id = '', cla = '', inn = 'Encontrei um tópico em cache. A carregar...'));
                setTimeout(function () {
                    leggeraVariables.hcPreview.innerHTML = leggeraVariables.textarea.value;
                    leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
                }, 1000);
            }
        }, 1000)
    })();
    // ################ textboxes
    const leggeraTextboxes = {
        // método para atualizar o appControls com as textboxes
        displayControls: function () {
            // limpa o appControls + inicia paginador
            leggeraVariables.appControls.innerHTML = '';
            // anexar o wrapper ao appControls 
            const textboxControls = leggeraVariables.appControls.appendChild(leggeraMethods.mambo('div', id = 'textbox-wrapper', cla = `row`));
            // anexa as textboxes ao wrapper
            for (i = 1; i <= leggeraGOAssets.textboxesFromDB.length; i++) {
                if (i >= 4) { textboxControls.appendChild(leggeraMethods.mambo('div', id = `textbox-${i}`, cla = 'col-sm-6 helpcenter-textbox', inn = leggeraGOAssets.textboxesFromDB[i - 1])); }
                else { textboxControls.appendChild(leggeraMethods.mambo('div', id = `textbox-${i}`, cla = 'col-sm-4 helpcenter-textbox', inn = leggeraGOAssets.textboxesFromDB[i - 1])); }
                textboxControls.lastChild.addEventListener('click', leggeraTextboxes.write)
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
            const appControlsIcons = leggeraVariables.appControls.appendChild(leggeraMethods.mambo('div', id = '', cla = `row`));
            // Anexar o wrapper de icons (row 24 icons) ao wrapper principal
            let appControlsIconsMainWrapper = appControlsIcons.appendChild(leggeraMethods.mambo('div', id = '', cla = `row icon-row-wrapper icon-row-${nWrapper}`));
            // Anexar um sub-wrapper de icons (col 12 icons)
            let appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(leggeraMethods.mambo('div', id = '', cla = `col-sm-6 icon-sub-row-${nSubWrapper}`));
            for (i = 1; i <= leggeraGOAssets.iconsFromDB.length; i++) {
                // A cada 24 interações, cria uma nova row de 24 icons
                if ((i % 24) === 0) {
                    appControlsIconsSubWrapper.appendChild(leggeraMethods.mambo('div', id = `icon-${i}`, cla = 'col-sm-1 phcgo-icon', inn = leggeraGOAssets.iconsFromDB[i - 1]));
                    appControlsIconsSubWrapper.lastChild.addEventListener('click', leggeraIcons.writeIcon);
                    nSubWrapper = 1;
                    nWrapper++;
                    appControlsIconsMainWrapper = appControlsIcons.appendChild(leggeraMethods.mambo('div', id = '', cla = `row icon-row-wrapper icon-row-${nWrapper}`));
                    appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(leggeraMethods.mambo('div', id = '', cla = `col-sm-6 icon-sub-row-${nSubWrapper}`));
                }
                // A cada 12 interações, cria um novo row de 12 icons
                else if ((i % 12) === 0) {
                    appControlsIconsSubWrapper.appendChild(leggeraMethods.mambo('div', id = `icon-${i}`, cla = 'col-sm-1 phcgo-icon', inn = leggeraGOAssets.iconsFromDB[i - 1]));
                    appControlsIconsSubWrapper.lastChild.addEventListener('click', leggeraIcons.writeIcon);
                    nSubWrapper++;
                    appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(leggeraMethods.mambo('div', id = '', cla = `col-sm-6 icon-sub-row-${nSubWrapper}`));
                }
                else {
                    appControlsIconsSubWrapper.appendChild(leggeraMethods.mambo('div', id = `icon-${i}`, cla = 'col-sm-1 phcgo-icon', inn = leggeraGOAssets.iconsFromDB[i - 1]));
                    appControlsIconsSubWrapper.lastChild.addEventListener('click', leggeraIcons.writeIcon);
                }
            }
            const colorPickerRow = appControlsIcons.appendChild(leggeraMethods.mambo('div', id = 'color-picker'));
            const colorTable = ['#000000', '#e0e0e0', '#1a237e', '#b70505', '#ff8f00', '#004d40']
            for (i = 1; i <= colorTable.length; i++) {
                if (i === 1) {
                    colorPickerRow.appendChild(leggeraMethods.mambo('div', id = `icon-color-${i}`, cla = 'color-pick selected-color', inn = '<i class="lni lni-checkmark unselected-i"></i>'))
                } else {
                    colorPickerRow.appendChild(leggeraMethods.mambo('div', id = `icon-color-${i}`, cla = 'color-pick', inn = '<i class="lni lni-checkmark unselected-i"></i>'))
                }
                colorPickerRow.lastChild.value = colorTable[i - 1];
                colorPickerRow.lastChild.addEventListener('click', leggeraIcons.changeCurrentColor);
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
            leggeraMethods.appControlsChange();
            // Anexar ao appControls o wrapper principal
            let appControlsButton = leggeraVariables.appControls.appendChild(leggeraMethods.mambo('div', id = '', cla = `row page-1`));
            // Anexar ao wrapper principal uma linha de 4 buttons
            let appControlsButtonWrapper = appControlsButton.appendChild(leggeraMethods.mambo('div', id = '', cla = 'row phc-buttons'));
            for (i = 1; i <= 15; i++) {
                // A cada 5buttons, cria uma nova linha
                if (i % 5 === 0) {
                    appControlsButtonWrapper.appendChild(leggeraMethods.mambo('div', id = `botao-${leggeraVariables.currentTheme}-${i}`, cla = 'botao col-sm-2', inn = leggeraGOAssets.buttonsFromDB[control - 1][i - 1]));
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
                    appControlsButtonWrapper = appControlsButton.appendChild(leggeraMethods.mambo('div', id = '', cla = 'row phc-buttons'));
                } else {
                    appControlsButtonWrapper.appendChild(leggeraMethods.mambo('div', id = `botao-${leggeraVariables.currentTheme}-${i}`, cla = 'botao col-sm-2', inn = leggeraGOAssets.buttonsFromDB[control - 1][i - 1]));
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
            const themePickerRow = leggeraVariables.appControls.firstChild.appendChild(leggeraMethods.mambo('div', id = 'theme-picker', cla = 'row'));
            const themeTable = ['horizon', 'forest', 'dark', 'light']
            for (i = 1; i <= 4; i++) {
                if (i === control) {
                    themePickerRow.appendChild(leggeraMethods.mambo('div', id = `theme-${i}`, cla = 'theme-pick selected-theme', inn = `<i class="lni lni-checkmark unselected-i"></i>`))
                }
                else {
                    themePickerRow.appendChild(leggeraMethods.mambo('div', id = `theme-${i}`, cla = 'theme-pick', inn = `<i class="lni lni-checkmark unselected-i"></i>`))
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
    const leggeraTemplates = {
        listsAndTables: '<div class="row lists-tables-wrapper"> <div id="listas-wrapper" class="col-sm-5"> <div id="header-listas" class="row"><i class="lni lni-list gold"></i>&nbsp;&nbsp;Gerador de listas</div><div class="row"> <div class="col-sm-8"><span id="tipo-lista-span">Tipo de lista</span></div><div class="col-sm-3"><span id="num-itens-span">Itens</span></div><div class="col-sm-1"></div></div><div class="row"> <div class="col-sm-8"><select id="tipo-lista-dropdown"> <option value="ul">&nbsp;Não ordenada</option> <option value="ol-1">&nbsp;Ordenada numérica</option> <option value="ol-a">&nbsp;Ordenada alfabética</option> </select></div><div class="col-sm-3"><input id="num-itens-input" type="number"></div><div class="col-sm-1"></div></div><div class="row"> <div id="preview-list-row" class="col-sm-8"> <ul style="list-style-position: inside;"> <li><b>Item 1:</b> Lorem Ipsum</li><li><b>Item 2:</b> Lorem Ipsum</li><li><b>Item 3:</b> Lorem Ipsum</li></ul> </div><div class="col-sm-4"><input id="want-links-checkbox" type="checkbox"><span id="want-links-span">&nbsp;&nbsp;&nbsp;Links ?</span></div><div class="col-sm-12 text-center"><button id="create-list-btn" class="btn btn-success"><i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir lista</button></div><div class="col-sm-12 novo-separador"><span><i class="lni lni-page-break gold"></i> Separador horizontal<br></span><button id="nova-quebra-btn" class="btn btn-success"><i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir separador horizontal</button> </div></div></div><div id="tabelas-wrapper" class="col-sm-7"> <div id="header-tabelas" class="row"><i class="lni lni-layout gold"></i>&nbsp;&nbsp;Gerador de tabelas</div><div class="row"> <div class="col-sm-2"><span id="num-linhas-span">Linhas</span><input id="num-linhas-input" type="number"> </div><div class="col-sm-2"><span id="num-colunas-span">Colunas</span><input id="num-colunas-input" type="number"></div><div class="col-sm-3"><span id="table-id-span">ID tabela</span><input id="table-id-input"></div><div class="col-sm-5" id="import-table-btn"><button class="btn btn-warning"><i class="lni lni-code"></i>&nbsp;&nbsp;Importar tabela</button></div></div><div class="row"> <div class="col-sm-7" id="cria-tabela-checkbox-wrapper"><input id="normal-table" type="radio" name="tablestyle" checked="true"><span>&nbsp;&nbsp;Original</span><input id="modern-table" type="radio" name="tablestyle"><span>&nbsp;&nbsp;Moderna</span><br><input id="modern-table-blue" type="radio" name="tablestyle"><span>&nbsp;&nbsp;Moderna azul</span></div><div class="col-sm-5" id="cria-tabela-btn-div"><button id="add-table" class="btn btn-success"><i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir tabela</button></div><div class="col-sm-12 nova-imagem"><span id="imageb64-span"><i class="lni lni-gallery gold"></i>&nbsp;&nbsp;Carregar imagem<br></span> <form id="upload-form" method="post" enctype="multipart/form-data"><input id="file-upload-input" type="file" name="file-upload-input"></form><input id="imagem-centrada" type="checkbox"><span id="imagem-centrada-span">&nbsp;&nbsp;&nbsp;Centrar imagem</span><button id="nova-imagem-btn" class="btn btn-success"><i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir imagem</button> </div></div></div></div>',
        titlesAndLinks: '<div class="row titles-links-wrapper"> <div id="left-wrapper" class="col-sm-8"> <div id="gerador-titulos" class="row"><span><i class="lni lni-pilcrow gold"></i>&nbsp;Gerador de títulos</span><div class="row"> <div class="col-sm-1"></div><div class="col-sm-11"><span id="tipo-lista-span">Tipo de título</span></div></div><div class="row"> <div class="col-sm-1"></div><div class="col-sm-6"><select id="tipo-titulo-dropdown"> <option value="old1">&nbsp;Título H1</option> <option value="old2">&nbsp;Título H2</option> <option value="old3">&nbsp;Título H3</option> <option value="default1">&nbsp;Título H1 (alternativo)</option> <option value="default2">&nbsp;Título H2 (alternativo)</option> <option value="default3">&nbsp;Título H3 (alternativo)</option> </select></div><div class="col-sm-5"><button id="add-title" class="btn btn-success"><i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir título</button></div></div></div><div class="row"> <div id="preview-heading-row" class="col-sm-12 text-center"> <h1>Título/Heading 1</h1> </div></div><div class="row title-link-filler"></div><div class="row gerador-links-wrapper"> <div id="gerador-links-h1" class="col-sm-12"><i class="lni lni-website gold"></i>&nbsp;&nbsp;Gerador de links</div><div class="col-sm-2 text-left"><span id="nome-span">Descrição:</span></div><div class="col-sm-5"><input id="nome-input"></div><div class="col-sm-4 nova-ligacao-btn-col"><button id="add-link" class="btn btn-success"><i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir ligação</button></div><div class="col-sm-1"></div><div class="col-sm-2 text-left"><span id="link-span">URL:</span></div><div class="col-sm-5"><input id="link-input"></div></div><div class="row title-link-filler"></div><div class="row gerador-marcadores-wrapper"> <div id="gerador-marcadores-h1" class="col-sm-12"><i class="lni lni-bookmark-alt gold"></i>&nbsp;&nbsp;Gerador de marcadores</div><div class="col-sm-3 text-left"><span id="marcador-nome-span">Novo marcador:</span></div><div class="col-sm-4"><input id="marcador-nome-input"></div><div class="col-sm-1"></div><div class="col-sm-4 novo-marcador-btn-col"><button id="new-bookmark" class="btn btn-success"><i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir Marcador</button></div><div class="col-sm-3 text-left"><span id="marcador-link-span">Marcadores:</span></div><div class="col-sm-4"><select id="marcadores-dropdown" disabled> <option value="no-bookmark">-- não existem marcadores neste manual --</option> </select></div><div class="col-sm-1"></div><div class="col-sm-4 novo-marcador-btn-col"><button id="separador-add-link" class="btn btn-success"><i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir Ligação</button></div></div></div><div id="hilite-wrapper" class="col-sm-4"> <div id="hilite-subwrapper" class="row"><i class="lni lni-skipping-rope gold"></i>&nbsp;&nbsp;Hilite.me API </div><div class="row"> <div class="col-sm-12"><textarea id="hilite-textarea"></textarea> <div id="hilite-radio-row" class="row"> <div class="col-sm-3"><input id="vbnet" type="radio" name="hilite" checked="true"><span>&nbsp;&nbsp;VB</span></div><div class="col-sm-3"><input id="ts" type="radio" name="hilite"><span>&nbsp;&nbsp;&nbsp;TS</span> </div><div class="col-sm-3"><input id="json" type="radio" name="hilite"><span>&nbsp;&nbsp;JSON</span> </div><div class="col-sm-3"><input id="sql" type="radio" name="hilite"><span>&nbsp;&nbsp;SQL</span> </div></div><div class="row"> <div class="col-sm-12 line-numbers"><input id="line-numbers" type="checkbox"><span>&nbsp;&nbsp;Linhas numeradas</span></div></div><button id="add-hilite" class="btn btn-warning"><i class="lni lni-code"></i>&nbsp;&nbsp;Introduzir código</button> </div></div></div></div>',
        myManualsHeader: '<div id="savemanual-container" class="row"><div class="col-sm-8 text-left"><h1>Nome do manual</h1><input id="save-manual-input"><div id="contida-wrapper"><input id="procura-contida" type="checkbox">&nbsp;&nbsp;&nbsp;Procura contida?</div></div><div class="col-sm-2 text-left"><button id="save-manual-btn" class="btn btn-success"><i class="lni lni-save"></i>&nbsp;&nbsp;Guardar Manual</button></div><div id="close-myManuals-wrapper" class="col-sm-2 text-right"><button id="back-home-btn" class="btn btn-light"><i class="lni lni-reply"></i>&nbsp;&nbsp;Voltar ao editor</button></div></div>',
    }
    // ################ listas, tabelas, separador horizontal & carregamento de imagens
    const leggeraListsAndTables = {
        displayControls: function () {
            // Limpa o appcontrols e vai buscar a template do ecrã 
            leggeraMethods.appControlsChange(leggeraTemplates.listsAndTables);
            // ########## Listas ##########
            document.querySelector('#tipo-lista-dropdown').addEventListener('change', leggeraListsAndTables.listPreview)
            document.querySelector('#create-list-btn').addEventListener('click', leggeraListsAndTables.writeList)
            // ########## Separador Horizontal ##########
            document.querySelector('#nova-quebra-btn').addEventListener('click', leggeraListsAndTables.writeHR);
            // ########## Tabelas ##########
            leggeraVariables.tabletype = 'normal-table'
            document.querySelector('#import-table-btn').addEventListener('click', leggeraListsAndTables.convertTable);
            for (radio of document.querySelectorAll('#cria-tabela-checkbox-wrapper input')) { radio.addEventListener('click', leggeraMethods.updateTableType) }
            document.querySelector('#add-table').addEventListener('click', leggeraListsAndTables.writeTable);
            document.querySelector('#nova-imagem-btn').addEventListener('click', leggeraListsAndTables.writeImage);
        },
        // Função para atualizar com o tipo de lista selecionada
        listPreview: function () {
            const valorTipoLista = document.querySelector('#tipo-lista-dropdown').value;
            let previewWrapper = document.querySelector('#preview-list-row');
            switch (valorTipoLista) {
                case 'ul':
                    previewWrapper.innerHTML = '';
                    novaListaPreview = previewWrapper.appendChild(leggeraMethods.mambo('ul', id = '', cla = 'preview-list'));
                    novaListaPreview.style.listStylePosition = "inside";
                    for (i = 1; i <= 3; i++) {
                        novoItemPreview = novaListaPreview.appendChild(leggeraMethods.mambo('li', id = '', cla = 'preview-item', inn = `<b>Item ${i}:</b> Lorem Ipsum`));
                    }
                    break
                case 'ol-1':
                    previewWrapper.innerHTML = '';
                    novaListaPreview = previewWrapper.appendChild(leggeraMethods.mambo('ol', id = '', cla = 'preview-list', inn = '', type = '1'));
                    novaListaPreview.style.listStylePosition = "inside";
                    for (i = 1; i <= 3; i++) {
                        novoItemPreview = novaListaPreview.appendChild(leggeraMethods.mambo('li', id = '', cla = 'preview-item', inn = `<b>Item ${i}:</b> Lorem Ipsum`));
                    }
                    break
                case 'ol-a':
                    previewWrapper.innerHTML = '';
                    novaListaPreview = previewWrapper.appendChild(leggeraMethods.mambo('ol', id = '', cla = 'preview-list', inn = '', type = 'a'));
                    novaListaPreview.style.listStylePosition = "inside";
                    for (i = 1; i <= 3; i++) {
                        novoItemPreview = novaListaPreview.appendChild(leggeraMethods.mambo('li', id = '', cla = 'preview-item', inn = `<b>Item ${i}:</b> Lorem Ipsum`));
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
            if ((isNaN(n))
                || n <= 0) { alert('O valor para o número de itens não é válido (só aceito números positivos, acima de zero).'); return }
            // Declarar variávis para o Switch
            let novaLista = '';
            switch (tipo) {
                case 'ul':
                    novaLista = leggeraMethods.mambo('ul');
                    novaLista.style.listStylePosition = 'inside';
                    for (i = 1; i <= n; i++) {
                        if (wantLinks) { novaLista.appendChild(leggeraMethods.mambo('li', id = '', cla = '', inn = `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                            novaLista.appendChild(leggeraMethods.mambo('li', id = '', cla = '', inn = `<b>Item ${i}:</b> Lorem ipsum`));
                    }
                    // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
                    novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                    leggeraMethods.escreveNaTextarea(novaLista);
                    break;
                case 'ol-1':
                    novaLista = leggeraMethods.mambo('ol', id = '', cla = '', inn = '', type = '1');
                    novaLista.style.listStylePosition = "inside";
                    for (i = 1; i <= n; i++) {
                        if (wantLinks) { novaLista.appendChild(leggeraMethods.mambo('li', id = '', cla = '', inn = `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                            novaLista.appendChild(leggeraMethods.mambo('li', id = '', cla = '', inn = `<b>Item ${i}:</b> Lorem ipsum`));
                    }
                    novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                    leggeraMethods.escreveNaTextarea(novaLista);
                    break;
                case 'ol-a':
                    novaLista = leggeraMethods.mambo('ol', id = '', cla = '', inn = '', type = 'a');
                    novaLista.style.listStylePosition = 'inside';
                    for (i = 1; i <= n; i++) {
                        if (wantLinks) { novaLista.appendChild(leggeraMethods.mambo('li', id = '', cla = '', inn = `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                            novaLista.appendChild(leggeraMethods.mambo('li', id = '', cla = '', inn = `<b>Item ${i}:</b> Lorem ipsum`));
                    }
                    novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                    leggeraMethods.escreveNaTextarea(novaLista);
                    break;
            }
        },

        // id tabela para suporte de multi tabelas
        tableID: document.querySelector('#table-id-input'),
        // Estilos a serem utilizados para formatação das tabelas
        normalTableStyle: function (tableID) {
            return `<style>#${tableID}.phcgo-old-table>tbody>tr>td{text-align:left;background-color:#fff;padding:20px 10px;border:solid 1px #000}#${tableID}.phcgo-old-table>tbody>tr:nth-child(1)>td{background-color:rgb(255, 225, 189)!important;border:solid 1px #000!important;font-size:16px!important;font-weight:700}`
        },
        modernTableStyle: function (tableID) {
            return `<style>#${tableID}.phcgo-new-table>tbody>tr>td{border-radius:20px;border:solid 2px #fff;background-color:#f2f2f2;color:#000;padding:5px 20px}#${tableID}.phcgo-new-table>tbody>tr:nth-child(1)>td{border-radius:20px;border:solid 2px #fff;background-color:rgb(255, 225, 189);color:#000;padding:4px 20px;font-size:20px}`
        },
        modernTableStyleBlue: function (tableID) {
            return `<style>#${tableID}.phcgo-new-table-blue>tbody>tr>td{border-radius:20px;border:solid 2px #fff;background-color:#f2f2f2;color:#000;padding:5px 20px}#${tableID}.phcgo-new-table-blue>tbody>tr:nth-child(1)>td{border-radius:20px;border:solid 2px #fff;background-color:#3fa8f6;color:#fff;padding:4px 20px;font-size:20px}`
        },
        // necessário para o injetor de estilos de largura
        colunas: 0,
        estilosExtra: '',
        // Função para adicionar uma tabela ao tópico de manual
        writeTable: function () {
            // Obter os parâmetros para a ligação
            const numLinhas = document.querySelector('#num-linhas-input').value;
            const numColunas = document.querySelector('#num-colunas-input').value;

            // Babyproof
            if ((isNaN(numLinhas))
                || numLinhas <= 0) { alert('O valor para o número de linhas não é válido (só aceito números positivos, acima de zero).'); return }
            if ((isNaN(numColunas))
                || numColunas <= 0) { alert('O valor para o número de colunas não é válido (só aceito números positivos, acima de zero).'); return }

            // vai buscar o id da tabela
            leggeraVariables.tableID = document.querySelector('#table-id-input').value.replaceAll(' ', '');
            if (leggeraVariables.tableID === '') { alert('O ID da tabela não está definido.'); return }

            let novaTabela;
            switch (leggeraVariables.tableType) {
                case 'normal-table': novaTabela = leggeraMethods.mambo('table', id = leggeraVariables.tableID, cla = 'phcgo-old-table'); break
                case 'modern-table': novaTabela = leggeraMethods.mambo('table', id = leggeraVariables.tableID, cla = 'phcgo-new-table'); break
                case 'modern-table-blue': novaTabela = leggeraMethods.mambo('table', id = leggeraVariables.tableID, cla = 'phcgo-new-table-blue'); break
            }
            novaTabela.style.display = 'flex';
            novaTabela.style.justifyContent = 'center';
            const tBody = novaTabela.appendChild(leggeraMethods.mambo('tbody'));
            const novoCabecalho = leggeraMethods.mambo('tr');
            for (i = 1; i <= numColunas; i++) {
                let novaColuna = novoCabecalho.appendChild(leggeraMethods.mambo('td', id = '', cla = '', inn = `Cabeçalho ${i}`));
            }
            tBody.appendChild(novoCabecalho);
            // adiciona as restantes linhas á tabela
            for (iLinhas = 1; iLinhas <= numLinhas; iLinhas++) {
                const novaLinha = leggeraMethods.mambo('tr');
                for (iColunas = 1; iColunas <= numColunas; iColunas++) {
                    let novaColuna = novaLinha.appendChild(leggeraMethods.mambo('td', id = '', cla = '', inn = `Linha ${iLinhas} Coluna ${iColunas}`));
                }
                tBody.appendChild(novaLinha);
            }
            // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
            novaTabela = (novaTabela.outerHTML.toString().replaceAll('<tr>', "\n" + '<tr>'));
            novaTabela = (novaTabela.toString().replaceAll('</td><td>', '</td>' + "\n" + '<td>'));
            novaTabela.replaceAll('</tbody>', "\n" + '</tbody>');
            // gerador estilos para redimensionar larguras 
            function tableWidthLegoo(cla) {
                let tablewidth = prompt(`Introduz as larguras das colunas ( número de colunas selecionado: ${numColunas} ), separadas por vírgula (20px, 400px).\n\nCaso vazio, estas terão o seu tamanho definido automaticamente.`);
                if (tablewidth === null || tablewidth === '') { return }
                else {
                    //transforma as medidas recebidas em  em array 
                    tablewidth = tablewidth.replaceAll(' ', '').split(',');
                    leggeraListsAndTables.estilosExtra = '';
                    for (i = 1; i <= numColunas; i++) {
                        leggeraListsAndTables.estilosExtra = leggeraListsAndTables.estilosExtra + `#${leggeraVariables.tableID}.${cla}>tbody>tr>td:nth-child(${i}){width:${tablewidth[i - 1]};}`
                    }
                }
            }
            // Anexar o <style> necessário, de acordo com a tabela selecionada
            switch (leggeraVariables.tableType) {
                case 'normal-table':
                    novaTabela.classList = 'phcgo-old-table';
                    tableWidthLegoo('phcgo-old-table');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.normalTableStyle(leggeraVariables.tableID) + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
                case 'modern-table':
                    novaTabela.classList = 'phcgo-new-table';
                    tableWidthLegoo('phcgo-new-table');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyle(leggeraVariables.tableID) + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
                case 'modern-table-blue':
                    novaTabela.classList = 'phcgo-new-table-blue';
                    tableWidthLegoo('phcgo-new-table-blue');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyleBlue(leggeraVariables.tableID) + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
            }
            leggeraMethods.escreveNaTextarea(novaTabela);
        },
        // Função para converter tabelas
        convertTable: function () {
            // vai buscar o id da tabela
            leggeraVariables.tableID = document.querySelector('#table-id-input').value.replaceAll(' ', '');
            if (leggeraVariables.tableID === '') { alert('O ID da tabela não está definido.'); return }
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
            leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('div', id = 'tempTable', cla = '', inn = tablecode).outerHTML);
            let novaTabela;
            switch (leggeraVariables.tableType) {
                case 'normal-table': novaTabela = leggeraMethods.mambo('table', id = leggeraVariables.tableID, cla = 'phcgo-old-table'); break
                case 'modern-table': novaTabela = leggeraMethods.mambo('table', id = leggeraVariables.tableID, cla = 'phcgo-new-table'); break
                case 'modern-table-blue': novaTabela = leggeraMethods.mambo('table', id = leggeraVariables.tableID, cla = 'phcgo-new-table-blue'); break
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
                let tablewidth = prompt(`Introduz as larguras das colunas ( número de colunas importado: ${leggeraListsAndTables.colunas} ), separadas por vírgula (20px, 400px).\n\nCaso vazio, estas terão o seu tamanho definido automaticamente.`);
                if (tablewidth === null || tablewidth === '') { return }
                else {
                    //transforma as medidas recebidas em  em array 
                    tablewidth = tablewidth.replaceAll(' ', '').split(',');
                    leggeraListsAndTables.estilosExtra = '';
                    for (i = 1; i <= leggeraListsAndTables.colunas; i++) {
                        leggeraListsAndTables.estilosExtra = leggeraListsAndTables.estilosExtra + `#${leggeraVariables.tableID}.${cla}>tbody>tr>td:nth-child(${i}){width:${tablewidth[i - 1]};}`
                    }
                    leggeraListsAndTables.estilosExtra = leggeraListsAndTables.estilosExtra + '</style>'
                }
            }
            // Anexar o <style> necessário, de acordo com a tabela selecionada
            switch (leggeraVariables.tableType) {
                case 'normal-table':
                    novaTabela.classList = 'phcgo-old-table';
                    tableWidthLegoo('phcgo-old-table');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.normalTableStyle(leggeraVariables.tableID) + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
                case 'modern-table':
                    novaTabela.classList = 'phcgo-new-table';
                    tableWidthLegoo('phcgo-new-table');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyle(leggeraVariables.tableID) + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
                case 'modern-table-blue':
                    novaTabela.classList = 'phcgo-new-table-blue';
                    tableWidthLegoo('phcgo-new-table-blue');
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyleBlue(leggeraVariables.tableID) + leggeraListsAndTables.estilosExtra + '</style>' + "\n" + novaTabela); break
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
                    tabelaConvertida.lastChild.appendChild(leggeraMethods.mambo('td', id = '', cla = '', inn = itemsParaConverter[i][x].innerText))
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
            novoSeparador.style.marginTop = '0px';
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
                        } else { alert('Ocurreu um erro ao carregar a imagem.'); }
                    },
                });
            } else { alert("Não foi selecionada nenhuma imagem."); }
        }
    }
    // ################ títulos, links & hilite.me
    const leggeraTitlesAndLinks = {
        displayControls: function () {
            // Limpa o appcontrols e vai buscar a template do ecrã 
            leggeraMethods.appControlsChange(leggeraTemplates.titlesAndLinks);
            // atualiza a lista de marcadores
            leggeraTitlesAndLinks.refreshBookmarkList();
            // reseta a variável ao exibiar o app controls (VB.net é o default)
            leggeraVariables.codeType = 'vbnet'
            // ########## Títulos  ##########
            document.querySelector('#tipo-titulo-dropdown').addEventListener('change', leggeraTitlesAndLinks.previewTitle)
            document.querySelector('#add-title').addEventListener('click', leggeraTitlesAndLinks.writeTitle)
            // ########## Ligações ##########
            document.querySelector('#add-link').addEventListener('click', leggeraTitlesAndLinks.writeLink);
            // ########## Marcadores ##########
            document.querySelector('#new-bookmark').addEventListener('click', leggeraTitlesAndLinks.createBookmark);
            document.querySelector('#separador-add-link').addEventListener('click', leggeraTitlesAndLinks.writeBookmark);
            // ########## Hilite.me ##########
            for (radio of document.querySelectorAll('#hilite-radio-row input')) { radio.addEventListener('change', leggeraMethods.updateCodeType) }
            document.querySelector('#add-hilite').addEventListener('click', leggeraHiliteAPI.post);
        },
        // Função para mostrar uma preview do título selecionado na secção dos títulos
        previewTitle: function () {
            let dropdownTitulos = document.querySelector('#tipo-titulo-dropdown');
            let titulosPreview = document.querySelector('#preview-heading-row');
            titulosPreview.innerHTML = '';
            switch (dropdownTitulos.value) {
                // Opção 1
                case 'default1':
                    titulosPreview.appendChild(leggeraMethods.mambo('h1', id = '', cla = 'manuais', inn = 'Título/Heading 1'))
                    break;
                case 'default2':
                    titulosPreview.appendChild(leggeraMethods.mambo('h2', id = '', cla = 'manuais', inn = 'Título/Heading 2'))
                    break;
                case 'default3':
                    titulosPreview.appendChild(leggeraMethods.mambo('h3', id = '', cla = 'manuais', inn = 'Título/Heading 3'))
                    break;
                case 'old1':
                    titulosPreview.appendChild(leggeraMethods.mambo('h1', id = '', cla = '', inn = 'Título/Heading 1'));
                    break;
                case 'old2':
                    titulosPreview.appendChild(leggeraMethods.mambo('h2', id = '', cla = '', inn = 'Título/Heading 2'))
                    break;
                case 'old3':
                    titulosPreview.appendChild(leggeraMethods.mambo('h3', id = '', cla = '', inn = 'Título/Heading 3'))
                    break;
            }
        },
        // Função para adicionar o título ao tópico de manual
        writeTitle: function () {
            let dropdownTitulos = document.querySelector('#tipo-titulo-dropdown');
            switch (dropdownTitulos.value) {
                // Opção 1
                case 'default1':
                    leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h1', id = '', cla = 'manuais', inn = 'Título/Heading 1').outerHTML)
                    break;
                case 'default2':
                    leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h2', id = '', cla = 'manuais', inn = 'Título/Heading 2').outerHTML)
                    break;
                case 'default3':
                    leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h3', id = '', cla = 'manuais', inn = 'Título/Heading 3').outerHTML)
                    break;
                case 'old1':
                    leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h1', id = '', cla = '', inn = 'Título/Heading 1').outerHTML)
                    break;
                case 'old2':
                    leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h2', id = '', cla = '', inn = 'Título/Heading 2').outerHTML)
                    break;
                case 'old3':
                    leggeraMethods.escreveNaTextarea(leggeraMethods.mambo('h3', id = '', cla = '', inn = 'Título/Heading 3').outerHTML)
                    break;
            }
        },
        // Função para adicionar uma ligação ao código do tópico
        writeLink: function () {
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
            let novaLigacao = leggeraMethods.mambo('a', id = '', cla = 'manuais', inn = nome, type = '', href = link, dt = '', tar = '_blank');
            novaLigacao = novaLigacao.outerHTML
            leggeraMethods.escreveNaTextarea(novaLigacao);
        },
        createBookmark: function () {
            const nomeMarcador = document.querySelector('#marcador-nome-input').value;
            const marcador = leggeraMethods.mambo('p', `marcador-${nomeMarcador}`, '', `Parágrafo com o marcador ${nomeMarcador}`)
            leggeraMethods.escreveNaTextarea('\n' + marcador.outerHTML + '\n');
            leggeraTitlesAndLinks.refreshBookmarkList();
        },
        refreshBookmarkList: function () {
            const bookmarkListWrapper = document.querySelector('#marcadores-dropdown').parentElement;
            bookmarkListWrapper.innerHTML = '';
            const bookmarkList = bookmarkListWrapper.appendChild(leggeraMethods.mambo('select', 'marcadores-dropdown'));
            const allBookmarks = document.querySelectorAll('p[id^=marcador-]');
            if (allBookmarks.length > 0) {
                //marcador-                                                               
                for (marcador of allBookmarks) {         //012345678   
                    bookmarkList.appendChild(leggeraMethods.mambo('option', '', '', marcador.id.slice(9)))
                    bookmarkList.lastChild.value = marcador.id
                }
            } else {
                bookmarkList.appendChild(leggeraMethods.mambo('option', '', '', 'não existem marcadores'))
                bookmarkList.setAttribute('disabled', true);
            }
        },
        writeBookmark: function () {
            const selectedBookmarkID = document.querySelector('#marcadores-dropdown').value;
            const linkParaBookmark = leggeraMethods.mambo('a', '', 'manuais', `Nome da ligação para o marcador ${selectedBookmarkID.slice(9)}`, '', `#${selectedBookmarkID}`);
            leggeraMethods.escreveNaTextarea(linkParaBookmark.outerHTML);
        }
    }
    // ################ colapsáveis
    const leggeraCollapsables = {
        // Função ao carregar no botão Vista Colapsavel   
        toogleColapsablesappControls: function () {
            const helpcenterPreviewWrapper = document.querySelector('.hc-preview');
            // reset à activeTextarea
            leggeraVariables.activeTextarea = '';
            if (leggeraVariables.colapHCPreview.classList.contains('no-display')) {
                leggeraVariables.botaoVistaColap.classList.replace('btn-light', 'btn-info');
                document.querySelector('#helpcenter-preview').innerHTML = document.querySelector('#textarea').value;
                leggeraVariables.colapHCPreview.classList.remove('no-display');
                helpcenterPreviewWrapper.classList.add('no-display');
                leggeraCollapsables.appControlsColap();
            } else {
                leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');
                for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                    let saveBtn = document.querySelector(`#colap-save-btn-${i}`);
                    if (saveBtn.classList.contains('no-display') == false) {
                        alert(`Não é possível retornar à vista principal, enquanto existirem alterações pendentes.`); return
                    }
                }
                leggeraVariables.botaoVistaColap.classList.replace('btn-info', 'btn-light');
                leggeraVariables.colapHCPreview.classList.add('no-display');
                helpcenterPreviewWrapper.classList.remove('no-display');
                leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.hcPreview.innerHTML);
                leggeraCollapsables.appControlsColap();
                if (leggeraVariables.textarea.value === '') {
                    leggeraVariables.hcPreview.innerHTML = '';
                    leggeraMethods.displayUserStats();
                }
            }

        },
        // Função para mostrar a appControls dos colapsáveis
        appControlsColap: function () {
            // Array com todos os colapsáveis do tópico
            leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');
            // Limpa a appControls
            leggeraVariables.colapHCPreview.innerHTML = '';
            // Wrapper (row)
            let colapWrapper = leggeraVariables.colapHCPreview.appendChild(leggeraMethods.mambo('div', id = '', cla = `page-1`));
            if (leggeraVariables.colapList.length !== 0) {
                // Loop para cada item do Array
                for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                    // Row 1
                    let row = colapWrapper.appendChild(leggeraMethods.mambo('div', id = '', cla = 'row'));
                    (i % 2 === 0) ? row.classList.add('par') : row.classList.add('impar');
                    let wrapperLeft = row.appendChild(leggeraMethods.mambo('div', id = `inputs-${i}`, cla = 'col-sm-5 inputs-wrapper'));
                    let wrapperRight = row.appendChild(leggeraMethods.mambo('div', id = '', cla = 'col-sm-7'));
                    // Col 1 (inputs)
                    // Input 1
                    wrapperLeft.appendChild(leggeraMethods.mambo('span', id = '', cla = 'colap-id', inn = 'ID do colapsável (minúsculas, sem acentuação, sem espaçamento)'));
                    let idInput = wrapperLeft.appendChild(leggeraMethods.mambo('input', id = '', cla = `colap-input-id-${i}`));
                    idInput.value = leggeraVariables.colapList[i - 1].nextElementSibling.id;
                    idInput.addEventListener('keyup', leggeraCollapsables.updateColapPreviewByID)
                    // Input 2
                    wrapperLeft.appendChild(leggeraMethods.mambo('span', id = '', cla = 'colap-h2', inn = 'Título do colapsável'));
                    let h2Input = wrapperLeft.appendChild(leggeraMethods.mambo('input', id = '', cla = `colap-input-h2-${i}`));
                    let h2Trim = leggeraVariables.colapList[i - 1].innerText.trim().split('	');     // trim para ficar direitinho
                    h2Input.value = h2Trim[0];
                    h2Input.addEventListener('keyup', leggeraCollapsables.updateColapHeading)
                    //hotfix, estava a aparecer no input dos novos manuais.;
                    while (h2Input.value.includes('Abrir/Fechar'))
                        h2Input.value = h2Input.value.replace('Abrir/Fechar', '');
                    //hotfix, estava a aparecer no input dos novos manuais.;
                    while (h2Input.value.includes('Mostrar/Ocultar'))
                        h2Input.value = h2Input.value.replace('Mostrar/Ocultar', '');
                    // Input 3
                    wrapperLeft.appendChild(leggeraMethods.mambo('span', id = '', cla = 'colap-body', 'Corpo do colapsável'));
                    let bodyInput = wrapperLeft.appendChild(leggeraMethods.mambo('textarea', id = '', cla = `colap-input-body-${i}`));
                    bodyInput.addEventListener('keyup', leggeraCollapsables.colapTextAreaEventsSlim)
                    bodyInput.addEventListener('click', leggeraCollapsables.colapTextAreaEvents)
                    let bodyTempInput = leggeraVariables.colapList[i - 1].nextElementSibling.innerHTML;
                    // Remove o cursor laranja ao passar para os collaps
                    bodyInput.value = String(bodyTempInput).replace('<span id="pulse">|</span>', '');
                    // Guardar alterações Button
                    let updateCollaps = wrapperLeft.appendChild(leggeraMethods.mambo('button', id = `colap-save-btn-${i}`, cla = 'btn btn-success no-display', inn = `<i class="lni lni-save"></i> Guardar alterações`));
                    updateCollaps.addEventListener('click', leggeraCollapsables.gerarColapsaveis)
                    // Rejeitar alterações Button
                    let dropCollaps = wrapperLeft.appendChild(leggeraMethods.mambo('button', id = `colap-drop-btn-${i}`, cla = 'btn btn-danger no-display', inn = `<i class="lni lni-cross-circle"></i> Descartar alterações`));
                    dropCollaps.addEventListener('click', leggeraCollapsables.appControlsColap)
                    // filler div para padding
                    wrapperLeft.appendChild(leggeraMethods.mambo('div', id = '', cla = 'save-padding'));
                    // Col 2 (display)
                    wrapperRight.appendChild(leggeraMethods.mambo('div', id = '', cla = `colap-display-h2-${i}`, inn = h2Trim[0]));
                    // wrapperRight.lastChild.innerText = h2Trim[0];
                    //hotfix, estava a aparecer "Abrir/Fechar" várias vezes nos preview
                    while (wrapperRight.lastChild.innerText.includes('Abrir/Fechar')) {
                        wrapperRight.lastChild.innerText = wrapperRight.lastChild.innerText.replace('Abrir/Fechar', '');
                    }
                    while (wrapperRight.lastChild.innerText.includes('Mostrar/Ocultar')) {
                        wrapperRight.lastChild.innerText = wrapperRight.lastChild.innerText.replace('Mostrar/Ocultar', '');
                    }
                    wrapperRight.appendChild(leggeraMethods.mambo('div', id = '', cla = `colap-display-body-${i}`, inn = leggeraVariables.colapList[i - 1].nextElementSibling.innerHTML));
                }
                // adicionar novo collap
                row = colapWrapper.appendChild(leggeraMethods.mambo('div', id = '', cla = 'row'));
                col = row.appendChild(leggeraMethods.mambo('div', id = 'add-new-collap'));
                const newCollapBtn = col.appendChild(leggeraMethods.mambo('button', id = '', cla = "btn btn-info", inn = '<i class="lni lni-circle-plus"></i>&nbsp;&nbsp;Adicionar um novo colapsável'));
                newCollapBtn.addEventListener('click', leggeraCollapsables.novoColapsavel)
                const scrollToTop = col.appendChild(leggeraMethods.mambo('button', id = '', cla = "btn btn-info", inn = '<i class="lni lni-arrow-up-circle"></i>&nbsp;&nbsp;Voltar ao início'));
                scrollToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); })
            } else {
                let geradorColapWrapper = leggeraVariables.colapHCPreview.appendChild(leggeraMethods.mambo('div', id = 'gerador-colaps-wrapper', cla = 'row'));
                let col = geradorColapWrapper.appendChild(leggeraMethods.mambo('div', id = '', cla = 'gerador-colaps-1'));
                col.appendChild(leggeraMethods.mambo('span', id = '', cla = 'no-colaps-span', inn = 'Não foi encontrado nenhum colapsável.'));
                geradorColapWrapper.appendChild(leggeraMethods.mambo('div', id = '', cla = 'flex-br'));
                let geradornewCollapBtn = geradorColapWrapper.appendChild(leggeraMethods.mambo('button', id = '', cla = "btn btn-info", inn = '<i class="lni lni-circle-plus"></i>&nbsp;&nbsp;Adicionar um novo colapsável'));
                geradornewCollapBtn.addEventListener('click', leggeraCollapsables.novoColapsavel)
                col.appendChild(leggeraMethods.mambo('div'));
            }
        },
        // Função para mostrar o savebutton ao atualizar o ID dos colapsáveis
        updateColapPreviewByID: function (e) {
            // Mostra o save button
            const saveButton = e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
            saveButton.classList.remove('no-display');
            const cancelButton = saveButton.nextElementSibling
            cancelButton.classList.remove('no-display');
        },
        // Função para atualizar o prewview dos colapsáveis (H2)
        updateColapHeading: function (e) {
            leggeraVariables.activeTextarea = e.target;
            let inputText = leggeraVariables.activeTextarea.value;
            let cursorappControlsPos = leggeraMethods.getCursorPos(e);
            // divide o input em duas partes (até ao cursor, e após o curos)
            let inputColapTextStrings = [];
            inputColapTextStrings.push([inputText.slice(0, cursorappControlsPos)]);
            inputColapTextStrings.push([inputText.slice(cursorappControlsPos)]);
            leggeraVariables.stringCursorColap[0] = inputColapTextStrings[0];
            leggeraVariables.stringCursorColap[1] = inputColapTextStrings[1];
            // Preview do input
            let inputPreview = e.target.parentElement.nextElementSibling.children[0];
            inputPreview.innerHTML = `${inputColapTextStrings[0]}${inputColapTextStrings[1]}`;
            // Mostra o save button
            const saveButton = e.target.nextElementSibling.nextElementSibling.nextElementSibling
            saveButton.classList.remove('no-display');
            const cancelButton = saveButton.nextElementSibling
            cancelButton.classList.remove('no-display');
        },
        // função para atualizar o preview do body
        colapTextAreaEventsSlim: function (e) {
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
        },
        // função para atualizar o preview do body
        colapTextAreaEvents: function (e) {
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
        },
        gerarColapsaveis: function (e) {
            leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');
            let newCollapFinal = '';
            let newCollapseArray = [[], [], []];
            for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                newCollapseArray[0][i - 1] = document.querySelector(`.colap-input-id-${i}`).value;
                newCollapseArray[1][i - 1] = document.querySelector(`.colap-input-h2-${i}`).value;
                newCollapseArray[2][i - 1] = document.querySelector(`.colap-input-body-${i}`).value;
                // wrapper do collapsavel
                let newCollap = leggeraMethods.mambo('div', id = '', cla = 'row seccao-phcgo');
                // título
                let newCollapColTitulo = newCollap.appendChild(leggeraMethods.mambo('div', id = '', cla = 'col-xs-8'));
                //link do h2
                let h2Link = newCollapColTitulo.appendChild(leggeraMethods.mambo('a', id = '', cla = '', inn = '', type = '', href = `#${newCollapseArray[0][i - 1]}`, dt = 'collapse'));
                //h2
                let newtituloH2 = h2Link.appendChild(leggeraMethods.mambo('h2', id = '', cla = 'manuais', inn = newCollapseArray[1][i - 1]))
                newtituloH2.style.fontWeight = 'normal';
                //abrir/fechar
                let newCollapCol1 = newCollap.appendChild(leggeraMethods.mambo('div', id = '', cla = 'col-xs-4 text-right'))
                //link do abrir/fechar
                let link = newCollapCol1.appendChild(leggeraMethods.mambo('a', id = '', cla = '', inn = 'Abrir/Fechar', type = '', href = `#${newCollapseArray[0][i - 1]}`, dt = 'collapse'));
                link.style.display = 'block'
                // wrapper do conteudo
                let newCollapConteudo = leggeraMethods.mambo('div', id = newCollapseArray[0][i - 1], cla = 'collapse multi-collapse', inn = newCollapseArray[2][i - 1]);
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
            leggeraCollapsables.appControlsColap();
            leggeraMethods.autosave2JSON();
            // volta-nos a posicionar onde estávamos aquando da gravação (é necessário, porque o ecrã é re-escrito ao gravar)
            window.scrollTo(0, totalHeight - whereWasI);
        },
        singleColapsavel: function () {
            // wrapper do collapsavel
            let newCollap = leggeraMethods.mambo('div', id = '', cla = 'row seccao-phcgo');
            // título
            let newCollapColTitulo = newCollap.appendChild(leggeraMethods.mambo('div', id = '', cla = 'col-xs-8'))
            //link do h2
            let h2Link = newCollapColTitulo.appendChild(leggeraMethods.mambo('a', id = '', cla = '', inn = '', type = '', href = '#novo-colapsavel', dt = 'collapse'));
            //h2
            let newtituloH2 = h2Link.appendChild(leggeraMethods.mambo('h2', id = '', cla = 'manuais', inn = 'Novo colapsável'))
            //abrir/fechar
            let newCollapCol1 = newCollap.appendChild(leggeraMethods.mambo('div', id = '', cla = 'col-xs-4 text-right'))
            //link do abrir/fechar
            let link = newCollapCol1.appendChild(leggeraMethods.mambo('a', id = '', cla = '', inn = 'Abrir/Fechar', type = '', href = '#novo-colapsavel', dt = 'collapse'));
            // wrapper do conteudo
            let newCollapConteudo = leggeraMethods.mambo('div', id = 'novo-colapsavel', cla = 'collapse multi-collapse', inn = 'Conteúdo do novo colapsável aqui!');
            newCollapFinal = newCollap.outerHTML + newCollapConteudo.outerHTML
            return newCollapFinal
        },
        novoColapsavel: function () {
            if (leggeraVariables.colapList.length === 0) {
                const abrirTodosDiv = '<br><a id="colapse-all-a" style="display: block;text-align: right;" data-toggle="collapse" data-target=".multi-collapse" href="#" role="button" aria-expanded="false"">Abrir Todos</a></p>'
                leggeraVariables.textarea.value = leggeraVariables.textarea.value + "\n" + abrirTodosDiv + "\n" + '<!-- Início do Colapsável #1 -->' + "\n" + (leggeraCollapsables.singleColapsavel().toString() + "\n" + '<!-- Fim do Colapsável #1 -->');
                leggeraVariables.textarea.value = leggeraVariables.textarea.value.replaceAll('<div class="collapse', "\n" + "\n" + '<div class="collapse')
                leggeraVariables.hcPreview.innerHTML = leggeraVariables.textarea.value;
                leggeraCollapsables.appControlsColap();
                // leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
            } else {
                // babyproof, não deixa adicionar colapsável sem gravar alterações
                for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                    let saveBtn = document.querySelector(`#colap-save-btn-${i}`);
                    if (saveBtn.classList.contains('no-display') == false) {
                        alert(`Não é possível adicionar um novo colapsável, enquanto existirem alterações pendentes.`); return
                    }
                }
                leggeraVariables.textarea.value = leggeraVariables.textarea.value + "\n" + '<!-- Início do Colapsável #' + (leggeraVariables.colapList.length + 1) + ' -->' + "\n" + (leggeraCollapsables.singleColapsavel().toString() + "\n" + '<!-- Fim do Colapsável #' + (leggeraVariables.colapList.length + 1) + ' -->');
                leggeraVariables.textarea.value = leggeraVariables.textarea.value.replaceAll('><div class="collapse', '>' + "\n" + "\n" + '<div class="collapse ')
                leggeraVariables.hcPreview.innerHTML = leggeraVariables.textarea.value;
                leggeraCollapsables.appControlsColap();
                // leggeraVariables.hcPreview.innerHTML = leggeraPreviewAdjustments.execute(leggeraVariables.textarea.value);
                window.scrollTo(0, document.body.scrollHeight);
            }
        },
    }
    // ################ event listeners
    const leggeraListeners = {
        allEvents: function () {
            const menus = document.querySelectorAll('.main-menu');
            for (menu of menus) { menu.addEventListener('click', leggeraMethods.updateWhereIAm) };
            document.querySelector('#quicksave-btn').addEventListener('click', leggeraMethods.quickSave);
            document.querySelector('#quickload-btn').addEventListener('click', leggeraMethods.quickLoad);
            document.querySelector('#userstats-btn').addEventListener('click', function () { leggeraVariables.hcPreview.innerHTML = ''; leggeraMethods.displayUserStats(); });
            document.querySelector('#logout-btn').addEventListener('click', leggeraMethods.logout);
            document.querySelector('#preview-btn').addEventListener('click', leggeraMethods.saveByPreviewBtn)
            document.querySelector('#ancora-btn').addEventListener('click', leggeraMethods.stickyTop);
            document.querySelector('#botoes-btn').addEventListener('click', leggeraButtons.displayControls);
            document.querySelector('#logos-btn').addEventListener('click', leggeraIcons.displayControls);
            document.querySelector('#textbox-btn').addEventListener('click', leggeraTextboxes.displayControls);
            document.querySelector('#listas-tabelas-btn').addEventListener('click', leggeraListsAndTables.displayControls);
            document.querySelector('#titulos-ligacoes-btn').addEventListener('click', leggeraTitlesAndLinks.displayControls);
            document.querySelector('#manuals-btn').addEventListener('click', leggeraManuais.getManuals);
            document.querySelector('#colap-btn').addEventListener('click', leggeraCollapsables.toogleColapsablesappControls);
            document.addEventListener("keyup", leggeraMethods.newBr);
            leggeraVariables.textarea.addEventListener('keyup', leggeraUpdatePreviews.execute);
            leggeraVariables.textarea.addEventListener('click', leggeraUpdatePreviews.execute);
        }
    }
    leggeraListeners.allEvents();
    // ################ Session 
    (function leggeraSession() {
        setInterval(function () {
            $.ajax({    //create an ajax request to display.php
                type: "POST",
                url: "assets/php/session.php",
                dataType: "text",
                data: {
                    username: loggedinUser,
                    sessioncookie: localStorage.getItem('session')
                },
                success: function (response) {
                    if (!response.includes('OK')) { leggeraMethods.logout(); }
                },
                error: function (response) {
                    if (!response.includes('OK')) { leggeraMethods.logout(); }
                }
            });
        }, 10000);
    })();
}   