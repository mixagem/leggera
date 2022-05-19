<?php

$un = trim($_POST['username']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');


// seleciona todos os manuais do utilizador
$query = "SELECT * FROM manuals WHERE author = '$un' ORDER BY timestamp DESC";
$result = mysqli_query($con, $query);

function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}


if (mysqli_num_rows($result) !== 0) {
    // envia para o array todos os manuais encontrados
    for ($set = array (); $row = $result->fetch_assoc(); $set[] = $row);

   
    echo json_encode(utf8ize($set));
} else {
    echo "Não existem manuais para este utilizador";
}
mysqli_close($con);
