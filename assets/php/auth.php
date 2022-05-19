<?php
// obtem os valores do formulário
$un = trim($_POST['username']);
$pw = trim($_POST['password']);


$data = $pw;
$method = "AES-256-CTR";
$ivlength = openssl_cipher_iv_length($method);
$iv = "6543210987654321";
$key = "2855";
$options = 0;
$newpw = openssl_encrypt($data, $method, $key, $options, $iv);

// ligação à BD
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

// query
$query = "SELECT username, password, name, active, loginattempts, totallogins, darktheme FROM users WHERE (username = '$un' AND password = '$newpw')";
$result = mysqli_query($con, $query);

// se da query resultar 1 match (ou seja, credenciais corretas)
if (mysqli_num_rows($result) == 1) {

    // buscar variaveis do user
    while ($row = mysqli_fetch_array($result)) {
        $name = $row['name'];
        $active = $row['active'];
        $numtenta = $row['loginattempts'];
        $numlogins = $row['totallogins'];
        $darktheme = $row['darktheme'];
    }

    if ($active == 0) {
        echo "Erro: Conta bloqueada. Chora agora.";
    } else {

        // incrementa o total login + reseta a cookie
        $query = "UPDATE users SET totallogins = $numlogins+1, loginattempts=0, cookie='' WHERE (username = '$un' AND password = '$newpw')";
        $result = mysqli_query($con, $query);
        echo json_encode(array($name,$darktheme));
    }
} else {
    $query = "SELECT loginattempts from users WHERE username = '$un'";
    $result = mysqli_query($con, $query);
    // caso não exista o user, dá skip a isto tudo
    if (mysqli_num_rows($result) == 1) {

        // vaibuscar o numero de tentativas, e acrescenta 1.
        $numtenta = mysqli_fetch_row($result);
        $novoNumtenta = $numtenta[0] + 1;

        // se chegou ás 3 tentativas, dá  lock
        if ($novoNumtenta >= 3) {
            $query = "UPDATE users SET loginattempts = 3, active = 0 WHERE username = '$un'";
            $result = mysqli_query($con, $query);
        } else {
            // incrementa uma tentativa ao utilizador
            $query = "UPDATE users SET loginattempts = $novoNumtenta WHERE username = '$un'";
            $result = mysqli_query($con, $query);
        }
    }
    echo "Erro: Credenciais inválidas";
}
mysqli_close($con);
