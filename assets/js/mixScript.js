/************************************/
/* helpcenterplus                   */
/* mambosinfinitos, 2022            */
/************************************/


function mixWrapper() {

    // Função para preencher automaticamente a textarea/maindiv com o valor que ficou em cache




    // Selectores globais

    // textarea cabeçalho
    const textarea = document.querySelector('textarea');

    // div modal cabeçalho
    const modaldiv = document.querySelector('#modal');

    // div principal do helpcenter preview 
    const maindiv = document.querySelector('#main-div');

    /** 
     * array a ser utilizado para guardar os slices
     * da textarea, a quando da introdução de elementos
     * ([1] = texto até ao cursor | [2] = texto a partir do cursos)
    */
    let cursorPosInfo = ['', '', ''];

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

    const colapBtn = document.querySelector('#colap-btn');
    const colapModal = document.querySelector('#colapsables-modal');
    const hcPreview = document.querySelector('.hc-preview');


    function toogleColapsablesModal() {
        let colapModalClasses = colapModal.classList;
        if (colapModalClasses.length === 2) {
            colapBtn.classList.replace('btn-light', 'btn-info');
            colapModal.classList.remove('no-display');
            hcPreview.classList.add('no-display');
            getCollapsables();
        } else {
            colapBtn.classList.replace('btn-info', 'btn-light');
            getCollapsables();
            colapModalClasses = colapModal.classList.add('no-display');
            hcPreview.classList.remove('no-display');
        }
    }

    function getCollapsables() {
        // Array com todas as sections do HelpCenter
        let collapsablesArray = document.querySelectorAll('.row .seccao-phcgo');
        colapModal.innerHTML = '';

        // Wrapper (row)
        let colapWrapper = colapModal.appendChild(newRow(1));

        // So é executado se a modal estiver á mostra para poupar recursos
        if (colapModal.classList.contains('no-padding') === false) {

            // Loop para cada item do Array
            for (i = 1; i <= collapsablesArray.length; i++) {

                // Row 1
                let row = colapWrapper.appendChild(newColapRow());
                let wrapperLeft = row.appendChild(newColapInput(i));
                let wrapperRight = row.appendChild(newColapDisplay(i));

                // Col 1 (inputs)

                // Input 1
                wrapperLeft.appendChild(newSpan('colap-id', 'ID do colapsável (minúsculas, sem acentuação, sem espaçamento)'));
                let idInput = wrapperLeft.appendChild(newColapIDInput(i));
                idInput.value = collapsablesArray[i - 1].nextElementSibling.id;

                // Input 2
                wrapperLeft.appendChild(newSpan('colap-h2', 'Título do colapsável'));
                let h2Input = wrapperLeft.appendChild(newColapH2Input(i));
                let h2Trim = collapsablesArray[i - 1].innerText.trim().split('	');     // trim para ficar direitinho
                h2Input.value = h2Trim[0];

                //hotfix, estava a aparecer no input dos novos manuais.
                console.log(h2Input.value);
                while (h2Input.value.includes('Abrir/Fechar'))
                h2Input.value = h2Input.value.replace('Abrir/Fechar','');

                // Input 3
                wrapperLeft.appendChild(newSpan('colap-body', 'Corpo do colapsável'));
                let bodyInput = wrapperLeft.appendChild(newColapBodyInput(i));
                bodyInput.addEventListener('keyup', displaySave)


                let bodyTempInput = collapsablesArray[i - 1].nextElementSibling.innerHTML;
                // Remove o cursor laranja ao passar para os collaps
                bodyInput.value = String(bodyTempInput).replace('<span id="pulse">|</span>', '');

                // Button
                let updateCollaps = wrapperLeft.appendChild(document.createElement('button'));
                updateCollaps.id = `colap-save-btn-${1}`;
                updateCollaps.innerText = 'Guardar Alterações'
                updateCollaps.classList = 'btn btn-success no-display'
                updateCollaps.addEventListener('click', gerarColapsaveis)


                // bodyInput.addEventListener('click', displaySave)                         // Verificar a partir daqui. puta qui pariu :|[criar button com class hidden. ao fazer key press, remove a class.]

                // Col 2 (display)
                wrapperRight.appendChild(newColapH2Display(i));
                wrapperRight.lastChild.innerText = h2Trim[0];
                wrapperRight.appendChild(newColapBodyDisplay(i));
                wrapperRight.lastChild.innerHTML = collapsablesArray[i - 1].nextElementSibling.innerHTML;
            }
        }
    }


    function displaySave(e) {
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
            h2Link.setAttribute('href',`#${newCollapseArray[0][i - 1]}`)
            h2Link.setAttribute('data-toggle','collapse');

            //h2
            let newtituloH2 = h2Link.appendChild(document.createElement('h2'))
            newtituloH2.classList = 'manuais'
            newtituloH2.innerText = newCollapseArray[1][i - 1]

            

            //abrir/fechar
            let newCollapCol1 = newCollap.appendChild(document.createElement('div'))
            newCollapCol1.classList = 'col-xs-4 text-right'
            

            //link do abrir/fechar
            let link = newCollapCol1.appendChild(document.createElement('a'));
            link.setAttribute('href',`#${newCollapseArray[0][i - 1]}`)
            link.setAttribute('data-toggle',"collapse")
            link.innerText = 'Abrir/Fechar'

            // wrapper do conteudo
            let newCollapConteudo = document.createElement('div');
            newCollapConteudo.classList = 'collapse multi-collapse'
            newCollapConteudo.id = newCollapseArray[0][i - 1]
            newCollapConteudo.innerHTML = newCollapseArray[2][i - 1]

            
            
            
            newCollapFinal = newCollapFinal+(newCollap.outerHTML+newCollapConteudo.outerHTML)
        
        }

        // função para obter o texto antes do primeiro collap
        function topicoAntesColapsaveis () {
            const charCountAntes = textarea.value.search('<div class="row seccao-phcgo">');
            const textoAntesCollaps = textarea.value.slice(0,charCountAntes); 
            return textoAntesCollaps
        }

        newCollapFinal = topicoAntesColapsaveis()+newCollapFinal;
        textarea.value = newCollapFinal;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(newCollapFinal);
        getCollapsables();
        saveIntoJSON();

    }

    
    
    


    function novoTopicoViaColap() {
        // Declaração de variável
        const arrayParaNovoTopico = [];

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
        novaListaWrapper.classList.add('col-md-5');
        novaListaWrapper.id = 'listas-wrapper';

        // Row 0
        let row = novaListaWrapper.appendChild(document.createElement('div'));
        row.classList.add('row')
        row.id = 'header-listas'
        row.innerHTML = '<i class="lni lni-list"></i> Gerador de listas'

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
        col.classList.add('col-md-12')
        col.id = 'preview-list-row'

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
        criarListaButton.innerText = 'Criar lista'
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
        row.innerHTML = '<i class="lni lni-grid"></i> Gerador de tabelas'

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

        // Col 1
        col = row.appendChild(document.createElement('div'));
        col.classList.add('col-md-12')
        col.id = 'cria-tabela-btn-div'



        // Button 'Criar tabela'
        let criarCabecalho = col.appendChild(document.createElement('button'));
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
            if (class2Index === true) { novoTituloWrapper.classList.add(`manuais`); }

            novoTituloWrapper.innerText = `Título H${class1Index}`;
            novoTituloWrapper.addEventListener('click', function (e) { escreverTitulo(e); });

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

        novoSourceCode = `${cursorPosInfo[1]}${eTarget.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = novoSourceCode;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
        getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
        saveIntoJSON();
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
                //  else if ((i % 48) === 0) {
                //     modaldiv.lastChild.lastChild.appendChild(divIcon(i));
                //     pag++;
                //     modaldiv.appendChild(newHiddenRow(pag));
            }

            else { divSegundaRow.appendChild(divIcon(i)); }

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
        divIcon.addEventListener('click', escreverIcon);
        return divIcon
    }

    function escreverIcon(e) {
        let eTarget = e.target;

        // HotFix para quando o target não é igual ao icons
        if (eTarget.classList.contains('phcgo-icon')) { eTarget = eTarget.firstChild };

        novoSourceCode = `${cursorPosInfo[1]}${eTarget.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = novoSourceCode;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);
        getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
        saveIntoJSON();
    }

    function grabJSONIcons() {

        fetch('assets/js/imagens2.json')
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
        // modaldiv.appendChild(newPagiRow());
        // let pagiRow = document.querySelector('.pagi');
        // for (let pagi = 1; pagi <= pag; pagi++) {
        //     pagiRow.appendChild(newPagiItem(pagi));
        // }
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

        novoSourceCode = `${cursorPosInfo[1]}${eTarget.outerHTML}${cursorPosInfo[2]}`;
        textarea.value = novoSourceCode;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode);

        getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
        saveIntoJSON();

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
        if (e.target === textarea && e.key === 'Enter') {
            const novoBr = document.createElement('br');
            novoSourceCode = `${cursorPosInfo[1]}${novoBr.outerHTML}${cursorPosInfo[2]}`;
            textarea.value = novoSourceCode;
            maindiv.innerHTML = fixArtigosRelacionadosLogo(novoSourceCode) + '<span id="pulse">|</span>';
            getCollapsables();  // leftover dos colapsáveis. para apagar ao rescrever colapsáveis
            saveIntoJSON();

        }
    });

    // função para atualizar o preview com o cursor laranja
    function updatePreviews(e) {
        let inputText = textarea.value;
        let cursorPos = getCursorPos(e);

        // divide o tópico em duas partes (até ao cursor, e após o curos)
        let inputTextString1 = inputText.slice(0, cursorPos);
        let inputTextString2 = inputText.slice(cursorPos);


        // introduz o cursor laranja
        let inputTextWithCursor = `${inputTextString1}<span id="pulse">|</span>${inputTextString2}`;

        // guarda a posição do cursor 
        cursorPosInfo[1] = inputTextString1;
        cursorPosInfo[2] = inputTextString2;

        // atualiza o preview
        maindiv.innerHTML = inputTextWithCursor;
        maindiv.innerHTML = fixArtigosRelacionadosLogo(maindiv.innerHTML);

        getCollapsables();
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

    // Paginador (futureproof)
    function newRow(pag) {                                      // função geradora <div row> primeira página
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        newRow.classList.add(`page-${pag}`);
        return newRow
    }

    // function newPagiItem(pagi) {
    //     const newPagiItem = document.createElement('div');
    //     newPagiItem.classList.add('col');
    //     newPagiItem.classList.add(`pagi-${pagi}`);
    //     newPagiItem.innerHTML = `${pagi}`
    //     return newPagiItem
    // }

    // function newHiddenRow(pag) {                                // função geradora <div row> páginas seguintes
    //     const newHiddenRow = document.createElement('div');
    //     newHiddenRow.classList.add('row');
    //     newHiddenRow.classList.add('no-display');
    //     newHiddenRow.classList.add(`page-${pag}`);
    //     return newHiddenRow
    // }

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
                novaListaPreview = document.querySelector('#preview-list');
                novoItemPreview = novaListaPreview.appendChild(document.createElement('li'));
                novoItemPreview.id = 'preview-item';
                novoItemPreview.innerText = 'Lorem ipsum adit'
                novoItemPreview = document.querySelector('#preview-item');
                break

            // Opção 2
            case 'ol-1':
                previewWrapper.innerHTML = '';
                novaListaPreview = previewWrapper.appendChild(document.createElement('ol'));
                novaListaPreview.id = 'preview-list';
                novaListaPreview.setAttribute('type', '1');
                novaListaPreview = document.querySelector('#preview-list');
                novoItemPreview = novaListaPreview.appendChild(document.createElement('li'));
                novoItemPreview.id = 'preview-item';
                novoItemPreview.innerText = 'Lorem ipsum adit'
                novoItemPreview = document.querySelector('#preview-item');

                break

            // Opção 3
            case 'ol-a':
                previewWrapper.innerHTML = '';
                novaListaPreview = previewWrapper.appendChild(document.createElement('ol'));
                novaListaPreview.id = 'preview-list';
                novaListaPreview.setAttribute('type', 'a');
                novaListaPreview = document.querySelector('#preview-list');
                novoItemPreview = novaListaPreview.appendChild(document.createElement('li'));
                novoItemPreview.id = 'preview-item';
                novoItemPreview.innerText = 'Lorem ipsum adit'
                novoItemPreview = document.querySelector('#preview-item');
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
            console.log('tem')
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


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
mixWrapper();