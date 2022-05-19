/************************************/
/* helpcenter+ supperliggera        */
/* mambosinfinitos, 2022            */
/************************************/


function mixWrapper() {

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
        }, rng)

        return landingTimer
    }


    // ############ JSON FETCH ############

    /**
    * Delaração de arrays para guardar os dados vindos do fetch JSON
    * Utilizados na construção dos menus
    */
    const iconsFromJSON = [];
    const textboxesFromJSON = [];
    const buttonsFromJSON = [];

    /**
     * Declaração variáveis utilizadas para guardar o número de itens em cada JSON
     * Utilizados na construção dos menus
     */
    // a construção dos menus
    let numeroTextboxes;
    let numeroIcons;
    let numeroButtons;

    // Executa todas as funções que vão buscar dados JSON
    function grabThemAll() {
        grabJSONButtons();
        grabJSONTextBoxes();
        grabJSONIcons();
    }

    function grabJSONButtons() {
        fetch('assets/js/buttons.json')
            .then(function (response) { return response.json() })
            .then(function (data) { appendData(data) })
            .catch(function (err) { console.log('Rebentou. É lidar compadre.') })

        function appendData(data) {
            for (let i = 0; i < data.length; i++) {
                buttonsFromJSON[i] = data[i].code;
            }
            numeroButtons = data.length;
        }
    }

    function grabJSONTextBoxes() {
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
    }

    function grabJSONIcons() {
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
    }


    // ############ SELETORES  ############

    const textarea = document.querySelector('textarea');
    const appControls = document.querySelector('#app-controls-wrapper');
    const hcPreview = document.querySelector('#helpcenter-preview');


    // ############ VARIÁVEIS ############
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


    // ############ FUNÇÕES CONSTRUTORAS ############

    function elementGenerator(ele, id = '', classlist = '', inner = '') {
        const elementGenerated = document.createElement(`${ele}`);
        if (id !== '') { elementGenerated.id = `${id}` }
        if (classlist !== '') { elementGenerated.classList = `${classlist}` }
        if (inner !== '') { elementGenerated.innerHTML = `${inner}` }
        return elementGenerated
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

        escreveNaTextareaGeradores(textbox);
        // Hotfix para corrigir a text-box dos tópicos relacionados

    }


    // ############ APPCONTROLS ICONS ############

    // Função para mostrar os icons no appControls 
    function appControlsIcons() {

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
    }

    function writeIcon(e) {
        let icon = e.target;

        // Corrige o etarget quando não carregamos direitinho no icon
        if (icon.classList.contains('phcgo-icon')) { icon = icon.firstChild };

        escreveNaTextarea(icon);
    }


    // ############ APPCONTROLS BUTTONS ############

    // Função para mostrar o appControls de botoes e etiquetas
    function appControlsButtons() {

        // Limpa o appControls + inicia paginador
        let pag = appControlsChange();

        // Anexar ao appControls o wrapper principal
        let appControlsButton = appControls.appendChild(elementGenerator('div', '', `row page-${pag}`));

        // Anexar ao wrapper principal uma linha de 4 buttons
        let appControlsButtonWrapper = appControlsButton.appendChild(elementGenerator('div', '', 'row phc-buttons'));

        for (i = 1; i <= numeroButtons; i++) {

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
    }

    // Função para adicionar um botão ao código do tópico
    function writeButton(e) {
        let button = e.target;
        // Corrige o etarget quando carregamos ao lado do botão/etiqueta
        if (button.classList.length > 0) { button = button.firstChild };

        // Vai buscar o número do botão e vai buscar ao array dos botões o código original 
        button = buttonsFromJSON[String(button.parentElement.id).replace('botao-', '') - 1];
        escreveNaTextareaGeradores(button);
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

        tipoListaDropdown.addEventListener('change', previewLista)

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
        col = row.appendChild(elementGenerator('div', 'preview-list-row', 'col-md-12'));

        // Lista default
        let previewList = col.appendChild(document.createElement('ul'));
        previewList.style.listStylePosition = 'inside';
        for (i = 1; i <= 3; i++) {
            previewList.appendChild(elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem Ipsum`));
        }

        // Row 4
        row = appControlsLists.appendChild(elementGenerator('div', '', 'row'));
        col = row.appendChild(elementGenerator('div', 'cria-lista-btn-div', 'col-md-12'));

        // Button "Criar lista"
        let criarListaButton = col.appendChild(elementGenerator('button', '', 'btn btn-success', '<i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Criar lista'));
        criarListaButton.addEventListener('click', writeList)

        // ########## TABELAS ##########

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
        let converterTabela = col.appendChild(elementGenerator('button', '', 'btn btn-warning', '<i class="lni lni-code"></i>&nbsp;&nbsp;Converter tabela'));
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
        const checkboxLabel1 = col.appendChild(elementGenerator('span', '', '', 'Normal'));


        // Input 'Moderna'
        const checkbox2 = col.appendChild(elementGenerator('input', 'modern-table'));
        checkbox2.setAttribute('type', 'checkbox');
        checkbox2.addEventListener('click', updateTableType)

        // Span 'Moderna'
        const checkboxLabel2 = col.appendChild(elementGenerator('span', '', '', 'Moderna'));

        // Input 'Moderna Azul'
        const checkbox3 = col.appendChild(elementGenerator('input', 'modern-table-blue'));
        checkbox3.setAttribute('type', 'checkbox');
        checkbox3.addEventListener('click', updateTableType)

        // Span 'Moderna Azul'
        const checkboxLabel3 = col.appendChild(elementGenerator('span', '', '', 'Moderna Azul'));


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

    // Função para adicionar uma lista ao código do tópico
    function writeList() {

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
                    novaLista.appendChild(elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                }
                // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
                novaLista = (novaLista.outerHTML.toString().replaceAll('<li><b>', "\n" + '<li><b>'));
                escreveNaTextareaGeradores(novaLista);
                break;

            // Opção 2
            case 'ol-1':
                novaLista = document.createElement('ol');
                novaLista.setAttribute('type', '1');
                novaLista.style.listStylePosition = "inside";
                for (i = 1; i <= n; i++) {
                    novaLista.appendChild(elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                }
                // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
                novaLista = (novaLista.outerHTML.toString().replaceAll('<li><b>', "\n" + '<li><b>'));
                escreveNaTextareaGeradores(novaLista);
                break;

            // Opção 3
            case 'ol-a':
                novaLista = document.createElement('ol');
                novaLista.setAttribute('type', 'a');
                novaLista.style.listStylePosition = 'inside';
                for (i = 1; i <= n; i++) {
                    novaLista.appendChild(elementGenerator('li', '', '', `<b>Item ${i}:</b> Lorem ipsum`));
                }
                // Introdução de quebras de linha, de modo a tornar o código da textbox mais legível fora do leitor
                novaLista = (novaLista.outerHTML.toString().replaceAll('<li><b>', "\n" + '<li><b>'));
                escreveNaTextareaGeradores(novaLista);
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
        const tBody = novaTabela.appendChild(document.createElement('tbody'));

        // adiciona o cabeçalho à tabela
        // if (cabecalho === true) {

        const novoCabecalho = document.createElement('tr');
        for (i = 1; i <= numColunas; i++) {
            let novaColuna = novoCabecalho.appendChild(elementGenerator('td', '', '', `Cabeçalho ${i}`));
        }
        tBody.appendChild(novoCabecalho);
        // }

        // adiciona as restantes linhas á tabela
        for (iLinhas = 1; iLinhas <= numLinhas; iLinhas++) {
            const novaLinha = document.createElement('tr');
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
        escreveNaTextareaGeradores(novaTabela);
    }

    function convertTable() {

        let nome;
        switch (tableType) {
            case 'normal-table': nome = 'Normal'; break
            case 'modern-table': nome = 'Moderna'; break
            case 'modern-table-blue': nome = 'Moderna Azul'; break
        }

        const tablecode = prompt(`Introduz o código da tua tabela.\n\nEsta será convertida no estilo atualmente selecionado ( ${nome} )`);


        const tablecodeSlices = [];

        if (tablecode.toString().includes('<tbody>') && tablecode.toString().includes('</tbody>')) {

            tablecodeSlices.push(tablecode.toString().indexOf('<tbody>'))
            tablecodeSlices.push(tablecode.toString().indexOf('</tbody>'))
            tablecodeSlices.push(tablecode.toString().slice(tablecodeSlices[0] + 7, tablecodeSlices[1]))

        } else if (tablecode.toString().includes('<table>') && tablecode.toString().includes('</table>')) {

            tablecodeSlices.push(tablecode.toString().indexOf('<table>'))
            tablecodeSlices.push(tablecode.toString().indexOf('</table>'))
            tablecodeSlices.push(tablecode.toString().slice(tablecodeSlices[0] + 7, tablecodeSlices[1]))
            console.log(tablecodeSlices)

        } else { alert('A tabela fornecida não está corretamente formatada.'); return }

        // <table>
        switch (tableType) {
            case 'normal-table': novaTabela = elementGenerator('table', '', 'phcgo-old-table'); break
            case 'modern-table': novaTabela = elementGenerator('table', '', 'phcgo-new-table'); break
            case 'modern-table-blue': novaTabela = elementGenerator('table', '', 'phcgo-new-table-blue'); break
        }

        novaTabela.style.display = 'flex';
        novaTabela.style.justifyContent = 'center';

        // <tbody>
        const tBody = novaTabela.appendChild(document.createElement('tbody'));
        tBody.innerHTML = tablecodeSlices[2]

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
        escreveNaTextareaGeradores(novaTabela);

    }

    // Função para adicionar um seprador horizontal <hr> código do tópico
    function writeHR() {
        const novoSeparador = document.createElement('hr');
        novoSeparador.style.borderTop = '3px solid #eee';
        escreveNaTextarea(novoSeparador);
    }


    // ############ APPCONTROLS TITLES & LINKS ############























    function appControlsChange() {
        // Limpar o div dos appControls
        appControls.innerHTML = '';

        // Iniciar contador paginador (a ser utilizado no futuro, caso os elementos não caibam todos numa só página de appControls)
        return pag = 1;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Collapsables

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
        let colapWrapper = colaphcPreview.appendChild(elementGenerator('div', '', `row page-1`));

        if (colapList.length !== 0) {
            // Loop para cada item do Array
            for (i = 1; i <= colapList.length; i++) {

                // Row 1
                let row = colapWrapper.appendChild(newColapRow());
                (i % 2 === 0) ? row.classList.add('par') : row.classList.add('impar');
                let wrapperLeft = row.appendChild(newColapInput(i));
                let wrapperRight = row.appendChild(newColapDisplay(i));

                // Col 1 (inputs)

                // Input 1
                wrapperLeft.appendChild(newSpan('colap-id', 'ID do colapsável (minúsculas, sem acentuação, sem espaçamento)'));
                let idInput = wrapperLeft.appendChild(newColapIDInput(i));
                idInput.value = colapList[i - 1].nextElementSibling.id;
                idInput.addEventListener('keyup', updateColapPreviewByID)

                // Input 2
                wrapperLeft.appendChild(newSpan('colap-h2', 'Título do colapsável'));
                let h2Input = wrapperLeft.appendChild(newColapH2Input(i));
                let h2Trim = colapList[i - 1].innerText.trim().split('	');     // trim para ficar direitinho
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


                let bodyTempInput = colapList[i - 1].nextElementSibling.innerHTML;
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
                wrapperRight.lastChild.innerHTML = colapList[i - 1].nextElementSibling.innerHTML;
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
            let geradorColapWrapper = colaphcPreview.appendChild(document.createElement('div'));
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
        let cursorappControlsPos = getColapCursorPos(e);

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

    function colapTextAreaEvents(e) {
        // Atualiza a active textarea
        activeTextarea = e.target;

        let inputText = activeTextarea.value;
        let cursorappControlsPos = getColapCursorPos(e);

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

    function gerarColapsaveis() {

        const colapList = document.querySelectorAll('.row .seccao-phcgo');

        let newCollapFinal = '';
        let newCollapseArray = [[], [], []];

        for (i = 1; i <= colapList.length; i++) {

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
        hcPreview.innerHTML = fixArtigosRelacionadosLogo(newCollapFinal);
        appControlsColap();
        autosave2JSON();

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



    // // Função para mostrar a modal de Títulos e Ligações
    function appControlsTitulosELigacoes() {

        // Limpar a appControls
        appControls.innerHTML = '';

        // Iniciar contador paginador
        let pag = 1;

        // Anexar à appControls a primeira página (atualmente não existe segunda página)
        let primeiraPagina = appControls.appendChild(elementGenerator('div', '', `row page-${pag}`));

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
        miniWrapper1.classList = 'col-md-4'
        miniWrapper1.appendChild(document.createElement('input'));
        miniWrapper1.lastChild.type = 'checkbox'
        miniWrapper1.lastChild.setAttribute('checked', 'true');
        miniWrapper1.lastChild.id = 'vbnet'
        miniWrapper1.checked = true;
        miniWrapper1.addEventListener('change', updatecodeType)
        miniWrapper1.appendChild(document.createElement('span'));
        miniWrapper1.lastChild.innerHTML = '&nbsp;&nbsp;VB.NET'

        let miniWrapper2 = novaHiliteCheckboxesRow.appendChild(document.createElement('div'))
        miniWrapper2.classList = 'col-md-4'
        miniWrapper2.appendChild(document.createElement('input'));
        miniWrapper2.lastChild.type = 'checkbox'
        miniWrapper2.lastChild.id = 'ts'
        miniWrapper2.addEventListener('change', updatecodeType)
        miniWrapper2.appendChild(document.createElement('span'));
        miniWrapper2.lastChild.innerHTML = '&nbsp;&nbsp;TypeScript'

        let miniWrapper3 = novaHiliteCheckboxesRow.appendChild(document.createElement('div'))
        miniWrapper3.classList = 'col-md-4'
        miniWrapper3.appendChild(document.createElement('input'));
        miniWrapper3.lastChild.type = 'checkbox'
        miniWrapper3.lastChild.id = 'json'
        miniWrapper3.addEventListener('change', updatecodeType)
        miniWrapper3.appendChild(document.createElement('span'));
        miniWrapper3.lastChild.innerHTML = '&nbsp;&nbsp;JSON'

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











    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Extras 

    // Landing page


    // Função para guardar na cache do browser o Source Code do tópico (e respetivas alterações)
    function autosave2JSON() {
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
        stringCursor[0] = inputTextString1;
        stringCursor[1] = inputTextString2;

        // atualiza o preview
        hcPreview.innerHTML = inputTextWithCursor;
        hcPreview.innerHTML = fixArtigosRelacionadosLogo(hcPreview.innerHTML);

        appControlsColap();
        autosave2JSON();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Event listeners
    document.querySelector('#listas-tabelas-btn').addEventListener('click', appControlsListsAndTables);
    document.querySelector('#ancora-btn').addEventListener('click', stickyTop);
    document.querySelector('#titulos-ligacoes-btn').addEventListener('click', appControlsTitulosELigacoes);
    document.querySelector('#botoes-btn').addEventListener('click', appControlsButtons);
    document.querySelector('#logos-btn').addEventListener('click', appControlsIcons);
    document.querySelector('#textbox-btn').addEventListener('click', appControlsTextbox);
    document.querySelector('#quicksave-btn').addEventListener('click', quickSave);
    document.querySelector('#quickload-btn').addEventListener('click', quickLoad);

    // Função que atualiza à medida que vamos escrevendo, ou quando clicamos na text-area
    textarea.addEventListener('keyup', updatePreviews);
    textarea.addEventListener('click', updatePreviews);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Debug Tools

    // Mostra target na consola
    document.addEventListener("click", function (e) {
        console.log(e.target);
        // console.log('cursorpos: '+e.target.selectionStart)
    });


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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
    function fromJSON2Textarea() {
        try {
            const getTextareaFromJSON = localStorage.getItem('textarea');
            textarea.value = JSON.parse(getTextareaFromJSON);
        }
        catch { }
    }

    // Função que atualiza o hcPreview, conforme tenha encontrado ou não cache 
    function haveCache() {
        if (textarea.value === '') {
            let haveCache = hcPreview.appendChild(document.createElement('span'));
            haveCache.innerText = 'Não encontrei nenhum tópico em cache. Carrega na caixa de texto para começar!'
        } else {
            let haveCache = hcPreview.appendChild(document.createElement('span'));
            haveCache.innerText = 'Encontrei um tópico em cache. A carregar...'
            let timer = setTimeout(refreshhcPreview, 3600);
            function refreshhcPreview() {
                hcPreview.innerHTML = textarea.value;
            }
        }
    }

    // Inicializa as funções relacionadas com cache
    (function () {
        fromJSON2Textarea();
        haveCache();
    }());


    function escreveNaTextarea(etarget) {

        // babyproofs
        if (activeTextarea === '') { alert('Coloca o cursor numa área de texto antes de adicionar conteúdos.'); return }

        // caso seja a textarea principal
        if (activeTextarea.id === 'textarea') {
            // O array stringCursor é composto por duas string, antes e depois do cursor
            // O novoSourceCode faz o concat das string, com o elemento a ser escrito na posição do cursor.
            novoSourceCode = `${stringCursor[0]}` + "\n" + `${etarget.outerHTML}` + `${stringCursor[1]}`;

            // Atualiza a textarea
            textarea.value = novoSourceCode;

            // Atualiza o preview
            hcPreview.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);

            appControlsColap();

            // Guarda as alterações em cache
            autosave2JSON();

            // caso seja as textareas da vista de collaps
        } else {
            novoSourceCode = `${stringCursorColap[0]}` + "\n" + `${(etarget.outerHTML).toString()}` + `${stringCursorColap[1]}`;
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
            // O array stringCursor é composto por duas string, antes e depois do cursor
            // O novoSourceCode faz o concat das string, com o elemento a ser escrito na posição do cursor.
            novoSourceCode = `${stringCursor[0]}` + "\n" + `${etarget}` + `${stringCursor[1]}`;

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
                console.log(saveBtn.classList)
                console.log(saveBtn.classList.contains('no-display'))
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
        xhttp.send(`code=${code}&style=monokai&lexer=${codeType}`);


    }

    function updatecodeType(e) {
        document.querySelector('#ts').checked = false
        document.querySelector('#vbnet').checked = false
        document.querySelector('#json').checked = false
        e.target.checked = true
        codeType = e.target.id
        console.log(codeType)
    }

    function updateTableType(e) {
        document.querySelector('#normal-table').checked = false
        document.querySelector('#modern-table').checked = false
        document.querySelector('#modern-table-blue').checked = false
        e.target.checked = true
        tableType = e.target.id
    }

    function quickSave() {
        const textarea2JSON = JSON.stringify(textarea.value);
        localStorage.setItem('quickSave', textarea2JSON);
        textarea.value = '';
        hcPreview.innerHTML = '';
        appControlsColap();
    }
    
    
    function quickLoad() {
        const getTextareaFromJSON = localStorage.getItem('quickSave');
        textarea.value = JSON.parse(getTextareaFromJSON);
        autosave2JSON();
        hcPreview.innerHTML = textarea.value;
        appControlsColap();
    }



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
mixWrapper();




