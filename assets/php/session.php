<?php

$un = trim($_POST['username']);
$bolacha = trim($_POST['sessioncookie']);
$con = mysqli_connect('localhost', 'root', '', 'superleggera');
// guarda a cookie gerada no registo do utilizador
$query = "SELECT * from users WHERE (username = '$un' AND session = '$bolacha')";
$result = mysqli_query($con, $query);
if (mysqli_num_rows($result) == 1) {
    echo "Session OK";
} else {
    echo "Disconnected from LEGGERA";
}
mysqli_close($con);
