<?php

$un = trim($_POST['username']);
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

// seleciona todos os manuais do utilizador
$query = "SELECT * FROM manuals WHERE author = '$un' ORDER BY timestamp DESC";
$result = mysqli_query($con, $query);
// array para guardar todos os manuais
$jsonarray = [];

if (mysqli_num_rows($result) !== 0) {
    // envia para o array todos os manuais encontrados
    while ($row = mysqli_fetch_assoc($result)) {
        $jsonarray[] = $row;
    };
    echo json_encode($jsonarray);
} else {
    echo "Não existem manuais para este utilizador";
}
mysqli_close($con);
