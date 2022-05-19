<?php

$cookie = trim($_POST['cookie']);
$con = mysqli_connect('localhost', 'root', '', 'superleggera');

// token generator
function generateRandomString($length = 10)
{return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);};
$session = trim(generateRandomString(25));


// caso exista cookie em cache
if ($cookie !== '') {
// procura algum user com esta cookie
$query = "SELECT * FROM users WHERE cookie = '$cookie'";
$result = mysqli_query($con, $query);
// caso encontre algum user
if (mysqli_num_rows($result) == 1) {
    // vai buscar as informações do user
    while ($row = mysqli_fetch_array($result)) {
        $name = $row['name'];
        $un = $row['username'];
        $darktheme = $row['theme'];
        $numlogins = $row['totallogins'];
    }
    // devolve o nome, o tema e o utilizador ativo
    echo json_encode(array($name,$darktheme,$un,$session));
    // incrementa o número de logins
    $novoNumLogins = $numlogins + 1;
    $query = "UPDATE users SET totallogins = '$novoNumLogins', session = '$session' WHERE cookie = '$cookie'";
    $result = mysqli_query($con, $query);
} else {
    echo "Erro: Cookie inválida.";
}
mysqli_close($con);
}