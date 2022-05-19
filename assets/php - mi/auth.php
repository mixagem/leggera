<?php

$un = trim($_POST['username']);
$pw = trim($_POST['password']);
$action = trim($_POST['action']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');
$leggeraversion = 1.28;

// nem sei o que esta merda faz, veio direitinho do stackoverflow nem vou tocar
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
// fodass tava duro, necessário quando o servidor não tem a mesma collation que a bd. 
$con->set_charset('utf8mb4');
$con->query("SET collation_connection = utf8mb4_bin");

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
{return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);};
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
                $version = $row['appver'];
            }

            if ($active == 0) {
                echo "Erro: Conta inativa.";
          
                
            } elseif ($version != $leggeraversion) {
                // incrementa o total de logins, limpa o número de tentativas e reseta a cookie
                $query = "UPDATE users SET totallogins = $numlogins+1, loginattempts=0, cookie='', session='$session' WHERE (username = '$un' AND password = '$newpw')";
                $result = mysqli_query($con, $query);
                $nameArray = explode(' ',$name);
                $leggeraupdate = '<div class="animate__fadeInUp animate__animated container-fluid" style="color:var(--inverted-background-color)"> <style>.updatebullet{background-color: var(--primary-title-color); border-radius: 50%; width: 20px; height: 20px; display: inline-block; text-align: center; color: var(--background-color);}</style> <div class="row" style="height:15vh;"> <div class="col-sm-2"></div><div class="col-sm-8 text-center" style="font-size:20px;padding-top:9vh">Olá <span style="font-weight:bold;color:var(--primary-title-color)">' . $nameArray[0] . '</span>. O LEGGERA foi atualizado, fica a par das alterações:<br><span style="color:var(--primary-title-color);font-size:10px;">v1.28 - 13/abril/2022</span> </div><div class="col-sm-2"></div></div><div style="width:100%;height:75vh;overflow-y:auto;overflow-x:clip"> <div class="row" style="padding-top:5vh;"> <div class="col-sm-2"></div><div class="col-sm-8"> <h2>Horientação Vertical <a class="update-more-details" href="#update-1-details" data-toggle="collapse"><span class="material-icons"> expand_circle_down </span></a></h2> </div><div class="col-sm-2"></div></div><div id="update-1-details" class="collapse multi-collapse"> <div class="row" style="padding-top:2vh;"> <div class="col-sm-1"> </div><div class="col-sm-10">O cabeçalho da aplicação, passou a ser exibido na vertical (inclusivé na vista de colapsáveis).</div><div class="col-sm-1"> </div></div><div class="row" style="padding-top:2vh;padding-bottom:20px;"> <div class="col-sm-1"> </div><div class="col-sm-4" style="border: 10px solid var(--primary-title-color);border-radius: 15px;padding: 0;"> <img src="assets/img/update-1.png" style="max-width: 100%;filter: grayscale(1);"> </div><div class="col-sm-1"></div><div class="col-sm-5" style="border: 10px solid var(--primary-title-color);border-radius: 15px;padding: 0;"> <img src="assets/img/update-2.png" style="max-width: 100%"> </div><div class="col-sm-1"> </div></div></div><div class="row"> <div class="col-sm-2"></div><div class="col-sm-8"> <h2>Marcadores (e respetivas ligações) <a class="update-more-details" href="#update-2-details" data-toggle="collapse"><span class="material-icons"> expand_circle_down </span></a></h2> </div><div class="col-sm-2"></div></div><div id="update-2-details" class="collapse multi-collapse"> <div class="row" style="padding-top:2vh"> <div class="col-sm-1"> </div><div class="col-sm-10">Foi adicionado um novo componente<span style="font-size:18px;">&trade;</span> para criação de introdução de marcadores (&nbsp;&nbsp; <button class="btn btn-info main-menu" style="margin-bottom: 5px;"><i class="lni lni-link"></i> Títulos & Ligações</button> &nbsp;&nbsp;).</div><div class="col-sm-1"> </div></div><div class="row" style="padding-top:2vh;padding-bottom:20px;"> <div class="col-sm-1"> </div><div class="col-sm-10"> <span style="display: block;width:100%"> <span class="updatebullet">1</span> &nbsp;&nbsp;Posicionar o cursor na localização desejada para o separador.<br><br><span class="updatebullet">2</span> &nbsp;&nbsp;Atribuir um nome identificativo para o separador (sem acentuação, pontuação ou espaços - hiféns autorizados).<br><br><span class="updatebullet">3</span> &nbsp;&nbsp;Carregar em &nbsp;&nbsp;<button class="btn btn-success" style="margin-bottom:5px;"><i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir Separador</button> &nbsp;&nbsp;para adicionar o separador ao código do manual. </span><br><br><div class="text-center"><img src="assets/img/update-3.png" style="max-width: 65%;border: 10px solid var(--primary-title-color);border-radius: 15px;padding: 0;"> </div><br><br>Todos os separadores introduzidos através do LEGGERA terão seguinte a estrura de código:<br><br><div class="text-center" style="font-size:20px;">&lt;div id="marcador-<span style="font-weight: bold;color:var(--primary-title-color)">NomeAtribuidoPeloUtilizador</span>" style="display:none;"&gt;&lt;/div&gt; </div><br><br>Em adição, na pré-visualização do LEGGERA, o separador é exibido através de um retângulo piscante, ocuando a largura da pré-visualização.<br><br><div class="text-center"><div class="funky-bookmarks" id="marcador-como-lancar">### marcador ###</div></div><br><br>Tanto o retângulo piscante, como o marcador, estarão invisíveis ao leitor final no HelpCenter.<br><br><span style="display: block;width:100%"> <span class="updatebullet">4</span> &nbsp;&nbsp;Posicionar o cursor na localização desejada para a ligação para o separador.<br><br><span class="updatebullet">5</span> &nbsp;&nbsp;Da lista de separadores disponíveis, selecionar o separador desejado.<br><br><span class="updatebullet">6</span> &nbsp;&nbsp;Carregar em &nbsp;&nbsp;<button class="btn btn-success" style="margin-bottom: 5px;"><i class="lni lni-construction-hammer"></i>&nbsp;&nbsp;Introduzir Ligação</button> &nbsp;&nbsp;para adicionar o separador ao código do manual. </span><br><br><div class="text-center"><img src="assets/img/update-5.png" style="max-width: 65%;border: 10px solid var(--primary-title-color);border-radius: 15px;padding: 0;"> </div><br><br><span style="display: block;width:100%"> <span class="updatebullet">7</span> &nbsp;&nbsp;Jogo feito, nada mais (step by step).<br><br></span> <div class="text-center"><video autoplay muted controls src="assets/img/update-6.mp4" style="max-width: 65%;border: 10px solid var(--primary-title-color);border-radius: 15px;padding: 0;"></div></div><div class="col-sm-1"> </div></div></div></div><div class="row" style="height:10vh;display:flex;align-items: center;"> <div class="col-sm-12 text-center"> <button id="update-notice" class="btn btn-info" onclick="updateNotice()">Tomei conhecimento das alterações, obrigado!&nbsp;&nbsp;<i class="lni lni-cool" style="color:black;"></i></button> </div></div>';
                echo json_encode(array($name, $darktheme, $un, $session, $leggeraupdate));  


            } else {
                // incrementa o total de logins, limpa o número de tentativas e reseta a cookie
                $query = "UPDATE users SET totallogins = $numlogins+1, loginattempts=0, cookie='', session='$session' WHERE (username = '$un' AND password = '$newpw')";
                $result = mysqli_query($con, $query);
                echo json_encode(array($name, $darktheme, $un, $session));
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
