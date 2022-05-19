/************************************/
/* helpcenterplus                   */
/* mambosinfinitos, 2022            */
/************************************/


function mixWrapper() {

    // textarea principal
    const textarea = document.querySelector('textarea');

    // div modal cabeçalho
    const modaldiv = document.querySelector('#modal');

    /** 
     * array a ser utilizado para guardar os slices
     * da textarea, a quando da introdução de elementos
     * ([0] = texto até ao cursor | [1] = texto a partir do cursos)
    */
    let cursorPosInfo = [];


    // Código revisto -^
    // Código por rever -v

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

    textarea.addEventListener('click', updateCursorPos);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Collapsables (to remake)
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


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Função para mostrar a moda de Listas e Tabelas
    function modalListasETabelas() {

        // Limpar a modal
        modaldiv.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Anexar à modal a primeira página (atualmente não existe segunda página)
        let primeiraPagina = modaldiv.appendChild(newRow(pag));

        // Wrapper da secção das listas
        const novaListaWrapper = document.createElement('div');
        novaListaWrapper.classList.add('col-md-6');
        novaListaWrapper.id = 'listas-wrapper';

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

        // Anexar o wrapper da secção de listas à primeiraRow
        primeiraPagina.appendChild(novaListaWrapper);

        // Wrapper da secção das tabelas
        const novaTabelaWrapper = document.createElement('div');
        novaTabelaWrapper.classList.add('col-md-6');
        novaTabelaWrapper.id = 'tabelas-wrapper';

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

        // Anexar o wrapper da secção de ligações à primeira row 
        primeiraPagina.appendChild(novaTabelaWrapper);

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

    // Função para mostrar a moda de Títulos e Ligações
    function modalTitulosELigacoes() {

        // Limpar a modal
        modaldiv.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Anexar à modal a primeira página (atualmente não existe segunda página)
        let primeiraPagina = modaldiv.appendChild(newRow(pag));

        // Wrapper da secção dos títulos
        const novoTituloWrapper = document.createElement('div');
        novoTituloWrapper.classList.add('col-md-6');
        novoTituloWrapper.id = 'titulos-wrapper';

        // Tabela + tbody para os vários títulos
        const novaTabela = document.createElement('table');
        novaTabela.style = 'background-color:pink;border:1px solid blue';
        const novaTabelaBody = novaTabela.appendChild(document.createElement('tbody'));

        // contador dos estilos (h1, h2, h3)
        let class1Index = 1;

        // validador do tipo de estilo (true > class="manuais" | false > default HelpCenter)    
        let class2Index = true;

        // Criação de tr + td para os títulos
        for (i = 1; i <= 6; i++) {
            let novaTabelaRow = novaTabelaBody.appendChild(document.createElement('tr'));
            let novaTabelaCell = novaTabelaRow.appendChild(document.createElement('td'));
            let novoTituloWrapper = novaTabelaCell.appendChild(document.createElement(`h${class1Index}`));

            //se for falso, não coloca o estilo personalizado
            if (class2Index === true) { novoTituloWrapper.classList.add(`manuais`);} 

            novoTituloWrapper.innerText = `Título H${class1Index}`;
            novoTituloWrapper.addEventListener('click', function (e) {escreverTitulo(e);});

            // Atualiza contadores
            if (class1Index < 3) {
                class1Index++;
            } else {
                // Reseta o class1Index
                class1Index = 1;

                // Ao fim de 3 interações, a class2Index vira falso,de modo a não adicionar o estilo personalizado do título
                class2Index = false;
            }
        }

        // Anexa a tabela ao Wrapper dos título
        novoTituloWrapper.appendChild(novaTabela);

        // Anexa o Wrapper dos títulos à primeira row
        primeiraPagina.appendChild(novoTituloWrapper);

        // Wrapper da secção dos extras
        const novoExtrasWrapper = document.createElement('div');
        novoExtrasWrapper.classList.add('col-md-6');
        novoExtrasWrapper.id = 'extras-wrapper';

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

        // Anexar o wrapper da secção de ligações ao wrapper de extras   
        novoExtrasWrapper.appendChild(novaLigacaoWrapper);

        // Button para adicionar separador horizontal (hr)
        const novaQuebraBtn = document.createElement('button');
        novaQuebraBtn.innerText = 'Introduzir Separador Horizontal';
        novaQuebraBtn.classList = 'btn btn-info';
        novaQuebraBtn.id = 'nova-quebra-btn';
        novaQuebraBtn.addEventListener('click', escreverQuebra);

        // Anexar o button ao wrapper de extras
        novoExtrasWrapper.appendChild(novaQuebraBtn);

        // Anexa o Wrapper de extras  à primeira row
        primeiraPagina.appendChild(novoExtrasWrapper);
    }

    // Função para adicionar um título ao código do tópico
    function escreverTitulo(e) {
        const eTarget = e.target;
        novoSourceCode = `${cursorPosInfo[1]}${eTarget.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = novoSourceCode;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
        getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
        saveIntoJSON();
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

    // Função para adicionar um seprador horizontal <hr> código do tópico
    function escreverQuebra() {

        const novoSeparador = document.createElement('hr');
        novoSeparador.style.borderTop = '3px solid #eee';
        novoSourceCode = `${cursorPosInfo[1]}${novoSeparador.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = novoSourceCode;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
        getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
        saveIntoJSON();
    }

    // Função para mostrar a modal de botoes
    function modalBotoes() {

        // Limpar a modal
        modaldiv.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Anexar à modal a primeira página (atualmente não existe segunda página)
        let primeiraPagina = modaldiv.appendChild(newRow(pag));

        // Anexar à primeira página os wrappers (funcionam como rows)
        let novoBotoesWrapper = primeiraPagina.appendChild(document.createElement('div'));
        novoBotoesWrapper.classList = 'row phc-buttons';
        
        for (i = 1; i <= numeroButoes; i++) {
            // A cada 4 interações, cria uma nova linha
            if (i % 4 === 0) {
                novoBotoesWrapper.appendChild(botaoDiv(i));
                novoBotoesWrapper = primeiraPagina.appendChild(document.createElement('div'));
                novoBotoesWrapper.classList = 'row phc-buttons';
            } else {
                novoBotoesWrapper.appendChild(botaoDiv(i));
            }
        }

        // Substitui os valores dos botoes, pelos valores do JSON
        grabJSONButtons();
    }

    // Função para anexar botões à modal de botões
    function botaoDiv(i) {                                 
        const newMediumItem = document.createElement('div');
        newMediumItem.classList = `botao-${i} col-md-3`;
        newMediumItem.innerHTML = `${i}`;
        newMediumItem.addEventListener('click',escreverBotao)
        return newMediumItem
    }

    // Função para adicionar um botão ao código do tópico
    function escreverBotao(e) {
        let eTarget = e.target;

        // HotFix para quando o target não é igual ao botão
        if(eTarget.classList.length > 0) {eTarget = eTarget.firstChild};

        novoSourceCode = `${cursorPosInfo[1]}${eTarget.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = novoSourceCode;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
        getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
        saveIntoJSON();
    }

    // Função para substituir os valores dos botoes, de acordo com o JSON
    function grabJSONButtons() {

        fetch('assets/js/buttons.json')
            .then(function (response) {return response.json();})
            .then(function (data) {appendData(data);})
            .catch(function (err) {})

        function appendData(data) {
            for (let i = 0; i < data.length; i++) {
                buttonsFromJSON[i] = document.querySelector(`.botao-${i + 1}`); //+.col-md-3` 
                buttonsFromJSON[i].innerHTML = data[i].code;
            }
        }
    }

    // Função para mostrar a modal de icons
    function modalIcons() { 

        // Limpar a modal
        modaldiv.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Declaração de variáveis necessárias para efetuar o loop      
        let row = 1;
        let preRow = 1;

        // Anexar à modal a primeira página (atualmente não existe segunda página)
        let primeiraPagina = modaldiv.appendChild(newRow(pag));
    
        let divPrimeiraRow = primeiraPagina.appendChild(document.createElement('div'));
        divPrimeiraRow.classList = `row icon-row-${preRow}`;
    
        let divSegundaRow = divPrimeiraRow.appendChild(document.createElement('div'));
        divSegundaRow.classList = `col-md-6 icon-sub-row-${row}`;

        for (i = 1; i <= numeroImagens; i++) {
    
            // A cada 24 interações, cria um novo row (100%)
            if ((i % 24) === 0) {
                divSegundaRow.appendChild(divIcon(i));
                row = 1;
                preRow++;
                primeiraPagina.appendChild(document.createElement('div'));
                primeiraPagina.lastChild.classList = `row icon-row-${preRow}`;
                primeiraPagina.lastChild.appendChild(document.createElement('div'));
                primeiraPagina.lastChild.lastChild.classList = `col-md-6 icon-sub-row-${row}`;
                divPrimeiraRow = primeiraPagina.lastChild;
                divSegundaRow = primeiraPagina.lastChild.lastChild;
            }

            // A cada 12 interações, cria um novo row (50%)
            else if ((i % 12) === 0) {
                divSegundaRow.appendChild(divIcon(i));
                row++;
                divPrimeiraRow.appendChild(document.createElement('div'));
                divPrimeiraRow.lastChild.classList = `col-md-6 icon-sub-row-${row}`;
                divSegundaRow = divPrimeiraRow.lastChild;
                //  else if ((i % 48) === 0) {
                //     modaldiv.lastChild.lastChild.appendChild(divIcon(i));
                //     pag++;
                //     modaldiv.appendChild(newHiddenRow(pag));
            } 
            
            else {divSegundaRow.appendChild(divIcon(i));}

        }
        // modaldiv.appendChild(newPagiRow());
        // let pagiRow = document.querySelector('.pagi');
        // for (let pagi = 1; pagi <= pag; pagi++) {
        //     pagiRow.appendChild(newPagiItem(pagi));
        // }
        grabJSONIcons();
    }
    
    function divIcon(i) {                                   // Função geradora <div col> para Logos e Icons
        const divIcon = document.createElement('div');
        divIcon.classList = `icon-${i} col-md-1 phcgo-icon`;
        divIcon.innerHTML = `${i}`;
        divIcon.addEventListener('click',escreverIcon);
        return divIcon
    }
    
    function escreverIcon(e) {
        let eTarget = e.target;
        
        // HotFix para quando o target não é igual ao icons
        if(eTarget.classList.contains('phcgo-icon')) {eTarget = eTarget.firstChild};
    
        novoSourceCode = `${cursorPosInfo[1]}${eTarget.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = novoSourceCode;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
        getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
        saveIntoJSON();
    }
    
    function grabJSONIcons() {
    
        fetch('assets/js/imagens2.json')
            .then(function (response) {return response.json();})
            .then(function (data) {appendData(data);})
            .catch(function (err) { })
    
        function appendData(data) {
            for (let i = 0; i < data.length; i++) {
                iconsFromJSON[i] = document.querySelector(`.icon-${i + 1}`);
                iconsFromJSON[i].innerHTML = data[i].code;
            }
        }
    
    }
    
    // Função para mostar a modal de Textboxes
    function modalTextbox() { 

        // Limpar a modal
        modaldiv.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Anexar à modal a primeira página (atualmente não existe segunda página)
        let primeiraPagina = modaldiv.appendChild(newRow(pag));

        for (i = 1; i <= numeroTextBoxes; i++) {
            primeiraPagina.appendChild(divTextbox(i));
        }
        // modaldiv.appendChild(newPagiRow());
        // let pagiRow = document.querySelector('.pagi');
        // for (let pagi = 1; pagi <= pag; pagi++) {
        //     pagiRow.appendChild(newPagiItem(pagi));
        // }
        grabJSONTextBoxes();
    }

    function grabJSONTextBoxes() {

        fetch('assets/js/textbox.json')
            .then(function (response) {return response.json();})
            .then(function (data) {appendData(data);})
            .catch(function (err) {});

        function appendData(data) {
            for (let i = 0; i < data.length; i++) {
                textBoxesFromJSON[i] = document.querySelector(`.textbox-${i + 1}`);
                textBoxesFromJSON[i].innerHTML = data[i].code;
            }
        }
    }

    function divTextbox(i) {
        const divTextbox = document.createElement('div');          // Função geradora <div col> para Caixas de texto
        divTextbox.classList = `textbox-${i} helpcenter-textbox col-md-4`;
        divTextbox.innerHTML = `${i}`;
        divTextbox.addEventListener('click', escreverTextbox);
        return divTextbox
    }

    function escreverTextbox (e) {
        let eTarget = e.target;
        
        // Hotfix para quando o target devolve a <img> ou <i> (quando carregamos nos icons da textboxes)
        if (eTarget.tagName === "IMG" 
        || eTarget.tagName === "I")
        {eTarget = eTarget.parentElement.parentElement};

        // Hotfix para quando o target devolve o título do div (quando carregamos no título da textboxes)
        if (eTarget.classList.contains('novoalerta-titulo')
        || eTarget.classList.contains('novoalerta-contido'))
        {eTarget = eTarget.parentElement};

        // Hotfix para quando o target devolve o wrapper (quando carregamos fora das textboxes)
        if(eTarget.classList.contains('helpcenter-textbox'))
        {eTarget = eTarget.firstChild};

        novoSourceCode = `${cursorPosInfo[1]}${eTarget.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = novoSourceCode;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
        getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
        saveIntoJSON();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Landing page
    window.onload = function () {
        const rng = Math.floor(Math.random() * (3000 - 2500)) + 2500;

        const landingTimer = setTimeout(function () {
            document.querySelector('#landing').classList.add('no-display');
        }, rng);

        return landingTimer;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Event listeners
    document.querySelector('#listas-tabelas-btn').addEventListener('click', modalListasETabelas);
    document.querySelector('#ancora-btn').addEventListener('click', stickyTop);
    document.querySelector('#titulos-ligacoes-btn').addEventListener('click', modalTitulosELigacoes);
    document.querySelector('#botoes-btn').addEventListener('click', modalBotoes);
    document.querySelector('#logos-btn').addEventListener('click', modalIcons);
    document.querySelector('#textbox-btn').addEventListener('click', modalTextbox);

    // Função que atualiza à medida que vamos escrevendo
    textarea.addEventListener('keyup', updateCursorPos);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Debug Tools

        // Mostra target na consola
        document.addEventListener("click", function (e) {
            console.log(e.target);
        });

 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // Paginador (futureproof)
    function newRow(pag) {                                      // função geradora <div row> primeira página
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        newRow.classList.add(`page-${pag}`);
        return newRow
    }

    function newPagiItem(pagi) {
        const newPagiItem = document.createElement('div');
        newPagiItem.classList.add('col');
        newPagiItem.classList.add(`pagi-${pagi}`);
        newPagiItem.innerHTML = `${pagi}`
        return newPagiItem
    }

    
    function newHiddenRow(pag) {                                // função geradora <div row> páginas seguintes
        const newHiddenRow = document.createElement('div');
        newHiddenRow.classList.add('row');
        newHiddenRow.classList.add('no-display');
        newHiddenRow.classList.add(`page-${pag}`);
        return newHiddenRow
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
mixWrapper();