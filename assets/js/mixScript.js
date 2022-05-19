function mixWrapper() {


    let cursorPosInfo = [];
    const addTextBoxBtn = document.querySelector('#textbox-btn');
    const addIconBtn = document.querySelector('#logos-btn');
    const textarea = document.querySelector('textarea');
    const hcPreview = document.querySelector('.hc-preview');
    const modaldiv = document.querySelector('#modal');
    const maindiv = document.querySelector('#main-div');
    const previewBtn = document.querySelector('#preview-btn');
    const numeroImagens = 16; // trocar pelo numero de objetos no json no futuro.
    const numeroTextBoxes = 4;
    const iconsArray = [
        '<img src="/assets/img/icons/1.png">',
        '<img src="/assets/img/icons/2.png">',
        '<img src="/assets/img/icons/3.png">',
        '<img src="/assets/img/icons/4.png">',
        '<img src="/assets/img/icons/5.png">',
        '<img src="/assets/img/icons/6.png">',
        '<img src="/assets/img/icons/7.png">',
        '<img src="/assets/img/icons/8.png">',
        '<img src="/assets/img/icons/9.png">',
        '<img src="/assets/img/icons/10.png">',
        '<img src="/assets/img/icons/11.png">',
        '<img src="/assets/img/icons/12.png">',
        '<img src="/assets/img/icons/13.png">',
        '<img src="/assets/img/icons/14.png">',
        '<img src="/assets/img/icons/15.png">',
        '<img src="/assets/img/icons/16.png">'
    ]




    function text() {
        let inputText = textarea.value;  // obter o texto
        let fixedText = inputText.replace('src="../pimages/go/artigo.svg"', 'src="/assets/img/artigo.svg"'); // o texto corrigido
        maindiv.innerHTML = fixedText; // publicar o texto
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
        maindiv.innerHTML = fixedText;
        cursorPosInfo[1] = inputTextString1;
        cursorPosInfo[2] = inputTextString2;
    }

    function selectIcon(eTarget) {
        let fixedText = `${cursorPosInfo[1]}${eTarget.outerHTML}${cursorPosInfo[2]}`;
        maindiv.innerHTML = fixedText;
        textarea.value = fixedText;
    }

    previewBtn.addEventListener('click', text);
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
        newItem.innerHTML = iconsArray[(i - 1)];
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
            if ((i % 16) === 0) {
                let modaldivLastrow = modaldiv.lastChild;
                modaldivLastrow.appendChild(newItem(i));
                pag++;
                modaldiv.appendChild(newHiddenRow(pag));
            } else {
                let modaldivLastrow = modaldiv.lastChild;
                modaldivLastrow.appendChild(newItem(i));
            }

        }
        modaldiv.appendChild(newPagiRow());
        let pagiRow = document.querySelector('.pagi');
        for (let pagi = 1; pagi <= pag; pagi++) {
            pagiRow.appendChild(newPagiItem(pagi));
        }
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
    }

    addIconBtn.addEventListener('click', () => {
        hcPreview.classList.add('no-display');
        modaldiv.classList.remove('no-display');
        getIcons();
        // Gerador de eventlistener para cada icon
        (function () {
            let eventArray = [];
            for (i = 1; i <= numeroImagens; i++) {
                eventArray[i] = document.querySelector('.col-md-3' + `.item-${i}`);
                eventArray[i].addEventListener('click', (e) => {
                    hcPreview.classList.remove('no-display');
                    modaldiv.classList.add('no-display');
                    eTarget = e.target;
                    selectIcon(eTarget);
                });
            }
        })();
    });


    addTextBoxBtn.addEventListener('click', () => {
        hcPreview.classList.add('no-display');
        modaldiv.classList.remove('no-display');
        getTextBoxes();

    });





}

mixWrapper();