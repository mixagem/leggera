/************************************/
/* helpcenter+ supperleggera        */
/* mambosinfinitos, 2022            */
/* featurelist:
    - helpcenter "offline" preview
    - injetor caixas texto
    - injetor de icons com seletor de cor
    - injetor de buttons com seletor de tema
    - construtor de listas numeradas, não numeradas, e com links
    - construtor de tabelas, com selector de estilos e injeção dos <style> necessários 
        (inclui comentários informativos)
    - injetor de imagens
    - injetor de <hr>
    - injetor de títulos
    - constutor de links, com babyproof para ligações inválidas (# ou http only)
    - editor live na vista principal 
        (atualização ao vivo do preview com a posição do cursor + com o que foi acabado de escrever + introdução de <br> ao carregar Enter)
        (limite de 100.000 caracteres, para evitar a baixa performance em tópicos muito longos)
    - construtor/editor live de colapsáveis 
        (inclui reformatação automática dos colapsáveis de tópicos antigos, para adicionar ligação ao título do colapsável ao gravar as alterações efetuadas)
    - ligação api hilite.me c/ formatação automática para helpcenter (inclui compatibilidade indentação json, vb.net e typescript, desde que introduzidos com a indentação correta)
    - importação & conversão de tabelas 
        (remove os estilos que tem, e aplica o que estiver definido)
    - autosave / autoload - grava o tópico em cache quando clickamos ou escrevemos na textarea principal. 
        ao carregar a página, vai buscar o tópico que ficou em cache (caso exista).
    - quicksave / quickload 
        (segundo slot da cache, disponível através das ações respetivas)
    - cleancode™ - formatação de todos os códigos injetados, de modo a adicionar quebras de linha onde justificável, de modo a tornar o código mais legível fora da aplicação 
    - titlescroller - flashback aos tempos do myspace e hi5. groovy af. 
    - loginscreen com validação de credências c/ BD
    - cookie login 
    - myManuals™ - gestão de manuais c/ acesso a BD (carregar, guardar e apagar) 
/************************************/

