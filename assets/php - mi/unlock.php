<?php

$pw = trim($_POST['password']);
$token = trim($_POST['token']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');
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

// vai buscar as informações do utilizador com este token
$query = "SELECT * from users WHERE unlocktoken='$token'";
$result = mysqli_query($con, $query);
if (mysqli_num_rows($result) == 1) {
    // as informações do utilizador necessárias
    while ($row = mysqli_fetch_array($result)) {
        $nome = $row['name'];
    }
    // atualiza a password, apaga o token, e desbloqueia a conta
    $query = "UPDATE users SET loginattempts =0, active=1, unlocktoken='', password='$newpw' WHERE unlocktoken='$token'";
    $result = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) == 1) {
        // devolve a imagem e o nome do utilizador
        echo $nome;
    } else {
        echo "Erro: Ocorreu um erro ao atualizar a password do utilizador.";
    }
} else {
    echo "Erro: Token inválido.";
}
