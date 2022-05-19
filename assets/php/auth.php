<?php

$un = trim($_POST['username']);
$pw = trim($_POST['password']);
$action = trim($_POST['action']);
$con = mysqli_connect('localhost', 'root', '', 'superleggera');
$leggeraversion = 1.25;


// AES
$data = $pw;
$method = "AES-256-CTR";
$ivlength = openssl_cipher_iv_length($method);
$iv = "6543210987654321";
$key = "2855";
$options = 0;
$newpw = openssl_encrypt($data, $method, $key, $options, $iv);

// token generator
function generateRandomString($length = 10)
{
    return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);
};
$session = trim(generateRandomString(25));


switch ($action) {
    case 'auth':

        // Vai buscar as informações do utilizador
        $query = "SELECT * FROM users WHERE (username = '$un' AND password = '$newpw')";
        $result = mysqli_query($con, $query);
        // caso as credenciais estejam corretas
        if (mysqli_num_rows($result) == 1) {
            while ($row = mysqli_fetch_array($result)) {
                // declarar variáveis com as restantes informações do utilizador
                $name = $row['name'];
                $active = $row['active'];
                $numtenta = $row['loginattempts'];
                $numlogins = $row['totallogins'];
                $darktheme = $row['theme'];
                $version = $row['version'];
            }
            if ($active == 0) {
                echo "Erro: Conta inativa.";
            } elseif ($version != $leggeraversion) {
                // incrementa o total de logins, limpa o número de tentativas e reseta a cookie
                $query = "UPDATE users SET totallogins = $numlogins+1, loginattempts=0, cookie='', session='$session' WHERE (username = '$un' AND password = '$newpw')";
                $result = mysqli_query($con, $query);

                $nameArray = explode(' ',$name);
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
                // incrementa o total de logins, limpa o número de tentativas e reseta a cookie
                $query = "UPDATE users SET totallogins = $numlogins+1, loginattempts=0, cookie='', session='$session' WHERE (username = '$un' AND password = '$newpw')";
                $result = mysqli_query($con, $query);
                echo json_encode(array($name, $darktheme, $session));
            }
        }
        // caso as credenciais estejam erradas
        else {
            // vai buscar o número de logins para o utilizador introduzido
            $query = "SELECT loginattempts from users WHERE username = '$un'";
            $result = mysqli_query($con, $query);
            // caso exista o user introduzido
            if (mysqli_num_rows($result) == 1) {
                // vai buscar o número de tentativas e acrescenta 1
                $numtenta = mysqli_fetch_row($result);
                $novoNumtenta = $numtenta[0] + 1;
                // se chegou ás 3 tentativas, inativa a conta
                if ($novoNumtenta >= 3) {
                    $query = "UPDATE users SET loginattempts = 3, active = 0, session='' WHERE username = '$un'";
                    $result = mysqli_query($con, $query);
                } else {
                    // se ainda não chegou ás 3 tentativas, atualiza o valor de tentativas
                    $query = "UPDATE users SET loginattempts = $novoNumtenta WHERE username = '$un'";
                    $result = mysqli_query($con, $query);
                }
            }
            echo "Erro: Credenciais inválidas";
        }
        break;
}
mysqli_close($con);
