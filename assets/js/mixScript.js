/************************************/
/* helpcenterplus                   */
/* mambosinfinitos, 2022            */
/************************************/


function mixWrapper() {

    // Variáveis globais
    const modernTableStyle = '<style>.cabecalho-table-modern{border-radius:20px;border:solid 2px #fff;background-color:#3fa8f6;color:#fff;padding:4px 20px;font-size:20px}.td-table-modern{border-radius:20px;border:solid 2px #fff;background-color:#f2f2f2;color:#000;padding:5px 20px}</style>'

    // textarea cabeçalho
    const textarea = document.querySelector('textarea');

    // div modal cabeçalho
    const modaldiv = document.querySelector('#modal');

    // div principal do helpcenter preview 
    const maindiv = document.querySelector('#main-div');

    /** 
     * arrays a ser utilizados para guardar os slices
     * das textareas, aquando da introdução de elementos
     * ([0] = texto até ao cursor | [1] = texto a partir do cursos)
    */
    let cursorPosInfo = ['', ''];
    let modalTextareaPos = ['', ''];
    let collapsablesArray = [];

    // variável com o valor da última textarea selecionada
    let activeTextarea = '';

    // variável com o valor da última checkbox (hilite.me) selecionada
    let codetype = 'vbnet'
    let tipoTabela = 'normal-table'

    // Variáveis globais [preciso de aprender async(?) para guardar nas globais o valor dos length dos json]   
    const numeroImagens = 70;
    const numeroTextBoxes = 5;
    const numeroButoes = 12;

    // Declaração das variáveis a ser utilizadas aquando da leitura dos JSON
    const iconsFromJSON = [];
    const textBoxesFromJSON = [];
    const buttonsFromJSON = [];

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Collapsables

    // Variáveis globais
    const colapMainDiv = document.querySelector('#colapsables-modal');
    const botaoVistaColap = document.querySelector('#colap-btn');
    botaoVistaColap.addEventListener('click', toogleColapsablesModal);

    // Função ao carregar no botão Vista Colapsavel    
    function toogleColapsablesModal() {
        const helpcenterPreviewWrapper = document.querySelector('.hc-preview');

        //babyproof - reset à activetextarea
        activeTextarea = '';

        if (colapMainDiv.classList.contains('no-display') === true) {
            botaoVistaColap.classList.replace('btn-light', 'btn-info');
            colapMainDiv.classList.remove('no-display');
            helpcenterPreviewWrapper.classList.add('no-display');
            modalColap();
        } else {
            botaoVistaColap.classList.replace('btn-info', 'btn-light');        // a ordem invertida do getcollaps é importante, não sei porque nao me lembra
            modalColap();
            colapMainDiv.classList.add('no-display');
            helpcenterPreviewWrapper.classList.remove('no-display');
        }

    }

    // Função para mostrar a modal dos colapsáveis
    function modalColap() {

        // Array com todos os colapsáveis do tópico
        collapsablesArray = document.querySelectorAll('.row .seccao-phcgo');

        // Limpa a modal
        colapMainDiv.innerHTML = '';

        // Wrapper (row)
        let colapWrapper = colapMainDiv.appendChild(newRow(1));

        if (collapsablesArray.length !== 0) {
            // Loop para cada item do Array
            for (i = 1; i <= collapsablesArray.length; i++) {

                // Row 1
                let row = colapWrapper.appendChild(newColapRow());
                (i % 2 === 0) ? row.classList.add('par') : row.classList.add('impar');
                let wrapperLeft = row.appendChild(newColapInput(i));
                let wrapperRight = row.appendChild(newColapDisplay(i));

                // Col 1 (inputs)

                // Input 1
                wrapperLeft.appendChild(newSpan('colap-id', 'ID do colapsável (minúsculas, sem acentuação, sem espaçamento)'));
                let idInput = wrapperLeft.appendChild(newColapIDInput(i));
                idInput.value = collapsablesArray[i - 1].nextElementSibling.id;
                idInput.addEventListener('keyup', updateColapPreviewByID)

                // Input 2
                wrapperLeft.appendChild(newSpan('colap-h2', 'Título do colapsável'));
                let h2Input = wrapperLeft.appendChild(newColapH2Input(i));
                let h2Trim = collapsablesArray[i - 1].innerText.trim().split('	');     // trim para ficar direitinho
                h2Input.value = h2Trim[0];
                h2Input.addEventListener('keyup', updateColapHeading)

                //hotfix, estava a aparecer no input dos novos manuais.;
                while (h2Input.value.includes('Abrir/Fechar'))
                    h2Input.value = h2Input.value.replace('Abrir/Fechar', '');

                // Input 3
                wrapperLeft.appendChild(newSpan('colap-body', 'Corpo do colapsável'));
                let bodyInput = wrapperLeft.appendChild(newColapBodyInput(i));
                bodyInput.addEventListener('keyup', colapTextAreaEvents)
                bodyInput.addEventListener('click', colapTextAreaEvents)


                let bodyTempInput = collapsablesArray[i - 1].nextElementSibling.innerHTML;
                // Remove o cursor laranja ao passar para os collaps
                bodyInput.value = String(bodyTempInput).replace('<span id="pulse">|</span>', '');

                // Button
                let updateCollaps = wrapperLeft.appendChild(document.createElement('button'));
                updateCollaps.id = `colap-save-btn-${i}`;
                updateCollaps.innerHTML = `<i class="lni lni-save"></i> Guardar alterações`
                updateCollaps.classList = 'btn btn-success no-display'
                updateCollaps.addEventListener('click', gerarColapsaveis)

                // filler div para padding
                wrapperLeft.appendChild(document.createElement('div'));
                wrapperLeft.lastChild.classList = 'save-padding';

                // Col 2 (display)
                wrapperRight.appendChild(newColapH2Display(i));
                wrapperRight.lastChild.innerText = h2Trim[0];

                //hotfix, estava a aparecer "Abrir/Fechar" várias vezes nos preview
                while (wrapperRight.lastChild.innerText.includes('Abrir/Fechar')) {
                    wrapperRight.lastChild.innerText = wrapperRight.lastChild.innerText.replace('Abrir/Fechar', '');
                }

                wrapperRight.appendChild(newColapBodyDisplay(i));
                wrapperRight.lastChild.innerHTML = collapsablesArray[i - 1].nextElementSibling.innerHTML;
            }

            // adicionar novo collap
            row = colapWrapper.appendChild(newColapRow());

            col = row.appendChild(document.createElement('div'));
            col.id = 'add-new-collap'
            const newCollapBtn = col.appendChild(document.createElement('button'));
            newCollapBtn.classList = "btn btn-info"
            newCollapBtn.innerHTML = '<i class="lni lni-circle-plus"></i>&nbsp;&nbsp;Adicionar um novo colapsável'
            newCollapBtn.addEventListener('click', novoColapsavel)
            const scrollToTop = col.appendChild(document.createElement('button'));
            scrollToTop.classList = "btn btn-info"
            scrollToTop.innerHTML = '<i class="lni lni-arrow-up-circle"></i>&nbsp;&nbsp;Voltar ao início'
            scrollToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); })

        } else {
            let geradorColapWrapper = colapMainDiv.appendChild(document.createElement('div'));
            geradorColapWrapper.id = 'gerador-colaps-wrapper';
            geradorColapWrapper.classList = 'row'

            let col = geradorColapWrapper.appendChild(document.createElement('div'));
            col.classList = 'col-md-12 gerador-colaps-1'
            col.innerHTML = 'Não foi encontrado nenhum colapsável.'


            geradornewCollapBtn = geradorColapWrapper.appendChild(document.createElement('button'));
            geradornewCollapBtn.classList = "btn btn-info"
            geradornewCollapBtn.innerHTML = '<i class="lni lni-circle-plus"></i>&nbsp;&nbsp;Adicionar um novo colapsável'
            geradornewCollapBtn.addEventListener('click', novoColapsavel)

            col.appendChild(document.createElement('div'));

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
        let cursorModalPos = getColapCursorPos(e);

        // divide o input em duas partes (até ao cursor, e após o curos)
        let inputColapTextStrings = [];
        inputColapTextStrings.push([inputText.slice(0, cursorModalPos)]);
        inputColapTextStrings.push([inputText.slice(cursorModalPos)]);

        // introduz o cursor laranja
        let inputColapTextWithCursor = `${inputColapTextStrings[0]}<span id="pulse">|</span>${inputColapTextStrings[1]}`;

        modalTextareaPos[0] = inputColapTextStrings[0];
        modalTextareaPos[1] = inputColapTextStrings[1];

        // Preview do input
        let inputPreview = e.target.parentElement.nextElementSibling.children[0];
        inputPreview.innerHTML = inputColapTextWithCursor;

        // Mostra o save button
        const saveButton = e.target.nextElementSibling.nextElementSibling.nextElementSibling
        saveButton.classList.remove('no-display');
    }

    function colapTextAreaEvents(e) {
        // Atualiza a active textarea
        activeTextarea = e.target;

        let inputText = activeTextarea.value;
        let cursorModalPos = getColapCursorPos(e);

        // divide o input em duas partes (até ao cursor, e após o curos)
        let inputColapTextStrings = [];
        inputColapTextStrings.push([inputText.slice(0, cursorModalPos)]);
        inputColapTextStrings.push([inputText.slice(cursorModalPos)]);

        // introduz o cursor laranja
        let inputColapTextWithCursor = `${inputColapTextStrings[0]}<span id="pulse">|</span>${inputColapTextStrings[1]}`;

        modalTextareaPos[0] = inputColapTextStrings[0];
        modalTextareaPos[1] = inputColapTextStrings[1];

        // Preview do input
        let inputPreview = e.target.parentElement.nextElementSibling.children[1];
        inputPreview.innerHTML = inputColapTextWithCursor;

        // Mostra o save button
        const saveButton = e.target.nextElementSibling
        saveButton.classList.remove('no-display');
    }

    function gerarColapsaveis() {

        const collapsablesArray = document.querySelectorAll('.row .seccao-phcgo');

        let newCollapFinal = '';
        let newCollapseArray = [[], [], []];

        for (i = 1; i <= collapsablesArray.length; i++) {

            newCollapseArray[0][i - 1] = document.querySelector(`.colap-input-id-${i}`).value;
            newCollapseArray[1][i - 1] = document.querySelector(`.colap-input-h2-${i}`).value;
            newCollapseArray[2][i - 1] = document.querySelector(`.colap-input-body-${i}`).value;

            // wrapper do collapsavel
            let newCollap = document.createElement('div');
            newCollap.classList = 'row seccao-phcgo';

            // título
            let newCollapColTitulo = newCollap.appendChild(document.createElement('div'))
            newCollapColTitulo.classList = 'col-xs-8'

            //link do h2
            let h2Link = newCollapColTitulo.appendChild(document.createElement('a'));
            h2Link.setAttribute('href', `#${newCollapseArray[0][i - 1]}`)
            h2Link.setAttribute('data-toggle', 'collapse');

            //h2
            let newtituloH2 = h2Link.appendChild(document.createElement('h2'))
            newtituloH2.classList = 'manuais'
            newtituloH2.innerText = newCollapseArray[1][i - 1]

            //abrir/fechar
            let newCollapCol1 = newCollap.appendChild(document.createElement('div'))
            newCollapCol1.classList = 'col-xs-4 text-right'

            //link do abrir/fechar
            let link = newCollapCol1.appendChild(document.createElement('a'));
            link.setAttribute('href', `#${newCollapseArray[0][i - 1]}`)
            link.setAttribute('data-toggle', "collapse")
            link.innerText = 'Abrir/Fechar'

            // wrapper do conteudo
            let newCollapConteudo = document.createElement('div');
            newCollapConteudo.classList = 'collapse multi-collapse'
            newCollapConteudo.id = newCollapseArray[0][i - 1]
            newCollapConteudo.innerHTML = newCollapseArray[2][i - 1]
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
        maindiv.innerHTML = fixArtigosRelacionadosLogo(newCollapFinal);
        modalColap();
        saveIntoJSON();

    }

    function newColapRow() { // wrapper row
        const newColapRow = document.createElement('div');
        newColapRow.classList.add('row');
        return newColapRow
    }

    function newColapInput() { // wrapper esquerdo
        const newColapInput = document.createElement('div');
        newColapInput.classList = 'col-md-5 inputs-wrapper';
        return newColapInput
    }

    function newColapDisplay() { // wrapper direito
        const newColapDisplay = document.createElement('div');
        newColapDisplay.classList.add('col-md-7');
        newColapDisplay.style.paddingRight = '0px'
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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Função para mostrar a modal de Listas e Tabelas
    function modalListasETabelas() {

        // Limpar a modal
        modaldiv.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Anexar à modal a primeira página (atualmente não existe segunda página)
        let primeiraPagina = modaldiv.appendChild(newRow(pag));

        // Wrapper da secção das listas
        const novaListaWrapper = document.createElement('div');
        novaListaWrapper.classList.add('col-md-5');
        novaListaWrapper.id = 'listas-wrapper';

        // Row 0
        let row = novaListaWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')
        row.id = 'header-listas'
        row.innerHTML = '<i class="lni lni-hammer"></i>&nbsp;&nbsp;Gerador de listas'

        // Row 1
        row = novaListaWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')

        // Col 1
        let col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-8')

        // Span Tipo Lista
        let tipoListaSpan = col.appendChild(document.createElement('span'));
        tipoListaSpan.innerText = 'Tipo de lista';
        tipoListaSpan.id = 'tipo-lista-span';

        // Col 2
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-4')

        // Span "Número de Itens"
        let numItensSpan = col.appendChild(document.createElement('span'));
        numItensSpan.innerText = '# Itens';
        numItensSpan.id = 'num-itens-span';

        // Row 2
        row = novaListaWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')

        // Col 1
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-8')

        // Dropdown para "Tipo de lista"
        let tipoListaDropdown = col.appendChild(document.createElement('select'));
        tipoListaDropdown.id = 'tipo-lista-dropdown'
        tipoListaDropdown.addEventListener('change', previewLista)

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

        // Col 2 (Filler)
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-2')

        // Col 3
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-2')

        // Input "Número de Itens"
        let numItensInput = col.appendChild(document.createElement('input'));
        numItensInput.id = 'num-itens-input'
        numItensInput.setAttribute('type', 'number')

        // Row 3 
        row = novaListaWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')

        // Col 1 (pre-view da lista)
        col = row.appendChild(document.createElement('div'));
        col.classList = 'col-md-12'
        col.id = 'preview-list-row'

        // Preview-default li
        let previewList = col.appendChild(document.createElement('ul'));
        previewList.style.listStylePosition = 'inside';
        for (i = 1; i <= 3; i++) {
            previewList.appendChild(document.createElement('li'));
            previewList.lastChild.innerHTML = `<b>Item ${i}:</b> Lorem Ipsum`;
        }

        // Row 4
        row = novaListaWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')

        // Col Button criar lista
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-12')
        col.id = 'cria-lista-btn-div'

        // Button "Criar lista"
        let criarListaButton = col.appendChild(document.createElement('button'));
        criarListaButton.classList = 'btn btn-success';
        criarListaButton.innerHTML = '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Criar lista'
        criarListaButton.addEventListener('click', escreveLista)

        // Anexar o wrapper da secção de listas à primeiraRow
        primeiraPagina.appendChild(novaListaWrapper);

        // Wrapper da secção das tabelas
        const novaTabelaWrapper = document.createElement('div');
        novaTabelaWrapper.classList.add('col-md-7');
        novaTabelaWrapper.id = 'tabelas-wrapper';

        // Row 0
        row = novaTabelaWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')
        row.id = 'header-tabelas'
        row.innerHTML = '<i class="lni lni-hammer"></i>&nbsp;&nbsp;Gerador de tabelas'

        // Row 1
        row = novaTabelaWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')

        // Col 1 (Filler)
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-1')

        // Col 2
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-3')

        // Span 'Número de Linhas'
        let numLinhasSpan = col.appendChild(document.createElement('span'));
        numLinhasSpan.id = 'num-linhas-span'
        numLinhasSpan.innerText = '# de linhas';

        // Input 'Número de Linhas'
        let numLinhasInput = col.appendChild(document.createElement('input'));
        numLinhasInput.id = 'num-linhas-input'
        numLinhasInput.setAttribute('type', 'number')

        // Col 3
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-3')

        // Span 'Número de Colunas'
        let numColunasSpan = col.appendChild(document.createElement('span'));
        numColunasSpan.id = 'num-colunas-span'
        numColunasSpan.innerText = '# de colunas';

        // Input 'Número de Colunas'
        let numColunasInput = col.appendChild(document.createElement('input'));
        numColunasInput.id = 'num-colunas-input';
        numColunasInput.setAttribute('type', 'number')

        // Col 4 (Filler)
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-1')

        // Col 5
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-3')

        // Span 'Cabeçalho?'
        let cabecalhoSpan = col.appendChild(document.createElement('span'));
        cabecalhoSpan.innerText = 'Cabeçalho?';
        cabecalhoSpan.id = 'cabecalho-span'

        // Checkbox 'Cabeçalho?'
        let cabecalhoCheckbox = col.appendChild(document.createElement('input'));
        cabecalhoCheckbox.setAttribute('type', 'checkbox');
        cabecalhoCheckbox.setAttribute('checked', 'true'); // Ativa a checkbox por omissão
        cabecalhoCheckbox.id = 'cabecalho-checkbox';

        // Col 6 (Filler)
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-1')

        // Row 2
        row = novaTabelaWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')

        // Col 2
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-6')
        col.id = 'cria-tabela-checkbox-wrapper'

        // Span 'Cabeçalho?'
        let checkboxLabel1 = col.appendChild(document.createElement('span'));
        checkboxLabel1.innerText = 'Normal';

        const checkbox1 = col.appendChild(document.createElement('input'));
        checkbox1.setAttribute('type', 'checkbox');
        checkbox1.setAttribute('checked', 'true'); // Ativa a checkbox por omissão
        checkbox1.id = 'normal-table'
        checkbox1.addEventListener('click',updateTableType)

        let checkboxLabel2 = col.appendChild(document.createElement('span'));
        checkboxLabel2.innerText = 'Morderna';

        const checkbox2 = col.appendChild(document.createElement('input'));
        checkbox2.setAttribute('type', 'checkbox');
        checkbox2.id = 'modern-table'
        checkbox2.addEventListener('click',updateTableType)

        // Col 2
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-6')
        col.id = 'cria-tabela-btn-div'

        // Button 'Criar tabela'
        let criarCabecalho = col.appendChild(document.createElement('button'));
        criarCabecalho.classList.add('btn');
        criarCabecalho.classList.add('btn-success');
        criarCabecalho.innerHTML = '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Criar tabela';
        criarCabecalho.addEventListener('click', escreverTabela);

        //wrapper novo separador
        const novoSeparadorWrapper = row.appendChild(document.createElement('div'));
        novoSeparadorWrapper.classList = 'col-md-12 novo-separador'
        novoSeparadorWrapper.appendChild(document.createElement('span'));
        novoSeparadorWrapper.lastChild.innerHTML = '<i class="lni lni-code"></i> Separador horizontal<br>'

        // Button para adicionar separador horizontal (hr)
        const novaQuebraBtn = novoSeparadorWrapper.appendChild(document.createElement('button'));
        novaQuebraBtn.innerHTML = '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir separador horizontal';
        novaQuebraBtn.classList = 'btn btn-success';
        novaQuebraBtn.id = 'nova-quebra-btn';
        novaQuebraBtn.addEventListener('click', escreverQuebra);

        // Anexar o wrapper da secção de ligações à primeira row 
        primeiraPagina.appendChild(novaTabelaWrapper);
    }

    // Função para adicionar uma lista ao código do tópico
    function escreveLista() {

        // Obter os parâmetros para a lista
        const tipo = document.querySelector('#tipo-lista-dropdown').value;
        const n = document.querySelector('#num-itens-input').value;

        // Babyproof
        if ((isNaN(n)) === true
            || n <= 0) { alert('O valor para o número de itens não é válido (só aceito números positivos, acima de zero).'); return }

        // Declarar variávis para o Switch
        let novaLista = '';

        switch (tipo) {

            // Opção 1
            case 'ul':
                novaLista = document.createElement('ul');
                novaLista.style.listStylePosition = 'inside';
                for (i = 1; i <= n; i++) {
                    let novoItem = novaLista.appendChild(document.createElement('li'));
                    novoItem.innerHTML = `<b>Item ${i}:</b> Lorem ipsum`;
                }
                novaLista = (novaLista.outerHTML.toString().replaceAll('<li><b>', "\n" + '<li><b>'));
                escreveNaTextareaGeradores(novaLista);
                break;

            // Opção 2
            case 'ol-1':
                novaLista = document.createElement('ol');
                novaLista.setAttribute('type', '1');
                novaLista.style.listStylePosition = "inside";
                for (i = 1; i <= n; i++) {
                    novaLista.appendChild(document.createElement('li'));
                    novaLista.lastChild.innerHTML = `<b>Item ${i}:</b> Lorem ipsum`;
                }
                novaLista = (novaLista.outerHTML.toString().replaceAll('<li><b>', "\n" + '<li><b>'));
                escreveNaTextareaGeradores(novaLista);
                break;

            // Opção 3
            case 'ol-a':
                novaLista = document.createElement('ol');
                novaLista.setAttribute('type', 'a');
                novaLista.style.listStylePosition = 'inside';
                for (i = 1; i <= n; i++) {
                    novaLista.appendChild(document.createElement('li'));
                    novaLista.lastChild.innerHTML = `<b>Item ${i}:</b> Lorem ipsum`;
                }
                novaLista = (novaLista.outerHTML.toString().replaceAll('<li><b>', "\n" + '<li><b>'));
                escreveNaTextareaGeradores(novaLista);
                break;
        }

    }

    // Função para adicionar uma tabela ao tópico de manual
    function escreverTabela() {

        // Obter os parâmetros para a ligação
        const numLinhas = document.querySelector('#num-linhas-input').value;
        const numColunas = document.querySelector('#num-colunas-input').value;
        const cabecalho = document.querySelector('#cabecalho-checkbox').checked;

        // Babyproof
        if ((isNaN(numLinhas)) === true
            || numLinhas <= 0) { alert('O valor para o número de linhas não é válido (só aceito números positivos, acima de zero).'); return }
        if ((isNaN(numColunas)) === true
            || numColunas <= 0) { alert('O valor para o número de colunas não é válido (só aceito números positivos, acima de zero).'); return }

        // <table>
        let novaTabela = document.createElement('table');
        novaTabela.classList.add('phcgo-table');
        novaTabela.style.display = 'flex';
        novaTabela.style.justifyContent = 'center';

        // <tbody>
        const tBody = novaTabela.appendChild(document.createElement('tbody'));

        switch (tipoTabela) {
            case 'normal-table':

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
            break
            case 'modern-table':

                // Se a checkbox estiver a true, é também adicionado um cabeçalho à tabela
                if (cabecalho === true) {
                    const novoCabecalho = document.createElement('tr');
                    for (i = 1; i <= numColunas; i++) {
                        let novaColuna = novoCabecalho.appendChild(document.createElement('td'));
                        novaColuna.classList.add('cabecalho-table-modern')
                        novaColuna.innerText = `Cabeçalho ${i}`;
                    }
                    tBody.appendChild(novoCabecalho);
                }

                // adiciona as restantes linhas á tabela
                for (iLinhas = 1; iLinhas <= numLinhas; iLinhas++) {
                    const novaLinha = document.createElement('tr');
                    for (iColunas = 1; iColunas <= numColunas; iColunas++) {
                        let novaColuna = novaLinha.appendChild(document.createElement('td'));
                        novaColuna.classList.add('td-table-modern')
                        novaColuna.innerText = `Linha ${iLinhas} Coluna ${iColunas}`;
                    }
                    tBody.appendChild(novaLinha);
                }
                break
        }

        // para tornar o código gerado mais clean
        novaTabela = (novaTabela.outerHTML.toString().replaceAll('<tr>', "\n" + '<tr>'));
        novaTabela = (novaTabela.toString().replaceAll('</td><td>', '</td>' + "\n" + '<td>'));
        novaTabela.replaceAll('</tbody>', "\n" + '</tbody>');
        novaTabela = ('<!-- Estilos necessários para a tabela moderna -->'+"\n"+modernTableStyle+"\n"+novaTabela)
        escreveNaTextareaGeradores(novaTabela);
    }

    // // Função para mostrar a moda de Títulos e Ligações
    function modalTitulosELigacoes() {

        // Limpar a modal
        modaldiv.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Anexar à modal a primeira página (atualmente não existe segunda página)
        let primeiraPagina = modaldiv.appendChild(newRow(pag));

        // Wrapper da secção da esquerda
        const novoVariosWrapperLeft = primeiraPagina.appendChild(document.createElement('div'));
        novoVariosWrapperLeft.classList.add('col-md-8');
        novoVariosWrapperLeft.id = 'left-wrapper';

        // Wrapper gerador titulos
        const geradorTitulosWrapper = novoVariosWrapperLeft.appendChild(document.createElement('div'));
        geradorTitulosWrapper.classList.add('row')
        geradorTitulosWrapper.id = 'gerador-titulos'
        geradorTitulosWrapper.innerHTML = '<i class="lni lni-hammer"></i>&nbsp;&nbsp;Gerador de títulos'

        // Row 1
        row = geradorTitulosWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')

        // Col 0 (filler)
        let col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-1')

        // Col 1
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-11')

        // Span Tipo Lista
        let tipoListaSpan = col.appendChild(document.createElement('span'));
        tipoListaSpan.innerText = 'Tipo de título:';
        tipoListaSpan.id = 'tipo-lista-span';

        // Row 2 
        row = geradorTitulosWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')

        // Col 0 (filler)   
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-1')

        // Col 1
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-7')

        // Dropdown para "Tipo de título"
        let tipoTituloDropdown = col.appendChild(document.createElement('select'));
        tipoTituloDropdown.id = 'tipo-titulo-dropdown'
        tipoTituloDropdown.addEventListener('change', previewTitulo)

        // Opção 1    
        tipoTituloDropdown.appendChild(document.createElement('option'));
        tipoTituloDropdown.lastChild.value = 'default1' // Valor a se passado para a função construtora de lista
        tipoTituloDropdown.lastChild.innerHTML = '&nbsp;Título H1';
        // Opção 2
        tipoTituloDropdown.appendChild(document.createElement('option'));
        tipoTituloDropdown.lastChild.value = 'default2'
        tipoTituloDropdown.lastChild.innerHTML = '&nbsp;Título H2';
        // Opção 3
        tipoTituloDropdown.appendChild(document.createElement('option'));
        tipoTituloDropdown.lastChild.value = 'default3'
        tipoTituloDropdown.lastChild.innerHTML = '&nbsp;Título H3';
        // Opção 4
        tipoTituloDropdown.appendChild(document.createElement('option'));
        tipoTituloDropdown.lastChild.value = 'old1' // Valor a se passado para a função construtora de lista
        tipoTituloDropdown.lastChild.innerHTML = '&nbsp;Título H1 (antigo)';
        // Opção 5
        tipoTituloDropdown.appendChild(document.createElement('option'));
        tipoTituloDropdown.lastChild.value = 'old2'
        tipoTituloDropdown.lastChild.innerHTML = '&nbsp;Título H2 (antigo)';
        // Opção 6
        tipoTituloDropdown.appendChild(document.createElement('option'));
        tipoTituloDropdown.lastChild.value = 'old3'
        tipoTituloDropdown.lastChild.innerHTML = '&nbsp;Título H3 (antigo)';

        // Col 2 (filler)
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-1')

        // Col Button criar título
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-2')
        col.id = 'cria-lista-btn-div'

        // Button "Criar título"
        let criarListaButton = col.appendChild(document.createElement('button'));
        criarListaButton.classList = 'btn btn-success';
        criarListaButton.innerHTML = '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Criar título'
        criarListaButton.addEventListener('click', escreveTitulo)

        // Col 4 (filler)
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-1')

        // Row 3 
        row = geradorTitulosWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')

        // Col 1 (pre-view do título)
        col = row.appendChild(document.createElement('div'));
        col.classList = 'col-md-12'
        col.id = 'preview-heading-row'

        // Filler Row
        row = novoVariosWrapperLeft.appendChild(document.createElement('div'));
        row.classList = ('row title-link-filler')

        // Wrapper da secção das ligações
        const novaLigacaoWrapper = novoVariosWrapperLeft.appendChild(document.createElement('div'));
        novaLigacaoWrapper.classList = 'row gerador-links-wrapper'

        // Col 0
        col = novaLigacaoWrapper.appendChild(document.createElement('div'));
        col.classList.add('col-md-12')
        col.innerHTML = '<i class="lni lni-hammer"></i>&nbsp;&nbsp;Gerador de links'

        // Col 1
        col = novaLigacaoWrapper.appendChild(document.createElement('div'));
        col.classList = 'col-md-3 text-left'

        // Span 'Descrição da ligação'
        let spanDescricao = col.appendChild(document.createElement('span'));
        spanDescricao.innerText = 'Descrição da ligação:'
        spanDescricao.id = 'nome-span';

        // Col 2
        col = novaLigacaoWrapper.appendChild(document.createElement('div'));
        col.classList.add('col-md-6')

        // Input 'Descrição da ligação'
        let inputDescricao = col.appendChild(document.createElement('input'));
        inputDescricao.id = 'nome-input';

        // Col 3
        col = novaLigacaoWrapper.appendChild(document.createElement('div'));
        col.classList = 'col-md-2 nova-ligacao-btn-col'

        // Button Criar ligação
        let criarLigacao = col.appendChild(document.createElement('button'));
        criarLigacao.classList = 'btn btn-success';
        criarLigacao.innerHTML = '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Criar ligação';
        criarLigacao.addEventListener('click', escreverLigacao);

        // Col 4
        col = novaLigacaoWrapper.appendChild(document.createElement('div'));
        col.classList = 'col-md-3 text-left'

        // Span 'URL'
        let spanURL = col.appendChild(document.createElement('span'));
        spanURL.innerText = 'URL da ligação:'
        spanURL.id = 'link-span';

        // Col 5
        col = novaLigacaoWrapper.appendChild(document.createElement('div'));
        col.classList.add('col-md-6')

        // Input 'URL'
        let inputURL = col.appendChild(document.createElement('input'));
        inputURL.id = 'link-input';

        // Wrapper da secção dos extras
        const novoVariosWrapperRight = primeiraPagina.appendChild(document.createElement('div'));
        novoVariosWrapperRight.classList.add('col-md-4');
        novoVariosWrapperRight.id = 'extras-wrapper';

        // Row 0
        row = novoVariosWrapperRight.appendChild(document.createElement('div'));
        row.classList.add('row')
        row.id = 'header-outros'
        row.innerHTML = '<i class="lni lni-code"></i> Código Hilite.me'

        // Row 1
        row = novoVariosWrapperRight.appendChild(document.createElement('div'));
        row.classList.add('row')

        // Wrapper Hilite.me
        const hiliteWrapper = row.appendChild(document.createElement('div'));
        hiliteWrapper.classList.add('col-md-12')

        // Button para formatar hilite.me
        const hiliteTextarea = hiliteWrapper.appendChild(document.createElement('textarea'));
        hiliteTextarea.id = 'hilite-textarea'

        const novaHiliteCheckboxesRow = hiliteWrapper.appendChild(document.createElement('div'));
        novaHiliteCheckboxesRow.classList = 'row'
        novaHiliteCheckboxesRow.id = 'hilite-checkboxes-row'

        let miniWrapper1 = novaHiliteCheckboxesRow.appendChild(document.createElement('div'))
        miniWrapper1.classList = 'col-md-6'
        miniWrapper1.appendChild(document.createElement('span'));
        miniWrapper1.lastChild.innerHTML = 'VB.NET&nbsp;&nbsp;'

        miniWrapper1.appendChild(document.createElement('input'));
        miniWrapper1.lastChild.type = 'checkbox'
        miniWrapper1.lastChild.setAttribute('checked', 'true');
        miniWrapper1.lastChild.id = 'vbnet'
        miniWrapper1.checked = true;
        miniWrapper1.addEventListener('change', updateCodeType)

        let miniWrapper2 = novaHiliteCheckboxesRow.appendChild(document.createElement('div'))
        miniWrapper2.classList = 'col-md-6'
        miniWrapper2.appendChild(document.createElement('span'));
        miniWrapper2.lastChild.innerHTML = 'TypeScript&nbsp;&nbsp;'
        miniWrapper2.appendChild(document.createElement('input'));
        miniWrapper2.lastChild.type = 'checkbox'
        miniWrapper2.lastChild.id = 'ts'
        miniWrapper2.addEventListener('change', updateCodeType)

        const novaHiliteBtn = hiliteWrapper.appendChild(document.createElement('button'));
        novaHiliteBtn.innerHTML = '<i class="lni lni-code"></i>&nbsp;&nbsp;Gerar código hilite.me';
        novaHiliteBtn.classList = 'btn btn-warning';
        novaHiliteBtn.id = 'novo-hilitecode-btn';
        novaHiliteBtn.addEventListener('click', hiliteAPI);
    }

    // Função para adicionar uma ligação ao código do tópico
    function escreverLigacao() {

        // Obter os parâmetros para a ligação
        const nome = document.querySelector('#nome-input').value;
        const link = document.querySelector('#link-input').value;

        // babyproof
        if (link.slice(0, 4) !== 'http') {
            alert('A ligação tem de começar por http ou https (tudo em minúsculas).')
            return
        }
        const novaLigacao = document.createElement('a');
        novaLigacao.classList.add('manuais');
        novaLigacao.setAttribute('href', link);
        novaLigacao.setAttribute('target', '_blank');
        novaLigacao.innerText = nome;

        escreveNaTextarea(novaLigacao);
    }

    // Função para adicionar um seprador horizontal <hr> código do tópico
    function escreverQuebra() {
        const novoSeparador = document.createElement('hr');
        novoSeparador.style.borderTop = '3px solid #eee';
        escreveNaTextarea(novoSeparador);
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
        newMediumItem.classList = `botao-${i} botao-label col-md-3`;
        newMediumItem.innerHTML = `${i}`;
        newMediumItem.addEventListener('click', escreverBotao)
        return newMediumItem
    }

    // Função para adicionar um botão ao código do tópico
    function escreverBotao(e) {
        let eTarget = e.target;

        // HotFix para quando o target não é igual ao botão
        if (eTarget.classList.length > 0) { eTarget = eTarget.firstChild };

        escreveNaTextarea(eTarget);
    }

    // Função para substituir os valores dos botoes, de acordo com o JSON
    function grabJSONButtons() {

        fetch('assets/js/buttons.json')
            .then(function (response) { return response.json(); })
            .then(function (data) { appendData(data); })
            .catch(function (err) { })

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
            }

            else { divSegundaRow.appendChild(divIcon(i)); }

        }
        grabJSONIcons();
    }

    function divIcon(i) {
        const divIcon = document.createElement('div');
        divIcon.classList = `icon-${i} col-md-1 phcgo-icon`;
        divIcon.innerHTML = `${i}`;
        divIcon.addEventListener('click', escreverIcon);
        return divIcon
    }

    function escreverIcon(e) {
        let eTarget = e.target;

        // HotFix para quando o target não é igual ao icons
        if (eTarget.classList.contains('phcgo-icon')) { eTarget = eTarget.firstChild };

        escreveNaTextarea(eTarget);
    }

    function grabJSONIcons() {

        fetch('assets/js/imagens.json')
            .then(function (response) { return response.json(); })
            .then(function (data) { appendData(data); })
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
        grabJSONTextBoxes();
    }

    function grabJSONTextBoxes() {

        fetch('assets/js/textbox.json')
            .then(function (response) { return response.json(); })
            .then(function (data) { appendData(data); })
            .catch(function (err) { });

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

    function escreverTextbox(e) {
        let eTarget = e.target;

        // Hotfix para quando o target devolve a <img> ou <i> (quando carregamos nos icons da textboxes)
        if (eTarget.tagName === "IMG"
            || eTarget.tagName === "I") { eTarget = eTarget.parentElement.parentElement };

        // Hotfix para quando o target devolve o título do div (quando carregamos no título da textboxes)
        if (eTarget.classList.contains('novoalerta-titulo')
            || eTarget.classList.contains('novoalerta-contido')) { eTarget = eTarget.parentElement };

        // Hotfix para quando o target devolve o wrapper (quando carregamos fora das textboxes)
        if (eTarget.classList.contains('helpcenter-textbox')) { eTarget = eTarget.firstChild };

        eTarget = eTarget.outerHTML.toString().replace('<div class="novoalerta-titulo">', '<div class="novoalerta-titulo">' + "\n")
        eTarget = eTarget.toString().replace('<br>', '<br>' + "\n")
        eTarget = eTarget.toString().replace('<ul>', '<ul>' + "\n")
        eTarget = eTarget.toString().replace('</li>', '</li>' + "\n")

        escreveNaTextareaGeradores(eTarget);
        // Hotfix para corrigir a text-box dos tópicos relacionados

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Extras 

    // Landing page
    window.onload = function () {
        const rng = Math.floor(Math.random() * (3000 - 2500)) + 2500;

        const landingTimer = setTimeout(function () {

            // esconde o loading
            document.querySelector('#landing').classList.add('no-display');

            // mostras as sections
            const allSections = [];
            allSections.push(document.querySelector('.sticky-top'));
            allSections.push(document.querySelector('.display-preview'));
            for (i = 0; i < allSections.length; i++) {
                allSections[i].classList.remove('no-display');
            }
        }, rng);

        return landingTimer;
    }

    // Função para guardar na cache do browser o Source Code do tópico (e respetivas alterações)
    function saveIntoJSON() {
        let textarea2JSON = JSON.stringify(textarea.value);
        localStorage.setItem('textarea', textarea2JSON);
    }

    /**
    * Função para alterar o código do preview para apontar para a imagem local.
    * O código da textarea não é alterado, para manter compatibilidade com o HelpCenter
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

    function getColapCursorPos(e) {
        let eTarget = e.target;
        let cursorColapPos = eTarget.selectionStart;
        return cursorColapPos
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
    document.addEventListener("keyup", function (e) {
        if (e.target.tagName === 'TEXTAREA' && e.key === 'Enter') {
            escreveNaTextarea(document.createElement('br'));
        }
    })

    // função para atualizar o preview com o cursor laranja
    function updatePreviews(e) {
        activeTextarea = e.target;
        let inputText = textarea.value;
        let cursorPos = getCursorPos(e);

        // divide o tópico em duas partes (até ao cursor, e após o curos)
        let inputTextString1 = inputText.slice(0, cursorPos);
        let inputTextString2 = inputText.slice(cursorPos);


        // introduz o cursor laranja
        let inputTextWithCursor = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;

        // guarda a posição do cursor 
        cursorPosInfo[0] = inputTextString1;
        cursorPosInfo[1] = inputTextString2;

        // atualiza o preview
        maindiv.innerHTML = inputTextWithCursor;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(maindiv.innerHTML);

        modalColap();
        saveIntoJSON();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Event listeners
    document.querySelector('#listas-tabelas-btn').addEventListener('click', modalListasETabelas);
    document.querySelector('#ancora-btn').addEventListener('click', stickyTop);
    document.querySelector('#titulos-ligacoes-btn').addEventListener('click', modalTitulosELigacoes);
    document.querySelector('#botoes-btn').addEventListener('click', modalBotoes);
    document.querySelector('#logos-btn').addEventListener('click', modalIcons);
    document.querySelector('#textbox-btn').addEventListener('click', modalTextbox);

    // Função que atualiza à medida que vamos escrevendo, ou quando clicamos na text-area
    textarea.addEventListener('keyup', updatePreviews);
    textarea.addEventListener('click', updatePreviews);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Debug Tools

    // // Mostra target na consola
    // document.addEventListener("click", function (e) {
    //     console.log(e.target);
    //     console.log('cursorpos: '+e.target.selectionStart)
    // });


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Paginador (futureproof caso seja necessário adicionar páginas adicionais às diferentes categorias)
    function newRow(pag) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        newRow.classList.add(`page-${pag}`);
        return newRow
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Notepad

    // Função que atualiza a previsualização da lista
    function previewLista() {

        const valorTipoLista = document.querySelector('#tipo-lista-dropdown').value;
        let previewWrapper = document.querySelector('#preview-list-row');


        switch (valorTipoLista) {
            // Opção 1
            case 'ul':
                previewWrapper.innerHTML = '';
                novaListaPreview = previewWrapper.appendChild(document.createElement('ul'));
                novaListaPreview.id = 'preview-list';
                novaListaPreview.style.listStylePosition = "inside";
                for (i = 1; i <= 3; i++) {
                    novoItemPreview = novaListaPreview.appendChild(document.createElement('li'));
                    novoItemPreview.classList = 'preview-item';
                    novoItemPreview.innerHTML = `<b>Item ${i}:</b> Lorem Ipsum`
                }
                break

            // Opção 2
            case 'ol-1':
                previewWrapper.innerHTML = '';
                novaListaPreview = previewWrapper.appendChild(document.createElement('ol'));
                novaListaPreview.id = 'preview-list';
                novaListaPreview.setAttribute('type', '1')
                novaListaPreview.style.listStylePosition = "inside";
                for (i = 1; i <= 3; i++) {
                    novoItemPreview = novaListaPreview.appendChild(document.createElement('li'));
                    novoItemPreview.classList = 'preview-item';
                    novoItemPreview.innerHTML = `<b>Item ${i}:</b> Lorem Ipsum`
                }
                break

            // Opção 3
            case 'ol-a':
                previewWrapper.innerHTML = '';
                novaListaPreview = previewWrapper.appendChild(document.createElement('ol'));
                novaListaPreview.id = 'preview-list';
                novaListaPreview.setAttribute('type', 'a');
                novaListaPreview.style.listStylePosition = "inside";
                for (i = 1; i <= 3; i++) {
                    novoItemPreview = novaListaPreview.appendChild(document.createElement('li'));
                    novoItemPreview.classList = 'preview-item';
                    novoItemPreview.innerHTML = `<b>Item ${i}:</b> Lorem Ipsum`
                }
                break
        }
    }
    // Função que vai buscar o tópico à cache do browser (Caso exista)
    function JSON2Input() {
        try {
            const getTextareaFromJSON = localStorage.getItem('textarea');
            textarea.value = JSON.parse(getTextareaFromJSON);
        }
        catch { }
    }

    // Função que atualiza o maindiv, conforme tenha encontrado ou não cache 
    function haveCache() {
        if (textarea.value === '') {
            let haveCache = maindiv.appendChild(document.createElement('span'));
            haveCache.innerText = 'Não encontrei nenhum tópico em cache. Carrega na caixa de texto para começar!'
        } else {
            let haveCache = maindiv.appendChild(document.createElement('span'));
            haveCache.innerText = 'Encontrei um tópico em cache. A carregar...'
            let timer = setTimeout(refreshMainDiv, 3600);
            function refreshMainDiv() {
                maindiv.innerHTML = textarea.value;
            }
        }
    }

    // Inicializa as funções relacionadas com cache
    (function () {
        JSON2Input();
        haveCache();
    }());


    function escreveNaTextarea(etarget) {

        // babyproofs
        if (activeTextarea === '') { alert('Coloca o cursor numa área de texto antes de adicionar conteúdos.'); return }

        // caso seja a textarea principal
        if (activeTextarea.id === 'textarea') {
            // O array cursorPosInfo é composto por duas string, antes e depois do cursor
            // O novoSourceCode faz o concat das string, com o elemento a ser escrito na posição do cursor.
            novoSourceCode = `${cursorPosInfo[0]}` + "\n" + `${etarget.outerHTML}` + `${cursorPosInfo[1]}`;

            // Atualiza a textarea
            textarea.value = novoSourceCode;

            // Atualiza o preview
            maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);

            modalColap();

            // Guarda as alterações em cache
            saveIntoJSON();

            // caso seja as textareas da vista de collaps
        } else {
            novoSourceCode = `${modalTextareaPos[0]}` + "\n" + `${(etarget.outerHTML).toString()}` + `${modalTextareaPos[1]}`;
            activeTextarea.value = novoSourceCode;
            let inputPreview = activeTextarea.parentElement.nextElementSibling.children[1];
            inputPreview.innerHTML = novoSourceCode;
        }
    }

    // serve para adicionar quebras de linha à textarea, aquando da introdução de elementos que utilizam esta função 
    // em vez de ser etarget.outerhtml, é etarget (porque a esta funçaõ já chega um outerhtml, com os replaces feitos)
    function escreveNaTextareaGeradores(etarget) {

        // babyproofs
        if (activeTextarea === '') { alert('Coloca o cursor numa área de texto antes de adicionar conteúdos.'); return }

        // caso seja a textarea principal
        if (activeTextarea.id === 'textarea') {
            // O array cursorPosInfo é composto por duas string, antes e depois do cursor
            // O novoSourceCode faz o concat das string, com o elemento a ser escrito na posição do cursor.
            novoSourceCode = `${cursorPosInfo[0]}` + "\n" + `${etarget}` + `${cursorPosInfo[1]}`;

            // Atualiza a textarea
            textarea.value = novoSourceCode;

            // Atualiza o preview
            maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);

            modalColap();

            // Guarda as alterações em cache
            saveIntoJSON();

            // caso seja as textareas da vista de collaps
        } else {
            novoSourceCode = `${modalTextareaPos[0]}` + "\n" + `${(etarget).toString()}` + `${modalTextareaPos[1]}`;
            activeTextarea.value = novoSourceCode;
            let inputPreview = activeTextarea.parentElement.nextElementSibling.children[1];
            inputPreview.innerHTML = novoSourceCode;
        }
    }

    function singleColapsavel() {
        // wrapper do collapsavel
        let newCollap = document.createElement('div');
        newCollap.classList = 'row seccao-phcgo';

        // título
        let newCollapColTitulo = newCollap.appendChild(document.createElement('div'))
        newCollapColTitulo.classList = 'col-xs-8'

        //link do h2
        let h2Link = newCollapColTitulo.appendChild(document.createElement('a'));
        h2Link.setAttribute('href', `#novo-colapsavel`)
        h2Link.setAttribute('data-toggle', 'collapse');

        //h2
        let newtituloH2 = h2Link.appendChild(document.createElement('h2'))
        newtituloH2.classList = 'manuais'
        newtituloH2.innerText = 'Novo colapsável'

        //abrir/fechar
        let newCollapCol1 = newCollap.appendChild(document.createElement('div'))
        newCollapCol1.classList = 'col-xs-4 text-right'

        //link do abrir/fechar
        let link = newCollapCol1.appendChild(document.createElement('a'));
        link.setAttribute('href', `#novo-colapsavel`)
        link.setAttribute('data-toggle', "collapse")
        link.innerText = 'Abrir/Fechar'

        // wrapper do conteudo
        let newCollapConteudo = document.createElement('div');
        newCollapConteudo.classList = 'collapse multi-collapse'
        newCollapConteudo.id = 'novo-colapsavel'
        newCollapConteudo.innerHTML = 'Conteúdo do novo colapsável aqui!'

        newCollapFinal = newCollap.outerHTML + newCollapConteudo.outerHTML
        return newCollapFinal
    }

    function novoColapsavel() {
        if (collapsablesArray.length === 0) {
            const abrirTodosDiv = '<br><a id="colapse-all-a" style="display: block;text-align: right;" data-toggle="collapse" data-target=".multi-collapse" href="#" role="button" aria-expanded="false"">Abrir Todos</a></p></div>'
            textarea.value = textarea.value + "\n" + abrirTodosDiv + "\n" + '<!-- Início do Colapsável #1 -->' + "\n" + (singleColapsavel().toString() + "\n" + '<!-- Fim do Colapsável #1 -->');
            textarea.value = textarea.value.replaceAll('<div class="collapse', "\n" + "\n" + '<div class="collapse')
            maindiv.innerHTML = textarea.value;
            modalColap();
        } else {

            // babyproof, não deixa adicionar colapsável sem gravar alterações
            for (i = 1; i <= collapsablesArray.length; i++) {
                let saveBtn = document.querySelector(`#colap-save-btn-${i}`);
                console.log(saveBtn.classList)
                console.log(saveBtn.classList.contains('no-display'))
                if (saveBtn.classList.contains('no-display') == false) {
                    alert(`Não é possível adicionar um novo colapsável, enquanto existirem alterações pendentes.`); return
                }
            }

            textarea.value = textarea.value + "\n" + '<!-- Início do Colapsável #' + (collapsablesArray.length + 1) + ' -->' + "\n" + (singleColapsavel().toString() + "\n" + '<!-- Fim do Colapsável #' + (collapsablesArray.length + 1) + ' -->');
            textarea.value = textarea.value.replaceAll('><div class="collapse', '>' + "\n" + "\n" + '<div class="collapse ')
            maindiv.innerHTML = textarea.value;
            modalColap();
            window.scrollTo(0, document.body.scrollHeight);
        }
    }

    function escreveTitulo() {
        let dropdownTitulos = document.querySelector('#tipo-titulo-dropdown');
        let novoTitulo;
        switch (dropdownTitulos.value) {

            // Opção 1
            case 'default1':
                novoTitulo = document.createElement('h1');
                novoTitulo.classList = 'manuais';
                novoTitulo.innerText = 'Título/Heading 1'
                escreveNaTextarea(novoTitulo);
                break;
            case 'default2':
                novoTitulo = document.createElement('h2');
                novoTitulo.classList = 'manuais';
                novoTitulo.innerText = 'Título/Heading 2'
                escreveNaTextarea(novoTitulo);
                break;
            case 'default3':
                novoTitulo = document.createElement('h3');
                novoTitulo.classList = 'manuais';
                novoTitulo.innerText = 'Título/Heading 3'
                escreveNaTextarea(novoTitulo);
                break;
            case 'old1':
                novoTitulo = document.createElement('h1');
                novoTitulo.innerText = 'Título/Heading 1'
                escreveNaTextarea(novoTitulo);
                break;
            case 'old2':
                novoTitulo = document.createElement('h2');
                novoTitulo.innerText = 'Título/Heading 2'
                escreveNaTextarea(novoTitulo);
                break;
            case 'old3':
                novoTitulo = document.createElement('h3');
                novoTitulo.innerText = 'Título/Heading 3'
                escreveNaTextarea(novoTitulo);
                break;
        }
    }

    function previewTitulo() {

        let dropdownTitulos = document.querySelector('#tipo-titulo-dropdown');
        let titulosPreview = document.querySelector('#preview-heading-row');
        titulosPreview.innerHTML = '';
        let previewTitulo;
        switch (dropdownTitulos.value) {

            // Opção 1
            case 'default1':
                previewTitulo = document.createElement('h1');
                previewTitulo.classList = 'manuais';
                previewTitulo.innerText = 'Título/Heading 1'
                titulosPreview.appendChild(previewTitulo)
                break;
            case 'default2':
                previewTitulo = document.createElement('h2');
                previewTitulo.classList = 'manuais';
                previewTitulo.innerText = 'Título/Heading 2'
                titulosPreview.appendChild(previewTitulo)
                break;
            case 'default3':
                previewTitulo = document.createElement('h3');
                previewTitulo.classList = 'manuais';
                previewTitulo.innerText = 'Título/Heading 3'
                titulosPreview.appendChild(previewTitulo)
                break;
            case 'old1':
                previewTitulo = document.createElement('h1');
                previewTitulo.innerText = 'Título/Heading 1'
                titulosPreview.appendChild(previewTitulo);
                break;
            case 'old2':
                previewTitulo = document.createElement('h2');
                previewTitulo.innerText = 'Título/Heading 2'
                titulosPreview.appendChild(previewTitulo)
                break;
            case 'old3':
                previewTitulo = document.createElement('h3');
                previewTitulo.innerText = 'Título/Heading 3'
                titulosPreview.appendChild(previewTitulo)
                break;
        }

    }
    const titleScrol = setInterval(scrollTitle, 500);
    function scrollTitle() {
        let tituloPagina = document.title.toString();
        const updatedTituloPagina1 = tituloPagina.slice(0, 1)
        const updatedTituloPagina2 = tituloPagina.slice(1, tituloPagina.length)
        document.title = updatedTituloPagina2 + updatedTituloPagina1
    }


    //hilite.me formatter 
    function hiliteFormater(novosource) {
        let fixedHilite = String(novosource).replaceAll("\n", '<br>' + "\n");
        fixedHilite = fixedHilite.toString().replace('<pre style="', '<pre style="background:transparent;border:0px;');
        escreveNaTextareaGeradores(fixedHilite);
    }

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
        xhttp.open("POST", "http://hilite.me/api", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`code=${code}&style=monokai&lexer=${codetype}`);


    }

    function updateCodeType(e) {
        document.querySelector('#ts').checked = false
        document.querySelector('#vbnet').checked = false
        e.target.checked = true
        codetype = e.target.id
    }

    function updateTableType(e) {
        document.querySelector('#normal-table').checked = false
        document.querySelector('#modern-table').checked = false
        e.target.checked = true
        tipoTabela = e.target.id
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
mixWrapper();