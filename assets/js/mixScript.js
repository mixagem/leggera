function mixWrapper() {

    const addTextBoxBtn = document.querySelector('#textbox-btn');
    const addIconBtn = document.querySelector('#logos-btn');
    const addButtonsBtn = document.querySelector('#botoes-btn');
    const textarea = document.querySelector('textarea');
    const modaldiv = document.querySelector('#modal');
    const maindiv = document.querySelector('#main-div');
    const ancoraBtn = document.querySelector('#ancora-btn');
    const colapBtn = document.querySelector('#colap-btn');
    const colapModal = document.querySelector('#colapsables-modal');
    const hcPreview = document.querySelector('.hc-preview');
    const numeroImagens = 36;
    const numeroTextBoxes = 4;
    const numeroButoes = 12;
    const iconsFromJSON = [];
    const textBoxesFromJSON = [];
    const buttonsFromJSON = [];
    let cursorPosInfo = [];



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
        let fixedText2 = fixedText.replace('src="../pimages/go/artigo.svg"', 'src="/assets/img/artigo.svg"');
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
        newItem.classList.add('col-md-3');
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
        let fixedText2 = fixedText.replace('src="../pimages/go/artigo.svg"', 'src="/assets/img/artigo.svg"'); // o texto corrigido
        maindiv.innerHTML = fixedText2;
        getCollapsables();
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
                textBoxesFromJSON[i] = document.querySelector(`.col-md-3` + `.item-${i + 1}`);
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

    function newButtonRow () {
        const newButtonRow = document.createElement('div');
        newButtonRow.classList.add('row');
        newButtonRow.classList.add('phc-buttons');
        return newButtonRow;
    }

    // function newPagiRow() {
    //     const newPagiRow = document.createElement('div');
    //     newPagiRow.classList.add('row');
    //     newPagiRow.classList.add('pagi');
    //     return newPagiRow
    // }

    // function newPagiItem(pagi) {
    //     const newPagiItem = document.createElement('div');
    //     newPagiItem.classList.add('col');
    //     newPagiItem.classList.add(`pagi-${pagi}`);
    //     newPagiItem.innerHTML = `${pagi}`
    //     return newPagiItem
    // }


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
                eventArray[i] = document.querySelector('.col-md-3' + `.item-${i}`);
                eventArray[i].addEventListener('click', (e) => {
                    eTarget = e.target;
                    eTargetLenght = eTarget.classList.length;
                    eTargetParent = eTarget.parentElement;
                    eTargetParentLenght = eTargetParent.classList.length;
                    if (eTargetLenght !== 2) {
                        selectIcon(eTargetParent);
                    } else if (eTargetParentLenght !== 2) {
                        selectIcon(eTargetParent.parentElement);
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
                    selectIcon(eTarget);
                });
            }
        })();
    });



    function toogleColapsablesModal() {
        let colapModalClasses = colapModal.classList;
        if (colapModalClasses.length === 2) {
            colapModal.classList.remove('no-display');
            hcPreview.classList.add('no-display');
        } else {
            colapModalClasses = colapModal.classList.add('no-display');
            hcPreview.classList.remove('no-display');
        }
        getCollapsables();
    }

    function oldColapsContent2JSON() {
        // let tarefas = tarefasList.querySelectorAll('li');                     // Estamos a obter um array com os textos dos vários <li>
        // let arrayTarefas = [];
        let collapsablesArray = document.querySelectorAll('.row .seccao-phcgo');
        let tempArray = [[],[],[]];

        for (i = 1; i <= collapsablesArray.length; i++) {
            tempArray[0][i-1] = document.querySelector(`.colap-input-id-${i}`).value ;
            tempArray[1][i-1] = document.querySelector(`.colap-input-h2-${i}`).value ;
            tempArray[2][i-1] = document.querySelector(`.colap-input-body-${i}`).value ;
        }

        console.log(tempArray);
        let colap2JSON = JSON.stringify(tempArray);
        console.log(colap2JSON);
        localStorage.setItem('old-text',colap2JSON);
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
                let bodyTemp1 = collapsablesArray[i - 1].nextElementSibling.innerHTML;
                bodyTemp1 = String(bodyTemp1).replace('<span id="pulse">|</span>', '');
                wrapperLeft.lastChild.value = bodyTemp1;
                wrapperLeft.appendChild(newBtn(saveChanges, 'btn-success', 'Guardar Alterações', `save-btn-${i}`));
                wrapperLeft.appendChild(newBtn(discardChanges, 'btn-danger', 'Descartar Alterações', `reject-btn-${i}`));
                // wrapperRight.appendChild(newColapIDDisplay(i));
                // wrapperRight.lastChild.innerText = collapsablesArray[i-1].nextElementSibling.id;
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
        console.log('save')
    }

    function discardChanges() {
        console.log('discard')
    }

    (function eventz() {
        let collapsablesArray = document.querySelectorAll('.row .seccao-phcgo');
        for (i = 1; i <= collapsablesArray.length; i++) {
            let eventzArray = [];
            eventzArray[i] = document.querySelector(`#save-btn-${i}`);
            eventzArray[i].addEventListener('click', saveChanges);
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

    // function displayAllOptions (y) {
    //         let arrayOptions1 = document.querySelectorAll('.btn-success');
    //         let arrayOptions2 = document.querySelectorAll('.btn-danger');         
    //         for (i = 1 ; i < arrayOptions1.length; i++) {
    //             arrayOptions1[i-1].classList.remove('no-display');
    //             arrayOptions2[i-1].classList.remove('no-display');
    //         }

    // }


    function displayOptions(i) {
        let arrayOptions1 = document.querySelectorAll('.btn-success');
        let arrayOptions2 = document.querySelectorAll('.btn-danger');
        arrayOptions1[i - 1].classList.remove('no-display');
        arrayOptions2[i - 1].classList.remove('no-display');
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

    // function newColapIDDisplay (i) { // div para mostrar o atual ID do colap
    //     const newColapIDDisplay = document.createElement('div');
    //     newColapIDDisplay.classList.add(`colap-display-id-${i}`);
    //     return newColapIDDisplay
    // }

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

}

mixWrapper();