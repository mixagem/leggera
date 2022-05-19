<?php

$pw = trim($_POST['password']);
$token = trim($_POST['token']);

// ligação à BD
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

// buscar o nome
$query = "SELECT name, image from users WHERE unlocktoken='$token'";
$result = mysqli_query($con, $query);

// se o token for válido, devolve o nome e a imagem
if (mysqli_num_rows($result) == 1) {

    // guarda os valores antes de apagar o token
    while ($row = mysqli_fetch_array($result)) {
        $nome = $row['name'];
        $imagem = $row['image'];
    }

    // query a resetar a password, e a desbloquear o utilizador
    $query = "UPDATE users SET loginattempts =0, active=1, unlocktoken='', password='$pw' WHERE unlocktoken='$token'";
    $result = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) == 1) {
        echo $nome . $imagem;
    } else {
        echo "Error updating DB";
    }
} else {
    echo "Erro: Token inválido";
}
