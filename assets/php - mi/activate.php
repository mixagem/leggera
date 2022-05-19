<?php

$un = trim($_GET['u']);
$token = trim($_GET['t']);
$nome = trim($_GET['n']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');
// nem sei o que esta merda faz, veio direitinho do stackoverflow nem vou tocar
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
// fodass tava duro, necessário quando o servidor não tem a mesma collation que a bd. 
$con->set_charset('utf8mb4');
$con->query("SET collation_connection = utf8mb4_bin");

// procura na bd algum registo com o respetivo username/token
$query = "SELECT * FROM users WHERE (username = '$un' AND unlocktoken = '$token')";
$result = mysqli_query($con, $query);

if (mysqli_num_rows($result) == 1) {
    // atualiza o registo do utilizador (ative a conta, limpa o token, e define o tema default[1])
    $query = "UPDATE users SET active ='1', theme ='1', unlocktoken='' WHERE (username = '$un' AND unlocktoken = '$token')";
    $result = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) == 1) {
        echo "<head>
        <meta charset='UTF-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>.:&nbsp;HelpCenter+&nbsp;Superleggera&nbsp;edition&nbsp;:.&nbsp;</title>
        <link id='theme-css' rel='stylesheet' type='text/css' href='/leggera/assets/css/style1.css'>
        <link rel='stylesheet' type='text/css' href='/leggera/assets/css/bootstrap.min.css'>
        <link rel='stylesheet' type='text/css' href='/leggera/assets/css/font-awesome.min.css'>
        <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/icon?family=Material+Icons'>
        <link rel='stylesheet' type='text/css'
            href='https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' />
        <link rel='stylesheet' type='text/css' href='https://cdn.lineicons.com/3.0/lineicons.css'>
    
        <link rel='shortcut icon' href='/leggera/favicon.ico' type='image/x-icon'>
        <link rel='icon' href='/leggera/favicon.ico' type='image/x-icon'>
    
    </head>
    
    <body>
        <div id='loading-wrapper' style='margin-top:-5vh;height:105vh;background-image: url(/leggera/assets/img/loading-bg-1.png);'>
            <span id='loading-gif' class='animate__animated animate__fadeIn'></span>
            <span id='loading-gif-red' class='animate__animated animate__fadeIn'></span>
            <div style='text-transform: uppercase;' id='loading-title' class='animate__animated animate__fadeIn animate__delay-1s'>REGISTO CONCLUÍDO COM
                SUCESSO, AGORA ARRANCA CONTIGO " . $nome . ".</div>
        </div>
    </body>
    
    <script src='/leggera/assets/js/jquery.min.js' type='text/javascript'></script>
    <script src='/leggera/assets/js/bootstrap.min.js' type='text/javascript'></script>
    <script>(function redirect() {
            const redirectTimer = setTimeout(function () {
                window.location.replace('/leggera/index.html');
            }, 5000);
        })();</script>";
    } else {
        echo "Erro: Ocorreu um erro ao ativar a conta.";
    }
    mysqli_close($con);
} else {
    echo "Erro: Ocorreu um erro ao ativar a conta.";
}