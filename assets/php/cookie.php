<?php
// obtem os valores do formulário
$cookie = trim($_POST['cookie']);

if ($cookie !== '') {
// ligação à BD
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

// query
$query = "SELECT name, username, totallogins FROM users WHERE cookie = '$cookie'";
$result = mysqli_query($con, $query);

// se da query resultar 1 match (ou seja, credenciais corretas)
if (mysqli_num_rows($result) == 1) {

    $row = mysqli_fetch_row($result);
    $numlogins = $row[2];
    echo $row[1] . "/" . $row[0];
    $novoNumLogins = $numlogins + 1;
    $query = "UPDATE users SET totallogins = '$novoNumLogins' WHERE cookie = '$cookie'";
    $result = mysqli_query($con, $query);
} else {
    echo "login-failed";
}
mysqli_close($con);
}