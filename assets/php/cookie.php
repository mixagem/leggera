<?php
// obtem os valores do formulário
$cookie = trim($_POST['cookie']);

if ($cookie !== '') {
// ligação à BD
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

// query
$query = "SELECT name, username, totallogins, darktheme FROM users WHERE cookie = '$cookie'";
$result = mysqli_query($con, $query);

// se da query resultar 1 match (ou seja, credenciais corretas)
if (mysqli_num_rows($result) == 1) {

    while ($row = mysqli_fetch_array($result)) {
        $name = $row['name'];
        $un = $row['username'];
        $darktheme = $row['darktheme'];
        $numlogins = $row['totallogins'];
    }

    echo json_encode(array($name,$darktheme,$un));

    $novoNumLogins = $numlogins + 1;
    $query = "UPDATE users SET totallogins = '$novoNumLogins' WHERE cookie = '$cookie'";
    $result = mysqli_query($con, $query);
} else {
    echo "Erro: login-failed";
}
mysqli_close($con);
}