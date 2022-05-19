<?php

$un = trim($_POST['username']);
$pw = trim($_POST['password']);
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

// AES
$data = $pw;
$method = "AES-256-CTR";
$ivlength = openssl_cipher_iv_length($method);
$iv = "6543210987654321";
$key = "2855";
$options = 0;
$newpw = openssl_encrypt($data, $method, $key, $options, $iv);

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
        $darktheme = $row['darktheme'];
    }

    if ($active == 0) {
        echo "Erro: Conta inativa.";
    } else {
        // incrementa o total de logins, limpa o número de tentativas e reseta a cookie
        $query = "UPDATE users SET totallogins = $numlogins+1, loginattempts=0, cookie='' WHERE (username = '$un' AND password = '$newpw')";
        $result = mysqli_query($con, $query);
        echo json_encode(array($name,$darktheme));
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
            $query = "UPDATE users SET loginattempts = 3, active = 0 WHERE username = '$un'";
            $result = mysqli_query($con, $query);
        } else {
            // se ainda não chegou ás 3 tentativas, atualiza o valor de tentativas
            $query = "UPDATE users SET loginattempts = $novoNumtenta WHERE username = '$un'";
            $result = mysqli_query($con, $query);
        }
    }
    echo "Erro: Credenciais inválidas";
}
mysqli_close($con);
