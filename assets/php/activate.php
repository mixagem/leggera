<?php

$un = trim($_GET['u']);
$token = trim($_GET['t']);
$con = mysqli_connect('localhost', 'root', '', 'superleggera');

// procura na bd algum registo com o respetivo username/token
$query = "SELECT * FROM users WHERE (username = '$un' AND unlocktoken = '$token')";
$result = mysqli_query($con, $query);

if (mysqli_num_rows($result) == 1) {
    // atualiza o registo do utilizador (ative a conta, limpa o token, e define o tema default[1])
    $query = "UPDATE users SET active ='1', theme ='1', unlocktoken='' WHERE (username = '$un' AND unlocktoken = '$token')";
    $result = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) == 1) {
        echo "Conta ativada com sucesso.";
    } else {
        echo "Erro: Ocorreu um erro ao ativar a conta.";
    }
    mysqli_close($con);
}