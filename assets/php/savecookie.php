<?php

$un = trim($_POST['username']);
$bolacha = trim($_POST['cookie']);
$con = mysqli_connect('localhost', 'root', '', 'superleggera');

// guarda a cookie gerada no registo do utilizador
$query = "UPDATE users SET cookie = '$bolacha' WHERE username = '$un'";
$result = mysqli_query($con, $query);
if (mysqli_affected_rows($con) == 1) {
    echo "Cookie guardada com sucesso.";
} else {
    echo "Erro ao guardar cookie.";
}
mysqli_close($con);
