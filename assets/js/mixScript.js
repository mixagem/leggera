function mixWrapper() {

    let cursorPosInfo = [];
    const addTextBoxBtn = document.querySelector('#textbox-btn');
    const addIconBtn = document.querySelector('#logos-btn');
    const textarea = document.querySelector('textarea');
    const hcPreview = document.querySelector('.hc-preview');
    const modaldiv = document.querySelector('#modal');
    const maindiv = document.querySelector('#main-div');

    const numeroImagens = 16;
    const numeroTextBoxes = 4;
    const iconsFromJSON = [];
    const textBoxesFromJSON = [];

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

    function iconTopicRelacionado(fixedText) {
        let fixedText2 = fixedText.replace('src="../pimages/go/artigo.svg"', 'src="/assets/img/artigo.svg"'); // o texto corrigido
        maindiv.innerHTML = fixedText2; // publicar o texto
    }

    function getCursorPos(e) {
        let eTarget = e.target;
        let cursorPos = eTarget.selectionStart;
        return cursorPos
    }

    function updateCursorPos(e) {
        let inputText = textarea.value;
        let cursorPos = getCursorPos(e);
        let inputTextString1 = inputText.slice(0, cursorPos);
        let inputTextString2 = inputText.slice(cursorPos);
        let fixedText = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;
        cursorPosInfo[1] = inputTextString1;
        cursorPosInfo[2] = inputTextString2;
        iconTopicRelacionado(fixedText);
    }

    function selectIcon(eTarget) {
        let fixedText = `${cursorPosInfo[1]}${eTarget.outerHTML}${cursorPosInfo[2]}`;
        maindiv.innerHTML = fixedText;
        textarea.value = fixedText;
    }

    textarea.addEventListener('click', updateCursorPos);

    function newRow(pag) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        newRow.classList.add(`page-${pag}`);
        return newRow
    }

    function newHiddenRow(pag) {
        const newHiddenRow = document.createElement('div');
        newHiddenRow.classList.add('row');
        newHiddenRow.classList.add('no-display');
        newHiddenRow.classList.add(`page-${pag}`);
        return newHiddenRow
    }

    function newItem(i) {
        const newItem = document.createElement('div');
        newItem.classList.add('col-md-3');
        newItem.classList.add(`item-${i}`);
        newItem.innerHTML = `${i}`;
        return newItem
    }

    function newMiniItem(i) {
        const newItem = document.createElement('div');
        newItem.classList.add('col-md-1');
        newItem.classList.add(`mini-item-${i}`);
        newItem.classList.add(`mini-item`);
        newItem.innerHTML = `${i}`;
        return newItem
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

    function getIcons() {
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
        modaldiv.appendChild(newPagiRow());
        let pagiRow = document.querySelector('.pagi');
        for (let pagi = 1; pagi <= pag; pagi++) {
            pagiRow.appendChild(newPagiItem(pagi));
        }
        grabJSONIcons();
    }

    function getTextBoxes() {
        modaldiv.innerHTML = '';
        let pag = 1;
        modaldiv.appendChild(newRow(pag));
        for (i = 1; i <= numeroTextBoxes; i++) {
            let modaldivLastrow = modaldiv.lastChild;
            modaldivLastrow.appendChild(newItem(i));
        }
        modaldiv.appendChild(newPagiRow());
        let pagiRow = document.querySelector('.pagi');
        for (let pagi = 1; pagi <= pag; pagi++) {
            pagiRow.appendChild(newPagiItem(pagi));
        }
        grabJSONTextBoxes();
    }

    addIconBtn.addEventListener('click', () => {
        hcPreview.classList.add('no-display');
        modaldiv.classList.remove('no-display');
        getIcons();

        (function () {
            let eventArray = [];
            for (i = 1; i <= numeroImagens; i++) {
                eventArray[i] = document.querySelector('.col-md-1' + `.mini-item-${i}` + '.mini-item');
                eventArray[i].addEventListener('click', (e) => {
                    hcPreview.classList.remove('no-display');
                    modaldiv.classList.add('no-display');
                    eTarget = e.target;
                    eTargetLenght = eTarget.classList.length;
                    eTargetChild = eTarget.children[0];
                    if (eTargetLenght !== 2) {
                        selectIcon(eTargetChild);
                    } else {
                        selectIcon(eTarget);
                    }
                });
            }
        })();
    });

    addTextBoxBtn.addEventListener('click', () => {
        hcPreview.classList.add('no-display');
        modaldiv.classList.remove('no-display');
        getTextBoxes();

        (function () {
            let eventArray = [];
            for (i = 1; i <= numeroTextBoxes; i++) {
                eventArray[i] = document.querySelector('.col-md-3' + `.item-${i}`);
                eventArray[i].addEventListener('click', (e) => {
                    hcPreview.classList.remove('no-display');
                    modaldiv.classList.add('no-display');
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

}

mixWrapper();