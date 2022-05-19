<?php 
echo "<section class='header sticky-top'>
<div class='container-fluid'>
    <div class='row'>

        <div class='col-md-5'>
            <div class='col-md-6 headControls text-left'>
                <button type='button' class='btn btn-info' id='ancora-btn'><i class='lni lni-anchor'></i>
                </button>
                <button type='button' class='btn btn-light' id='colap-btn'><i class='lni lni-layers'></i>
                    Colapsáveis</button>
                <button type='button' class='btn btn-light' id='manuals-btn'><i class='lni lni-library'></i>
                    Manuais</button>
                </div>
                <div class='col-md-6 headControls text-right'>
                <button type='button' class='btn btn-warning no-display' id='preview-btn'><i class='lni lni-magnifier'></i>
                Prever</button>
                <button type='button' class='btn btn-warning' id='quicksave-btn'><i class='lni lni-upload'></i>
                    Quicksave</button>
                <button type='button' class='btn btn-warning' id='quickload-btn'><i class='lni lni-download'></i>
                    Quickload</button>
                <button type='button' class='btn btn-warning' id='userstats-btn'><i class='lni lni-user'></i>
                </button>
                <button type='button' class='btn btn-danger' id='logout-btn'><i class='lni lni-power-switch'></i>
                </button>
            </div>
            <textarea id='textarea'></textarea>
            <div class='col-md-12 headControls2'>
                <button type='button' class='btn btn-light main-menu' id='textbox-btn'><i
                        class='lni lni-text-format'></i>
                    Caixas de Texto</button>
                <button type='button' class='btn btn-light main-menu' id='logos-btn'><i class='lni lni-image'></i>
                    Icons</button>
                <button type='button' class='btn btn-light main-menu' id='botoes-btn'><i
                        class='lni lni-pointer-top'></i>
                    Botões & Chips</button>
                <button type='button' class='btn btn-light main-menu' id='listas-tabelas-btn'><i
                        class='lni lni-grid'></i>
                    Listas/Tabelas & Imagens</button>
                <button type='button' class='btn btn-light main-menu' id='titulos-ligacoes-btn'><i
                        class='lni lni-link'></i>
                    Títulos & Ligações</button>
            </div>
        </div>

        <div class='col-md-7'>
            <div id='app-controls-wrapper'></div>
        </div>

    </div>
</div>
</section>

<section class='display-preview'>
<div class='container-fluid'>
    <div class='row'>

        <div id='colapsables-wrapper' class='col-md-12 no-display'></div>

        <div class='col-md-12 hc-preview'>

            <section class='header-hc'>
                <div class='container-fluid'>
                    <div class='row'>
                        <div class='col-md-5 header-logo'><img src='assets/img/logo_kbmon.png'></div>
                        <div class='col-md-3'></div>
                        <div class='col-md-4 head-slogan'><span>fast software</span> for fast companies</div>
                    </div>
                </div>
            </section>

            <section class='text-body-hc'>
                <div class='container'>
                    <div class='row'>
                        <div class='col-md-1'></div>
                        <div id='helpcenter-preview' class='col-md-10'></div>
                        <div class='col-md-1'></div>
                    </div>
                </div>
            </section>

            <section class='footer-hc'>
                <div class='container-fluid'>
                    <div class='row'>
                        <div class='col-md-5'><img src='assets/img/HC_Developers_logo_footer.svg'></div>
                        <div class='col-md'></div>
                        <div class='col-md-5'></div>
                    </div>
                </div>
            </section>

        </div>
    </div>
</div>

</section>"
?>