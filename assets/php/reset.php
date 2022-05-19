<?php

$pw = trim($_POST['password']);
$token = trim($_POST['token']);

$data = $pw;
$method = "AES-256-CTR";
$ivlength = openssl_cipher_iv_length($method);
$iv = "6543210987654321";
$key = "2855";
$options = 0;
$newpw = openssl_encrypt($data, $method, $key, $options, $iv);


// ligação à BD
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

// buscar o nome
$query = "SELECT name, image from users WHERE unlocktoken='$token'";
$result = mysqli_query($con, $query);

// se o token for válido, devolve o nome e a imagem
if (mysqli_num_rows($result) == 1) {

    // guarda os valores antes de apagar o token
    while ($row = mysqli_fetch_array($result)) {
        $nome = $row['name'];
        $imagem = $row['image'];
    }

    // query a resetar a password, e a desbloquear o utilizador
    $query = "UPDATE users SET loginattempts =0, active=1, unlocktoken='', password='$newpw' WHERE unlocktoken='$token'";
    $result = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) == 1) {
        echo $nome . $imagem;
    } else {
        echo "Error updating DB";
    }
} else {
    echo "Erro: Token inválido";
}
