<?php

$leggeraversion = 1.28;
$un = trim($_POST['username']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');
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
