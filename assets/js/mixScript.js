function mixWrapper() {

    // textarea principal
    const textarea = document.querySelector('textarea');

    /** 
     * array a ser utilizado para guardar os slices
     * da textarea, a quando da introdução de elementos
     * ([0] = texto até ao cursor | [1] = texto a partir do cursos)
    */
    let cursorPosInfo = [];

    // Código revisto -^
    // Código por rever -v

    const addTextBoxBtn = document.querySelector('#textbox-btn');
    const addIconBtn = document.querySelector('#logos-btn');
    const addButtonsBtn = document.querySelector('#botoes-btn');

    const modaldiv = document.querySelector('#modal');
    const maindiv = document.querySelector('#main-div');


    const colapBtn = document.querySelector('#colap-btn');
    const colapModal = document.querySelector('#colapsables-modal');
    const hcPreview = document.querySelector('.hc-preview');
    const numeroImagens = 70;
    const numeroTextBoxes = 5;
    const numeroButoes = 12;
    const iconsFromJSON = [];
    const textBoxesFromJSON = [];
    const buttonsFromJSON = [];

    // Código por rever -^
    // Código revisto -v

    // Função para preencher automaticamente a textarea, com a última alteração guardada
    (function JSON2Input() {
        try {
            const getTextareaFromJSON = localStorage.getItem('textarea');
            textarea.value = JSON.parse(getTextareaFromJSON);
        }
        catch { }
    })();

    /**
    * Função para alterar o código do preview para apontar para a imagem local.
    * O código da textarea não é alterado, para manter compatibilidade com o HelpCenter
     */
    function fixArtigosRelacionadosLogo(novoSourceCode) {
        let sourceCodeParaPreview = novoSourceCode.replace('src="../pimages/go/artigo.svg"', 'src="assets/img/artigo.svg"');
        return sourceCodeParaPreview
    }

    // Função para guardar na cache do browser o Source Code do tópico (e respetivas alterações)
    function saveIntoJSON() {
        let textarea2JSON = JSON.stringify(textarea.value);
        localStorage.setItem('textarea', textarea2JSON);
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

    // Código revisto -^
    // Código por rever -v

    textarea.addEventListener('keyup', autoSave);
    textarea.addEventListener('keydown', stopAutoSave);

    function autoSave(e) {
        let autoSaveTimer = updateCursorPos(e);
        return autoSaveTimer
    }

    function stopAutoSave() {
        try {
            clearTimeout(autoSaveTimer);
        } catch { }
    }



    function getCursorPos(e) {                                                  // função para obter a posição do cursor (utilizado para a textarea)
        let eTarget = e.target;
        let cursorPos = eTarget.selectionStart;
        return cursorPos
    }

    function iconTopicRelacionado(fixedText) {                                  // converter o caminho do icon dos tópicos relacionados para ser visível no preview
        let fixedText2 = fixedText.replace('src="../pimages/go/artigo.svg"', 'src="assets/img/artigo.svg"');
        maindiv.innerHTML = fixedText2;
    }

    function updateCursorPos(e) {                               // função para atualizar o preview com o cursor
        let inputText = textarea.value;
        let cursorPos = getCursorPos(e);
        let inputTextString1 = inputText.slice(0, cursorPos);
        let inputTextString2 = inputText.slice(cursorPos);
        let fixedText = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;
        cursorPosInfo[1] = inputTextString1;
        cursorPosInfo[2] = inputTextString2;
        iconTopicRelacionado(fixedText);
        getCollapsables();
        saveIntoJSON();
    }

    function newRow(pag) {                                      // função geradora <div row> primeira página
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        newRow.classList.add(`page-${pag}`);
        return newRow
    }

    function newHiddenRow(pag) {                                // função geradora <div row> páginas seguintes
        const newHiddenRow = document.createElement('div');
        newHiddenRow.classList.add('row');
        newHiddenRow.classList.add('no-display');
        newHiddenRow.classList.add(`page-${pag}`);
        return newHiddenRow
    }

    function newItem(i) {
        const newItem = document.createElement('div');          // Função geradora <div col> para Caixas de texto
        newItem.classList.add('col-md-4');
        newItem.classList.add(`item-${i}`);
        newItem.innerHTML = `${i}`;
        return newItem
    }

    function newMediumItem(i) {                                 // Função geradora <div col> para PHC Buttons
        const newMediumItem = document.createElement('div');
        newMediumItem.classList.add('col-md-3');
        newMediumItem.classList.add(`item-${i}`);
        newMediumItem.innerHTML = `${i}`;
        return newMediumItem
    }

    function newMiniItem(i) {                                   // Função geradora <div col> para Logos e Icons
        const newItem = document.createElement('div');
        newItem.classList.add('col-md-1');
        newItem.classList.add(`mini-item-${i}`);
        newItem.classList.add(`mini-item`);
        newItem.innerHTML = `${i}`;
        return newItem
    }

    function selectIcon(eTarget) {                              // função para adicionar o icon / caixa texto / botão PHC GO ao preview, e à textarea 
        let fixedText = `${cursorPosInfo[1]}${eTarget.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = fixedText;
        let fixedText2 = fixedText.replace('src="../pimages/go/artigo.svg"', 'src="assets/img/artigo.svg"'); // o texto corrigido
        maindiv.innerHTML = fixedText2;
        getCollapsables();
        saveIntoJSON();
    }

    function grabJSONIcons() {

        fetch('assets/js/imagens2.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                appendData(data);
            })
            .catch(function (err) {
                // console.log('error: ' + err);
            });

        function appendData(data) {
            for (let i = 0; i < data.length; i++) {
                iconsFromJSON[i] = document.querySelector(`.col-md-1` + `.mini-item-${i + 1}`);
                iconsFromJSON[i].innerHTML = data[i].code;
            }
        }

    }

    function getIcons() {                                       // função construtora <div> para todos os Icons
        modaldiv.innerHTML = '';
        let pag = 1;
        let row = 1;
        let preRow = 1;
        modaldiv.appendChild(newRow(pag));
        let divPaginador = modaldiv.lastChild;
        divPaginador.appendChild(document.createElement('div'));
        let divPrimeiraRow = divPaginador.lastChild;
        divPrimeiraRow.classList = `row icon-row-${preRow}`;
        divPrimeiraRow.appendChild(document.createElement('div'));
        let divSegundaRow = divPrimeiraRow.lastChild;
        divSegundaRow.classList = `col-md-6 icon-sub-row-${row}`;

        for (i = 1; i <= numeroImagens; i++) {

            if ((i % 24) === 0) {
                divSegundaRow.appendChild(newMiniItem(i));
                row = 1;
                preRow++;
                divPaginador.appendChild(document.createElement('div'));
                divPaginador.lastChild.classList = `row icon-row-${preRow}`;
                divPaginador.lastChild.appendChild(document.createElement('div'));
                divPaginador.lastChild.lastChild.classList = `col-md-6 icon-sub-row-${row}`;
                divPrimeiraRow = divPaginador.lastChild;
                divSegundaRow = divPaginador.lastChild.lastChild;
            } else if ((i % 12) === 0) {
                divSegundaRow.appendChild(newMiniItem(i));
                row++;
                divPrimeiraRow.appendChild(document.createElement('div'));
                divPrimeiraRow.lastChild.classList = `col-md-6 icon-sub-row-${row}`;
                divSegundaRow = divPrimeiraRow.lastChild;
                //  else if ((i % 48) === 0) {
                //     modaldiv.lastChild.lastChild.appendChild(newMiniItem(i));
                //     pag++;
                //     modaldiv.appendChild(newHiddenRow(pag));
            } else {
                divSegundaRow.appendChild(newMiniItem(i));
            }
        }
        // modaldiv.appendChild(newPagiRow());
        // let pagiRow = document.querySelector('.pagi');
        // for (let pagi = 1; pagi <= pag; pagi++) {
        //     pagiRow.appendChild(newPagiItem(pagi));
        // }
        grabJSONIcons();
    }

    function grabJSONTextBoxes() {

        fetch('assets/js/textbox.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                appendData(data);
            })
            .catch(function (err) {
                // console.log('error: ' + err);
            });

        function appendData(data) {
            for (let i = 0; i < data.length; i++) {
                textBoxesFromJSON[i] = document.querySelector(`.col-md-4` + `.item-${i + 1}`);
                textBoxesFromJSON[i].innerHTML = data[i].code;
            }
        }

    }

    function getTextBoxes() {                               // função construtora <div> para todas as textboxes
        modaldiv.innerHTML = '';
        let pag = 1;
        modaldiv.appendChild(newRow(pag));
        for (i = 1; i <= numeroTextBoxes; i++) {
            let modaldivLastrow = modaldiv.lastChild;
            modaldivLastrow.appendChild(newItem(i));
        }
        // modaldiv.appendChild(newPagiRow());
        // let pagiRow = document.querySelector('.pagi');
        // for (let pagi = 1; pagi <= pag; pagi++) {
        //     pagiRow.appendChild(newPagiItem(pagi));
        // }
        grabJSONTextBoxes();
    }

    function grabJSONButtons() {

        fetch('assets/js/buttons.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                appendData(data);
            })
            .catch(function (err) {
                // console.log('error: ' + err);
            });

        function appendData(data) {
            for (let i = 0; i < data.length; i++) {
                buttonsFromJSON[i] = document.querySelector(`.col-md-3` + `.item-${i + 1}`);
                buttonsFromJSON[i].innerHTML = data[i].code;
            }
        }

    }

    function getButtons() {                               // função construtora <div> para todos os PHC GO Buttons
        modaldiv.innerHTML = '';
        let pag = 1;
        modaldiv.appendChild(newRow(pag));
        let rowPagi = modaldiv.lastChild;
        rowPagi.appendChild(newButtonRow());
        let modaldivLastRow = rowPagi.lastChild;
        for (i = 1; i <= numeroButoes; i++) {
            if (i % 4 === 0) {
                modaldivLastRow.appendChild(newMediumItem(i));
                rowPagi.appendChild(newButtonRow());
                modaldivLastRow = rowPagi.lastChild;
            } else {
                modaldivLastRow.appendChild(newMediumItem(i));
            }
        }
        // modaldiv.appendChild(newPagiRow());
        // let pagiRow = document.querySelector('.pagi');
        // for (let pagi = 1; pagi <= pag; pagi++) {
        //     pagiRow.appendChild(newPagiItem(pagi));
        // }
        grabJSONButtons();
    }

    function newButtonRow() {
        const newButtonRow = document.createElement('div');
        newButtonRow.classList.add('row');
        newButtonRow.classList.add('phc-buttons');
        return newButtonRow;
    }

    function newPagiRow() {
        const newPagiRow = document.createElement('div');
        newPagiRow.classList.add('row');
        newPagiRow.classList.add('pagi');
        return newPagiRow
    }

    function newPagiItem(pagi) {
        const newPagiItem = document.createElement('div');
        newPagiItem.classList.add('col');
        newPagiItem.classList.add(`pagi-${pagi}`);
        newPagiItem.innerHTML = `${pagi}`
        return newPagiItem
    }


    // Event Listeners 





    textarea.addEventListener('click', updateCursorPos);

    addIconBtn.addEventListener('click', () => {
        getIcons();

        (function () {
            let eventArray = [];
            for (i = 1; i <= numeroImagens; i++) {
                eventArray[i] = document.querySelector('.col-md-1' + `.mini-item-${i}` + '.mini-item');
                eventArray[i].addEventListener('click', (e) => {
                    eTarget = e.target;
                    eTargetLenght = eTarget.classList.length;
                    eTargetChild = eTarget.children[0];
                    if (eTargetLenght === 2 || eTargetLenght === 0) {
                        selectIcon(eTarget)
                    } else {
                        selectIcon(eTargetChild)
                    }
                });
            }
        })();
    });

    addTextBoxBtn.addEventListener('click', () => {
        getTextBoxes();

        (function () {
            let eventArray = [];
            for (i = 1; i <= numeroTextBoxes; i++) {
                eventArray[i] = document.querySelector('.col-md-4' + `.item-${i}`);
                eventArray[i].addEventListener('click', (e) => {
                    eTarget = e.target;
                    eTargetLenght = eTarget.classList.length;
                    eTargetParent = eTarget.parentElement;
                    eTargetParentLenght = eTargetParent.classList.length;
                    if (eTargetLenght !== 2) {
                        selectIcon(eTargetParent);
                    } else if (eTargetParentLenght !== 2) {
                        selectIcon(eTargetParent.parentElement);
                    } else if (eTarget.classList.contains('col-md-4')) {
                        selectIcon(eTarget.children[1]);

                    } else {
                        selectIcon(eTarget);
                    }
                });
            }
        })();
    });

    addButtonsBtn.addEventListener('click', () => {
        getButtons();

        (function () {
            let eventArray = [];
            for (i = 1; i <= numeroButoes; i++) {
                eventArray[i] = document.querySelector('.col-md-3' + `.item-${i}`);
                eventArray[i].addEventListener('click', (e) => {
                    eTarget = e.target;
                    eTargetLenght = eTarget.classList.length;
                    eTargetParent = eTarget.parentElement;
                    eTargetParentLenght = eTargetParent.classList.length;
                    if (eTarget.classList.contains('col-md-3')) {
                        selectIcon(eTarget.firstChild);
                    } else {
                        selectIcon(eTarget);
                    }
                });
            }
        })();
    });

    function toogleColapsablesModal() {
        let colapModalClasses = colapModal.classList;
        if (colapModalClasses.length === 2) {
            colapBtn.classList.replace('btn-light', 'btn-info');
            colapModal.classList.remove('no-display');
            hcPreview.classList.add('no-display');
            getCollapsables();
            oldColapsContent2JSON();
        } else {
            colapBtn.classList.replace('btn-info', 'btn-light');
            oldColapsContent2JSON();
            getCollapsables();
            colapModalClasses = colapModal.classList.add('no-display');
            hcPreview.classList.remove('no-display');
        }
    }

    function oldColapsContent2JSON() {
        let collapsablesArray = document.querySelectorAll('.row .seccao-phcgo');
        let tempArray = [[], [], []];

        for (i = 1; i <= collapsablesArray.length; i++) {
            tempArray[0][i - 1] = document.querySelector(`.colap-input-id-${i}`).value;
            tempArray[1][i - 1] = document.querySelector(`.colap-input-h2-${i}`).value;
            tempArray[2][i - 1] = document.querySelector(`.colap-input-body-${i}`).value;
        }

        let colap2JSON = JSON.stringify(tempArray);
        localStorage.setItem('old-text', colap2JSON);
    };

    function getCollapsables() {
        let collapsablesArray = document.querySelectorAll('.row .seccao-phcgo');
        colapModal.innerHTML = '';
        colapModal.appendChild(newRow(1));
        let colapModalChild = colapModal.firstChild;
        if (colapModal.classList.length === 1) {
            for (i = 1; i <= collapsablesArray.length; i++) {
                colapModalChild.appendChild(newColapRow());
                let colapModalGranChild = colapModalChild.lastChild;
                colapModalGranChild.appendChild(newColapInput(i));
                colapModalGranChild.appendChild(newColapDisplay(i));
                let wrapperLeft = colapModalGranChild.firstChild;
                let wrapperRight = colapModalGranChild.lastChild;
                wrapperLeft.appendChild(newSpan('colap-id', 'ID do colapsável (minúsculas, sem acentuação, sem espaçamento)'));
                wrapperLeft.appendChild(newColapIDInput(i));
                wrapperLeft.lastChild.value = collapsablesArray[i - 1].nextElementSibling.id;
                wrapperLeft.appendChild(newSpan('colap-h2', 'Título do colapsável'));
                wrapperLeft.appendChild(newColapH2Input(i));
                let h2Trim = collapsablesArray[i - 1].innerText.trim().split('	');
                wrapperLeft.lastChild.value = h2Trim[0];
                wrapperLeft.appendChild(newSpan('colap-body', 'Corpo do colapsável'));
                wrapperLeft.appendChild(newColapBodyInput(i));
                let isBlankValid = collapsablesArray[i - 1].nextElementSibling.innerHTML;
                let bodyTemp1 = '';
                if (isBlankValid[0] === '\n') {                                                             //tentativa do fix do body nao estár a dar replace
                    bodyTemp1 = isBlankValid.slice(1, isBlankValid.length);
                } else {
                    bodyTemp1 = collapsablesArray[i - 1].nextElementSibling.innerHTML;
                }
                bodyTemp1 = String(bodyTemp1).replace('<span id="pulse">|</span>', '');
                wrapperLeft.lastChild.value = bodyTemp1;
                wrapperLeft.appendChild(newBtn(saveChanges, 'btn-success', 'Guardar Alterações', `save-btn-${i}`));
                wrapperRight.appendChild(newColapH2Display(i));
                wrapperRight.lastChild.innerText = h2Trim[0];
                wrapperRight.appendChild(newColapBodyDisplay(i));
                wrapperRight.lastChild.innerHTML = collapsablesArray[i - 1].nextElementSibling.innerHTML;
            }
            showSave();
        }
    }

    function newBtn(tipo, cla, texto, id) { // 
        const newBtn = document.createElement('button');
        newBtn.setAttribute('type', 'button');
        newBtn.classList.add(cla);
        newBtn.setAttribute('id', id);
        newBtn.classList.add('btn');
        newBtn.classList.add('no-display');
        newBtn.innerText = texto;
        newBtn.addEventListener('click', tipo);
        return newBtn
    }

    function saveChanges(i) {
        console.log('working on it')
        /**  refazer cacheColaps()
         * Ao gravar, devemos fazer um array com todos os inputs
         * deve ser feito também um array com o material a ser reutilizado, nomeadamente
         * O colapsável zero (tudo até ao primeiro colaps)
         * Depois de função geradora, "criar um novo tópico de manual" (a estrutura escrevo eu via JS, o conteudo vai buscar aos inputs)
         * E ao juntar tudo, enviar para o textarea, e depois, re-escrever o bit do que.
         */
        // oldColapsContent2JSON(); // a guardar na cache
    }

    function cacheColaps() {
        const getColapsFromJSON = localStorage.getItem('old-text');                 // Obter o string do localstorage
        const colapsJSON2Array = JSON.parse(getColapsFromJSON);                  // Converter a string JSON de volta para um array
        let newInputsValues = [''];
        let newDisplayValues = ['']
        let updatedTextArea = '';
        for (i = 1; i <= 1; i++) {
            let getTextareaValue = textarea.value.toString();
            newInputsValues[0] = document.querySelector(`.colap-input-id-${i}`);
            updatedTextArea = getTextareaValue.replace('id="' + colapsJSON2Array[0][i - 1] + '">', 'id="' + newInputsValues[0].value + '">');
            newInputsValues[1] = document.querySelector(`.colap-input-h2-${i}`);
            updatedTextArea = updatedTextArea.replace(colapsJSON2Array[1][i - 1] + '</h2>', newInputsValues[1].value + '</h2>');
            newDisplayValues[1] = document.querySelector(`.colap-display-h2-${i}`);
            newDisplayValues[1].innerText = newInputsValues[1].value;
            newInputsValues[2] = document.querySelector(`.colap-input-body-${i}`);
            console.log(updatedTextArea); console.log(colapsJSON2Array[2][i - 1]); console.log(newInputsValues[2].value);
            updatedTextArea = updatedTextArea.replace(colapsJSON2Array[2][i - 1], newInputsValues[2].value);// tenho de dar fix... há aqui alguma coisa que não tá muito fixe no find
            newDisplayValues[2] = document.querySelector(`.colap-display-body-${i}`);
            newDisplayValues[2].innerHTML = newInputsValues[2].value;
            textarea.value = updatedTextArea;
        }
    }

    function discardChanges() {
        console.log('discard')
    }

    (function saveListeners() {
        let collapsablesArray = document.querySelectorAll('.row .seccao-phcgo');
        for (i = 1; i <= collapsablesArray.length; i++) {
            let listenersArray = [];
            listenersArray[i] = document.querySelector(`#save-btn-${i}`);
            listenersArray[i].addEventListener('click', saveChanges.bind(null, i));
        }
    })();

    function showSave() {
        let collapsablesArray = document.querySelectorAll('.row .seccao-phcgo');
        for (i = 1; i <= collapsablesArray.length; i++) {
            let tempSelected = document.querySelector(`.colap-input-id-${i}`);
            tempSelected.addEventListener('change', displayOptions.bind(null, i));
            let tempSelected2 = document.querySelector(`.colap-input-h2-${i}`);
            tempSelected2.addEventListener('change', displayOptions.bind(null, i));
            let tempSelected3 = document.querySelector(`.colap-input-body-${i}`);
            tempSelected3.addEventListener('change', displayOptions.bind(null, i));
        }
    };

    function displayOptions(i) {
        let arrayOptions1 = document.querySelectorAll('.btn-success');
        arrayOptions1[i - 1].classList.remove('no-display');
    }

    function newColapRow() { // wrapper row
        const newColapRow = document.createElement('div');
        newColapRow.classList.add('row');
        return newColapRow
    }

    function newColapInput() { // wrapper esquerdo
        const newColapInput = document.createElement('div');
        newColapInput.classList.add('col-md-5');
        return newColapInput
    }

    function newColapDisplay() { // wrapper direito
        const newColapDisplay = document.createElement('div');
        newColapDisplay.classList.add('col-md-7');
        return newColapDisplay
    }

    function newColapIDInput(i) { // input para o cliente conseguir editar o ID colap
        const newColapIDInput = document.createElement('input');
        newColapIDInput.classList.add(`colap-input-id-${i}`);
        return newColapIDInput
    }

    function newColapH2Display(i) { // div para mostrar o atual h2 do colap
        const newColapH2Display = document.createElement('div');
        newColapH2Display.classList.add(`colap-display-h2-${i}`);
        return newColapH2Display
    }

    function newColapH2Input(i) {    // input para o cliente conseguir editar o h2 do colap
        const newColapH2Input = document.createElement('input');
        newColapH2Input.classList.add(`colap-input-h2-${i}`);
        return newColapH2Input
    }

    function newColapBodyDisplay(i) { // div para mostrar o atual body do colap
        const newColapBodyDisplay = document.createElement('div');
        newColapBodyDisplay.classList.add(`colap-display-body-${i}`);
        return newColapBodyDisplay
    }

    function newColapBodyInput(i) {    // input para o cliente conseguir editar o body do colap
        const newColapBodyInput = document.createElement('textarea');
        newColapBodyInput.classList.add(`colap-input-body-${i}`);
        return newColapBodyInput
    }

    function newSpan(cla, text) {    // input para o cliente conseguir editar o body do colap
        const newSpan = document.createElement('span');
        newSpan.classList.add(cla);
        newSpan.innerText = `${text}`;
        return newSpan
    }

    colapBtn.addEventListener('click', toogleColapsablesModal);

    // Código por rever -^
    // Código revisto -v

    // Função para mostrar a modal de tabelas
    function modalTabelas() {

        // Limpar a modal
        modaldiv.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Anexar à modal a primeira página (atualmente não existe segunda página)
        let primeiraPagina = modaldiv.appendChild(newRow(pag));

        // Wrapper da secção das tabelas
        const novaTabelaWrapper = document.createElement('div');
        novaTabelaWrapper.classList.add('col-md-12');
        novaTabelaWrapper.id = 'tabelasInput';

        // Span 'Número de Linhas'
        let numLinhasSpan = novaTabelaWrapper.appendChild(document.createElement('span'));
        numLinhasSpan.id = 'num-linhas-span'
        numLinhasSpan.innerText = 'Número de linhas';

        // Input 'Número de Linhas'
        let numLinhasInput = novaTabelaWrapper.appendChild(document.createElement('input'));
        numLinhasInput.id = 'num-linhas-input'

        // Span 'Número de Colunas'
        let numColunasSpan = novaTabelaWrapper.appendChild(document.createElement('span'));
        numColunasSpan.id = 'num-colunas-span'
        numColunasSpan.innerText = 'Número de colunas';

        // Input 'Número de Colunas'
        let numColunasInput = novaTabelaWrapper.appendChild(document.createElement('input'));
        numColunasInput.id = 'num-colunas-input';

        // Span 'Cabeçalho?'
        let cabecalhoSpan = novaTabelaWrapper.appendChild(document.createElement('span'));
        cabecalhoSpan.innerText = 'Cabeçalho?';
        cabecalhoSpan.id = 'cabecalho-span'

        // Checkbox 'Cabeçalho?'
        let cabecalhoCheckbox = novaTabelaWrapper.appendChild(document.createElement('input'));
        cabecalhoCheckbox.setAttribute('type', 'checkbox');
        cabecalhoCheckbox.setAttribute('checked', 'true'); // Ativa a checkbox por omissão
        cabecalhoCheckbox.id = 'cabecalho-checkbox';

        // Button 'Criar tabela'
        let criarCabecalho = novaTabelaWrapper.appendChild(document.createElement('button'));
        criarCabecalho.classList.add('btn');
        criarCabecalho.classList.add('btn-success');
        criarCabecalho.innerText = 'Criar tabela';
        criarCabecalho.addEventListener('click', escreverTabela);

        // Anexar o wrapper da secção de ligações à primeira página 
        primeiraPagina.appendChild(novaTabelaWrapper);
    }

    // Função para adicionar uma tabela ao tópico de manual
    function escreverTabela() {

        // Obter os parâmetros para a ligação
        const numLinhas = document.querySelector('#num-linhas-input').value;
        const numColunas = document.querySelector('#num-colunas-input').value;
        const cabecalho = document.querySelector('#cabecalho-checkbox').checked;

        // <table>
        const novaTabela = document.createElement('table');
        novaTabela.classList.add('phcgo-table');

        // <tbody>
        const tBody = novaTabela.appendChild(document.createElement('tbody'));

        // Se a checkbox estiver a true, é também adicionado um cabeçalho à tabela
        if (cabecalho === true) {
            const novoCabecalho = document.createElement('tr');
            for (i = 1; i <= numColunas; i++) {
                let novaColuna = novoCabecalho.appendChild(document.createElement('td'));
                novaColuna.classList.add('td-cabecalho');
                novaColuna.innerText = `Cabeçalho ${i}`;
            }
            tBody.appendChild(novoCabecalho);
        }

        // adiciona as restantes linhas á tabela
        for (iLinhas = 1; iLinhas <= numLinhas; iLinhas++) {
            const novaLinha = document.createElement('tr');
            for (iColunas = 1; iColunas <= numColunas; iColunas++) {
                let novaColuna = novaLinha.appendChild(document.createElement('td'));
                novaColuna.innerText = `Linha ${iLinhas} Coluna ${iColunas}`;
            }
            tBody.appendChild(novaLinha);
        }

        novoSourceCode = `${cursorPosInfo[1]}${novaTabela.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = novoSourceCode;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
        getCollapsables();// leftover dos colapsáveis. para apagar ao rescrever colapsáveis
        saveIntoJSON();
    }

    // Função para mostrar a modal de ligações
    function modalLigacoes() {

        // Limpar a modal
        modaldiv.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Anexar à modal a primeira página (atualmente não existe segunda página)
        let primeiraPagina = modaldiv.appendChild(newRow(pag));

        // Wrapper da secção das ligações
        const novaLigacaoWrapper = document.createElement('div');

        // Span 'Descrição da ligação'
        let spanDescricao = novaLigacaoWrapper.appendChild(document.createElement('span'));
        spanDescricao.innerText = 'Descrição da ligação'
        spanDescricao.id = 'nome-span';

        // Input 'Descrição da ligação'
        let inputDescricao = novaLigacaoWrapper.appendChild(document.createElement('input'));
        inputDescricao.id = 'nome-input';

        // Span 'URL'
        let spanURL = novaLigacaoWrapper.appendChild(document.createElement('span'));
        spanURL.innerText = 'URL da ligação'
        spanURL.id = 'link-span';

        // Input 'URL'
        let inputURL = novaLigacaoWrapper.appendChild(document.createElement('input'));
        inputURL.id = 'link-input';

        // Button Criar ligação
        let criarLigacao = novaLigacaoWrapper.appendChild(document.createElement('button'));
        criarLigacao.classList = 'btn btn-success';
        criarLigacao.innerText = 'Criar ligação';
        criarLigacao.addEventListener('click', escreverLigacao);

        // Anexar o wrapper da secção de ligações à primeira página    
        primeiraPagina.appendChild(novaLigacaoWrapper)
    }

    // Função para adicionar uma ligação ao código do tópico
    function escreverLigacao() {

        // Obter os parâmetros para a ligação
        const nome = document.querySelector('#nome-input').value;
        const link = document.querySelector('#link-input').value;

        const novaLigacao = document.createElement('a');
        novaLigacao.classList.add('manuais');
        novaLigacao.setAttribute('href', link);
        novaLigacao.setAttribute('target', '_blank');
        novaLigacao.innerText = nome;
        novoSourceCode = `${cursorPosInfo[1]}${novaLigacao.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = novoSourceCode;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
        getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
        saveIntoJSON();
    }

    // Função para mostrar a modal de listas
    function modalListas() {

        // Limpar a modal
        modaldiv.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Anexar à modal a primeira página (atualmente não existe segunda página)
        let primeiraPagina = modaldiv.appendChild(newRow(pag));

        // Wrapper da secção das listas
        const novaListaWrapper = document.createElement('div');

        // Span "Tipo de lista"
        let tipoListaSpan = novaListaWrapper.appendChild(document.createElement('span'));
        tipoListaSpan.innerText = 'Tipo de lista';
        tipoListaSpan.id = 'tipo-lista-span';

        // Dropdown para "Tipo de lista"
        let tipoListaDropdown = novaListaWrapper.appendChild(document.createElement('select'));
        tipoListaDropdown.id = 'tipo-lista-dropdown'

        // Anexar opções á dropdown
        // Opção 1    
        tipoListaDropdown.appendChild(document.createElement('option'));
        tipoListaDropdown.lastChild.value = 'ul' // Valor a se passado para a função construtora de lista
        tipoListaDropdown.lastChild.innerHTML = '&nbsp;Não ordenada &nbsp;&nbsp;&nbsp;( • Item )';
        // Opção 2
        tipoListaDropdown.appendChild(document.createElement('option'));
        tipoListaDropdown.lastChild.value = 'ol-1'
        tipoListaDropdown.lastChild.innerHTML = '&nbsp;Ordenada &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( 1. Item )'
        // Opção 3
        tipoListaDropdown.appendChild(document.createElement('option'));
        tipoListaDropdown.lastChild.value = 'ol-a'
        tipoListaDropdown.lastChild.innerHTML = '&nbsp;Ordenada &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( a. Item )';

        // Span "Número de Itens"
        let numItensSpan = novaListaWrapper.appendChild(document.createElement('span'));
        numItensSpan.innerText = 'Número de itens';
        numItensSpan.id = 'num-itens-span';

        // Input "Número de Itens"
        let numItensInput = novaListaWrapper.appendChild(document.createElement('input'));
        numItensInput.id = 'num-itens-input'

        // Button "Criar lista"
        let criarListaButton = novaListaWrapper.appendChild(document.createElement('button'));
        criarListaButton.classList = 'btn btn-success';
        criarListaButton.innerText = 'Criar lista'
        criarListaButton.addEventListener('click', escreveLista)

        // Anexar o wrapper da secção de listas à primeira página
        primeiraPagina.appendChild(novaListaWrapper);
    }

    // Função para adicionar uma lista ao código do tópico
    function escreveLista() {

        // Obter os parâmetros para a lista
        const tipo = document.querySelector('#tipo-lista-dropdown').value;
        const n = document.querySelector('#num-itens-input').value;

        // Declarar variávis para o Switch
        let novaLista = '';
        let novoSourceCode = '';

        switch (tipo) {

            // Opção 1
            case 'ul':
                novaLista = document.createElement('ul');
                for (i = 1; i <= n; i++) {
                    let novoItem = novaLista.appendChild(document.createElement('li'));
                    novoItem.innerHTML = `<b>Item ${i}:</b> Lorem ipsum`;
                }
                novoSourceCode = `${cursorPosInfo[1]}${novaLista.outerHTML}${cursorPosInfo[2]}`;
                textarea.value = novoSourceCode;
                maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
                getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
                saveIntoJSON();
                break;

            // Opção 2
            case 'ol-1':
                novaLista = document.createElement('ol');
                novaLista.setAttribute('type', '1');
                for (i = 1; i <= n; i++) {
                    novaLista.appendChild(document.createElement('li'));
                    novaLista.lastChild.innerHTML = `<b>Item ${i}:</b> Lorem ipsum`;
                }
                novoSourceCode = `${cursorPosInfo[1]}${novaLista.outerHTML}${cursorPosInfo[2]}`;
                textarea.value = novoSourceCode;
                maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
                getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
                saveIntoJSON();
                break;

            // Opção 3
            case 'ol-a':
                novaLista = document.createElement('ol');
                novaLista.setAttribute('type', 'a');
                for (i = 1; i <= n; i++) {
                    novaLista.appendChild(document.createElement('li'));
                    novaLista.lastChild.innerHTML = `<b>Item ${i}:</b> Lorem ipsum`;
                }
                novoSourceCode = `${cursorPosInfo[1]}${novaLista.outerHTML}${cursorPosInfo[2]}`;
                textarea.value = novoSourceCode;
                maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
                getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
                saveIntoJSON();
                break;
        }
    }

    // Event listeners
    document.querySelector('#list-btn').addEventListener('click', modalListas);
    document.querySelector('#link-btn').addEventListener('click', modalLigacoes);
    document.querySelector('#table-btn').addEventListener('click', modalTabelas);
    document.querySelector('#ancora-btn').addEventListener('click', stickyTop);

    // Debug Tools

    // Mostra target na consola
    document.addEventListener("click", function (e) {
        console.log(e.target);
    });

    // Landing page - para fazer um scale fixe, tenho de isolar o RNG.   Depois é pegar no RNG, dividir por 20 (ms é smooth). Este valor, é o nosso i 

    window.onload = function () {
        const rng = Math.floor(Math.random() * (1800 - 1600)) + 1600;
        const loadingBarTimer = setInterval(refreshBar, 15);
        let scale = 1.35;
        let px = 3.5;

        function refreshBar() {
            if (px < 2 && scale < 1.2) {
                document.querySelector('#loading').style.width = 0 + 'px';
            }
            else {
                px = px * scale;
                scale = scale / 1.0085;
                document.querySelector('#loading').style.width = px + 'px';
            }

        }

        const landingTimer = setTimeout(function () {
            document.querySelector('#landing').classList.add('no-display');
            clearInterval(loadingBarTimer);
        }, rng);

        return landingTimer;
    }
}
mixWrapper();