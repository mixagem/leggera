/************************************/
/* helpcenter+ supperliggera        */
/* mambosinfinitos, 2022            */
/* featurelist:
    - helpcenter "offline" preview
    - injetor caixas texto
    - injetor de icons com seletor de cor
    - injetor de buttons com seletor de tema
    - injetor de <hr>
    - injetor de títulos
    - injetor de imagens
    - construtor de listas numeradas, não numeradas, e com links
    - construtor de tabelas, com selector de estilos e injeção dos <style> necessários 
        (inclui comentários informativos)
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

    to do:
        - corrigir o bug "&" no code generator" -> Quando o código tem &ampersand, fica partido
        - css review
        - js review

/************************************/

function mixWrapper() {

    // ############ SELETORES  ############

    const textarea = document.querySelector('textarea');
    const appControls = document.querySelector('#app-controls-wrapper');
    const hcPreview = document.querySelector('#helpcenter-preview');


    // ############ VARIÁVEIS ############

    // Estilos a serem utilizados para formatação das tabelas
    const normalTableStyle = '<style>.phcgo-old-table>tbody>tr>td{text-align:left;background-color:#fff;padding:20px 10px;border:solid 1px #000}.phcgo-old-table>tbody>tr:nth-child(1)>td{background-color:rgb(255, 225, 189)!important;border:solid 1px #000!important;font-size:16px!important;font-weight:700}</style>'
    const modernTableStyle = '<style>.phcgo-new-table>tbody>tr>td{border-radius:20px;border:solid 2px #fff;background-color:#f2f2f2;color:#000;padding:5px 20px}.phcgo-new-table>tbody>tr:nth-child(1)>td{border-radius:20px;border:solid 2px #fff;background-color:rgb(255, 225, 189);color:#000;padding:4px 20px;font-size:20px}</style>'
    const modernTableStyleBlue = '<style>.phcgo-new-table-blue>tbody>tr>td{border-radius:20px;border:solid 2px #fff;background-color:#f2f2f2;color:#000;padding:5px 20px}.phcgo-new-table-blue>tbody>tr:nth-child(1)>td{border-radius:20px;border:solid 2px #fff;background-color:#3fa8f6;color:#fff;padding:4px 20px;font-size:20px}</style>'

    /** 
     * arrays a ser utilizados para guardar os slices
     * das textareas, aquando da introdução de elementos
     * ([0] = texto até ao cursor | [1] = texto a partir do cursos)
    */
    let stringCursor = [];
    let stringCursorColap = [];

    /**
     * Array onde vão ser guardados os colapsáveis existentes (.row .seccao-phcgo)
     * A ser utilizado para a construção da vista de colapsáveis
     */
    let colapList = [];

    // variável com o valor da última textarea selecionada
    let activeTextarea = '';

    // variável com o valor da última checkbox (tipo de tabela) selecionada
    let codeType = 'vbnet'
    let tableType = 'normal-table'
    let currentColor = '#000000'
    let currentTheme = 'horizon'
    const colorTable = ['#000000', '#e0e0e0', '#1a237e', '#b70505', '#ff8f00', '#004d40']
    const themeTable = ['horizon', 'forest', 'dark', 'light']

    // controlo do autosave
    let limitExceded = 0;

    // ############ FUNÇÕES PRINCIAIS ############

    // document.createElement, mais turbinada para a escritura de grids
    function elementGenerator(ele, id = '', classlist = '', inner = '') {
        const elementGenerated = document.createElement(`${ele}`);
        if (id !== '') { elementGenerated.id = `${id}` }
        if (classlist !== '') { elementGenerated.classList = `${classlist}` }
        if (inner !== '') { elementGenerated.innerHTML = `${inner}` }
        return elementGenerated
    }

    // Adiciona o elemento selecionado na posição do cursor
    function escreveNaTextarea(etarget) {

        // babyproofs
        if (activeTextarea === '') { alert('Coloca o cursor numa área de texto antes de adicionar conteúdos.'); return }

        // caso seja a textarea principal
        if (activeTextarea.id === 'textarea') {
            if (etarget === '<br>') {
                novoSourceCode = `${stringCursor[0]}` + `${etarget}` + "\n" + `${stringCursor[1]}`;
            } else {
                // O array stringCursor é composto por duas string, antes e depois do cursor
                // O novoSourceCode faz o concat das string, com o elemento a ser escrito na posição do cursor.
                novoSourceCode = `${stringCursor[0]}` + "\n" + `${etarget}` + `${stringCursor[1]}`;
            }
            // Atualiza a textarea
            textarea.value = novoSourceCode;

            // Atualiza o preview
            hcPreview.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);

            appControlsColap();

            // Guarda as alterações em cache
            autosave2JSON();

            // caso seja as textareas da vista de collaps
        } else {
            novoSourceCode = `${stringCursorColap[0]}` + "\n" + `${(etarget).toString()}` + `${stringCursorColap[1]}`;
            activeTextarea.value = novoSourceCode;
            let inputPreview = activeTextarea.parentElement.nextElementSibling.children[1];
            inputPreview.innerHTML = novoSourceCode;
        }
    }


    // ############ FUNÇÕES AUXILIARES  ############

    // Função para guardar na cache do browser o Source Code do tópico (e respetivas alterações)
    function autosave2JSON() {
        let textarea2JSON = JSON.stringify(textarea.value);
        localStorage.setItem('textarea', textarea2JSON);
    }

    /**
    * Função para alterar o código do preview para apontar para a imagem local.
    * O código da textarea não é alterado, para manter compatibilidade com o HelpCenter (por refazer ao contrário, substiuindo o icon velho pelo novo)
    */
    function fixArtigosRelacionadosLogo(novoSourceCode) {
        let sourceCodeParaPreview = novoSourceCode.replace('src="../pimages/go/artigo.svg"', 'src="assets/img/artigo.svg"');
        return sourceCodeParaPreview
    }

    // função para obter a posição do cursor (utilizado para a textarea)
    function getCursorPos(e) {
        let eTarget = e.target;
        let cursorPos = eTarget.selectionStart;
        return cursorPos
    }

    // função para ancorar o cabeçalho do editor
    function stickyTop() {
        const header = document.querySelector('.header');
        const ancoraBtn = document.querySelector('#ancora-btn');

        if (header.classList.contains('sticky-top')) {
            header.classList.remove('sticky-top');
            ancoraBtn.classList.replace('btn-info', 'btn-light');
        } else {
            header.classList.add('sticky-top');
            ancoraBtn.classList.replace('btn-light', 'btn-info');
        }
    }

    // Mostra injeta um <br> ao carregar Enter
    function newBr(e) {
        if (e.target.tagName === 'TEXTAREA' && e.key === 'Enter') {
            escreveNaTextarea('<br>');
        }
    }

    // função para atualizar o preview com o cursor laranja
    function updatePreviews(e) {
        activeTextarea = e.target;
        let inputText = textarea.value;
        console.log(inputText.length)
        if (inputText.length <= 100000) {
            document.querySelector('#preview-btn').classList.add('no-display')
            limitExceded = 0;

            let cursorPos = getCursorPos(e);
            let inputTextString1;
            let inputTextString2;

            // babyproof para quando colocamos o cursor numa tag, ele se mostrado for da tag (para não partir o prewview)
            novoCursorPos = cursorPos;
            if (inputText[cursorPos] === '>') {
                inputTextString1 = inputText.slice(0, cursorPos + 2)
                inputTextString2 = inputText.slice(cursorPos + 2, inputText.length)
            } else {
                (function rotinaCursor() {
                    switch (inputText[novoCursorPos]) {
                        case '<':
                            inputTextString1 = inputText.slice(0, novoCursorPos)
                            inputTextString2 = inputText.slice(novoCursorPos, inputText.length)
                            break
                        case '>':
                            inputTextString1 = inputText.slice(0, cursorPos)
                            inputTextString2 = inputText.slice(cursorPos, inputText.length)
                            break
                        case undefined:
                            inputTextString1 = inputText.slice(0, cursorPos)
                            inputTextString2 = inputText.slice(cursorPos, inputText.length)
                            break
                        default:
                            novoCursorPos--
                            rotinaCursor()
                    }

                    // introduz o cursor laranja
                    let inputTextWithCursor = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;

                    // guarda a posição do cursor 
                    stringCursor[0] = inputTextString1;
                    stringCursor[1] = inputTextString2;

                    // atualiza o preview
                    hcPreview.innerHTML = inputTextWithCursor;
                    hcPreview.innerHTML = fixArtigosRelacionadosLogo(hcPreview.innerHTML);

                    appControlsColap();
                    autosave2JSON();
                })();
            }
        } else {
            if (limitExceded === 0) {
                document.querySelector('#preview-btn').classList.remove('no-display')
                alert(`Foi excedido o limite máximo de caractéres aceites pelo Autosave.\n Para pre-visualizar e guardar em cache as alterações efetuadas, carrega em "Pré-visualizar", localizado por cima da textarea principal da aplicação.`)
            }
            limitExceded = 1;
            return
        }
    }

    function updatePreviewsSlim(e) {
        activeTextarea = e.target;
        let inputText = textarea.value;
        if (inputText.length <= 100000) {
            document.querySelector('#preview-btn').classList.add('no-display')
            limitExceded = 0;
            let cursorPos = getCursorPos(e);

            // divide o tópico em duas partes (até ao cursor, e após o curos)
            let inputTextString1 = inputText.slice(0, cursorPos);
            let inputTextString2 = inputText.slice(cursorPos);

            // introduz o cursor laranja
            let inputTextWithCursor = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;

            // guarda a posição do cursor 
            stringCursor[0] = inputTextString1;
            stringCursor[1] = inputTextString2;

            // atualiza o preview
            hcPreview.innerHTML = inputTextWithCursor;
            hcPreview.innerHTML = fixArtigosRelacionadosLogo(hcPreview.innerHTML);

            appControlsColap();
            autosave2JSON();
        } else {
            if (limitExceded === 0) {
                document.querySelector('#preview-btn').classList.remove('no-display')
                alert('Foi excedido o limite máximo de caractéres aceites pelo Autosave. Carrega em atualizar para guardar as tuas alterações e atualizar a pré-visualização.')
            }
            limitExceded = 1;
            return
        }
    }

    document.querySelector('#preview-btn').addEventListener('click', saveFromPreviewBtn)

    function saveFromPreviewBtn() {

        activeTextarea = textarea;
        let inputText = textarea.value;
        hcPreview.innerHTML = inputText
        appControlsColap();
        autosave2JSON();
    }



    // Page title auto-scroller
    const titleScrol = setInterval(scrollTitle, 500);
    function scrollTitle() {
        let tituloPagina = document.title.toString();
        const updatedTituloPagina1 = tituloPagina.slice(0, 1)
        const updatedTituloPagina2 = tituloPagina.slice(1, tituloPagina.length)
        document.title = updatedTituloPagina2 + updatedTituloPagina1
    }

    // Função para atualizar o tipo de código selecionado
    function updatecodeType(e) {
        document.querySelector('#ts').checked = false
        document.querySelector('#vbnet').checked = false
        document.querySelector('#json').checked = false
        e.target.checked = true
        codeType = e.target.id
    }

    // Função para atualizar o tipo de tabela selecionado
    function updateTableType(e) {
        document.querySelector('#normal-table').checked = false
        document.querySelector('#modern-table').checked = false
        document.querySelector('#modern-table-blue').checked = false
        e.target.checked = true
        tableType = e.target.id
    }

    // Função para guardar o tópico num segundo slot da chache
    function quickSave() {
        const textarea2JSON = JSON.stringify(textarea.value);
        localStorage.setItem('quickSave', textarea2JSON);
        textarea.value = '';
        hcPreview.innerHTML = '';
        appControlsColap();
        stringCursor = ['','']
    }

    // Função para carregar o tópico do segundo slot da chache
    function quickLoad() {
        const getTextareaFromJSON = localStorage.getItem('quickSave');
        textarea.value = JSON.parse(getTextareaFromJSON);
        autosave2JSON();
        hcPreview.innerHTML = textarea.value;
        appControlsColap();
    }

    function appControlsChange() {
        // Limpar o div dos appControls
        appControls.innerHTML = '';

        // Iniciar contador paginador (a ser utilizado no futuro, caso os elementos não caibam todos numa só página de appControls)
        return pag = 1;
    }

    // Atualizar o botão dos menus conforme o menu onde estamos 
    (function whereAmI() {
        const menus = document.querySelectorAll('.main-menu');
        for (menu of menus) {
            menu.addEventListener('click', updateWhereIAm)
        }
    })();

    function updateWhereIAm(e) {
        let eTarget = e.target;
        const menus = document.querySelectorAll('.main-menu');
        for (menu of menus) {
            menu.classList = 'btn btn-light main-menu'
        }
        if (eTarget.tagName === "I") { eTarget = eTarget.parentElement }
        eTarget.classList = 'btn btn-info main-menu'
    }

    // Atualiza a cor selecionada para os icons
    function changeCurrentColor(e) {
        let eTarget = e.target
        if (eTarget.tagName === 'I') {
            eTarget = eTarget.parentElement
        }
        currentColor = eTarget.value;
        const colorBottons = document.querySelectorAll('.color-pick')
        for (color of colorBottons) {
            color.classList.remove('selected-color')
        }
        eTarget.classList.add('selected-color')
    }

    // Atualiza o tema selecionado para os icons
    function changeCurrentTheme(e) {
        let eTarget = e.target
        if (eTarget.tagName === 'I') {
            eTarget = eTarget.parentElement
        }
        currentTheme = eTarget.value;
        switch (eTarget.id) {
            case 'theme-1': appControlsButtons(e, 1);
                break
            case 'theme-2': appControlsButtons(e, 2);
                break
            case 'theme-3': appControlsButtons(e, 3);
                break
            case 'theme-4': appControlsButtons(e, 4);
        }
    }

    // Debug Tools

    // Mostra target na consola
    // document.addEventListener("click", function (e) {
    //     console.log(e.target);
    // // console.log('cursorpos: '+e.target.selectionStart)
    // });


    // ############ HILITE.ME API ############

    // API POST
    function hiliteAPI() {

        // Babyproof
        if (document.querySelector('#hilite-textarea').value.length <= 0) { alert('A textarea para o código hilite.me está vazia.'); return }

        const code = document.querySelector('#hilite-textarea').value.toString();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                hiliteFormater(this.responseText);
            }
        };
        xhttp.open("POST", "http://hilite.me/api", true); //
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`code=${code}&style=monokai&lexer=${codeType}&divstyles=border:solid #eb8475;border-width:.1em .1em .1em .8em;padding:.2em .6em;`);
    }

    // Formatar a resposta obtida
    function hiliteFormater(novosource) {
        let fixedHilite = String(novosource).replaceAll("\n", '<br>' + "\n");
        // para vbnet
        fixedHilite = fixedHilite.replaceAll('    ','<div style="display:inline-block;width:20px;"></div>')
        // para json
        fixedHilite = fixedHilite.replaceAll('	','<div style="display:inline-block;width:20px;"></div>')
        // para typescript
        fixedHilite = fixedHilite.replaceAll('  ','<div style="display:inline-block;width:20px;"></div>')
        
        fixedHilite = fixedHilite.replace('<pre style="', '<pre style="background:transparent;border:0px;');
        escreveNaTextarea(fixedHilite);
    }


    // ############ EVENT LISTENERS ############

    document.addEventListener("keyup", newBr);
    document.querySelector('#listas-tabelas-btn').addEventListener('click', appControlsListsAndTables);
    document.querySelector('#ancora-btn').addEventListener('click', stickyTop);
    document.querySelector('#titulos-ligacoes-btn').addEventListener('click', appControlsTitulosELigacoes);
    document.querySelector('#botoes-btn').addEventListener('click', appControlsButtons);
    document.querySelector('#logos-btn').addEventListener('click', appControlsIcons);
    document.querySelector('#textbox-btn').addEventListener('click', appControlsTextbox);
    document.querySelector('#quicksave-btn').addEventListener('click', quickSave);
    document.querySelector('#quickload-btn').addEventListener('click', quickLoad);
    document.querySelector('#image-btn').addEventListener('click', writeImage);
    textarea.addEventListener('keyup', updatePreviewsSlim);
    textarea.addEventListener('click', updatePreviews);


    // ############ APP START ############

    window.onload = superliggeraStart();

    function superliggeraStart() {

        // Vai buscar os dados aos JSON
        grabThemAll();

        // RNG entre 2500 e 3000
        const rng = Math.floor(Math.random() * (3000 - 2500)) + 2500;

        // Função a ser executada RNG milisegundos depois de ter sido carregada a página
        const landingTimer = setTimeout(function () {

            // Esconde a loading page
            document.querySelector('#loading-wrapper').classList.add('no-display')

            // Mostra a aplicação
            const allSections = [];
            allSections.push(document.querySelector('.sticky-top'))
            allSections.push(document.querySelector('.display-preview'))
            for (i = 0; i < allSections.length; i++) {
                allSections[i].classList.remove('no-display')
            }
        }, rng);

        // Vai buscar o último tópico de manual à cache (caso exista)
        (function fromJSON2Textarea() {
            try {
                const getTextareaFromJSON = localStorage.getItem('textarea');
                textarea.value = JSON.parse(getTextareaFromJSON);
            }
            catch { }
        })();

        // Função que atualiza o hcPreview, conforme tenha encontrado ou não cache 
        (function haveCache() {
            if (textarea.value === '') {
                const haveCache = hcPreview.appendChild(elementGenerator('span', '', '', 'Não encontrei nenhum tópico em cache. Carrega na caixa de texto para começar!'));
            } else {
                const haveCache = hcPreview.appendChild(elementGenerator('span', '', '', 'Encontrei um tópico em cache. A carregar...'));
                const timer = setTimeout(refreshhcPreview, 3600);
                function refreshhcPreview() {
                    hcPreview.innerHTML = textarea.value;
                }
            }
        })();
    }


    // ############ JSON FETCH ############

    /**
    * Delaração de arrays para guardar os dados vindos do fetch JSON
    * Utilizados na construção dos menus
    */
    const iconsFromJSON = [];
    const textboxesFromJSON = [];
    const horizonButtonsFromJSON = [];
    const forestButtonsFromJSON = [];
    const darkButtonsFromJSON = [];
    const lightButtonsFromJSON = [];
    let buttonsFromJSON = [];

    /**
     * Declaração variáveis utilizadas para guardar o número de itens em cada JSON
     * Utilizados na construção dos menus
     */
    // a construção dos menus
    let numeroTextboxes;
    let numeroIcons;

    // Executa todas as funções que vão buscar dados JSON
    function grabThemAll() {

        (function grabJSONButtons1() {
            fetch('assets/js/buttons-horizon.json')
                .then(function (response) { return response.json() })
                .then(function (data) { appendData(data) })
                .catch(function (err) { console.log('Rebentou. É lidar compadre.') })

            function appendData(data) {
                for (let i = 0; i < data.length; i++) {
                    horizonButtonsFromJSON[i] = data[i].code;
                }
            }
        })();

        (function grabJSONButtons2() {
            fetch('assets/js/buttons-forest.json')
                .then(function (response) { return response.json() })
                .then(function (data) { appendData(data) })
                .catch(function (err) { console.log('Rebentou. É lidar compadre.') })

            function appendData(data) {
                for (let i = 0; i < data.length; i++) {
                    forestButtonsFromJSON[i] = data[i].code;
                }
            }
        })();

        (function grabJSONButtons3() {
            fetch('assets/js/buttons-dark.json')
                .then(function (response) { return response.json() })
                .then(function (data) { appendData(data) })
                .catch(function (err) { console.log('Rebentou. É lidar compadre.') })

            function appendData(data) {
                for (let i = 0; i < data.length; i++) {
                    darkButtonsFromJSON[i] = data[i].code;
                }
            }
        })();

        (function grabJSONButtons4() {
            fetch('assets/js/buttons-light.json')
                .then(function (response) { return response.json() })
                .then(function (data) { appendData(data) })
                .catch(function (err) { console.log('Rebentou. É lidar compadre.') })

            function appendData(data) {
                for (let i = 0; i < data.length; i++) {
                    lightButtonsFromJSON[i] = data[i].code;
                }
            }
        })();

        (function grabJSONTextBoxes() {
            fetch('assets/js/textbox.json')
                .then(function (response) { return response.json() })
                .then(function (data) { appendData(data) })
                .catch(function (err) { console.log('Rebentou. É lidar compadre.') })

            function appendData(data) {
                for (let i = 0; i < data.length; i++) {
                    textboxesFromJSON[i] = data[i].code;
                }
                numeroTextboxes = data.length;
            }
        })();

        (function grabJSONIcons() {
            fetch('assets/js/imagens.json')
                .then(function (response) { return response.json() })
                .then(function (data) { appendData(data) })
                .catch(function (err) { console.log('Rebentou. É lidar compadre.') })

            function appendData(data) {
                for (let i = 0; i < data.length; i++) {
                    iconsFromJSON[i] = data[i].code;
                }
                numeroIcons = data.length;
            }
        })();
    }


    // ############ APPCONTROLS TEXTBOXES ############

    // Função para mostar as textboxes no appControls
    function appControlsTextbox() {

        // Limpa o appControls + inicia paginador
        let pag = appControlsChange();

        // Anexar ao appControls a primeira página
        let textboxControls = appControls.appendChild(elementGenerator('div', '', `row page-${pag}`));

        // Anexa as Textboxes à primeira página
        for (i = 1; i <= numeroTextboxes; i++) {
            textboxControls.appendChild(elementGenerator('div', `textbox-${i}`, 'col-md-4 helpcenter-textbox', textboxesFromJSON[i - 1]));
            textboxControls.lastChild.addEventListener('click', writeTextbox)
        }
    }

    // Função para escrever as textboxes na textarea
    function writeTextbox(e) {
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

        escreveNaTextarea(textbox);
    }


    // ############ APPCONTROLS ICONS ############

    // Função para mostrar os icons no appControls 
    function appControlsIcons() {

        currentColor = '#000000'
        // Limpa o appControls + inicia paginador
        let pag = appControlsChange();

        // Declaração de variáveis necessárias para efetuar o loop      
        let nWrapper = 1;
        let nSubWrapper = 1;

        // Anexar ao appControls o wrapper de icons principal
        let appControlsIcons = appControls.appendChild(elementGenerator('div', '', `row page-${pag}`));

        // Anexar o wrapper de icons (row 24 icons) ao wrapper principal
        let appControlsIconsMainWrapper = appControlsIcons.appendChild(elementGenerator('div', '', `row icon-row-${nWrapper}`));

        // Anexar um sub-wrapper de icons (col 12 icons)
        let appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(elementGenerator('div', '', `col-md-6 icon-sub-row-${nSubWrapper}`));

        for (i = 1; i <= numeroIcons; i++) {

            // A cada 24 interações, cria um novo row de 24 icons
            if ((i % 24) === 0) {
                appControlsIconsSubWrapper.appendChild(elementGenerator('div', `icon-${i}`, 'col-md-1 phcgo-icon', iconsFromJSON[i - 1]));
                appControlsIconsSubWrapper.lastChild.addEventListener('click', writeIcon);
                nSubWrapper = 1;
                nWrapper++;
                appControlsIconsMainWrapper = appControlsIcons.appendChild(elementGenerator('div', '', `row icon-row-${nWrapper}`));
                appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(elementGenerator('div', '', `col-md-6 icon-sub-row-${nSubWrapper}`));
            }

            // A cada 12 interações, cria um novo row de 12 icons
            else if ((i % 12) === 0) {
                appControlsIconsSubWrapper.appendChild(elementGenerator('div', `icon-${i}`, 'col-md-1 phcgo-icon', iconsFromJSON[i - 1]));
                appControlsIconsSubWrapper.lastChild.addEventListener('click', writeIcon);
                nSubWrapper++;
                appControlsIconsSubWrapper = appControlsIconsMainWrapper.appendChild(elementGenerator('div', '', `col-md-6 icon-sub-row-${nSubWrapper}`));
            }

            else {
                appControlsIconsSubWrapper.appendChild(elementGenerator('div', `icon-${i}`, 'col-md-1 phcgo-icon', iconsFromJSON[i - 1]));
                appControlsIconsSubWrapper.lastChild.addEventListener('click', writeIcon);
            }
        }

        const colorPickerRow = appControlsIcons.appendChild(elementGenerator('div', 'color-picker'));

        for (i = 1; i <= colorTable.length; i++) {
            if (i === 1) {
                colorPickerRow.appendChild(elementGenerator('div', `icon-color-${i}`, 'color-pick selected-color', '<i class="lni lni-checkmark unselected-i"></i>'))
            } else {
                colorPickerRow.appendChild(elementGenerator('div', `icon-color-${i}`, 'color-pick', '<i class="lni lni-checkmark unselected-i"></i>'))
            }
            colorPickerRow.lastChild.value = colorTable[i - 1];
            colorPickerRow.lastChild.addEventListener('click', changeCurrentColor)
        }
    }

    function writeIcon(e) {
        let icon = e.target;

        // Corrige o etarget quando não carregamos direitinho no icon
        if (icon.classList.contains('phcgo-icon')) { icon = icon.firstChild };

        // altera a cor do icon, de acordo com a côr selecionada
        icon.style.color = currentColor
        leIcon = icon.outerHTML
        escreveNaTextarea(leIcon);

        // volta a alterar a cor do icon para a côr de origem
        icon.style.color = '#fff'
    }


    // ############ APPCONTROLS BUTTONS ############

    // Função para mostrar o appControls de botoes e etiquetas
    function appControlsButtons(e, control = 1) {

        currentTheme = 'horizon'
        switch (control) {
            case 1: buttonsFromJSON = horizonButtonsFromJSON;
                break
            case 2: buttonsFromJSON = forestButtonsFromJSON;
                break
            case 3: buttonsFromJSON = darkButtonsFromJSON;
                break
            case 4: buttonsFromJSON = lightButtonsFromJSON;
        }
        // Limpa o appControls + inicia paginador
        let pag = appControlsChange();

        // Anexar ao appControls o wrapper principal
        let appControlsButton = appControls.appendChild(elementGenerator('div', '', `row page-${pag}`));

        // Anexar ao wrapper principal uma linha de 4 buttons
        let appControlsButtonWrapper = appControlsButton.appendChild(elementGenerator('div', '', 'row phc-buttons'));

        // Tive de  maertelar o número de ciclos para a row das chips ter colunas mais curtas que o resto dos botões XD
        for (i = 1; i <= 8; i++) {

            // A cada 4 buttons, cria uma nova linha
            if (i % 4 === 0) {
                appControlsButtonWrapper.appendChild(elementGenerator('div', `botao-${i}`, 'botao col-md-3', buttonsFromJSON[i - 1]));
                appControlsButtonWrapper.lastChild.addEventListener('click', writeButton)
                appControlsButtonWrapper = appControlsButton.appendChild(elementGenerator('div', '', 'row phc-buttons'));
            } else {
                appControlsButtonWrapper.appendChild(elementGenerator('div', `botao-${i}`, 'botao col-md-3', buttonsFromJSON[i - 1]));
                appControlsButtonWrapper.lastChild.addEventListener('click', writeButton)
            }
        }

        // aqui está o martelanço
        appControlsButtonWrapper.appendChild(elementGenerator('div', '', 'col-md-1'))
        for (i = 9; i <= 13; i++) {
            appControlsButtonWrapper.appendChild(elementGenerator('div', `botao-${i}`, 'botao col-md-2', buttonsFromJSON[i - 1]));
            appControlsButtonWrapper.lastChild.addEventListener('click', writeButton);
        }
        appControlsButtonWrapper.appendChild(elementGenerator('div', '', 'col-md-1'))

        //hot fix para ajustar o contraste, sem mexer no codigo original do botão 
        for (i = 5; i <= 8; i++) {
            document.querySelector(`#botao-${i}`).lastChild.style.backgroundColor = 'rgba(255,255,255,0.08)'
            if (i === 7) {
                document.querySelector(`#botao-${i}`).lastChild.style.color = '#888'
            }
            else {
                document.querySelector(`#botao-${i}`).lastChild.style.border = '1px solid #bbb'
            }
        }

        const themePickerRow = appControls.firstChild.appendChild(elementGenerator('div', 'theme-picker', 'row'));

        for (i = 1; i <= 4; i++) {
            if (i === control) {
                themePickerRow.appendChild(elementGenerator('div', `theme-${i}`, 'theme-pick selected-theme', `<i class="lni lni-checkmark unselected-i"></i>`))
            }
            else {
                themePickerRow.appendChild(elementGenerator('div', `theme-${i}`, 'theme-pick', `<i class="lni lni-checkmark unselected-i"></i>`))
            }
            themePickerRow.lastChild.addEventListener('click', changeCurrentTheme)
            themePickerRow.lastChild.value = themeTable[i - 1];
        }
    }

    // Função para adicionar um botão ao código do tópico
    function writeButton(e) {
        let button = e.target;
        // Corrige o etarget quando carregamos ao lado do botão/etiqueta
        if (button.classList.length > 0) { button = button.firstChild };

        // Vai buscar o número do botão e vai buscar ao array dos botões o código original 
        button = buttonsFromJSON[String(button.parentElement.id).replace('botao-', '') - 1];
        escreveNaTextarea(button);
    }


    // ############ APPCONTROLS LISTS & TABLES ############

    // Função para mostrar o appControls de Listas e Tabelas
    function appControlsListsAndTables() {

        // ########## LISTAS ##########

        // Limpa o appControls + inicia paginador
        let pag = appControlsChange();

        // Anexar ao appControls a primeira página (atualmente não existe segunda página)
        let appControlsListsAndTables = appControls.appendChild(elementGenerator('div', '', `row page-${pag}`));

        // Anexar o wrapper da secção listas ao wrapper principal
        const appControlsLists = appControlsListsAndTables.appendChild(elementGenerator('div', 'listas-wrapper', 'col-md-5'));

        let row = appControlsLists.appendChild(elementGenerator('div', 'header-listas', 'row', '<i class="lni lni-hammer"></i>&nbsp;&nbsp;Gerador de listas'));
        row = appControlsLists.appendChild(elementGenerator('div', '', 'row'));
        let col = row.appendChild(elementGenerator('div', '', 'col-md-8'));

        // Span Tipo Lista
        const tipoListaSpan = col.appendChild(elementGenerator('span', 'tipo-lista-span', '', 'Tipo de lista'));

        col = row.appendChild(elementGenerator('div', '', 'col-md-4'));

        // Span "Número de Itens"
        const numItensSpan = col.appendChild(elementGenerator('span', 'num-itens-span', '', '# Itens'));

        row = appControlsLists.appendChild(elementGenerator('div', '', 'row'));
        col = row.appendChild(elementGenerator('div', '', 'col-md-8'));

        // Dropdown para "Tipo de lista"
        let tipoListaDropdown = col.appendChild(elementGenerator('select', 'tipo-lista-dropdown'));

        tipoListaDropdown.addEventListener('change', listPreview)

        // Anexar opções á dropdown
        // Opção 1    
        tipoListaDropdown.appendChild(elementGenerator('option', '', '', '&nbsp;Não ordenada &nbsp;&nbsp;&nbsp;( • Item )'));
        tipoListaDropdown.lastChild.value = 'ul'; // Valor a se passado para a função construtora de lista
        // Opção 2
        tipoListaDropdown.appendChild(elementGenerator('option', '', '', '&nbsp;Ordenada &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( 1. Item )'));
        tipoListaDropdown.lastChild.value = 'ol-1';
        // Opção 3
        tipoListaDropdown.appendChild(elementGenerator('option', '', '', '&nbsp;Ordenada &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( a. Item )'));
        tipoListaDropdown.lastChild.value = 'ol-a';

        col = row.appendChild(elementGenerator('div', '', 'col-md-2'));// Filler row
        col = row.appendChild(elementGenerator('div', '', 'col-md-2'));

        // Input "Número de Itens"
        let numItensInput = col.appendChild(elementGenerator('input', 'num-itens-input'));
        numItensInput.setAttribute('type', 'number')

        row = appControlsLists.appendChild(elementGenerator('div', '', 'row'));

        // Pre-view da lista
        col = row.appendChild(elementGenerator('div', 'preview-list-row', 'col-md-8'));

        // Lista default
        let previewList = col.appendChild(elementGenerator('ul'));
        previewList.style.listStylePosition = 'inside';
        for (i = 1; i <= 3; i++) {
            previewList.appendChild(elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem Ipsum`));
        }

        // Cria lista + want links
        col = row.appendChild(elementGenerator('div', '', 'col-md-4'));

        const wantLinksSpan = col.appendChild(elementGenerator('span', 'want-links-span', '', 'Links?'));
        const wantLinks = col.appendChild(elementGenerator('input', 'want-links-checkbox'));
        wantLinks.setAttribute('type', 'checkbox')

        // Button "Criar lista"
        let criarListaButton = col.appendChild(elementGenerator('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Criar lista'));
        criarListaButton.addEventListener('click', writeList)


        // ########## TABELAS ##########

        tableType = 'normal-table'

        // Anexar o wrapper da secção das tabelas ao wrapper principal 
        const novaTabelaWrapper = appControlsListsAndTables.appendChild(elementGenerator('div', 'tabelas-wrapper', 'col-md-7'));

        row = novaTabelaWrapper.appendChild(elementGenerator('div', 'header-tabelas', 'row', '<i class="lni lni-hammer"></i>&nbsp;&nbsp;Gerador de tabelas'));
        row = novaTabelaWrapper.appendChild(elementGenerator('div', '', 'row'));
        col = row.appendChild(elementGenerator('div', '', 'col-md-1')); // Filler col
        col = row.appendChild(elementGenerator('div', '', 'col-md-3'));

        // Span 'Número de Linhas'
        const numLinhasSpan = col.appendChild(elementGenerator('span', 'num-linhas-span', '', '# de linhas'));
        // Input 'Número de Linhas'
        const numLinhasInput = col.appendChild(elementGenerator('input', 'num-linhas-input'));
        numLinhasInput.setAttribute('type', 'number')

        // Col 3
        col = row.appendChild(elementGenerator('div', '', 'col-md-3'));

        // Span 'Número de Colunas'
        let numColunasSpan = col.appendChild(elementGenerator('span', 'num-colunas-span', '', '# de colunas'));

        // Input 'Número de Colunas'
        const numColunasInput = col.appendChild(elementGenerator('input', 'num-colunas-input'));
        numColunasInput.setAttribute('type', 'number')

        col = row.appendChild(elementGenerator('div', '', 'col-md-1'));   // Filler col
        col = row.appendChild(elementGenerator('div', '', 'col-md-3'));

        // Button 'Converter tabela'
        let converterTabela = col.appendChild(elementGenerator('button', '', 'btn btn-warning', '<i class="lni lni-code"></i>&nbsp;&nbsp;Importar tabela'));
        converterTabela.addEventListener('click', convertTable);

        col = row.appendChild(elementGenerator('div', '', 'col-md-1')); //  Filler Col
        row = novaTabelaWrapper.appendChild(elementGenerator('div', '', 'row'));
        col = row.appendChild(elementGenerator('div', '', 'col-md-1')); //  Filler Col
        col = row.appendChild(elementGenerator('div', 'cria-tabela-checkbox-wrapper', 'col-md-7'));

        // Checkbox 'Normal'
        const checkbox1 = col.appendChild(elementGenerator('input', 'normal-table'));
        checkbox1.setAttribute('type', 'checkbox');
        checkbox1.setAttribute('checked', 'true'); // Ativa a checkbox por omissão
        checkbox1.addEventListener('click', updateTableType)

        // Span 'Normal'
        const checkboxLabel1 = col.appendChild(elementGenerator('span', '', '', '&nbsp;&nbsp;Normal'));

        // Input 'Moderna'
        const checkbox2 = col.appendChild(elementGenerator('input', 'modern-table'));
        checkbox2.setAttribute('type', 'checkbox');
        checkbox2.addEventListener('click', updateTableType)

        // Span 'Moderna'
        const checkboxLabel2 = col.appendChild(elementGenerator('span', '', '', '&nbsp;&nbsp;Moderna'));

        // Input 'Moderna Azul'
        const checkbox3 = col.appendChild(elementGenerator('input', 'modern-table-blue'));
        checkbox3.setAttribute('type', 'checkbox');
        checkbox3.addEventListener('click', updateTableType)

        // Span 'Moderna Azul'
        const checkboxLabel3 = col.appendChild(elementGenerator('span', '', '', '&nbsp;&nbsp;Moderna Azul'));

        col = row.appendChild(elementGenerator('div', 'cria-tabela-btn-div', 'col-md-3'));

        // Button 'Criar tabela'
        let criarTabela = col.appendChild(elementGenerator('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Criar tabela'));
        criarTabela.addEventListener('click', writeTable);

        col = row.appendChild(elementGenerator('div', '', 'col-md-1')); //  Filler Col

        // ########## SEPARADOR HORIZONTAL ##########

        //wrapper novo separador
        const novoSeparadorWrapper = row.appendChild(elementGenerator('div', '', 'col-md-12 novo-separador'));
        novoSeparadorWrapper.appendChild(elementGenerator('span', '', '', '<i class="lni lni-hammer"></i> Separador horizontal<br>'));

        // Button para adicionar separador horizontal (hr)
        const novaQuebraBtn = novoSeparadorWrapper.appendChild(elementGenerator('button', 'nova-quebra-btn', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir separador horizontal'));
        novaQuebraBtn.addEventListener('click', writeHR);
    }

    // Função para prever a lista selecionada
    function listPreview() {

        const valorTipoLista = document.querySelector('#tipo-lista-dropdown').value;
        let previewWrapper = document.querySelector('#preview-list-row');

        switch (valorTipoLista) {
            // Opção 1
            case 'ul':
                previewWrapper.innerHTML = '';
                novaListaPreview = previewWrapper.appendChild(elementGenerator('ul', 'preview-list'));
                novaListaPreview.style.listStylePosition = "inside";
                for (i = 1; i <= 3; i++) {
                    novoItemPreview = novaListaPreview.appendChild(elementGenerator('li', '', 'preview-item', `<b>Item ${i}:</b> Lorem Ipsum`));
                }
                break

            // Opção 2
            case 'ol-1':
                previewWrapper.innerHTML = '';
                novaListaPreview = previewWrapper.appendChild(elementGenerator('ol', 'preview-list'));
                novaListaPreview.setAttribute('type', '1')
                novaListaPreview.style.listStylePosition = "inside";
                for (i = 1; i <= 3; i++) {
                    novoItemPreview = novaListaPreview.appendChild(elementGenerator('li', '', 'preview-item', `<b>Item ${i}:</b> Lorem Ipsum`));
                }
                break

            // Opção 3
            case 'ol-a':
                previewWrapper.innerHTML = '';
                novaListaPreview = previewWrapper.appendChild(elementGenerator('ol', 'preview-list'));
                novaListaPreview.setAttribute('type', 'a');
                novaListaPreview.style.listStylePosition = "inside";
                for (i = 1; i <= 3; i++) {
                    novoItemPreview = novaListaPreview.appendChild(elementGenerator('li', '', 'preview-item', `<b>Item ${i}:</b> Lorem Ipsum`));
                }
                break
        }
    }

    // Função para adicionar uma lista ao código do tópico
    function writeList() {

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

            // Opção 1
            case 'ul':
                novaLista = elementGenerator('ul');
                novaLista.style.listStylePosition = 'inside';
                for (i = 1; i <= n; i++) {
                    if (wantLinks) { novaLista.appendChild(elementGenerator('li', '', '', `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                        novaLista.appendChild(elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                }
                // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
                novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                escreveNaTextarea(novaLista);
                break;

            // Opção 2
            case 'ol-1':
                novaLista = elementGenerator('ol');
                novaLista.setAttribute('type', '1');
                novaLista.style.listStylePosition = "inside";
                for (i = 1; i <= n; i++) {
                    if (wantLinks) { novaLista.appendChild(elementGenerator('li', '', '', `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                        novaLista.appendChild(elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                }
                // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
                novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                escreveNaTextarea(novaLista);
                break;

            // Opção 3
            case 'ol-a':
                novaLista = elementGenerator('ol');
                novaLista.setAttribute('type', 'a');
                novaLista.style.listStylePosition = 'inside';
                for (i = 1; i <= n; i++) {
                    if (wantLinks) { novaLista.appendChild(elementGenerator('li', '', '', `<a href="#" class="manuais" target="_blank">Item ${i} da lista com links</a>`)) } else
                        novaLista.appendChild(elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                }
                // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
                novaLista = (novaLista.outerHTML.toString().replaceAll('<li>', "\n" + '<li>'));
                escreveNaTextarea(novaLista);
                break;
        }
    }

    // Função para adicionar uma tabela ao tópico de manual
    function writeTable() {

        // Obter os parâmetros para a ligação
        const numLinhas = document.querySelector('#num-linhas-input').value;
        const numColunas = document.querySelector('#num-colunas-input').value;
        // const cabecalho = document.querySelector('#cabecalho-checkbox').checked;

        // Babyproof
        if ((isNaN(numLinhas)) === true
            || numLinhas <= 0) { alert('O valor para o número de linhas não é válido (só aceito números positivos, acima de zero).'); return }
        if ((isNaN(numColunas)) === true
            || numColunas <= 0) { alert('O valor para o número de colunas não é válido (só aceito números positivos, acima de zero).'); return }

        let novaTabela;

        // <table>
        switch (tableType) {
            case 'normal-table': novaTabela = elementGenerator('table', '', 'phcgo-old-table'); break
            case 'modern-table': novaTabela = elementGenerator('table', '', 'phcgo-new-table'); break
            case 'modern-table-blue': novaTabela = elementGenerator('table', '', 'phcgo-new-table-blue'); break
        }

        novaTabela.style.display = 'flex';
        novaTabela.style.justifyContent = 'center';

        // <tbody>
        const tBody = novaTabela.appendChild(elementGenerator('tbody'));

        const novoCabecalho = elementGenerator('tr');
        for (i = 1; i <= numColunas; i++) {
            let novaColuna = novoCabecalho.appendChild(elementGenerator('td', '', '', `Cabeçalho ${i}`));
        }
        tBody.appendChild(novoCabecalho);
        // }

        // adiciona as restantes linhas á tabela
        for (iLinhas = 1; iLinhas <= numLinhas; iLinhas++) {
            const novaLinha = elementGenerator('tr');
            for (iColunas = 1; iColunas <= numColunas; iColunas++) {
                let novaColuna = novaLinha.appendChild(elementGenerator('td', '', '', `Linha ${iLinhas} Coluna ${iColunas}`));
            }
            tBody.appendChild(novaLinha);
        }

        // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
        novaTabela = (novaTabela.outerHTML.toString().replaceAll('<tr>', "\n" + '<tr>'));
        novaTabela = (novaTabela.toString().replaceAll('</td><td>', '</td>' + "\n" + '<td>'));
        novaTabela.replaceAll('</tbody>', "\n" + '</tbody>');

        // Anexar o <style> necessário, de acordo com a tabela selecionada
        switch (tableType) {
            case 'normal-table':
                novaTabela.classList = 'phcgo-old-table';
                novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + normalTableStyle + "\n" + novaTabela); break
            case 'modern-table':
                novaTabela.classList = 'phcgo-new-table';
                novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + modernTableStyle + "\n" + novaTabela); break
            case 'modern-table-blue':
                novaTabela.classList = 'phcgo-new-table-blue';
                novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + modernTableStyleBlue + "\n" + novaTabela); break
        }
        escreveNaTextarea(novaTabela);
    }

    // Função para converter tabelas
    function convertTable() {

        // publicar a tabela recebida
        let nome;

        switch (tableType) {
            case 'normal-table': nome = 'Normal'; break
            case 'modern-table': nome = 'Moderna'; break
            case 'modern-table-blue': nome = 'Moderna Azul'; break
        }

        let tablecode = prompt(`Introduz o código da tua tabela.\n\nEsta será convertida no estilo atualmente selecionado ( ${nome} )`);
        if (tablecode === null) { return }

        // temporario
        escreveNaTextarea(elementGenerator('div', 'tempTable', '', tablecode).outerHTML);

        let novaTabela;
        switch (tableType) {
            case 'normal-table': novaTabela = elementGenerator('table', '', 'phcgo-old-table'); break
            case 'modern-table': novaTabela = elementGenerator('table', '', 'phcgo-new-table'); break
            case 'modern-table-blue': novaTabela = elementGenerator('table', '', 'phcgo-new-table-blue'); break
        }
        novaTabela.style.display = 'flex';
        novaTabela.style.justifyContent = 'center';

        novaTabela.innerHTML = (convertTableEngine()).outerHTML;

        // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
        novaTabela = (novaTabela.outerHTML.toString().replaceAll('<tr>', "\n" + '<tr>'));
        novaTabela = (novaTabela.toString().replaceAll('</td><td>', '</td>' + "\n" + '<td>'));
        novaTabela.replaceAll('</tbody>', "\n" + '</tbody>');

        // Anexar o <style> necessário, de acordo com a tabela selecionada
        switch (tableType) {
            case 'normal-table':
                novaTabela.classList = 'phcgo-old-table';
                novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + normalTableStyle + "\n" + novaTabela); break
            case 'modern-table':
                novaTabela.classList = 'phcgo-new-table';
                novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + modernTableStyle + "\n" + novaTabela); break
            case 'modern-table-blue':
                novaTabela.classList = 'phcgo-new-table-blue';
                novaTabela = ('<!-- Estilos necessários para a tabela -->' + "\n" + modernTableStyleBlue + "\n" + novaTabela); break
        }
        escreveNaTextarea(novaTabela);
    }

    // Função que pega na tabela temporária, envia os conteúdos para array, e devolve uma nova tabela, sem estilos nem classes
    function convertTableEngine() {

        const itemsParaConverter = [];
        const numLinhas = document.querySelectorAll('#tempTable tr').length

        itemsParaConverter.push(document.querySelectorAll(`#tempTable th`));

        for (i = 1; i < numLinhas; i++) {
            itemsParaConverter.push(document.querySelectorAll(`#tempTable tr:nth-child(${i}) td`))
        }
        const tabelaConvertida = elementGenerator('table')
        for (i = 0; i < numLinhas; i++) {
            tabelaConvertida.appendChild(elementGenerator('tr'));

            for (x = 0; x < itemsParaConverter[i].length; x++) {
                tabelaConvertida.lastChild.appendChild(elementGenerator('td', '', '', itemsParaConverter[i][x].innerText))
                let colspan = itemsParaConverter[i][x].attributes.colspan;
                try { tabelaConvertida.lastChild.lastChild.setAttribute('colspan', colspan.value) }
                catch { }
                let rowspan = itemsParaConverter[i][x].attributes.rowspan;
                try { tabelaConvertida.lastChild.lastChild.setAttribute('rowspan', rowspan.value) }
                catch { }
            }
        }
        return tabelaConvertida
    }

    // Função para adicionar um seprador horizontal <hr> código do tópico
    function writeHR() {
        let novoSeparador = elementGenerator('hr');
        novoSeparador.style.borderTop = '3px solid #eee';
        novoSeparador = novoSeparador.outerHTML
        escreveNaTextarea(novoSeparador);
    }


    // ############ APPCONTROLS TITLES & LINKS ############

    // Função para mostrar a modal de Títulos e Ligações
    function appControlsTitulosELigacoes() {

        // Limpa o appControls + inicia paginador
        let pag = appControlsChange();

        // Anexar ao appControls o wrapper principal
        let appControlsLinksAndTitles = appControls.appendChild(elementGenerator('div', '', `row page-${pag}`));

        // Anexar ao wrapper principal, o Wrapper da secção da esquerda
        const novoVariosWrapperLeft = appControlsLinksAndTitles.appendChild(elementGenerator('div', 'left-wrapper', 'col-md-8'));

        // Anexar ao wrapper principal, o Wrapper da secção da direita
        const geradorTitulosWrapper = novoVariosWrapperLeft.appendChild(elementGenerator('div', 'gerador-titulos', 'row', '<i class="lni lni-hammer"></i>&nbsp;&nbsp;Gerador de títulos'));

        // Row 1
        row = geradorTitulosWrapper.appendChild(elementGenerator('div', '', 'row'));
        let col = row.appendChild(elementGenerator('div', '', 'col-md-1')); // Filler col

        // Col 1
        col = row.appendChild(elementGenerator('div', '', 'col-md-11'));

        // Span Tipo Lista
        let tipoListaSpan = col.appendChild(elementGenerator('span', 'tipo-lista-span', '', 'Tipo de título'));

        // Row 2 
        row = geradorTitulosWrapper.appendChild(elementGenerator('div', '', 'row'));
        col = row.appendChild(elementGenerator('div', '', 'col-md-1')); // Filler col

        // Col 1
        col = row.appendChild(elementGenerator('div', '', 'col-md-7'));

        // Dropdown para "Tipo de título"
        let tipoTituloDropdown = col.appendChild(elementGenerator('select', 'tipo-titulo-dropdown'));
        tipoTituloDropdown.addEventListener('change', previewTitle)

        // Opção 1    
        tipoTituloDropdown.appendChild(elementGenerator('option', '', '', '&nbsp;Título H1'));
        tipoTituloDropdown.lastChild.value = 'default1' // Valor a se passado para a função construtora de lista
        // Opção 2
        tipoTituloDropdown.appendChild(elementGenerator('option', '', '', '&nbsp;Título H2'));
        tipoTituloDropdown.lastChild.value = 'default2'
        // Opção 3
        tipoTituloDropdown.appendChild(elementGenerator('option', '', '', '&nbsp;Título H3'));
        tipoTituloDropdown.lastChild.value = 'default3'
        // Opção 4
        tipoTituloDropdown.appendChild(elementGenerator('option', '', '', '&nbsp;Título H1 - 2'));
        tipoTituloDropdown.lastChild.value = 'old1' // Valor a se passado para a função construtora de lista
        // Opção 5
        tipoTituloDropdown.appendChild(elementGenerator('option', '', '', '&nbsp;Título H2 - 2'));
        tipoTituloDropdown.lastChild.value = 'old2'
        // Opção 6
        tipoTituloDropdown.appendChild(elementGenerator('option', '', '', '&nbsp;Título H3 - 2'));
        tipoTituloDropdown.lastChild.value = 'old3'

        col = row.appendChild(elementGenerator('div', '', 'col-md-1'));   //Filler col

        // Col Button criar título
        row.appendChild(elementGenerator('div', 'cria-lista-btn-div', 'col-md-2'));

        // Button "Criar título"
        let criarTituloButton = col.appendChild(elementGenerator('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Criar título'));
        criarTituloButton.addEventListener('click', writeTitle)

        col = row.appendChild(elementGenerator('div', '', 'col-md-1'));   //Filler col
        row = geradorTitulosWrapper.appendChild(elementGenerator('div', '', 'row'));

        // Col 1 (pre-view do título)
        col = row.appendChild(elementGenerator('div', 'preview-heading-row', 'col-md-12'));
        row.lastChild.appendChild(elementGenerator('h1', '', 'manuais', 'Título/Heading 1'))
        row = novoVariosWrapperLeft.appendChild(elementGenerator('div', '', 'row title-link-filler'));         // Filler Row

        

        // Wrapper da secção das ligações
        const novaLigacaoWrapper = novoVariosWrapperLeft.appendChild(elementGenerator('div', '', 'row gerador-links-wrapper'));

        // Col 0
        col = novaLigacaoWrapper.appendChild(elementGenerator('div', '', 'col-md-12', '<i class="lni lni-hammer"></i>&nbsp;&nbsp;Gerador de links'));

        // Col 1
        col = novaLigacaoWrapper.appendChild(elementGenerator('div', '', 'col-md-3 text-left'));

        // Span 'Descrição da ligação'
        const spanDescricao = col.appendChild(elementGenerator('span', 'nome-span', '', 'Descrição da ligação:'));

        // Col 2
        col = novaLigacaoWrapper.appendChild(elementGenerator('div', '', 'col-md-6'));

        // Input 'Descrição da ligação'
        const inputDescricao = col.appendChild(elementGenerator('input', 'nome-input'));

        // Col 3
        col = novaLigacaoWrapper.appendChild(elementGenerator('div', '', 'col-md-2 nova-ligacao-btn-col'));

        // Button Criar ligação
        const criarLigacao = col.appendChild(elementGenerator('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Criar ligação'));
        criarLigacao.addEventListener('click', writeLink);

        // Col 4
        col = novaLigacaoWrapper.appendChild(elementGenerator('div', '', 'col-md-3 text-left'));

        // Span 'URL'
        const spanURL = col.appendChild(elementGenerator('span', 'link-span', '', 'URL da ligação:'));

        // Col 5
        col = novaLigacaoWrapper.appendChild(elementGenerator('div', '', 'col-md-6'));

        // Input 'URL'
        const inputURL = col.appendChild(elementGenerator('input', 'link-input'));

        // Wrapper da secção dos extras
        const novoVariosWrapperRight = appControlsLinksAndTitles.appendChild(elementGenerator('div', 'extras-wrapper', 'col-md-4'));

        // Row 0
        row = novoVariosWrapperRight.appendChild(elementGenerator('div', 'header-outros', 'row', '<i class="lni lni-code"></i> Código Hilite.me'));

        // Row 1
        row = novoVariosWrapperRight.appendChild(elementGenerator('div', '', 'row'));

        // Wrapper Hilite.me
        const hiliteWrapper = row.appendChild(elementGenerator('div', '', 'col-md-12'));

        // Button para formatar hilite.me
        const hiliteTextarea = hiliteWrapper.appendChild(elementGenerator('textarea', 'hilite-textarea'));

        const novaHiliteCheckboxesRow = hiliteWrapper.appendChild(elementGenerator('div', 'hilite-checkboxes-row', 'row'));

        codeType = 'vbnet' //reset ao trocar de página

        let miniWrapper1 = novaHiliteCheckboxesRow.appendChild(elementGenerator('div', '', 'col-md-4'))
        miniWrapper1.appendChild(elementGenerator('input', 'vbnet'));
        miniWrapper1.lastChild.type = 'checkbox'
        miniWrapper1.lastChild.setAttribute('checked', 'true');
        miniWrapper1.addEventListener('change', updatecodeType)
        miniWrapper1.appendChild(elementGenerator('span', '', '', '&nbsp;&nbsp;VB.NET'));

        let miniWrapper2 = novaHiliteCheckboxesRow.appendChild(elementGenerator('div', '', 'col-md-4'))
        miniWrapper2.appendChild(elementGenerator('input', 'ts'));
        miniWrapper2.lastChild.type = 'checkbox'
        miniWrapper2.addEventListener('change', updatecodeType)
        miniWrapper2.appendChild(elementGenerator('span', '', '', '&nbsp;&nbsp;TypeScript'));

        let miniWrapper3 = novaHiliteCheckboxesRow.appendChild(elementGenerator('div', '', 'col-md-4'))
        miniWrapper3.appendChild(elementGenerator('input', 'json'));
        miniWrapper3.lastChild.type = 'checkbox'
        miniWrapper3.addEventListener('change', updatecodeType)
        miniWrapper3.appendChild(elementGenerator('span', '', '', '&nbsp;&nbsp;JSON'));

        const novaHiliteBtn = hiliteWrapper.appendChild(elementGenerator('button', 'novo-hilitecode-btn', 'btn btn-warning', '<i class="lni lni-code"></i>&nbsp;&nbsp;Gerar código hilite.me'));
        novaHiliteBtn.addEventListener('click', hiliteAPI);
    }

    // Função para mostrar uma preview do título selecionado na secção dos títulos
    function previewTitle() {

        let dropdownTitulos = document.querySelector('#tipo-titulo-dropdown');
        let titulosPreview = document.querySelector('#preview-heading-row');
        titulosPreview.innerHTML = '';
        switch (dropdownTitulos.value) {

            // Opção 1
            case 'default1':
                titulosPreview.appendChild(elementGenerator('h1', '', 'manuais', 'Título/Heading 1'))
                break;
            case 'default2':
                titulosPreview.appendChild(elementGenerator('h2', '', 'manuais', 'Título/Heading 2'))
                break;
            case 'default3':
                titulosPreview.appendChild(elementGenerator('h3', '', 'manuais', 'Título/Heading 3'))
                break;
            case 'old1':
                titulosPreview.appendChild(elementGenerator('h1', '', '', 'Título/Heading 1'));
                break;
            case 'old2':
                titulosPreview.appendChild(elementGenerator('h2', '', '', 'Título/Heading 2'))
                break;
            case 'old3':
                titulosPreview.appendChild(elementGenerator('h3', '', '', 'Título/Heading 3'))
                break;
        }
    }

    // Função para adicionar o título ao tópico de manual
    function writeTitle() {
        let dropdownTitulos = document.querySelector('#tipo-titulo-dropdown');
        switch (dropdownTitulos.value) {

            // Opção 1
            case 'default1':
                escreveNaTextarea(elementGenerator('h1', '', 'manuais', 'Título/Heading 1').outerHTML)
                break;
            case 'default2':
                escreveNaTextarea(elementGenerator('h2', '', 'manuais', 'Título/Heading 2').outerHTML)
                break;
            case 'default3':
                escreveNaTextarea(elementGenerator('h3', '', 'manuais', 'Título/Heading 3').outerHTML)
                break;
            case 'old1':
                escreveNaTextarea(elementGenerator('h1', '', '', 'Título/Heading 1').outerHTML)
                break;
            case 'old2':
                escreveNaTextarea(elementGenerator('h2', '', '', 'Título/Heading 2').outerHTML)
                break;
            case 'old3':
                escreveNaTextarea(elementGenerator('h3', '', '', 'Título/Heading 3').outerHTML)
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
        let novaLigacao = elementGenerator('a', '', 'manuais', nome);
        novaLigacao.setAttribute('href', link);
        novaLigacao.setAttribute('target', '_blank');
        novaLigacao = novaLigacao.outerHTML
        escreveNaTextarea(novaLigacao);
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

        //babyproof - reset à activetextarea
        activeTextarea = '';

        if (colaphcPreview.classList.contains('no-display') === true) {
            botaoVistaColap.classList.replace('btn-light', 'btn-info');
            colaphcPreview.classList.remove('no-display');
            helpcenterPreviewWrapper.classList.add('no-display');
            appControlsColap();
        } else {
            botaoVistaColap.classList.replace('btn-info', 'btn-light');        // a ordem invertida do getcollaps é importante, não sei porque nao me lembra
            appControlsColap();
            colaphcPreview.classList.add('no-display');
            helpcenterPreviewWrapper.classList.remove('no-display');
        }
    }

    // Função para mostrar a appControls dos colapsáveis
    function appControlsColap() {

        // Array com todos os colapsáveis do tópico
        colapList = document.querySelectorAll('.row .seccao-phcgo');

        // Limpa a appControls
        colaphcPreview.innerHTML = '';

        // Wrapper (row)
        let colapWrapper = colaphcPreview.appendChild(elementGenerator('div', '', `page-1`));

        if (colapList.length !== 0) {
            // Loop para cada item do Array
            for (i = 1; i <= colapList.length; i++) {

                // Row 1
                let row = colapWrapper.appendChild(elementGenerator('div', '', 'row'));
                (i % 2 === 0) ? row.classList.add('par') : row.classList.add('impar');
                let wrapperLeft = row.appendChild(elementGenerator('div', `inputs-${i}`, 'col-md-5 inputs-wrapper'));
                let wrapperRight = row.appendChild(elementGenerator('div', '', 'col-md-7'));

                // Col 1 (inputs)

                // Input 1
                wrapperLeft.appendChild(elementGenerator('span', '', 'colap-id', 'ID do colapsável (minúsculas, sem acentuação, sem espaçamento)'));
                let idInput = wrapperLeft.appendChild(elementGenerator('input', '', `colap-input-id-${i}`));
                idInput.value = colapList[i - 1].nextElementSibling.id;
                idInput.addEventListener('keyup', updateColapPreviewByID)

                // Input 2
                wrapperLeft.appendChild(elementGenerator('span', '', 'colap-h2', 'Título do colapsável'));
                let h2Input = wrapperLeft.appendChild(elementGenerator('input', '', `colap-input-h2-${i}`));
                let h2Trim = colapList[i - 1].innerText.trim().split('	');     // trim para ficar direitinho
                h2Input.value = h2Trim[0];
                h2Input.addEventListener('keyup', updateColapHeading)

                //hotfix, estava a aparecer no input dos novos manuais.;
                while (h2Input.value.includes('Abrir/Fechar'))
                    h2Input.value = h2Input.value.replace('Abrir/Fechar', '');

                // Input 3
                wrapperLeft.appendChild(elementGenerator('span', '', 'colap-body', 'Corpo do colapsável'));
                let bodyInput = wrapperLeft.appendChild(elementGenerator('textarea', '', `colap-input-body-${i}`));
                bodyInput.addEventListener('keyup', colapTextAreaEventsSlim)
                bodyInput.addEventListener('click', colapTextAreaEvents)

                let bodyTempInput = colapList[i - 1].nextElementSibling.innerHTML;
                // Remove o cursor laranja ao passar para os collaps
                bodyInput.value = String(bodyTempInput).replace('<span id="pulse">|</span>', '');

                // Guardar alterações Button
                let updateCollaps = wrapperLeft.appendChild(elementGenerator('button', `colap-save-btn-${i}`, 'btn btn-success no-display', `<i class="lni lni-save"></i> Guardar alterações`));
                updateCollaps.addEventListener('click', gerarColapsaveis)

                // filler div para padding
                wrapperLeft.appendChild(elementGenerator('div', '', 'save-padding'));

                // Col 2 (display)
                wrapperRight.appendChild(elementGenerator('div', '', `colap-display-h2-${i}`));
                wrapperRight.lastChild.innerText = h2Trim[0];

                //hotfix, estava a aparecer "Abrir/Fechar" várias vezes nos preview
                while (wrapperRight.lastChild.innerText.includes('Abrir/Fechar')) {
                    wrapperRight.lastChild.innerText = wrapperRight.lastChild.innerText.replace('Abrir/Fechar', '');
                }

                wrapperRight.appendChild(elementGenerator('div', '', `colap-display-body-${i}`, colapList[i - 1].nextElementSibling.innerHTML));
            }

            // adicionar novo collap
            row = colapWrapper.appendChild(elementGenerator('div', '', 'row'));

            col = row.appendChild(elementGenerator('div', 'add-new-collap'));
            const newCollapBtn = col.appendChild(elementGenerator('button', '', "btn btn-info", '<i class="lni lni-circle-plus"></i>&nbsp;&nbsp;Adicionar um novo colapsável'));
            newCollapBtn.addEventListener('click', novoColapsavel)
            const scrollToTop = col.appendChild(elementGenerator('button', '', "btn btn-info", '<i class="lni lni-arrow-up-circle"></i>&nbsp;&nbsp;Voltar ao início'));
            scrollToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); })

        } else {
            let geradorColapWrapper = colaphcPreview.appendChild(elementGenerator('div', 'gerador-colaps-wrapper', 'row'));

            let col = geradorColapWrapper.appendChild(elementGenerator('div', '', 'col-md-12 gerador-colaps-1', 'Não foi encontrado nenhum colapsável.'));

            geradornewCollapBtn = geradorColapWrapper.appendChild(elementGenerator('button', '', "btn btn-info", '<i class="lni lni-circle-plus"></i>&nbsp;&nbsp;Adicionar um novo colapsável'));
            geradornewCollapBtn.addEventListener('click', novoColapsavel)

            col.appendChild(elementGenerator('div'));
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
        activeTextarea = e.target;

        let inputText = activeTextarea.value;
        let cursorappControlsPos = getCursorPos(e);

        // divide o input em duas partes (até ao cursor, e após o curos)
        let inputColapTextStrings = [];
        inputColapTextStrings.push([inputText.slice(0, cursorappControlsPos)]);
        inputColapTextStrings.push([inputText.slice(cursorappControlsPos)]);

        // introduz o cursor laranja
        let inputColapTextWithCursor = `${inputColapTextStrings[0]}<span id="pulse">|</span>${inputColapTextStrings[1]}`;

        stringCursorColap[0] = inputColapTextStrings[0];
        stringCursorColap[1] = inputColapTextStrings[1];

        // Preview do input
        let inputPreview = e.target.parentElement.nextElementSibling.children[0];
        inputPreview.innerHTML = inputColapTextWithCursor;

        // Mostra o save button
        const saveButton = e.target.nextElementSibling.nextElementSibling.nextElementSibling
        saveButton.classList.remove('no-display');
    }

    // função para atualizar o preview do body
    function colapTextAreaEventsSlim(e) {
        // Atualiza a active textarea
        activeTextarea = e.target;

        let inputText = activeTextarea.value;
        let cursorappControlsPos = getCursorPos(e);

        // divide o input em duas partes (até ao cursor, e após o curos)
        let inputColapTextStrings = [];
        inputColapTextStrings.push([inputText.slice(0, cursorappControlsPos)]);
        inputColapTextStrings.push([inputText.slice(cursorappControlsPos)]);

        // introduz o cursor laranja
        let inputColapTextWithCursor = `${inputColapTextStrings[0]}<span id="pulse">|</span>${inputColapTextStrings[1]}`;

        stringCursorColap[0] = inputColapTextStrings[0];
        stringCursorColap[1] = inputColapTextStrings[1];

        // Preview do input
        let inputPreview = e.target.parentElement.nextElementSibling.children[1];
        inputPreview.innerHTML = inputColapTextWithCursor;

        // Mostra o save button
        const saveButton = e.target.nextElementSibling
        saveButton.classList.remove('no-display');
    }

    // função para atualizar o preview do body
    function colapTextAreaEvents(e) {
        // Atualiza a active textarea
        activeTextarea = e.target;

        let inputText = activeTextarea.value;
        let cursorappControlsPos = getCursorPos(e);
        let inputColapTextStrings1;
        let inputColapTextStrings2;

        // babyproof para quando colocamos o cursor numa tag, ele se mostrado for da tag (para não partir o prewview)
        novoColapsCursorPos = cursorappControlsPos;
        if (inputText[cursorappControlsPos] === '>') {
            inputColapTextStrings = inputText.slice(0, cursorappControlsPos + 2)
            inputColapTextStrings = inputText.slice(cursorappControlsPos + 2, inputText.length)
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

                stringCursorColap[0] = inputColapTextStrings1;
                stringCursorColap[1] = inputColapTextStrings2;

                // Preview do input
                let inputPreview = e.target.parentElement.nextElementSibling.children[1];
                inputPreview.innerHTML = inputColapTextWithCursor;

                // Mostra o save button
                const saveButton = e.target.nextElementSibling
                saveButton.classList.remove('no-display');
            })();
        }
    }

    function gerarColapsaveis(e) {
        const colapList = document.querySelectorAll('.row .seccao-phcgo');
        let newCollapFinal = '';
        let newCollapseArray = [[], [], []];

        for (i = 1; i <= colapList.length; i++) {

            newCollapseArray[0][i - 1] = document.querySelector(`.colap-input-id-${i}`).value;
            newCollapseArray[1][i - 1] = document.querySelector(`.colap-input-h2-${i}`).value;
            newCollapseArray[2][i - 1] = document.querySelector(`.colap-input-body-${i}`).value;

            // wrapper do collapsavel
            let newCollap = elementGenerator('div', '', 'row seccao-phcgo');

            // título
            let newCollapColTitulo = newCollap.appendChild(elementGenerator('div', '', 'col-xs-8'));

            //link do h2
            let h2Link = newCollapColTitulo.appendChild(elementGenerator('a'));
            h2Link.setAttribute('href', `#${newCollapseArray[0][i - 1]}`)
            h2Link.setAttribute('data-toggle', 'collapse');

            //h2
            let newtituloH2 = h2Link.appendChild(elementGenerator('h2', '', 'manuais', newCollapseArray[1][i - 1]))

            //abrir/fechar
            let newCollapCol1 = newCollap.appendChild(elementGenerator('div', '', 'col-xs-4 text-right'))

            //link do abrir/fechar
            let link = newCollapCol1.appendChild(elementGenerator('a', '', '', 'Abrir/Fechar'));
            link.setAttribute('href', `#${newCollapseArray[0][i - 1]}`)
            link.setAttribute('data-toggle', "collapse")
            link.style.display = 'block'

            // wrapper do conteudo
            let newCollapConteudo = elementGenerator('div', newCollapseArray[0][i - 1], 'collapse multi-collapse', newCollapseArray[2][i - 1]);
            newCollapFinal = newCollapFinal + `<!-- Início do Colapsável #${i} -->` + "\n" + (newCollap.outerHTML.toString() + "\n\n" + newCollapConteudo.outerHTML.toString() + "\n" + `<!-- Fim do Colapsável #${i} -->` + "\n")
        }

        // função para obter o texto antes do primeiro collap
        function topicoAntesColapsaveis() {
            let charCountAntes = textarea.value.search('<!-- Início do Colapsável #1 -->');
            if (charCountAntes < 0) { charCountAntes = textarea.value.search('<div class="row seccao-phcgo">') }
            const textoAntesCollaps = textarea.value.slice(0, charCountAntes);
            return textoAntesCollaps
        }

        newCollapFinal = topicoAntesColapsaveis() + newCollapFinal;
        textarea.value = newCollapFinal;
        hcPreview.innerHTML = fixArtigosRelacionadosLogo(newCollapFinal);

        //obtem a nossa localização vertical ao gravar
        const whereWasI = document.querySelector('#' + e.target.parentElement.id).parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect().bottom
        const totalHeight = document.querySelector('#' + e.target.parentElement.id).parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect().height

        appControlsColap();
        autosave2JSON();

        // volta-nos a posicionar onde estávamos aquando da gravação (é necessário, porque o ecrã é re-escrito ao gravar)
        window.scrollTo(0, totalHeight - whereWasI);
    }

    function singleColapsavel() {
        // wrapper do collapsavel
        let newCollap = elementGenerator('div');
        newCollap.classList = 'row seccao-phcgo';

        // título
        let newCollapColTitulo = newCollap.appendChild(elementGenerator('div'))
        newCollapColTitulo.classList = 'col-xs-8'

        //link do h2
        let h2Link = newCollapColTitulo.appendChild(elementGenerator('a'));
        h2Link.setAttribute('href', `#novo-colapsavel`)
        h2Link.setAttribute('data-toggle', 'collapse');

        //h2
        let newtituloH2 = h2Link.appendChild(elementGenerator('h2'))
        newtituloH2.classList = 'manuais'
        newtituloH2.innerText = 'Novo colapsável'

        //abrir/fechar
        let newCollapCol1 = newCollap.appendChild(elementGenerator('div'))
        newCollapCol1.classList = 'col-xs-4 text-right'

        //link do abrir/fechar
        let link = newCollapCol1.appendChild(elementGenerator('a'));
        link.setAttribute('href', `#novo-colapsavel`)
        link.setAttribute('data-toggle', "collapse")
        link.innerText = 'Abrir/Fechar'

        // wrapper do conteudo
        let newCollapConteudo = elementGenerator('div');
        newCollapConteudo.classList = 'collapse multi-collapse'
        newCollapConteudo.id = 'novo-colapsavel'
        newCollapConteudo.innerHTML = 'Conteúdo do novo colapsável aqui!'

        newCollapFinal = newCollap.outerHTML + newCollapConteudo.outerHTML
        return newCollapFinal
    }

    function novoColapsavel() {
        if (colapList.length === 0) {
            const abrirTodosDiv = '<br><a id="colapse-all-a" style="display: block;text-align: right;" data-toggle="collapse" data-target=".multi-collapse" href="#" role="button" aria-expanded="false"">Abrir Todos</a></p></div>'
            textarea.value = textarea.value + "\n" + abrirTodosDiv + "\n" + '<!-- Início do Colapsável #1 -->' + "\n" + (singleColapsavel().toString() + "\n" + '<!-- Fim do Colapsável #1 -->');
            textarea.value = textarea.value.replaceAll('<div class="collapse', "\n" + "\n" + '<div class="collapse')
            hcPreview.innerHTML = textarea.value;
            appControlsColap();
        } else {

            // babyproof, não deixa adicionar colapsável sem gravar alterações
            for (i = 1; i <= colapList.length; i++) {
                let saveBtn = document.querySelector(`#colap-save-btn-${i}`);
                if (saveBtn.classList.contains('no-display') == false) {
                    alert(`Não é possível adicionar um novo colapsável, enquanto existirem alterações pendentes.`); return
                }
            }
            textarea.value = textarea.value + "\n" + '<!-- Início do Colapsável #' + (colapList.length + 1) + ' -->' + "\n" + (singleColapsavel().toString() + "\n" + '<!-- Fim do Colapsável #' + (colapList.length + 1) + ' -->');
            textarea.value = textarea.value.replaceAll('><div class="collapse', '>' + "\n" + "\n" + '<div class="collapse ')
            hcPreview.innerHTML = textarea.value;
            appControlsColap();
            window.scrollTo(0, document.body.scrollHeight);
        }
    }

    function writeImage() {
        const code = prompt('Link direto para a imagem (http ou data:image)')
        if (code === null) { return }
        let imagem = `<span style="display:flex;justify-content:center;align-self:center;"><img style="max-width:100%;"\nsrc="${code}"></span>`;
        escreveNaTextarea(imagem);
    }
}
mixWrapper();
