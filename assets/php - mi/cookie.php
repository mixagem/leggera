<?php

$cookie = trim($_POST['cookie']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');
$leggeraversion = 1.29;
// nem sei o que esta merda faz, veio direitinho do stackoverflow nem vou tocar
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
// fodass tava duro, necessário quando o servidor não tem a mesma collation que a bd. 
$con->set_charset('utf8mb4');
$con->query("SET collation_connection = utf8mb4_bin");

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
            $version = $row['appver'];
        }
        if ($active == 0) {
            echo 'conta inativa';
        // leggera update?
        } elseif ($version != $leggeraversion) {
            // incrementa o total de logins, limpa o número de tentativas e reseta a cookie
            $novoNumLogins = $numlogins + 1;
            $query = "UPDATE users SET totallogins = '$novoNumLogins', session = '$session' WHERE cookie = '$cookie'";
            $result = mysqli_query($con, $query);
            $nameArray = explode(' ', $name);
            $leggeraupdate = '<div class="animate__fadeInUp animate__animated container-fluid" style="color:var(--inverted-background-color)">
            <style>
                .updatebullet {
                    background-color: var(--primary-title-color);
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: inline-block;
                    text-align: center;
                    color: var(--background-color);
                }
            </style>
            <div class="row" style="height:15vh;">
                <div class="col-sm-2"></div>
                <div class="col-sm-8 text-center" style="font-size:20px;padding-top:9vh">Olá <span style="font-weight:bold;color:var(--primary-title-color)">' . $nameArray[0] . '</span>. O LEGGERA foi atualizado, fica a par das alterações:<br><span style="color:var(--primary-title-color);font-size:10px;">v1.29 - 25/maio/2022</span>            </div>
                <div class="col-sm-2"></div>
            </div>
            <div style="width:100%;height:75vh;overflow-y:auto;overflow-x:clip">
                <div class="row" style="padding-top:5vh;">
                    <div class="col-sm-2"></div>
                    <div class="col-sm-8">
                        <h2>Mensagens de validação<a class="update-more-details" href="#update-1-details" data-toggle="collapse"><span class="material-icons"> expand_circle_down </span></a></h2>
                    </div>
                    <div class="col-sm-2"></div>
                </div>
                <div id="update-1-details" class="collapse multi-collapse">
                    <div class="row" style="padding-top:2vh;">
                        <div class="col-sm-1"> </div>
                        <div class="col-sm-10">Quando carregamos, atualizamos ou apagamos um manual, é perguntado ao utilizador se tem a certeza se quer realizar a operação selecionada.
                        </div>
                        <div class="col-sm-1"> </div>
                    </div>
                   
                </div>
            
            <div class="row" style="height:10vh;display:flex;align-items: center;">
                <div class="col-sm-12 text-center"> <button id="update-notice" class="btn btn-info"
                        onclick="updateNotice()">Tomei conhecimento das alterações, obrigado!&nbsp;&nbsp;<i class="lni lni-cool"
                            style="color:black;"></i></button> </div>
            </div>';
            echo json_encode(array($name, $darktheme, $un, $session, $leggeraupdate));
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