function mixWrapper() {

    // ################ várias variáveis da aplicação
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
        // variável com o tema atual para o leggera
        currentLeggeraTheme: darktheme
    }

    // ################ funções várias da aplicação 
    const leggeraExtraFunctions = {

        // document.createElement, mais turbinada para a escritura de grids
        elementGenerator: function (ele, id = '', classlist = '', inner = '') {
            const elementGenerated = document.createElement(`${ele}`);
            if (id !== '') { elementGenerated.id = `${id}` }
            if (classlist !== '') { elementGenerated.classList = `${classlist}` }
            if (inner !== '') { elementGenerated.innerHTML = `${inner}` }
            return elementGenerated
        },

        // Adiciona o elemento selecionado na posição do cursor
        escreveNaTextarea: function (etarget) {
            // babyproof
            if (leggeraVariables.activeTextarea === '') { alert('Coloca o cursor numa área de texto antes de adicionar conteúdos.'); return }
            // caso seja a textarea principal
            if (leggeraVariables.activeTextarea.id === 'textarea') {
                if (etarget === '<br>') {
                    novoSourceCode = `${leggeraVariables.stringCursor[0]}` + `${etarget}` + "\n" + `${leggeraVariables.stringCursor[1]}`;
                } else {
                    // O array stringCursor é composto por duas string, antes e depois do cursor
                    // O novoSourceCode faz o concat das string, com o elemento a ser escrito na posição do cursor.
                    novoSourceCode = `${leggeraVariables.stringCursor[0]}` + "\n" + `${etarget}` + `${leggeraVariables.stringCursor[1]}`;
                }
                // Atualiza a textarea
                leggeraVariables.textarea.value = novoSourceCode;
                // Atualiza o preview
                leggeraVariables.hcPreview.innerHTML = novoSourceCode;
                // Atualiza a vista de colapsáveis
                appControlsColap();
                // Guarda as alterações em cache
                (this).autosave2JSON();
                // caso seja as textareas da vista de collaps
            } else {
                novoSourceCode = `${leggeraVariables.stringCursorColap[0]}` + "\n" + `${(etarget).toString()}` + `${leggeraVariables.stringCursorColap[1]}`;
                leggeraVariables.activeTextarea.value = novoSourceCode;
                let inputPreview = leggeraVariables.activeTextarea.parentElement.nextElementSibling.children[1];
                inputPreview.innerHTML = novoSourceCode;
            }
        },

        // Função para guardar na cache do browser o Source Code do tópico (e respetivas alterações)
        autosave2JSON: function () {
            let textarea2JSON = JSON.stringify(leggeraVariables.textarea.value);
            localStorage.setItem('textarea', textarea2JSON);
        },

        // função para obter a posição do cursor (utilizado para a textarea)
        getCursorPos: function (e) {
            let eTarget = e.target;
            let cursorPos = eTarget.selectionStart;
            return cursorPos
        },

        // função para ancorar o cabeçalho do editor
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

        // Mostra injeta um <br> ao carregar Enter
        newBr: function (e) {
            if (e.target.tagName === 'TEXTAREA' && e.key === 'Enter') {
                leggeraExtraFunctions.escreveNaTextarea('<br>');
            }
        },

        // Atualiza o preview, textarea e os previews manualmente (a ser utilizado quando o tópico tem 100.000+ chars)
        saveFromPreviewBtn: function () {
            leggeraVariables.activeTextarea = leggeraVariables.textarea;
            let inputText = leggeraVariables.textarea.value;
            leggeraVariables.hcPreview.innerHTML = inputText
            appControlsColap();
            leggeraExtraFunctions.autosave2JSON();
        },

        // Page title auto-scroller
        titleScrol: setInterval(function () {
            let tituloPagina = document.title.toString();
            const updatedTituloPagina1 = tituloPagina.slice(0, 1)
            const updatedTituloPagina2 = tituloPagina.slice(1, tituloPagina.length)
            document.title = updatedTituloPagina2 + updatedTituloPagina1
        }, 500),

        // Função para atualizar o tipo de código selecionado
        updatecodeType: function (e) {
            document.querySelector('#ts').checked = false
            document.querySelector('#vbnet').checked = false
            document.querySelector('#json').checked = false
            e.target.checked = true
            leggeraVariables.codeType = e.target.id
        },

        // Função para atualizar o tipo de tabela selecionado
        updateTableType: function (e) {
            document.querySelector('#normal-table').checked = false
            document.querySelector('#modern-table').checked = false
            document.querySelector('#modern-table-blue').checked = false
            e.target.checked = true
            leggeraVariables.tableType = e.target.id
        },

        // Função para guardar o tópico num segundo slot da chache
        quickSave: function () {
            const textarea2JSON = JSON.stringify(leggeraVariables.textarea.value);
            localStorage.setItem('quickSave', textarea2JSON);
            leggeraVariables.textarea.value = '';
            leggeraVariables.hcPreview.innerHTML = '';
            appControlsColap();
            leggeraVariables.stringCursor = ['', '']
        },

        // Função para carregar o tópico do segundo slot da chache
        quickLoad: function () {
            const getTextareaFromJSON = localStorage.getItem('quickSave');
            leggeraVariables.textarea.value = JSON.parse(getTextareaFromJSON);
            leggeraVariables.hcPreview.innerHTML = leggeraVariables.textarea.value;
            appControlsColap();
        },

        // Função para limpar a área de controlos, e iniciar o contador de páginas da área selecionada
        appControlsChange: function () {
            // Limpar o div dos appControls
            leggeraVariables.appControls.innerHTML = '';
            // Iniciar contador paginador (a ser utilizado no futuro, caso os elementos não caibam todos numa só página de appControls)
            return pag = 1;
        },

        // Função para atualizar o botão conforme a área de controlos selecioanda
        updateWhereIAm: function (e) {
            let eTarget = e.target;
            const menus = document.querySelectorAll('.main-menu');
            for (menu of menus) {
                menu.classList = 'btn btn-light main-menu'
            }
            if (eTarget.tagName === "I") { eTarget = eTarget.parentElement }
            eTarget.classList = 'btn btn-info main-menu'
        },

        // Função para fazer logout
        logout: function () {
            localStorage.removeItem('bolachinha');
            location.reload();
        },

        changeLeggeraTheme: function () {
            if (leggeraVariables.currentLeggeraTheme === 0) { leggeraVariables.currentLeggeraTheme = 1; }
            else { leggeraVariables.currentLeggeraTheme = 0; }
            console.log(leggeraVariables.currentLeggeraTheme);
        }
    }

    // ################ atualizar o preview com o cursor laranja
    const leggeraUpdatePreviews = {
        // a ser utilizado quando é feito click
        full: function (e) {
            // babyproof alterações pendentes
            if (botaoVistaColap.classList.contains('btn-info')) {
                leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');
                for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                    let saveBtn = document.querySelector(`#colap-save-btn-${i}`);
                    if (saveBtn.classList.contains('no-display') == false) {
                        alert(`Não é possível adicionar um novo colapsável, enquanto existirem alterações pendentes.`); return
                    }
                }
            }
            leggeraVariables.activeTextarea = e.target;
            let inputText = leggeraVariables.textarea.value;
            if (inputText.length <= 100000) {
                document.querySelector('#preview-btn').classList.add('no-display')
                leggeraVariables.limitExceded = 0;
                let cursorPos = leggeraExtraFunctions.getCursorPos(e);
                let inputTextString1;
                let inputTextString2;
                // babyproof para quando colocamos o cursor numa tag, ele se mostrado for da tag (para não partir o prewview)
                novoCursorPos = cursorPos;

                // if (inputText[cursorPos] === '>') {
                inputTextString1 = inputText.slice(0, cursorPos)
                inputTextString2 = inputText.slice(cursorPos, inputText.length)
                // old rotina de cursor, causava muito lag
                // } else {
                //     (function rotinaCursor() {
                //         switch (inputText[novoCursorPos]) {
                //             case '<':
                //                 inputTextString1 = inputText.slice(0, novoCursorPos)
                //                 inputTextString2 = inputText.slice(novoCursorPos, inputText.length)
                //                 break
                //             case '>':
                //                 inputTextString1 = inputText.slice(0, cursorPos)
                //                 inputTextString2 = inputText.slice(cursorPos, inputText.length)
                //                 break
                //             case undefined:
                //                 inputTextString1 = inputText.slice(0, cursorPos)
                //                 inputTextString2 = inputText.slice(cursorPos, inputText.length)
                //                 break
                //             default:
                //                 novoCursorPos--
                //                 rotinaCursor()
                //         }
                //         // introduz o cursor laranja
                let inputTextWithCursor = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;
                // guarda a posição do cursor 
                leggeraVariables.stringCursor[0] = inputTextString1;
                leggeraVariables.stringCursor[1] = inputTextString2;
                // atualiza o preview
                leggeraVariables.hcPreview.innerHTML = inputTextWithCursor;
                appControlsColap();
                leggeraExtraFunctions.autosave2JSON();
                //     })();
                // }
            } else {
                if (leggeraVariables.limitExceded === 0) {
                    document.querySelector('#preview-btn').classList.remove('no-display');
                    alert(`Foi excedido o limite máximo de caractéres aceites pelo Autosave.\nPara pre-visualizar e guardar em cache as alterações efetuadas, carrega em "Preview", localizado ao lado esquerdo do botão "QuickSave".`)
                }
                leggeraVariables.limitExceded = 1;

                let cursorPos = leggeraExtraFunctions.getCursorPos(e);
                // divide o tópico em duas partes (até ao cursor, e após o curos)
                let inputTextString1 = inputText.slice(0, cursorPos);
                let inputTextString2 = inputText.slice(cursorPos);
                // introduz o cursor laranja
                let inputTextWithCursor = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;
                // guarda a posição do cursor 
                leggeraVariables.stringCursor[0] = inputTextString1;
                leggeraVariables.stringCursor[1] = inputTextString2;
                // atualiza o preview
                leggeraVariables.hcPreview.innerHTML = inputTextWithCursor;
                appControlsColap();
            }
        },

        // a ser utilizado quando é feito keyup (não tem corretor de posição)
        slim: function (e) {
            // babyproof alterações pendentes
            if (botaoVistaColap.classList.contains('btn-info')) {
                leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');
                for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                    let saveBtn = document.querySelector(`#colap-save-btn-${i}`);
                    if (saveBtn.classList.contains('no-display') == false) {
                        alert(`Não é possível adicionar um novo colapsável, enquanto existirem alterações pendentes.`); return
                    }
                }
            }
            leggeraVariables.activeTextarea = e.target;
            let inputText = leggeraVariables.textarea.value;
            if (inputText.length <= 100000) {
                document.querySelector('#preview-btn').classList.add('no-display');
                leggeraVariables.limitExceded = 0;
                let cursorPos = leggeraExtraFunctions.getCursorPos(e);
                // divide o tópico em duas partes (até ao cursor, e após o curos)
                let inputTextString1 = inputText.slice(0, cursorPos);
                let inputTextString2 = inputText.slice(cursorPos);
                // introduz o cursor laranja
                let inputTextWithCursor = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;
                // guarda a posição do cursor 
                leggeraVariables.stringCursor[0] = inputTextString1;
                leggeraVariables.stringCursor[1] = inputTextString2;
                // atualiza o preview
                leggeraVariables.hcPreview.innerHTML = inputTextWithCursor;
                appControlsColap();
                leggeraExtraFunctions.autosave2JSON();
            } else {
                if (leggeraVariables.limitExceded === 0) {
                    document.querySelector('#preview-btn').classList.remove('no-display');
                    alert('Foi excedido o limite máximo de caractéres aceites pelo Autosave.\nPara pre-visualizar e guardar em cache as alterações efetuadas, carrega em "Preview", localizado ao lado esquerdo do botão "QuickSave".')
                }
                leggeraVariables.limitExceded = 1;

                let cursorPos = leggeraExtraFunctions.getCursorPos(e);
                // divide o tópico em duas partes (até ao cursor, e após o curos)
                let inputTextString1 = inputText.slice(0, cursorPos);
                let inputTextString2 = inputText.slice(cursorPos);
                // introduz o cursor laranja
                let inputTextWithCursor = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;
                // guarda a posição do cursor 
                leggeraVariables.stringCursor[0] = inputTextString1;
                leggeraVariables.stringCursor[1] = inputTextString2;
                // atualiza o preview
                leggeraVariables.hcPreview.innerHTML = inputTextWithCursor;
                appControlsColap();
                leggeraExtraFunctions.autosave2JSON();
            }
        }
    }

    // ################ myManuals
    const leggeraMyManualsDBConnect = {
        // Query para buscar os manuais que o utilizador tem guardado
        getManuals: function () {
            console.log('entrei com: ' + loggedinUser)
            $.ajax({    //create an ajax request to display.php
                type: "POST",
                url: "assets/php/manualslist.php",
                dataType: "JSON",
                data: { username: loggedinUser },
                success: function (rsp) {
                    leggeraMyManualsDBConnect.myManuals(rsp);
                },
                error: function (rsp) {
                    leggeraMyManualsDBConnect.myManuals(rsp);
                }
            })
        },

        myManualsFilterResults: function () {
            const keyword = document.querySelector('#save-manual-input').value.toLowerCase().split(" ");
            const numManuais = document.querySelector('#modal-container tbody').childElementCount;
            let control = 0;
            for (i = 1; i <= numManuais; i++) {
                for (x = 0; x < keyword.length; x++) {
                    if (document.querySelector('#modal-container tbody').children[i - 1].children[0].innerText.toLowerCase().includes(keyword[x])) {
                        console.log('found');
                    } else {
                        control = 1;
                    }
                }
                if (control === 0) {
                    document.querySelector('#modal-container tbody').children[i - 1].classList.remove('no-display');
                } else {
                    document.querySelector('#modal-container tbody').children[i - 1].classList.add('no-display');
                }
                control = 0;
            }
        },

        // Constroi a modal com os manuais recebidos da DB
        myManuals: function (rsp) {
            console.log('here?')
            // oculta a app
            const sectionsArray = document.querySelectorAll('section');
            for (i = 0; i < sectionsArray.length; i++) {
                if (!sectionsArray[i].classList.contains('no-display')) { sectionsArray[i].classList.add('no-display') }
            }
            const modal = document.querySelector('body').appendChild(leggeraExtraFunctions.elementGenerator('div', 'manuals-modal', '', ''));
            const saveManualModal = modal.appendChild(leggeraExtraFunctions.elementGenerator('div', 'savemanual-container', 'row', ''));

            const leftWrapper = saveManualModal.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-8 text-left', ''));
            leftWrapper.appendChild(leggeraExtraFunctions.elementGenerator('h1', '', '', 'Nome do manual'));
            leftWrapper.appendChild(leggeraExtraFunctions.elementGenerator('input', 'save-manual-input', '', ''));
            leftWrapper.lastChild.addEventListener('keyup', leggeraMyManualsDBConnect.myManualsFilterResults);
            const midWrapper = saveManualModal.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-2 text-left', ''));
            midWrapper.appendChild(leggeraExtraFunctions.elementGenerator('button', 'save-manual-btn', 'btn btn-success', "<i class='lni lni-save'></i>&nbsp;&nbsp;Guardar Manual"));
            midWrapper.lastChild.addEventListener('click', leggeraMyManualsDBConnect.saveManual)
            const rightWrapper = saveManualModal.appendChild(leggeraExtraFunctions.elementGenerator('div', 'close-myManuals-wrapper', 'col-md-2 text-right', ''));
            rightWrapper.appendChild(leggeraExtraFunctions.elementGenerator('button', 'save-manual-btn', 'btn btn-light', '<i class="lni lni-reply"></i>&nbsp;&nbsp;Voltar ao editor'));
            rightWrapper.lastChild.addEventListener('click', leggeraMyManualsDBConnect.backHome)


            const manualsWrapper = modal.appendChild(leggeraExtraFunctions.elementGenerator('div', 'my-manuals-wrapper', '', ''));
            const modalTable = manualsWrapper.appendChild(leggeraExtraFunctions.elementGenerator('table', 'modal-container', '', ''));
            const modalHeader = modalTable.appendChild(leggeraExtraFunctions.elementGenerator('thead', '', '', ''));
            modalHeader.appendChild(leggeraExtraFunctions.elementGenerator('th', '', '', 'Título do Manual'))
            modalHeader.appendChild(leggeraExtraFunctions.elementGenerator('th', '', 'text-right', 'Última atualização'))
            modalHeader.appendChild(leggeraExtraFunctions.elementGenerator('th', '', '', ''))
            modalHeader.appendChild(leggeraExtraFunctions.elementGenerator('th', '', '', ''))
            const modalBody = modalTable.appendChild(leggeraExtraFunctions.elementGenerator('tbody', '', '', ''));
            for (i = 0; i < rsp.length; i++) {
                let modalRow = modalBody.appendChild(leggeraExtraFunctions.elementGenerator('tr', `manual-${i + 1}`, `animate__animated animate__fadeInUp`, ''))
                if (i % 2 === 0) { modalRow.classList.add('manual-impar') } else { modalRow.classList.add('manual-par') }
                modalRow.setAttribute('style', `--animate-delay: ${(i + 1) * 0.2}s`)
                modalRow.appendChild(leggeraExtraFunctions.elementGenerator('td', '', '', rsp[i].title))
                modalRow.lastChild.addEventListener('click', function (e) {
                    leggeraMyManualsDBConnect.getManualCode(e, rsp);
                });
                let data = new Date(Number(rsp[i].timestamp));
                modalRow.appendChild(leggeraExtraFunctions.elementGenerator('td', '', '', `${data.toLocaleDateString('pt-PT', { dateStyle: 'short' })} @ ${data.toLocaleTimeString('pt-PT', { timeStyle: 'short' })}`))
                modalRow.appendChild(leggeraExtraFunctions.elementGenerator('td', '', '', `<i class="lni lni-save"></i>`))
                modalRow.lastChild.addEventListener('click', leggeraMyManualsDBConnect.saveManual);
                modalRow.appendChild(leggeraExtraFunctions.elementGenerator('td', '', '', `<i class="lni lni-eraser"></i>`))
                modalRow.lastChild.addEventListener('click', leggeraMyManualsDBConnect.deleteManual);
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
            appControlsColap();
            // Guarda as alterações em cache
            leggeraExtraFunctions.autosave2JSON();
        },

        saveManual: function (e) {

            console.log(e.target.parentElement.parentElement.firstChild.innerText);
            let manualName = document.querySelector('#save-manual-input').value;

            if (e.target.tagName === "TD") { manualName = e.target.parentElement.firstChild.innerText };
            if (e.target.tagName === "I") { manualName = e.target.parentElement.parentElement.firstChild.innerText };
            $.ajax({    //create an ajax request to display.php
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
                        for (i = 0; i < sectionsArray.length; i++) {
                            sectionsArray[i].classList.remove('no-display')
                        }
                        document.querySelector('#manuals-modal').remove();
                    } else {
                        alert('tópico criado com sucesso');
                        // mostra a app
                        const sectionsArray = document.querySelectorAll('section');
                        for (i = 0; i < sectionsArray.length; i++) {
                            sectionsArray[i].classList.remove('no-display')
                        }
                        document.querySelector('#manuals-modal').remove();
                    }
                }
            })
        },

        backHome: function () {
            const sectionsArray = document.querySelectorAll('section');
            for (i = 0; i < sectionsArray.length; i++) {
                sectionsArray[i].classList.remove('no-display')
            }
            document.querySelector('#manuals-modal').remove();
        },

        deleteManual: function (e) {
            let eTarget = e.target;
            if (e.target.tagName === "I") {
                eTarget = e.target.parentElement;
            }
            const wantToDelete = prompt(`Para excluír o tópico ${eTarget.parentElement.firstChild.innerText}, escreve "apagar":`);
            if (wantToDelete === 'apagar') {
                $.ajax({    //create an ajax request to display.php
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
                            // mostra a app
                            const sectionsArray = document.querySelectorAll('section');
                            for (i = 0; i < sectionsArray.length; i++) {
                                sectionsArray[i].classList.remove('no-display')
                            }
                            document.querySelector('#manuals-modal').remove();
                        }
                    }
                })
            } else {
                return
            }
        }
    }

    // ################ go assets (antigos JSON)
    const leggeraJSONGrab = {

        //Delaração de arrays para guardar os dados vindos do fetch JSON, utilizados nas respetivas áreas de controlo
        iconsFromJSON: [],
        textboxesFromJSON: [],
        horizonButtonsFromJSON: [],
        forestButtonsFromJSON: [],
        darkButtonsFromJSON: [],
        lightButtonsFromJSON: [],
        buttonsFromJSON: [],
        numeroTextboxes: '',
        numeroIcons: '',
        numeroButtons: '',



        // Executa todas
        grabThemAll: function () {


            $.ajax({    //create an ajax request to display.php
                type: "POST",
                url: "assets/php/assetsgo.php",
                dataType: "JSON",
                data: {
                    action: 'icons'
                },
                success: function (rsp) {
                    leggeraJSONGrab.numeroIcons = rsp.length
                    for (i = 0; i < rsp.length; i++) {
                        leggeraJSONGrab.iconsFromJSON[i] = rsp[i];
                    }
                }
            })

            $.ajax({    //create an ajax request to display.php
                type: "POST",
                url: "assets/php/assetsgo.php",
                dataType: "JSON",
                data: {
                    action: 'textboxes'
                },
                success: function (rsp) {
                    leggeraJSONGrab.numeroTextboxes = rsp.length
                    for (i = 0; i < rsp.length; i++) {
                        leggeraJSONGrab.textboxesFromJSON[i] = rsp[i];
                    }
                }
            })


            $.ajax({    //create an ajax request to display.php
                type: "POST",
                url: "assets/php/assetsgo.php",
                dataType: "JSON",
                data: {
                    action: 'buttons'
                },
                success: function (rsp) {
                    // leggeraJSONGrab.numeroButtons = rsp[0].length;
                    // for (i = 0; i < rsp.length; i++) {
                    //     leggeraJSONGrab.iconsFromJSON[i] = rsp[0];
                    //     leggeraJSONGrab.iconsFromJSON[i] = rsp[1];
                    //     leggeraJSONGrab.iconsFromJSON[i] = rsp[2];
                    //     leggeraJSONGrab.iconsFromJSON[i] = rsp[3];
                    // }
                    leggeraJSONGrab.numeroButtons = rsp[0].length;
                    leggeraJSONGrab.buttonsFromJSON = rsp;

                }
            })





        }
    }

    // ################ método para chamadas API c/ Hilite.me
    const leggeraHiliteAPI = {

        post: function () {
            // Babyproof
            if (document.querySelector('#hilite-textarea').value.length <= 0) { alert('A textarea para o código hilite.me está vazia.'); return }
            const code = document.querySelector('#hilite-textarea').value.toString();
            $.ajax({
                type: "POST",
                url: "http://hilite.me/api",
                dataType: "text",
                data: {
                    code: code,
                    style: 'monokai',
                    lexer: leggeraVariables.codeType,
                    divstyles: 'border:solid #eb8475;border-width:.1em .1em .1em .8em;padding:.2em .6em;'
                },
                success: function (response) { leggeraHiliteAPI.hiliteFormater(response); }
            })
        },

        // Formatar a resposta obtida
        hiliteFormater: function (novosource) {
            let fixedHilite = String(novosource).replaceAll("\n", '<br>' + "\n");
            // para vbnet
            fixedHilite = fixedHilite.replaceAll('    ', '<div style="display:inline-block;width:20px;"></div>')
            // para json
            fixedHilite = fixedHilite.replaceAll('	', '<div style="display:inline-block;width:20px;"></div>')
            // para typescript
            fixedHilite = fixedHilite.replaceAll('  ', '<div style="display:inline-block;width:20px;"></div>')
            // estilo compatível com o helpcenter
            fixedHilite = fixedHilite.replace('<pre style="', '<pre style="background:transparent;border:0px;');
            leggeraExtraFunctions.escreveNaTextarea(fixedHilite);
        }
    }


    // ################ app start
    window.onload = (function () {
        // Vai buscar os dados aos JSON
        leggeraJSONGrab.grabThemAll();
        // Vai buscar o último tópico de manual à cache (caso exista)
        try {
            const getTextareaFromJSON = localStorage.getItem('textarea');
            leggeraVariables.textarea.value = JSON.parse(getTextareaFromJSON);
        }
        catch { }
        // Função que atualiza o hcPreview, conforme tenha encontrado ou não cache 
        if (leggeraVariables.textarea.value === '') {
            leggeraVariables.hcPreview.appendChild(leggeraExtraFunctions.elementGenerator('span', '', '', 'Não encontrei nenhum tópico em cache. Carrega na caixa de texto para começar!'));
        } else {
            leggeraVariables.hcPreview.appendChild(leggeraExtraFunctions.elementGenerator('span', '', '', 'Encontrei um tópico em cache. A carregar...'));
            setTimeout(function () {
                leggeraVariables.hcPreview.innerHTML = leggeraVariables.textarea.value;
            }, 1000);
        }
    })();

    // ################ textboxes
    const leggeraTextboxes = {
        // Função para mostar as textboxes no appControls
        displayControls: function () {
            // Limpa o appControls + inicia paginador
            let pag = leggeraExtraFunctions.appControlsChange();
            // Anexar ao appControls a primeira página
            let textboxControls = leggeraVariables.appControls.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `row textbox-wrapper page-${pag}`));
            // Anexa as Textboxes à primeira página
            for (i = 1; i <= leggeraJSONGrab.numeroTextboxes; i++) {
                textboxControls.appendChild(leggeraExtraFunctions.elementGenerator('div', `textbox-${i}`, 'col-md-4 helpcenter-textbox', leggeraJSONGrab.textboxesFromJSON[i - 1]));
                textboxControls.lastChild.addEventListener('click', leggeraTextboxes.writeTextbox)
            }
        },

        // Função para escrever as textboxes na textarea
        writeTextbox: function (e) {
            let textbox = e.target;
            // Corrige a textbox quando se carrega na <img> ou <i>
            if (textbox.tagName === "IMG"
                || textbox.tagName === "I") { textbox = textbox.parentElement.parentElement };
            // Corrige a textbox quando se carrega no título da textbox
            if (textbox.classList.contains('novoalerta-titulo')
                || textbox.classList.contains('novoalerta-contido')) { textbox = textbox.parentElement };
            // Corrige a textbox quando se carrega fora das textboxes
            if (textbox.classList.contains('helpcenter-textbox')) { textbox = textbox.firstChild };
            // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
            textbox = textbox.outerHTML.toString().replace('<div class="novoalerta-titulo">', '<div class="novoalerta-titulo">' + "\n")
            textbox = textbox.toString().replace('<br>', '<br>' + "\n")
            textbox = textbox.toString().replace('<ul>', '<ul>' + "\n")
            textbox = textbox.toString().replace('</li>', '</li>' + "\n")
            leggeraExtraFunctions.escreveNaTextarea(textbox);
        }
    }

    // ################ icons
    const leggeraIcons = {
        // Atualiza a cor selecionada para os icons
        changeCurrentColor: function (e) {
            let eTarget = e.target
            if (eTarget.tagName === 'I') {
                eTarget = eTarget.parentElement
            }
            leggeraVariables.currentColor = eTarget.value;
            const colorBottons = document.querySelectorAll('.color-pick')
            for (color of colorBottons) {
                color.classList.remove('selected-color')
            }
            eTarget.classList.add('selected-color')
        },

        // Função para mostrar os icons no appControls 
        displayControls: function () {
            leggeraVariables.currentColor = '#000000'
            // Limpa o appControls + inicia paginador
            let pag = leggeraExtraFunctions.appControlsChange();
            // Declaração de variáveis necessárias para efetuar o loop      
            let nWrapper = 1;
            let nSubWrapper = 1;
            // Anexar ao appControls o wrapper de icons principal
            let appControlsIcons = leggeraVariables.appControls.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `row page-${pag}`));
            // Anexar o wrapper de icons (row 24 icons) ao wrapper principal
            let appControlsIconsMainWrapper = appControlsIcons.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `row icon-row-wrapper icon-row-${nWrapper}`));
            // Anexar um sub-wrapper de icons (col 12 icons)
            let appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `col-md-6 icon-sub-row-${nSubWrapper}`));
            for (i = 1; i <= leggeraJSONGrab.numeroIcons; i++) {
                // A cada 24 interações, cria um novo row de 24 icons
                if ((i % 24) === 0) {
                    appControlsIconsSubWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', `icon-${i}`, 'col-md-1 phcgo-icon', leggeraJSONGrab.iconsFromJSON[i - 1]));
                    appControlsIconsSubWrapper.lastChild.addEventListener('click', leggeraIcons.writeIcon);
                    nSubWrapper = 1;
                    nWrapper++;
                    appControlsIconsMainWrapper = appControlsIcons.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `row icon-row-wrapper icon-row-${nWrapper}`));
                    appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `col-md-6 icon-sub-row-${nSubWrapper}`));
                }
                // A cada 12 interações, cria um novo row de 12 icons
                else if ((i % 12) === 0) {
                    appControlsIconsSubWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', `icon-${i}`, 'col-md-1 phcgo-icon', leggeraJSONGrab.iconsFromJSON[i - 1]));
                    appControlsIconsSubWrapper.lastChild.addEventListener('click', leggeraIcons.writeIcon);
                    nSubWrapper++;
                    appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `col-md-6 icon-sub-row-${nSubWrapper}`));
                }
                else {
                    appControlsIconsSubWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', `icon-${i}`, 'col-md-1 phcgo-icon', leggeraJSONGrab.iconsFromJSON[i - 1]));
                    appControlsIconsSubWrapper.lastChild.addEventListener('click', leggeraIcons.writeIcon);
                }
            }
            const colorPickerRow = appControlsIcons.appendChild(leggeraExtraFunctions.elementGenerator('div', 'color-picker'));
            const colorTable = ['#000000', '#e0e0e0', '#1a237e', '#b70505', '#ff8f00', '#004d40']
            for (i = 1; i <= colorTable.length; i++) {
                if (i === 1) {
                    colorPickerRow.appendChild(leggeraExtraFunctions.elementGenerator('div', `icon-color-${i}`, 'color-pick selected-color', '<i class="lni lni-checkmark unselected-i"></i>'))
                } else {
                    colorPickerRow.appendChild(leggeraExtraFunctions.elementGenerator('div', `icon-color-${i}`, 'color-pick', '<i class="lni lni-checkmark unselected-i"></i>'))
                }
                colorPickerRow.lastChild.value = colorTable[i - 1];
                colorPickerRow.lastChild.addEventListener('click', leggeraIcons.changeCurrentColor)
            }
        },

        // Função para introduzir o icon no manual
        writeIcon: function (e) {
            let icon = e.target;
            // Corrige o etarget quando não carregamos direitinho no icon
            if (icon.classList.contains('phcgo-icon')) { icon = icon.firstChild };
            // altera a cor do icon, de acordo com a côr selecionada
            icon.style.color = leggeraVariables.currentColor;
            leIcon = icon.outerHTML;
            leggeraExtraFunctions.escreveNaTextarea(leIcon);
            // volta a alterar a cor do icon para a côr de origem
            if (leggeraVariables.currentLeggeraTheme == 1) { icon.style.color = '#fff' }
            else { icon.style.color = '#000' };
        }
    }

    // ################ botões & chips
    const leggeraButtons = {

        // Função para alterar os botões de acordo com o tema selecionado
        changeCurrentTheme: function (e) {
            let eTarget = e.target
            if (eTarget.tagName === 'I') {
                eTarget = eTarget.parentElement
            }
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
            // switch (control) {
            //     case 1: leggeraJSONGrab.buttonsFromJSON = leggeraJSONGrab.horizonButtonsFromJSON;
            //         
            //         break
            //     case 2: leggeraJSONGrab.buttonsFromJSON = leggeraJSONGrab.forestButtonsFromJSON;
            //         break
            //     case 3: leggeraJSONGrab.buttonsFromJSON = leggeraJSONGrab.darkButtonsFromJSON;
            //         break
            //     case 4: leggeraJSONGrab.buttonsFromJSON = leggeraJSONGrab.lightButtonsFromJSON;
            // }
            // Limpa o appControls + inicia paginador
            let pag = leggeraExtraFunctions.appControlsChange();
            // Anexar ao appControls o wrapper principal
            let appControlsButton = leggeraVariables.appControls.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `row page-${pag}`));
            // Anexar ao wrapper principal uma linha de 4 buttons
            let appControlsButtonWrapper = appControlsButton.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row phc-buttons'));
            for (i = 1; i <= 15; i++) {
                // A cada 5buttons, cria uma nova linha
                if (i % 5 === 0) {
                    // console.log(leggeraJSONGrab.iconsFromJSON);
                    appControlsButtonWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', `botao-${leggeraVariables.currentTheme}-${i}`, 'botao col-md-2', leggeraJSONGrab.buttonsFromJSON[control - 1][i - 1]));
                    appControlsButtonWrapper.lastChild.addEventListener('click', leggeraButtons.writeButton)
                    //regras de contraste no beat
                    if (control !== 3 && (i >= 5 && i <= 10)) { appControlsButtonWrapper.lastChild.lastChild.style.borderColor = 'hsla(0,0%,100%,.12)' }
                    if (control !== 3 && (i === 7 || i === 10)) { appControlsButtonWrapper.lastChild.lastChild.style.color = 'hsla(0,0%,100%,.12)' }
                    if (i === 9 || i === 10) { appControlsButtonWrapper.lastChild.lastChild.style.background = 'hsla(0,0%,100%,.12)' }
                    appControlsButtonWrapper = appControlsButton.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row phc-buttons'));
                } else {
                    appControlsButtonWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', `botao-${leggeraVariables.currentTheme}-${i}`, 'botao col-md-2', leggeraJSONGrab.buttonsFromJSON[control - 1][i - 1]));
                    appControlsButtonWrapper.lastChild.addEventListener('click', leggeraButtons.writeButton)
                    //regras de contraste no beat
                    if (control !== 3 && (i >= 5 && i <= 10)) { appControlsButtonWrapper.lastChild.lastChild.style.borderColor = 'hsla(0,0%,100%,.12)' }
                    if (control !== 3 && (i === 7 || i === 10)) { appControlsButtonWrapper.lastChild.lastChild.style.color = 'hsla(0,0%,100%,.12)' }
                    if (i === 9 || i === 10) { appControlsButtonWrapper.lastChild.lastChild.style.background = 'hsla(0,0%,100%,.12)' }
                }

            }
            const themePickerRow = leggeraVariables.appControls.firstChild.appendChild(leggeraExtraFunctions.elementGenerator('div', 'theme-picker', 'row'));
            const themeTable = ['horizon', 'forest', 'dark', 'light']
            for (i = 1; i <= 4; i++) {
                if (i === control) {
                    themePickerRow.appendChild(leggeraExtraFunctions.elementGenerator('div', `theme-${i}`, 'theme-pick selected-theme', `<i class="lni lni-checkmark unselected-i"></i>`))
                }
                else {
                    themePickerRow.appendChild(leggeraExtraFunctions.elementGenerator('div', `theme-${i}`, 'theme-pick', `<i class="lni lni-checkmark unselected-i"></i>`))
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
            button = leggeraJSONGrab.buttonsFromJSON[currentThemeID][String(button.parentElement.id).replace(`botao-${leggeraVariables.currentTheme}-`, '') - 1];
            leggeraExtraFunctions.escreveNaTextarea(button);
        }
    }

    // ############ APPCONTROLS LISTS & TABLES ############

    // Função para mostrar o appControls de Listas e Tabela

    const leggeraListsAndTables = {
        displayControls: function () {

            // ########## Listas ##########
            let pag = leggeraExtraFunctions.appControlsChange();
            let appControlsListsAndTables = leggeraVariables.appControls.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `row page-${pag}`));
            const appControlsLists = appControlsListsAndTables.appendChild(leggeraExtraFunctions.elementGenerator('div', 'listas-wrapper', 'col-md-5'));
            let row = appControlsLists.appendChild(leggeraExtraFunctions.elementGenerator('div', 'header-listas', 'row', '<i class="lni lni-list gold"></i>&nbsp;&nbsp;Gerador de listas'));
            row = appControlsLists.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));
            let col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-8'));
            const tipoListaSpan = col.appendChild(leggeraExtraFunctions.elementGenerator('span', 'tipo-lista-span', '', 'Tipo de lista'));
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-4'));
            const numItensSpan = col.appendChild(leggeraExtraFunctions.elementGenerator('span', 'num-itens-span', '', '# Itens'));
            row = appControlsLists.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-8'));
            let tipoListaDropdown = col.appendChild(leggeraExtraFunctions.elementGenerator('select', 'tipo-lista-dropdown'));
            tipoListaDropdown.addEventListener('change', leggeraListsAndTables.listPreview)
            tipoListaDropdown.appendChild(leggeraExtraFunctions.elementGenerator('option', '', '', '&nbsp;Não ordenada'));
            tipoListaDropdown.lastChild.value = 'ul'; // Valor a se passado para a função construtora de lista
            tipoListaDropdown.appendChild(leggeraExtraFunctions.elementGenerator('option', '', '', '&nbsp;Ordenada numérica'));
            tipoListaDropdown.lastChild.value = 'ol-1';
            tipoListaDropdown.appendChild(leggeraExtraFunctions.elementGenerator('option', '', '', '&nbsp;Ordenada alfabética'));
            tipoListaDropdown.lastChild.value = 'ol-a';
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-2'));// Filler row
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-2'));
            let numItensInput = col.appendChild(leggeraExtraFunctions.elementGenerator('input', 'num-itens-input'));
            numItensInput.setAttribute('type', 'number')
            row = appControlsLists.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', 'preview-list-row', 'col-md-8'));
            let previewList = col.appendChild(leggeraExtraFunctions.elementGenerator('ul'));
            previewList.style.listStylePosition = 'inside';
            for (i = 1; i <= 3; i++) {
                previewList.appendChild(leggeraExtraFunctions.elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem Ipsum`));
            }
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-4'));
            const wantLinks = col.appendChild(leggeraExtraFunctions.elementGenerator('input', 'want-links-checkbox'));
            wantLinks.setAttribute('type', 'checkbox')
            const wantLinksSpan = col.appendChild(leggeraExtraFunctions.elementGenerator('span', 'want-links-span', '', '&nbsp;&nbsp;&nbsp;Links?'));
            let criarListaButton = col.appendChild(leggeraExtraFunctions.elementGenerator('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir lista'));
            criarListaButton.addEventListener('click', leggeraListsAndTables.writeList)
            // ########## Separador Horizontal ##########
            const novoSeparadorWrapper = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-12 novo-separador'));
            novoSeparadorWrapper.appendChild(leggeraExtraFunctions.elementGenerator('span', '', '', '<i class="lni lni-page-break gold"></i> Separador horizontal<br>'));
            const novaQuebraBtn = novoSeparadorWrapper.appendChild(leggeraExtraFunctions.elementGenerator('button', 'nova-quebra-btn', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir separador horizontal'));
            novaQuebraBtn.addEventListener('click', leggeraListsAndTables.writeHR);


            // ########## Tabelas ##########
            leggeraVariables.tableType = 'normal-table'
            const novaTabelaWrapper = appControlsListsAndTables.appendChild(leggeraExtraFunctions.elementGenerator('div', 'tabelas-wrapper', 'col-md-7'));
            row = novaTabelaWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', 'header-tabelas', 'row', '<i class="lni lni-layout gold"></i>&nbsp;&nbsp;Gerador de tabelas'));
            row = novaTabelaWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-1')); // Filler col
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-3'));
            const numLinhasSpan = col.appendChild(leggeraExtraFunctions.elementGenerator('span', 'num-linhas-span', '', '# de linhas'));
            const numLinhasInput = col.appendChild(leggeraExtraFunctions.elementGenerator('input', 'num-linhas-input'));
            numLinhasInput.setAttribute('type', 'number')
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-3'));
            let numColunasSpan = col.appendChild(leggeraExtraFunctions.elementGenerator('span', 'num-colunas-span', '', '# de colunas'));
            const numColunasInput = col.appendChild(leggeraExtraFunctions.elementGenerator('input', 'num-colunas-input'));
            numColunasInput.setAttribute('type', 'number')
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-1'));   // Filler col
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', 'import-table-btn', 'col-md-3'));
            let converterTabela = col.appendChild(leggeraExtraFunctions.elementGenerator('button', '', 'btn btn-warning', '<i class="lni lni-code"></i>&nbsp;&nbsp;Importar tabela'));
            converterTabela.addEventListener('click', leggeraListsAndTables.convertTable);
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-1')); //  Filler Col
            row = novaTabelaWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-1')); //  Filler Col
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', 'cria-tabela-checkbox-wrapper', 'col-md-7'));
            const checkbox1 = col.appendChild(leggeraExtraFunctions.elementGenerator('input', 'normal-table'));
            checkbox1.setAttribute('type', 'checkbox');
            checkbox1.setAttribute('checked', 'true'); // Ativa a checkbox por omissão
            checkbox1.addEventListener('click', leggeraExtraFunctions.updateTableType)
            const checkboxLabel1 = col.appendChild(leggeraExtraFunctions.elementGenerator('span', '', '', '&nbsp;&nbsp;Normal'));
            const checkbox2 = col.appendChild(leggeraExtraFunctions.elementGenerator('input', 'modern-table'));
            checkbox2.setAttribute('type', 'checkbox');
            checkbox2.addEventListener('click', leggeraExtraFunctions.updateTableType)
            const checkboxLabel2 = col.appendChild(leggeraExtraFunctions.elementGenerator('span', '', '', '&nbsp;&nbsp;Moderna'));
            const checkbox3 = col.appendChild(leggeraExtraFunctions.elementGenerator('input', 'modern-table-blue'));
            checkbox3.setAttribute('type', 'checkbox');
            checkbox3.addEventListener('click', leggeraExtraFunctions.updateTableType)
            const checkboxLabel3 = col.appendChild(leggeraExtraFunctions.elementGenerator('span', '', '', '&nbsp;&nbsp;Moderna Azul'));
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', 'cria-tabela-btn-div', 'col-md-3'));
            let criarTabela = col.appendChild(leggeraExtraFunctions.elementGenerator('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir tabela'));
            criarTabela.addEventListener('click', leggeraListsAndTables.writeTable);
            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-1')); //  Filler Col

            // ########## Injetor de imagens base64 ##########
            const novaImagemWrapper = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-12 nova-imagem'));
            novaImagemWrapper.appendChild(leggeraExtraFunctions.elementGenerator('span', 'imageb64-span', '', '<i class="lni lni-gallery gold"></i>&nbsp;&nbsp;Carregar imagem<br>'));
            const fileUplaodForm = novaImagemWrapper.appendChild(leggeraExtraFunctions.elementGenerator('form', 'upload-form'));
            fileUplaodForm.setAttribute('method', 'post');
            fileUplaodForm.setAttribute('enctype', 'multipart/form-data');
            const file2Upload = fileUplaodForm.appendChild(leggeraExtraFunctions.elementGenerator('input', 'file-upload-input', '', ''));
            file2Upload.setAttribute('type', 'file')
            file2Upload.setAttribute('name', 'file-upload-input')
            const imagemCentradaCheckbox = novaImagemWrapper.appendChild(leggeraExtraFunctions.elementGenerator('input', 'imagem-centrada', '', ''));
            imagemCentradaCheckbox.setAttribute('type', 'checkbox');
            const imagemCentradaLabel = novaImagemWrapper.appendChild(leggeraExtraFunctions.elementGenerator('span', 'imagem-centrada-span', '', '&nbsp;&nbsp;&nbsp;Centrada?'));
            const fileUploadBtn = novaImagemWrapper.appendChild(leggeraExtraFunctions.elementGenerator('button', 'nova-quebra-btn', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir imagem'));
            fileUploadBtn.addEventListener('click', leggeraListsAndTables.writeImage);


        },

        // Função para atualizar com o tipo de lista selecionada
        listPreview: function () {

            const valorTipoLista = document.querySelector('#tipo-lista-dropdown').value;
            let previewWrapper = document.querySelector('#preview-list-row');

            switch (valorTipoLista) {
                case 'ul':
                    previewWrapper.innerHTML = '';
                    novaListaPreview = previewWrapper.appendChild(leggeraExtraFunctions.elementGenerator('ul', 'preview-list'));
                    novaListaPreview.style.listStylePosition = "inside";
                    for (i = 1; i <= 3; i++) {
                        novoItemPreview = novaListaPreview.appendChild(leggeraExtraFunctions.elementGenerator('li', '', 'preview-item', `<b>Item ${i}:</b> Lorem Ipsum`));
                    }
                    break
                case 'ol-1':
                    previewWrapper.innerHTML = '';
                    novaListaPreview = previewWrapper.appendChild(leggeraExtraFunctions.elementGenerator('ol', 'preview-list'));
                    novaListaPreview.setAttribute('type', '1')
                    novaListaPreview.style.listStylePosition = "inside";
                    for (i = 1; i <= 3; i++) {
                        novoItemPreview = novaListaPreview.appendChild(leggeraExtraFunctions.elementGenerator('li', '', 'preview-item', `<b>Item ${i}:</b> Lorem Ipsum`));
                    }
                    break
                case 'ol-a':
                    previewWrapper.innerHTML = '';
                    novaListaPreview = previewWrapper.appendChild(leggeraExtraFunctions.elementGenerator('ol', 'preview-list'));
                    novaListaPreview.setAttribute('type', 'a');
                    novaListaPreview.style.listStylePosition = "inside";
                    for (i = 1; i <= 3; i++) {
                        novoItemPreview = novaListaPreview.appendChild(leggeraExtraFunctions.elementGenerator('li', '', 'preview-item', `<b>Item ${i}:</b> Lorem Ipsum`));
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
                    novaLista = leggeraExtraFunctions.elementGenerator('ul');
                    novaLista.style.listStylePosition = 'inside';
                    for (i = 1; i <= n; i++) {
                        if (wantLinks) { novaLista.appendChild(leggeraExtraFunctions.elementGenerator('li', '', '', `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                            novaLista.appendChild(leggeraExtraFunctions.elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                    }
                    // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
                    novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                    leggeraExtraFunctions.escreveNaTextarea(novaLista);
                    break;
                case 'ol-1':
                    novaLista = leggeraExtraFunctions.elementGenerator('ol');
                    novaLista.setAttribute('type', '1');
                    novaLista.style.listStylePosition = "inside";
                    for (i = 1; i <= n; i++) {
                        if (wantLinks) { novaLista.appendChild(leggeraExtraFunctions.elementGenerator('li', '', '', `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                            novaLista.appendChild(leggeraExtraFunctions.elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                    }
                    novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                    leggeraExtraFunctions.escreveNaTextarea(novaLista);
                    break;
                case 'ol-a':
                    novaLista = leggeraExtraFunctions.elementGenerator('ol');
                    novaLista.setAttribute('type', 'a');
                    novaLista.style.listStylePosition = 'inside';
                    for (i = 1; i <= n; i++) {
                        if (wantLinks) { novaLista.appendChild(leggeraExtraFunctions.elementGenerator('li', '', '', `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                            novaLista.appendChild(leggeraExtraFunctions.elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                    }
                    novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                    leggeraExtraFunctions.escreveNaTextarea(novaLista);
                    break;
            }
        },

        // Estilos a serem utilizados para formatação das tabelas
        normalTableStyle: '<style>.phcgo-old-table>tbody>tr>td{text-align:left;background-color:#fff;padding:20px 10px;border:solid 1px #000}.phcgo-old-table>tbody>tr:nth-child(1)>td{background-color:rgb(255, 225, 189)!important;border:solid 1px #000!important;font-size:16px!important;font-weight:700}</style>',
        modernTableStyle: '<style>.phcgo-new-table>tbody>tr>td{border-radius:20px;border:solid 2px #fff;background-color:#f2f2f2;color:#000;padding:5px 20px}.phcgo-new-table>tbody>tr:nth-child(1)>td{border-radius:20px;border:solid 2px #fff;background-color:rgb(255, 225, 189);color:#000;padding:4px 20px;font-size:20px}</style>',
        modernTableStyleBlue: '<style>.phcgo-new-table-blue>tbody>tr>td{border-radius:20px;border:solid 2px #fff;background-color:#f2f2f2;color:#000;padding:5px 20px}.phcgo-new-table-blue>tbody>tr:nth-child(1)>td{border-radius:20px;border:solid 2px #fff;background-color:#3fa8f6;color:#fff;padding:4px 20px;font-size:20px}</style>',

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
                case 'normal-table': novaTabela = leggeraExtraFunctions.elementGenerator('table', '', 'phcgo-old-table'); break
                case 'modern-table': novaTabela = leggeraExtraFunctions.elementGenerator('table', '', 'phcgo-new-table'); break
                case 'modern-table-blue': novaTabela = leggeraExtraFunctions.elementGenerator('table', '', 'phcgo-new-table-blue'); break
            }
            novaTabela.style.display = 'flex';
            novaTabela.style.justifyContent = 'center';
            const tBody = novaTabela.appendChild(leggeraExtraFunctions.elementGenerator('tbody'));
            const novoCabecalho = leggeraExtraFunctions.elementGenerator('tr');
            for (i = 1; i <= numColunas; i++) {
                let novaColuna = novoCabecalho.appendChild(leggeraExtraFunctions.elementGenerator('td', '', '', `Cabeçalho ${i}`));
            }
            tBody.appendChild(novoCabecalho);
            // adiciona as restantes linhas á tabela
            for (iLinhas = 1; iLinhas <= numLinhas; iLinhas++) {
                const novaLinha = leggeraExtraFunctions.elementGenerator('tr');
                for (iColunas = 1; iColunas <= numColunas; iColunas++) {
                    let novaColuna = novaLinha.appendChild(leggeraExtraFunctions.elementGenerator('td', '', '', `Linha ${iLinhas} Coluna ${iColunas}`));
                }
                tBody.appendChild(novaLinha);
            }
            // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
            novaTabela = (novaTabela.outerHTML.toString().replaceAll('<tr>', "\n" + '<tr>'));
            novaTabela = (novaTabela.toString().replaceAll('</td><td>', '</td>' + "\n" + '<td>'));
            novaTabela.replaceAll('</tbody>', "\n" + '</tbody>');
            // Anexar o <style> necessário, de acordo com a tabela selecionada
            switch (leggeraVariables.tableType) {
                case 'normal-table':
                    novaTabela.classList = 'phcgo-old-table';
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.normalTableStyle + "\n" + novaTabela); break
                case 'modern-table':
                    novaTabela.classList = 'phcgo-new-table';
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyle + "\n" + novaTabela); break
                case 'modern-table-blue':
                    novaTabela.classList = 'phcgo-new-table-blue';
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyleBlue + "\n" + novaTabela); break
            }
            leggeraExtraFunctions.escreveNaTextarea(novaTabela);
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
            leggeraExtraFunctions.escreveNaTextarea(leggeraExtraFunctions.elementGenerator('div', 'tempTable', '', tablecode).outerHTML);
            let novaTabela;
            switch (leggeraVariables.tableType) {
                case 'normal-table': novaTabela = leggeraExtraFunctions.elementGenerator('table', '', 'phcgo-old-table'); break
                case 'modern-table': novaTabela = leggeraExtraFunctions.elementGenerator('table', '', 'phcgo-new-table'); break
                case 'modern-table-blue': novaTabela = leggeraExtraFunctions.elementGenerator('table', '', 'phcgo-new-table-blue'); break
            }
            novaTabela.style.display = 'flex';
            novaTabela.style.justifyContent = 'center';
            novaTabela.innerHTML = (leggeraListsAndTables.convertTableEngine()).outerHTML;
            // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
            novaTabela = (novaTabela.outerHTML.toString().replaceAll('<tr>', "\n" + '<tr>'));
            novaTabela = (novaTabela.toString().replaceAll('</td><td>', '</td>' + "\n" + '<td>'));
            novaTabela.replaceAll('</tbody>', "\n" + '</tbody>');
            // Anexar o <style> necessário, de acordo com a tabela selecionada
            switch (leggeraVariables.tableType) {
                case 'normal-table':
                    novaTabela.classList = 'phcgo-old-table';
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.normalTableStyle + "\n" + novaTabela); break
                case 'modern-table':
                    novaTabela.classList = 'phcgo-new-table';
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyle + "\n" + novaTabela); break
                case 'modern-table-blue':
                    novaTabela.classList = 'phcgo-new-table-blue';
                    novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + leggeraListsAndTables.modernTableStyleBlue + "\n" + novaTabela); break
            }
            leggeraExtraFunctions.escreveNaTextarea(novaTabela);
        },

        // Função que pega na tabela temporária, envia os conteúdos para array, e devolve uma nova tabela, sem estilos nem classes
        convertTableEngine: function () {
            const itemsParaConverter = [];
            const numLinhas = document.querySelectorAll('#tempTable tr').length
            itemsParaConverter.push(document.querySelectorAll(`#tempTable th`));
            for (i = 1; i <= numLinhas; i++) {
                itemsParaConverter.push(document.querySelectorAll(`#tempTable tr:nth-child(${i}) td`))
            }
            const tabelaConvertida = leggeraExtraFunctions.elementGenerator('table')
            for (i = 0; i < numLinhas; i++) {
                tabelaConvertida.appendChild(leggeraExtraFunctions.elementGenerator('tr'));
                for (x = 0; x < itemsParaConverter[i].length; x++) {
                    tabelaConvertida.lastChild.appendChild(leggeraExtraFunctions.elementGenerator('td', '', '', itemsParaConverter[i][x].innerText))
                    let colspan = itemsParaConverter[i][x].attributes.colspan;
                    try { tabelaConvertida.lastChild.lastChild.setAttribute('colspan', colspan.value) }
                    catch { }
                    let rowspan = itemsParaConverter[i][x].attributes.rowspan;
                    try { tabelaConvertida.lastChild.lastChild.setAttribute('rowspan', rowspan.value) }
                    catch { }
                }
            }
            return tabelaConvertida
        },

        // Função para adicionar um seprador horizontal <hr> código do tópico
        writeHR: function () {
            let novoSeparador = leggeraExtraFunctions.elementGenerator('hr');
            novoSeparador.style.borderTop = '3px solid #eee';
            novoSeparador = novoSeparador.outerHTML
            leggeraExtraFunctions.escreveNaTextarea(novoSeparador);
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
                        console.log(response)
                        if (response != 0) {
                            let uploadedImagem = `<span style="display:flex;justify-content:center;align-self:center;"><img style="max-width:100%;height:auto;"\nsrc="${response}"></span>`
                            if (document.querySelector('#imagem-centrada').checked === false) {
                                uploadedImagem = `<img style="max-width:100%;height:auto;"\nsrc="${response}">`
                            }
                            leggeraExtraFunctions.escreveNaTextarea(uploadedImagem)
                        } else {
                            alert('file not uploaded');
                        }
                    },
                });
            } else {
                alert("Please select a file.");
            }
        }
    }

    // ############ APPCONTROLS TITLES & LINKS ############

    // Função para mostrar a modal de Títulos e Ligações
    function appControlsTitulosELigacoes() {

        // Limpa o appControls + inicia paginador
        let pag = leggeraExtraFunctions.appControlsChange();

        // Anexar ao appControls o wrapper principal
        let appControlsLinksAndTitles = leggeraVariables.appControls.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `row page-${pag}`));

        // Anexar ao wrapper principal, o Wrapper da secção da esquerda
        const novoVariosWrapperLeft = appControlsLinksAndTitles.appendChild(leggeraExtraFunctions.elementGenerator('div', 'left-wrapper', 'col-md-8'));

        // Anexar ao wrapper principal, o Wrapper da secção da direita
        const geradorTitulosWrapper = novoVariosWrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('div', 'gerador-titulos', 'row', '<i class="lni lni-pilcrow gold"></i>&nbsp;Gerador de títulos'));

        // Row 1
        row = geradorTitulosWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));
        let col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-1')); // Filler col

        // Col 1
        col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-11'));

        // Span Tipo Lista
        let tipoListaSpan = col.appendChild(leggeraExtraFunctions.elementGenerator('span', 'tipo-lista-span', '', 'Tipo de título'));

        // Row 2 
        row = geradorTitulosWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));
        col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-1')); // Filler col

        // Col 1
        col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-7'));

        // Dropdown para "Tipo de título"
        let tipoTituloDropdown = col.appendChild(leggeraExtraFunctions.elementGenerator('select', 'tipo-titulo-dropdown'));
        tipoTituloDropdown.addEventListener('change', previewTitle)

        // Opção 1    
        tipoTituloDropdown.appendChild(leggeraExtraFunctions.elementGenerator('option', '', '', '&nbsp;Título H1'));
        tipoTituloDropdown.lastChild.value = 'default1' // Valor a se passado para a função construtora de lista
        // Opção 2
        tipoTituloDropdown.appendChild(leggeraExtraFunctions.elementGenerator('option', '', '', '&nbsp;Título H2'));
        tipoTituloDropdown.lastChild.value = 'default2'
        // Opção 3
        tipoTituloDropdown.appendChild(leggeraExtraFunctions.elementGenerator('option', '', '', '&nbsp;Título H3'));
        tipoTituloDropdown.lastChild.value = 'default3'
        // Opção 4
        tipoTituloDropdown.appendChild(leggeraExtraFunctions.elementGenerator('option', '', '', '&nbsp;Título H1 - 2'));
        tipoTituloDropdown.lastChild.value = 'old1' // Valor a se passado para a função construtora de lista
        // Opção 5
        tipoTituloDropdown.appendChild(leggeraExtraFunctions.elementGenerator('option', '', '', '&nbsp;Título H2 - 2'));
        tipoTituloDropdown.lastChild.value = 'old2'
        // Opção 6
        tipoTituloDropdown.appendChild(leggeraExtraFunctions.elementGenerator('option', '', '', '&nbsp;Título H3 - 2'));
        tipoTituloDropdown.lastChild.value = 'old3'

        col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-1'));   //Filler col

        // Col Button criar título
        row.appendChild(leggeraExtraFunctions.elementGenerator('div', 'cria-lista-btn-div', 'col-md-2'));

        // Button "Criar título"
        let criarTituloButton = col.appendChild(leggeraExtraFunctions.elementGenerator('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir título'));
        criarTituloButton.addEventListener('click', writeTitle)

        col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-1'));   //Filler col
        row = geradorTitulosWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));

        // Col 1 (pre-view do título)
        col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', 'preview-heading-row', 'col-md-12'));
        row.lastChild.appendChild(leggeraExtraFunctions.elementGenerator('h1', '', 'manuais', 'Título/Heading 1'))
        row = novoVariosWrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row title-link-filler'));         // Filler Row



        // Wrapper da secção das ligações
        const novaLigacaoWrapper = novoVariosWrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row gerador-links-wrapper'));

        // Col 0
        col = novaLigacaoWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', 'gerador-links-h1', 'col-md-12', '<i class="lni lni-website gold"></i>&nbsp;&nbsp;Gerador de links'));

        // Col 1
        col = novaLigacaoWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-3 text-left'));

        // Span 'Descrição da ligação'
        const spanDescricao = col.appendChild(leggeraExtraFunctions.elementGenerator('span', 'nome-span', '', 'Descrição da ligação:'));

        // Col 2
        col = novaLigacaoWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-6'));

        // Input 'Descrição da ligação'
        const inputDescricao = col.appendChild(leggeraExtraFunctions.elementGenerator('input', 'nome-input'));

        // Col 3
        col = novaLigacaoWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-2 nova-ligacao-btn-col'));

        // Button Criar ligação
        const criarLigacao = col.appendChild(leggeraExtraFunctions.elementGenerator('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir ligação'));
        criarLigacao.addEventListener('click', writeLink);

        // Col 4
        col = novaLigacaoWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-3 text-left'));

        // Span 'URL'
        const spanURL = col.appendChild(leggeraExtraFunctions.elementGenerator('span', 'link-span', '', 'URL da ligação:'));

        // Col 5
        col = novaLigacaoWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-6'));

        // Input 'URL'
        const inputURL = col.appendChild(leggeraExtraFunctions.elementGenerator('input', 'link-input'));

        // Wrapper da secção dos extras
        const novoVariosWrapperRight = appControlsLinksAndTitles.appendChild(leggeraExtraFunctions.elementGenerator('div', 'hilite-wrapper', 'col-md-4'));

        // Row 0
        row = novoVariosWrapperRight.appendChild(leggeraExtraFunctions.elementGenerator('div', 'hilite-subwrapper', 'row', '<i class="lni lni-skipping-rope gold"></i>&nbsp;&nbsp;Hilite.me API'));

        // Row 1
        row = novoVariosWrapperRight.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));

        // Wrapper Hilite.me
        const hiliteWrapper = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-12'));

        // Button para formatar hilite.me
        const hiliteTextarea = hiliteWrapper.appendChild(leggeraExtraFunctions.elementGenerator('textarea', 'hilite-textarea'));

        const novaHiliteCheckboxesRow = hiliteWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', 'hilite-checkboxes-row', 'row'));

        leggeraVariables.codeType = 'vbnet' //reset ao trocar de página

        let miniWrapper1 = novaHiliteCheckboxesRow.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-4'))
        miniWrapper1.appendChild(leggeraExtraFunctions.elementGenerator('input', 'vbnet'));
        miniWrapper1.lastChild.type = 'checkbox'
        miniWrapper1.lastChild.setAttribute('checked', 'true');
        miniWrapper1.addEventListener('change', leggeraExtraFunctions.updatecodeType)
        miniWrapper1.appendChild(leggeraExtraFunctions.elementGenerator('span', '', '', '&nbsp;&nbsp;VB.NET'));

        let miniWrapper2 = novaHiliteCheckboxesRow.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-4'))
        miniWrapper2.appendChild(leggeraExtraFunctions.elementGenerator('input', 'ts'));
        miniWrapper2.lastChild.type = 'checkbox'
        miniWrapper2.addEventListener('change', leggeraExtraFunctions.updatecodeType)
        miniWrapper2.appendChild(leggeraExtraFunctions.elementGenerator('span', '', '', '&nbsp;&nbsp;TypeScript'));

        let miniWrapper3 = novaHiliteCheckboxesRow.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-4'))
        miniWrapper3.appendChild(leggeraExtraFunctions.elementGenerator('input', 'json'));
        miniWrapper3.lastChild.type = 'checkbox'
        miniWrapper3.addEventListener('change', leggeraExtraFunctions.updatecodeType)
        miniWrapper3.appendChild(leggeraExtraFunctions.elementGenerator('span', '', '', '&nbsp;&nbsp;JSON'));

        const novaHiliteBtn = hiliteWrapper.appendChild(leggeraExtraFunctions.elementGenerator('button', '', 'btn btn-warning', '<i class="lni lni-code"></i>&nbsp;&nbsp;Introduzir código'));
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
                titulosPreview.appendChild(leggeraExtraFunctions.elementGenerator('h1', '', 'manuais', 'Título/Heading 1'))
                break;
            case 'default2':
                titulosPreview.appendChild(leggeraExtraFunctions.elementGenerator('h2', '', 'manuais', 'Título/Heading 2'))
                break;
            case 'default3':
                titulosPreview.appendChild(leggeraExtraFunctions.elementGenerator('h3', '', 'manuais', 'Título/Heading 3'))
                break;
            case 'old1':
                titulosPreview.appendChild(leggeraExtraFunctions.elementGenerator('h1', '', '', 'Título/Heading 1'));
                break;
            case 'old2':
                titulosPreview.appendChild(leggeraExtraFunctions.elementGenerator('h2', '', '', 'Título/Heading 2'))
                break;
            case 'old3':
                titulosPreview.appendChild(leggeraExtraFunctions.elementGenerator('h3', '', '', 'Título/Heading 3'))
                break;
        }
    }

    // Função para adicionar o título ao tópico de manual
    function writeTitle() {
        let dropdownTitulos = document.querySelector('#tipo-titulo-dropdown');
        switch (dropdownTitulos.value) {

            // Opção 1
            case 'default1':
                leggeraExtraFunctions.escreveNaTextarea(leggeraExtraFunctions.elementGenerator('h1', '', 'manuais', 'Título/Heading 1').outerHTML)
                break;
            case 'default2':
                leggeraExtraFunctions.escreveNaTextarea(leggeraExtraFunctions.elementGenerator('h2', '', 'manuais', 'Título/Heading 2').outerHTML)
                break;
            case 'default3':
                leggeraExtraFunctions.escreveNaTextarea(leggeraExtraFunctions.elementGenerator('h3', '', 'manuais', 'Título/Heading 3').outerHTML)
                break;
            case 'old1':
                leggeraExtraFunctions.escreveNaTextarea(leggeraExtraFunctions.elementGenerator('h1', '', '', 'Título/Heading 1').outerHTML)
                break;
            case 'old2':
                leggeraExtraFunctions.escreveNaTextarea(leggeraExtraFunctions.elementGenerator('h2', '', '', 'Título/Heading 2').outerHTML)
                break;
            case 'old3':
                leggeraExtraFunctions.escreveNaTextarea(leggeraExtraFunctions.elementGenerator('h3', '', '', 'Título/Heading 3').outerHTML)
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
        let novaLigacao = leggeraExtraFunctions.elementGenerator('a', '', 'manuais', nome);
        novaLigacao.setAttribute('href', link);
        novaLigacao.setAttribute('target', '_blank');
        novaLigacao = novaLigacao.outerHTML
        leggeraExtraFunctions.escreveNaTextarea(novaLigacao);
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
            colaphcPreview.classList.remove('no-display');
            helpcenterPreviewWrapper.classList.add('no-display');
            appControlsColap();
        } else {

            leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');

            for (i = 1; i <= leggeraVariables.colapList.length; i++) {
                let saveBtn = document.querySelector(`#colap-save-btn-${i}`);
                if (saveBtn.classList.contains('no-display') == false) {
                    alert(`Não é possível adicionar um novo colapsável, enquanto existirem alterações pendentes.`); return
                }
            }


            botaoVistaColap.classList.replace('btn-info', 'btn-light');        // a ordem invertida do getcollaps é importante, não sei porque nao me lembra
            appControlsColap();
            colaphcPreview.classList.add('no-display');
            helpcenterPreviewWrapper.classList.remove('no-display');
        }
    }

    // Função para mostrar a appControls dos colapsáveis
    function appControlsColap() {

        // Array com todos os colapsáveis do tópico
        leggeraVariables.colapList = document.querySelectorAll('.row .seccao-phcgo');

        // Limpa a appControls
        colaphcPreview.innerHTML = '';

        // Wrapper (row)
        let colapWrapper = colaphcPreview.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `page-1`));

        if (leggeraVariables.colapList.length !== 0) {
            // Loop para cada item do Array
            for (i = 1; i <= leggeraVariables.colapList.length; i++) {

                // Row 1
                let row = colapWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));
                (i % 2 === 0) ? row.classList.add('par') : row.classList.add('impar');
                let wrapperLeft = row.appendChild(leggeraExtraFunctions.elementGenerator('div', `inputs-${i}`, 'col-md-5 inputs-wrapper'));
                let wrapperRight = row.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-md-7'));

                // Col 1 (inputs)

                // Input 1
                wrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('span', '', 'colap-id', 'ID do colapsável (minúsculas, sem acentuação, sem espaçamento)'));
                let idInput = wrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('input', '', `colap-input-id-${i}`));
                idInput.value = leggeraVariables.colapList[i - 1].nextElementSibling.id;
                idInput.addEventListener('keyup', updateColapPreviewByID)

                // Input 2
                wrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('span', '', 'colap-h2', 'Título do colapsável'));
                let h2Input = wrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('input', '', `colap-input-h2-${i}`));
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
                wrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('span', '', 'colap-body', 'Corpo do colapsável'));
                let bodyInput = wrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('textarea', '', `colap-input-body-${i}`));
                bodyInput.addEventListener('keyup', colapTextAreaEventsSlim)
                bodyInput.addEventListener('click', colapTextAreaEvents)

                let bodyTempInput = leggeraVariables.colapList[i - 1].nextElementSibling.innerHTML;
                // Remove o cursor laranja ao passar para os collaps
                bodyInput.value = String(bodyTempInput).replace('<span id="pulse">|</span>', '');

                // Guardar alterações Button
                let updateCollaps = wrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('button', `colap-save-btn-${i}`, 'btn btn-success no-display', `<i class="lni lni-save"></i> Guardar alterações`));
                updateCollaps.addEventListener('click', gerarColapsaveis)

                // Rejeitar alterações Button
                let dropCollaps = wrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('button', `colap-drop-btn-${i}`, 'btn btn-danger no-display', `<i class="lni lni-cross-circle"></i> Descartar alterações`));
                dropCollaps.addEventListener('click', rejeitarColapsaveis)

                // filler div para padding
                wrapperLeft.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'save-padding'));

                // Col 2 (display)
                wrapperRight.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `colap-display-h2-${i}`));
                wrapperRight.lastChild.innerText = h2Trim[0];

                //hotfix, estava a aparecer "Abrir/Fechar" várias vezes nos preview
                while (wrapperRight.lastChild.innerText.includes('Abrir/Fechar')) {
                    wrapperRight.lastChild.innerText = wrapperRight.lastChild.innerText.replace('Abrir/Fechar', '');
                }

                wrapperRight.appendChild(leggeraExtraFunctions.elementGenerator('div', '', `colap-display-body-${i}`, leggeraVariables.colapList[i - 1].nextElementSibling.innerHTML));
            }

            // adicionar novo collap
            row = colapWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'row'));

            col = row.appendChild(leggeraExtraFunctions.elementGenerator('div', 'add-new-collap'));
            const newCollapBtn = col.appendChild(leggeraExtraFunctions.elementGenerator('button', '', "btn btn-info", '<i class="lni lni-circle-plus"></i>&nbsp;&nbsp;Adicionar um novo colapsável'));
            newCollapBtn.addEventListener('click', novoColapsavel)
            const scrollToTop = col.appendChild(leggeraExtraFunctions.elementGenerator('button', '', "btn btn-info", '<i class="lni lni-arrow-up-circle"></i>&nbsp;&nbsp;Voltar ao início'));
            scrollToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); })

        } else {
            let geradorColapWrapper = colaphcPreview.appendChild(leggeraExtraFunctions.elementGenerator('div', 'gerador-colaps-wrapper', 'row'));

            let col = geradorColapWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'gerador-colaps-1', ''));
            col.appendChild(leggeraExtraFunctions.elementGenerator('span', 'no-colaps-span', '', 'Não foi encontrado nenhum colapsável.'));
            geradorColapWrapper.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'flex-br', ''));
            let geradornewCollapBtn = geradorColapWrapper.appendChild(leggeraExtraFunctions.elementGenerator('button', '', "btn btn-info", '<i class="lni lni-circle-plus"></i>&nbsp;&nbsp;Adicionar um novo colapsável'));
            geradornewCollapBtn.addEventListener('click', novoColapsavel)

            col.appendChild(leggeraExtraFunctions.elementGenerator('div'));
        }
    }

    // Função para mostrar o savebutton ao atualizar o ID dos colapsáveis
    function updateColapPreviewByID(e) {
        // Mostra o save button
        const saveButton = e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
        saveButton.classList.remove('no-display');
    }

    // Função para atualizar o prewview dos colapsáveis (H2)
    function updateColapHeading(e) {
        leggeraVariables.activeTextarea = e.target;

        let inputText = leggeraVariables.activeTextarea.value;
        let cursorappControlsPos = leggeraExtraFunctions.getCursorPos(e);

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
        let cursorappControlsPos = leggeraExtraFunctions.getCursorPos(e);

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
        let cursorappControlsPos = leggeraExtraFunctions.getCursorPos(e);
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

    function rejeitarColapsaveis(e) {
        appControlsColap();
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
            let newCollap = leggeraExtraFunctions.elementGenerator('div', '', 'row seccao-phcgo');

            // título
            let newCollapColTitulo = newCollap.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-xs-8'));

            //link do h2
            let h2Link = newCollapColTitulo.appendChild(leggeraExtraFunctions.elementGenerator('a'));
            h2Link.setAttribute('href', `#${newCollapseArray[0][i - 1]}`)
            h2Link.setAttribute('data-toggle', 'collapse');


            //h2
            let newtituloH2 = h2Link.appendChild(leggeraExtraFunctions.elementGenerator('h2', '', 'manuais', newCollapseArray[1][i - 1]))
            newtituloH2.style.fontWeight = 'normal';

            //abrir/fechar
            let newCollapCol1 = newCollap.appendChild(leggeraExtraFunctions.elementGenerator('div', '', 'col-xs-4 text-right'))

            //link do abrir/fechar
            let link = newCollapCol1.appendChild(leggeraExtraFunctions.elementGenerator('a', '', '', 'Abrir/Fechar'));
            link.setAttribute('href', `#${newCollapseArray[0][i - 1]}`)
            link.setAttribute('data-toggle', "collapse")
            link.style.display = 'block'

            // wrapper do conteudo
            let newCollapConteudo = leggeraExtraFunctions.elementGenerator('div', newCollapseArray[0][i - 1], 'collapse multi-collapse', newCollapseArray[2][i - 1]);
            newCollapFinal = newCollapFinal + `<!-- Início do Colapsável #${i} -->` + "\n" + (newCollap.outerHTML.toString() + "\n\n" + newCollapConteudo.outerHTML.toString() + "\n" + `<!-- Fim do Colapsável #${i} -->` + "\n")
        }

        // função para obter o texto antes do primeiro collap
        function topicoAntesColapsaveis() {
            let charCountAntes = leggeraVariables.textarea.value.search('<!-- Início do Colapsável #1 -->');
            if (charCountAntes < 0) { charCountAntes = leggeraVariables.textarea.value.search('<div class="row seccao-phcgo">') }
            const textoAntesCollaps = leggeraVariables.textarea.value.slice(0, charCountAntes);
            return textoAntesCollaps
        }

        newCollapFinal = topicoAntesColapsaveis() + newCollapFinal;
        leggeraVariables.textarea.value = newCollapFinal;
        leggeraVariables.hcPreview.innerHTML = newCollapFinal;

        //obtem a nossa localização vertical ao gravar
        const whereWasI = document.querySelector('#' + e.target.parentElement.id).parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect().bottom
        const totalHeight = document.querySelector('#' + e.target.parentElement.id).parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect().height

        appControlsColap();
        leggeraExtraFunctions.autosave2JSON();

        // volta-nos a posicionar onde estávamos aquando da gravação (é necessário, porque o ecrã é re-escrito ao gravar)
        window.scrollTo(0, totalHeight - whereWasI);
    }

    function singleColapsavel() {
        // wrapper do collapsavel
        let newCollap = leggeraExtraFunctions.elementGenerator('div');
        newCollap.classList = 'row seccao-phcgo';

        // título
        let newCollapColTitulo = newCollap.appendChild(leggeraExtraFunctions.elementGenerator('div'))
        newCollapColTitulo.classList = 'col-xs-8'

        //link do h2
        let h2Link = newCollapColTitulo.appendChild(leggeraExtraFunctions.elementGenerator('a'));
        h2Link.setAttribute('href', `#novo-colapsavel`)
        h2Link.setAttribute('data-toggle', 'collapse');

        //h2
        let newtituloH2 = h2Link.appendChild(leggeraExtraFunctions.elementGenerator('h2'))
        newtituloH2.classList = 'manuais'
        newtituloH2.innerText = 'Novo colapsável'

        //abrir/fechar
        let newCollapCol1 = newCollap.appendChild(leggeraExtraFunctions.elementGenerator('div'))
        newCollapCol1.classList = 'col-xs-4 text-right'

        //link do abrir/fechar
        let link = newCollapCol1.appendChild(leggeraExtraFunctions.elementGenerator('a'));
        link.setAttribute('href', `#novo-colapsavel`)
        link.setAttribute('data-toggle', "collapse")
        link.innerText = 'Abrir/Fechar'

        // wrapper do conteudo
        let newCollapConteudo = leggeraExtraFunctions.elementGenerator('div');
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
            appControlsColap();
            window.scrollTo(0, document.body.scrollHeight);
        }
    }

    //############ event listeners

    // Atualizar o botão dos menus conforme o menu onde estamos 
    const menus = document.querySelectorAll('.main-menu');
    for (menu of menus) { menu.addEventListener('click', leggeraExtraFunctions.updateWhereIAm) };
    document.addEventListener("keyup", leggeraExtraFunctions.newBr);
    document.querySelector('#quicksave-btn').addEventListener('click', leggeraExtraFunctions.quickSave);
    document.querySelector('#quickload-btn').addEventListener('click', leggeraExtraFunctions.quickLoad);
    document.querySelector('#logout-btn').addEventListener('click', leggeraExtraFunctions.logout);
    document.querySelector('#preview-btn').addEventListener('click', leggeraExtraFunctions.saveFromPreviewBtn)
    document.querySelector('#ancora-btn').addEventListener('click', leggeraExtraFunctions.stickyTop);
    document.querySelector('#botoes-btn').addEventListener('click', leggeraButtons.displayControls);
    document.querySelector('#logos-btn').addEventListener('click', leggeraIcons.displayControls);
    document.querySelector('#textbox-btn').addEventListener('click', leggeraTextboxes.displayControls);
    document.querySelector('#listas-tabelas-btn').addEventListener('click', leggeraListsAndTables.displayControls);
    document.querySelector('#titulos-ligacoes-btn').addEventListener('click', appControlsTitulosELigacoes);
    document.querySelector('#manuals-btn').addEventListener('click', leggeraMyManualsDBConnect.getManuals);
    document.querySelector('#theme-btn').addEventListener('click', leggeraExtraFunctions.changeLeggeraTheme);
    leggeraVariables.textarea.addEventListener('keyup', leggeraUpdatePreviews.slim);
    leggeraVariables.textarea.addEventListener('click', leggeraUpdatePreviews.full);
}