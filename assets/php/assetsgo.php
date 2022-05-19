<?php

$action = trim($_POST['action']);
// ligação à BD
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

if ($action == 'icons') {

    // query
    $query = "SELECT * from icons";
    $result = mysqli_query($con, $query);

    $jsonarray = [];
    // se da query resultar 1 match (ou seja, credenciais corretas)
    if (mysqli_num_rows($result) !== 0) {

        while ($row = mysqli_fetch_assoc($result)) {
            $jsonarray[] = "<span style='vertical-align:" . $row['valign'] . ";' class='material-icons'>" . $row['iconcode'] . "</span>";
        };

        echo json_encode($jsonarray);
    } else {
        echo "Erro: sei lá que aconteceste";
    }
}

if ($action == 'textboxes') {

    // query
    $query = "SELECT * from textboxes";
    $result = mysqli_query($con, $query);

    $jsonarray = [];
    // se da query resultar 1 match (ou seja, credenciais corretas)
    if (mysqli_num_rows($result) !== 0) {

        while ($row = mysqli_fetch_assoc($result)) {
            $jsonarray[] ="<div class='novoalerta " . $row['textboxclass'] . "'><div class='novoalerta-titulo'>" . $row['titulo'] . "</div><br><div class='novoalerta-contido'>" . $row['texto'] . "</div></div>";
        };

        echo json_encode($jsonarray);
    } else {
        echo "Erro: sei lá que aconteceste";
    }
}


if ($action == 'buttons') {

    // query
    $query = "SELECT * from buttons WHERE theme='horizon' ORDER BY subid";
    $result = mysqli_query($con, $query);

    $horizonarray = [];
    if (mysqli_num_rows($result) !== 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $horizonarray[] = $row['code'];
        };
    } else {
        echo "Erro: sei lá que aconteceste";
    }

    $query = "SELECT * from buttons WHERE theme='forest' ORDER BY subid";
    $result = mysqli_query($con, $query);
    $forestarray = [];
    if (mysqli_num_rows($result) !== 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $forestarray[] = $row['code'];
        };
    } else {
        echo "Erro: sei lá que aconteceste";
    }

    $query = "SELECT * from buttons WHERE theme='dark' ORDER BY subid";
    $result = mysqli_query($con, $query);
    $darkarray = [];
    if (mysqli_num_rows($result) !== 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $darkarray[] = $row['code'];
        };
    } else {
        echo "Erro: sei lá que aconteceste";
    }

    $query = "SELECT * from buttons WHERE theme='light' ORDER BY subid";
    $result = mysqli_query($con, $query);
    $lightarray = [];
    if (mysqli_num_rows($result) !== 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $lightarray[] = $row['code'];
        };
    } else {
        echo "Erro: sei lá que aconteceste";
    }

    $jsonarray = [$horizonarray,$forestarray,$darkarray,$lightarray];
    echo json_encode($jsonarray);
}
mysqli_close($con);

