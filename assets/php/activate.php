<?php

$un = trim($_GET['u']);
$token = trim($_GET['t']);


$con = mysqli_connect('localhost', 'root', '', 'superliggera');

// query
$query = "SELECT * FROM users WHERE (username = '$un' AND unlocktoken = '$token')";
$result = mysqli_query($con, $query);

// se da query resultar 1 match (ou seja, credenciais corretas)
if (mysqli_num_rows($result) == 1) {
    $query = "UPDATE users SET active ='1', darktheme ='0', unlocktoken='' WHERE (username = '$un' AND unlocktoken = '$token')";
    $result = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) == 1) {
        echo "conta ativa";
    } else {
        echo "Erro: Algum problema ao ativar a tua conta";
    }
    mysqli_close($con);
}