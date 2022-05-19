<?php

$cookie = trim($_POST['cookie']);
$con = mysqli_connect('localhost', 'root', '', 'superleggera');
$leggeraversion = 1.25;

// token generator
function generateRandomString($length = 10)
{
    return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);
};
$session = trim(generateRandomString(25));


// caso exista cookie em cache
if ($cookie !== '') {
    // procura algum user com esta cookie
    $query = "SELECT * FROM users WHERE cookie = '$cookie'";
    $result = mysqli_query($con, $query);
    // caso encontre algum user
    if (mysqli_num_rows($result) == 1) {
        // vai buscar as informações do user
        while ($row = mysqli_fetch_array($result)) {
            $name = $row['name'];
            $un = $row['username'];
            $darktheme = $row['theme'];
            $numlogins = $row['totallogins'];
            $active = $row['active'];
            $version = $row['version'];
        }
        if ($active == 0) {
            echo "Erro: Conta inativa.";
        } elseif ($version != $leggeraversion) {
            // incrementa o total de logins, limpa o número de tentativas e reseta a cookie
            $novoNumLogins = $numlogins + 1;
            $query = "UPDATE users SET totallogins = '$novoNumLogins', session = '$session' WHERE cookie = '$cookie'";
            $result = mysqli_query($con, $query);

            $nameArray = explode(' ', $name);
            $leggeraupdate = '<div class="animate__fadeInUp animate__animated container-fluid" style="color:var(--inverted-background-color)">

            <div class="row">
                <div class="col-sm-2"></div>
                <div class="col-sm-8 text-center" style="font-size:20px;padding-top:20vh;">Olá <span
                        style="font-weight:bold;color:var(--primary-title-color)">' . $nameArray[0] . '</span>. O LEGGERA
                    foi atualizado, fica a par das alterações:<br>
                    <span style="color:var(--primary-title-color);font-size:10px;">v1.26 - 10/abril/2022</span>
                </div>
                <div class="col-sm-2"></div>
            </div>
        
        
        
            <div class="row" style="padding-top:5vh;">
                <div class="col-sm-2"></div>
                <div class="col-sm-8">
                    <h2>Horientação Vertical</h2>
                </div>
                <div class="col-sm-2"></div>
            </div>
            <div class="row" style="padding-top:2vh">
                <div class="col-sm-1"></div>
                <div class="col-sm-3">O cabeçalho da aplicação, passou a ser exibido na vertical (inclusivé na vista de
                    colapsáveis).</div>
                <div class="col-sm-7">
                    <img src="assets/img/update-1.png">
                    <img src="assets/img/update-2.png">
                </div>
                <div class="col-sm-1"></div>
            </div>
        
            <div class="row" style="padding-top:10vh;">
                <div class="col-sm-2"></div>
                <div class="col-sm-8">
                    <h2>Marcadores e respetivas ligações</h2>
                </div>
                <div class="col-sm-2"></div>
            </div>
            <div class="row" style="padding-top:2vh">
                <div class="col-sm-1"></div>
                <div class="col-sm-3">Foi alterado o componente de ligações, dando agora suporte a marcadores.</div>
                <div class="col-sm-7">
                    <img src="assets/img/update-3.gif">
                    <img src="assets/img/update-4.gif">
                </div>
                <div class="col-sm-1"></div>
            </div>
        
            <div class="row" style="padding-top:15vh">
                <div class="col-sm-12 text-center">
                    <button id="update-notice" class="btn btn-info">Tomei conhecimento das alterações, obrigado!&nbsp;&nbsp;<i
                            class="lni lni-cool" style="color:black;"></i></button>
                </div>
        
            </div>';


            echo json_encode(array($name, $darktheme, $session, 'Leggera update', $leggeraupdate));
        } else {
            // devolve o nome, o tema e o utilizador ativo
            echo json_encode(array($name, $darktheme, $un, $session));
            // incrementa o número de logins
            $novoNumLogins = $numlogins + 1;
            $query = "UPDATE users SET totallogins = '$novoNumLogins', session = '$session' WHERE cookie = '$cookie'";
            $result = mysqli_query($con, $query);
        }
    } else {
        echo "Erro: Cookie inválida.";
    }
    mysqli_close($con);
}
