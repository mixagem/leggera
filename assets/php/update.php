<?php

$leggeraversion = 1.29;
$un = trim($_POST['username']);
$con = mysqli_connect('localhost', 'root', '', 'superleggera');
// guarda a cookie gerada no registo do utilizador
$query = "UPDATE users SET appver = '$leggeraversion' WHERE username = '$un'";
$result = mysqli_query($con, $query);
$updatestatus = mysqli_affected_rows($con);
if ($updatestatus == 1) {
    echo 'Utilizador migrado com sucesso.';
} else {
    echo 'não foi possível atualizar a versão do utilizador.';
}
mysqli_close($con);
