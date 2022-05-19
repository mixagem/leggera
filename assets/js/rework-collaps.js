/* <div class="row seccao-phcgo">
<div class="col-xs-9"><h2 class="manuais">Outras Configurações</h2></div>
<div class="col-xs-3 text-right"><a data-toggle="collapse" href="#outras-configs" role="button" aria-expanded="false" aria-controls="outras-configs" style="width:100%;font-size:14px;padding-right:15px;">Mostrar/Ocultar</a></div>
</div>


<div class="collapse multi-collapse" id="outras-configs"><br> */

listsBtn.addEventListener('click', getLists);

function getLists () {
    modaldiv.innerHTML = '';
    let pag = 1;
    modaldiv.appendChild(newRow(pag));
    const listsInputWrapper = document.createElement('div');
    listsInputWrapper.classList.add('col-md-12');
    listsInputWrapper.document
    modaldiv.lastChild.appendChild(listsInputWrapper);


}

function novaSectionGOWrapper() {
    const novaSectionGOWrapper = document.createElement('div');
    novaSectionGOWrapper.classList.add('row');
    novaSectionGOWrapper.classList.add('seccao-phcgo');
    return novaSectionGOWrapper
}

function novaSectionGOH2() {
    const novaSectionGOH2 = document.createElement('h2');
    novaSectionGOH2.classList.add('manuais');
    return novaSectionGOH2
}

function novaSectionGOCol9() {
    const novaSectionCol9 = document.createElement('div');
    novaSectionCol9.classList.add('col-xs-9');
    return novaSectionCol9
}

function novaSectionGOCol3() {
    const novaSectionCol3 = document.createElement('div');
    novaSectionCol3.classList.add('col-xs-3');
    novaSectionCol3.classList.add('text-right');
    return novaSectionCol3
}


function novaSectionGOLink(id) {
    const novaSectionGOLink = document.createElement('a');
    novaSectionGOLink.setAttribute('data-toggle', 'collapse');
    novaSectionGOLink.setAttribute('href', `#${id}`);
    novaSectionGOLink.setAttribute('style', 'width:100%;font-size:14px;padding-right:15px;');
    return novaSectionGOLink
}


function novaSectionCollapse(id) {
    const novaSectionCollapse = document.createElement('div');
    novaSectionCollapse.id = id;
    novaSectionCollapse.classList.add('collapse');
    novaSectionCollapse.classList.add('multi-collapse');
    return novaSectionCollapse
}



function listGenerator(type, style, n) {
    const newList = document.createElement(`${type}`)
    newList.setAttribute('type', style)
    for (i = 1; i <= n; i++) {
        newList.appendChild(document.createElement('li'));
        newList.lastChild.innerText = `Item ${i}`;
    }
    return newList
}