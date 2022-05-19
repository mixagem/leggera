function mixWrapper() {

    const addTextBoxBtn = document.querySelector('#textbox-btn');
    const addIconBtn = document.querySelector('#logos-btn');
    const addButtonsBtn = document.querySelector('#botoes-btn');
    const textarea = document.querySelector('textarea');
    const modaldiv = document.querySelector('#modal');
    const maindiv = document.querySelector('#main-div');
    const ancoraBtn = document.querySelector('#ancora-btn');
    const tabelasBtn = document.querySelector('#table-btn');
    const colapBtn = document.querySelector('#colap-btn');
    const colapModal = document.querySelector('#colapsables-modal');
    const hcPreview = document.querySelector('.hc-preview');
    const numeroImagens = 36;
    const numeroTextBoxes = 5;
    const numeroButoes = 12;
    const iconsFromJSON = [];
    const textBoxesFromJSON = [];
    const buttonsFromJSON = [];
    let cursorPosInfo = [];

       
    document.addEventListener("click", function(evnt){
        console.log(evnt.target);
    });

    (function JSON2Input() {
        try {
            const getTextareaFromJSON = localStorage.getItem('textarea');                 // Obter o string do localstorage
            textarea.value = JSON.parse(getTextareaFromJSON);
        }
        catch { }
    })();

    textarea.addEventListener('keyup', autoSave);
    textarea.addEventListener('keydown', stopAutoSave);

    function autoSave(e) {
        let autoSaveTimer = updateCursorPos(e);
        return autoSaveTimer
    }

    function stopAutoSave() {
        try {
            clearTimeout(autoSaveTimer);
        } catch {}
    }


    function saveIntoJSON() {
        let textarea2JSON = JSON.stringify(textarea.value);
        localStorage.setItem('textarea', textarea2JSON);
        console.log('cache saved, you welcome');
    }


    function stickyTop() {                                                      // função para ancorar o header do live editor
        const header = document.querySelector('.header');
        if (header.classList.length === 1) {
            header.classList.add('sticky-top');
            ancoraBtn.classList.replace('btn-light', 'btn-info');
        } else {
            header.classList.remove('sticky-top');
            ancoraBtn.classList.replace('btn-info', 'btn-light');
        }
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

        fetch('assets/js/imagens.json')
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
        modaldiv.appendChild(newRow(pag));
        for (i = 1; i <= numeroImagens; i++) {
            if ((i % 36) === 0) {
                let modaldivLastrow = modaldiv.lastChild;
                modaldivLastrow.appendChild(newMiniItem(i));
                pag++;
                modaldiv.appendChild(newHiddenRow(pag));
            } else {
                let modaldivLastrow = modaldiv.lastChild;
                modaldivLastrow.appendChild(newMiniItem(i));
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

    ancoraBtn.addEventListener('click', stickyTop);
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
                    } else if (eTarget.classList.contains('col-md-3')) {
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

    function tableGenerator(header, nRow, nCol) {
        const newTable = document.createElement('table');
        newTable.classList.add('phcgo-table');
        newTable.appendChild(document.createElement('tbody'));
        const tableBody = newTable.lastChild;
        if (header === true) {
            const newHeader = document.createElement('tr');
            for (i = 1; i <= nCol; i++) {
                newHeader.appendChild(document.createElement('td'));
                newHeader.lastChild.classList.add('td-cabecalho');
                newHeader.lastChild.innerText = `Cabeçalho ${i}`;

            }
            tableBody.appendChild(newHeader);
        }
        for (i2 = 1; i2 <= nRow; i2++) {
            const newRow = document.createElement('tr');
            for (i3 = 1; i3 <= nCol; i3++) {
                newRow.appendChild(document.createElement('td'));
                newRow.lastChild.innerText = `Linha ${i2} Coluna ${i3}`;
            }
            tableBody.appendChild(newRow);
        }
        return newTable;
    }


    tabelasBtn.addEventListener('click', getTables);

    function getTables() {                                    // função construtora <div> para todos os Icons
        modaldiv.innerHTML = '';
        let pag = 1;
        modaldiv.appendChild(newRow(pag));
        const tabelasInputWrapper = document.createElement('div');
        tabelasInputWrapper.classList.add('col-md-12');
        tabelasInputWrapper.id = 'tabelasInput';
        tabelasInputWrapper.appendChild(document.createElement('span'));
        tabelasInputWrapper.lastChild.innerText = 'Linhas';
        tabelasInputWrapper.appendChild(document.createElement('input'));
        tabelasInputWrapper.lastChild.id = 'row-input'
        tabelasInputWrapper.appendChild(document.createElement('span'));
        tabelasInputWrapper.lastChild.innerText = 'Colunas';
        tabelasInputWrapper.appendChild(document.createElement('input'));
        tabelasInputWrapper.lastChild.id = 'col-input';
        tabelasInputWrapper.appendChild(document.createElement('span'));
        tabelasInputWrapper.lastChild.innerText = 'Cabeçalho?';
        tabelasInputWrapper.appendChild(document.createElement('input'));
        tabelasInputWrapper.lastChild.setAttribute('type', 'checkbox');
        tabelasInputWrapper.lastChild.setAttribute('checked', 'true');
        tabelasInputWrapper.lastChild.id = 'header-input';
        tabelasInputWrapper.appendChild(document.createElement('button'));
        tabelasInputWrapper.lastChild.classList.add('btn');
        tabelasInputWrapper.lastChild.classList.add('btn-success');
        tabelasInputWrapper.lastChild.innerText = 'Dá-lhe gás';
        tabelasInputWrapper.lastChild.addEventListener('click', writeTable);
        modaldiv.lastChild.appendChild(tabelasInputWrapper);
    }

    function writeTable() {
        let nRow = document.querySelector('#row-input').value;
        let nCol = document.querySelector('#col-input').value;
        let wantHeader = document.querySelector('#header-input').checked;
        let newTable = tableGenerator(wantHeader, nRow, nCol);
        let fixedText = `${cursorPosInfo[1]}${newTable.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = fixedText;
        let fixedText2 = fixedText.replace('src="../pimages/go/artigo.svg"', 'src="assets/img/artigo.svg"'); // o texto corrigido
        maindiv.innerHTML = fixedText2;
        getCollapsables();
        saveIntoJSON();
    }

    const linkBtn = document.querySelector('#link-btn');
    linkBtn.addEventListener('click', getLink);

    function getLink() {
        modaldiv.innerHTML = '';
        let pag = 1;
        modaldiv.appendChild(newRow(pag));
        const linkInputWrapper = document.createElement('div');
        linkInputWrapper.appendChild(document.createElement('span'));
        linkInputWrapper.lastChild.innerText = 'Nome da ligação:'
        linkInputWrapper.lastChild.id = 'nome-span';
        linkInputWrapper.appendChild(document.createElement('input'));
        linkInputWrapper.lastChild.id = 'nome-input';
        linkInputWrapper.appendChild(document.createElement('span'));
        linkInputWrapper.lastChild.innerText = 'URL:'
        linkInputWrapper.lastChild.id = 'link-span';
        linkInputWrapper.appendChild(document.createElement('input'));
        linkInputWrapper.lastChild.id = 'link-input';
        linkInputWrapper.appendChild(document.createElement('button'));
        linkInputWrapper.lastChild.classList = 'btn btn-success';
        linkInputWrapper.lastChild.innerText = 'Dá-lhe gás';
        linkInputWrapper.lastChild.addEventListener('click', linkGenerator);
        modaldiv.lastChild.appendChild(linkInputWrapper)
    }

    function linkGenerator() {
        let nome = document.querySelector('#nome-input').value;
        let link = document.querySelector('#link-input').value;
        const newLink = document.createElement('a');
        newLink.classList.add('manuais');
        newLink.setAttribute('href', link);
        newLink.setAttribute('target', '_blank');
        newLink.innerText = nome;
        let fixedText = `${cursorPosInfo[1]}${newLink.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = fixedText;
        let fixedText2 = fixedText.replace('src="../pimages/go/artigo.svg"', 'src="assets/img/artigo.svg"'); // o texto corrigido
        maindiv.innerHTML = fixedText2;
        getCollapsables();
        saveIntoJSON();
    }


    const listBtn = document.querySelector('#list-btn');
    listBtn.addEventListener('click', getLists);

    function getLists() {
        modaldiv.innerHTML = '';
        let pag = 1;
        modaldiv.appendChild(newRow(pag));
        const listInputWrapper = document.createElement('div');
        listInputWrapper.appendChild(document.createElement('span'));
        listInputWrapper.lastChild.innerText = 'Tipo de lista';
        listInputWrapper.appendChild(document.createElement('select'));
        listInputWrapper.lastChild.id = 'list-dropdown'
        listInputWrapper.lastChild.appendChild(document.createElement('option'));
        listInputWrapper.lastChild.lastChild.value = 'ul'
        listInputWrapper.lastChild.lastChild.innerText = 'Não ordenada ( • Item )'
        listInputWrapper.lastChild.appendChild(document.createElement('option'));
        listInputWrapper.lastChild.lastChild.value = 'ol-1'
        listInputWrapper.lastChild.lastChild.innerText = 'Ordenada ( 1. Item )'
        listInputWrapper.lastChild.appendChild(document.createElement('option'));
        listInputWrapper.lastChild.lastChild.value = 'ol-a'
        listInputWrapper.lastChild.lastChild.innerText = 'Ordenada ( a) Item )'
        listInputWrapper.appendChild(document.createElement('span'));
        listInputWrapper.lastChild.innerText = 'Número de Itens';
        listInputWrapper.appendChild(document.createElement('input'));
        listInputWrapper.lastChild.id = 'nList-input'
        listInputWrapper.appendChild(document.createElement('button'));
        listInputWrapper.lastChild.classList = 'btn btn-success';
        listInputWrapper.lastChild.innerText = 'Dá-lhe gás'
        listInputWrapper.lastChild.addEventListener('click', writeList)
        modaldiv.lastChild.appendChild(listInputWrapper);
    }



    function writeList() {
        const tipo = document.querySelector('#list-dropdown').value;
        const n = document.querySelector('#nList-input').value;
        let newList = '';
        let fixedText = '';
        let fixedText2 = '';
        switch (tipo) {
            case 'ul':
                newList = document.createElement('ul');
                for (i = 1; i <= n; i++) {
                    newList.appendChild(document.createElement('li'));
                    newList.lastChild.innerHTML = `<b>Item ${i}:</b> Lorem ipsum`;
                }
                fixedText = `${cursorPosInfo[1]}${newList.outerHTML}${cursorPosInfo[2]}`;
                textarea.value = fixedText;
                fixedText2 = fixedText.replace('src="../pimages/go/artigo.svg"', 'src="assets/img/artigo.svg"'); // o texto corrigido
                maindiv.innerHTML = fixedText2;
                getCollapsables();
                saveIntoJSON();
                break;
            case 'ol-1':
                newList = document.createElement('ol');
                newList.setAttribute('type', '1')
                for (i = 1; i <= n; i++) {
                    newList.appendChild(document.createElement('li'));
                    newList.lastChild.innerHTML = `<b>Item ${i}:</b> Lorem ipsum`;
                }
                fixedText = `${cursorPosInfo[1]}${newList.outerHTML}${cursorPosInfo[2]}`;
                textarea.value = fixedText;
                fixedText2 = fixedText.replace('src="../pimages/go/artigo.svg"', 'src="assets/img/artigo.svg"'); // o texto corrigido
                maindiv.innerHTML = fixedText2;
                getCollapsables();
                saveIntoJSON();
                break;
            case 'ol-a':
                newList = document.createElement('ol');
                newList.setAttribute('type', 'a');
                for (i = 1; i <= n; i++) {
                    newList.appendChild(document.createElement('li'));
                    newList.lastChild.innerHTML = `<b>Item ${i}:</b> Lorem ipsum`;
                }
                fixedText = `${cursorPosInfo[1]}${newList.outerHTML}${cursorPosInfo[2]}`;
                textarea.value = fixedText;
                fixedText2 = fixedText.replace('src="../pimages/go/artigo.svg"', 'src="assets/img/artigo.svg"'); // o texto corrigido
                maindiv.innerHTML = fixedText2;
                getCollapsables();
                saveIntoJSON();
                break;
        }
    }
}
mixWrapper();