<?php
// obtem os valores do formulário
$un = trim($_POST['username']);
$pw = trim($_POST['password']);
$nome = trim($_POST['nome']);

// ligação à BD
$con = mysqli_connect('localhost', 'root', '', 'superliggera');
$query = "SELECT * FROM users";
$result = mysqli_query($con, $query);
$totalusers = mysqli_num_rows($result);
mysqli_close($con);

$con = mysqli_connect('localhost', 'root', '', 'superliggera');
$query2 = "SELECT * FROM users WHERE username = '$un'";
$result2 = mysqli_query($con, $query2);
$temuserigual = mysqli_num_rows($result2);
mysqli_close($con);

if ($temuserigual == 0) {    
    $con = mysqli_connect('localhost', 'root', '', 'superliggera');
    $query3 = "INSERT INTO users (id, username, password, name) 
    VALUES ('$totalusers'+1, '$un', '$pw', '$nome')";
    $result3 = mysqli_query($con, $query3);
    if (mysqli_affected_rows($con) == 1) {
        echo "Utilizador criado com sucesso: " . $un;
    } else {
        echo "Erro: Por algum motivo, fudeu :C";
    }
} else {
    echo "Erro: Utilizador em uso";
}
mysqli_close($con);
