<?php
// obtem os valores do formulário
$un = trim($_POST['username']);
$pw = trim($_POST['password']);
$nome = trim($_POST['nome']);
$email = trim($_POST['email']);

//password encrypt
$data = $pw;
$method = "AES-256-CTR";
$ivlength = openssl_cipher_iv_length($method);//não faço ideia q'isto faz, veio do stackoverflow assim maré
$iv = "6543210987654321";
$key = "2855";
$options = 0;
$newpw = openssl_encrypt($data, $method, $key, $options, $iv);

// obtem numero total de users (para gerar id)
$con = mysqli_connect('localhost', 'root', '', 'superliggera');
$query = "SELECT * FROM users";
$result = mysqli_query($con, $query);
$totalusers = mysqli_num_rows($result);
mysqli_close($con);

// verifica se ja existe utilizador
$con = mysqli_connect('localhost', 'root', '', 'superliggera');
$query = "SELECT * FROM users WHERE username = '$un'";
$result = mysqli_query($con, $query);
$temuserigual = mysqli_num_rows($result);
mysqli_close($con);

if ($temuserigual == 0) {
    $con = mysqli_connect('localhost', 'root', '', 'superliggera');
    $query = "INSERT INTO users (id, username, password, name, email) 
    VALUES ('$totalusers'+1, '$un', '$newpw', '$nome', '$email')";
    $result = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) == 1) {
        echo "Utilizador criado com sucesso: " . $un;
    } else {
        echo "Erro: Por algum motivo, fudeu :C";
    }
} else {
    echo "Erro: Utilizador em uso";
}
mysqli_close($con);