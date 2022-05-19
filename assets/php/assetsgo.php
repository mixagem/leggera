<?php

$action = trim($_POST['action']);
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

if ($action == 'icons') {
    // seleciona todos os icons
    $query = "SELECT * from icons";
    $result = mysqli_query($con, $query);
    // array para guardar os assets
    $jsonarray = [];
    if (mysqli_num_rows($result) !== 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            // manda para array o icon, já formatado
            $jsonarray[] = "<span style='vertical-align:" . $row['valign'] . ";' class='material-icons'>" . $row['iconcode'] . "</span>";
        };
        echo json_encode($jsonarray);
    } else {
        echo "Erro: Ocurreu um erro ao carregar os icons do PHC GO.";
    }
}

if ($action == 'textboxes') {
    // seleciona todas as textboxes
    $query = "SELECT * from textboxes";
    $result = mysqli_query($con, $query);
    // array para guardar os assets
    $jsonarray = [];
    if (mysqli_num_rows($result) !== 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $jsonarray[] ="<div class='novoalerta " . $row['textboxclass'] . "'><div class='novoalerta-titulo'>" . $row['titulo'] . "</div><br><div class='novoalerta-contido'>" . $row['texto'] . "</div></div>";
        };
        echo json_encode($jsonarray);
    } else {
        echo "Erro: Ocurreu um erro ao carregar as textboxes do PHC GO.";
    }
}

if ($action == 'buttons') {
    // seleciona todas os buttons horizon
    $query = "SELECT * from buttons WHERE theme='horizon' ORDER BY subid";
    $result = mysqli_query($con, $query);
    // array para guardar os assets - tema horizon
    $horizonarray = [];
    if (mysqli_num_rows($result) !== 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $horizonarray[] = $row['code'];
        };
    } else {
        echo "Erro: Ocurreu um erro ao carregar os buttons (horizon) do PHC GO.";
    }
    // seleciona todas os buttons forest
    $query = "SELECT * from buttons WHERE theme='forest' ORDER BY subid";
    $result = mysqli_query($con, $query);
    // array para guardar os assets - tema forest
    $forestarray = [];
    if (mysqli_num_rows($result) !== 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $forestarray[] = $row['code'];
        };
    } else {
        echo "Erro: Ocurreu um erro ao carregar os buttons (forest) do PHC GO.";
    }
    // seleciona todas os buttons dark
    $query = "SELECT * from buttons WHERE theme='dark' ORDER BY subid";
    $result = mysqli_query($con, $query);
    // array para guardar os assets - tema dark
    $darkarray = [];
    if (mysqli_num_rows($result) !== 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $darkarray[] = $row['code'];
        };
    } else {
        echo "Erro: Ocurreu um erro ao carregar os buttons (dark) do PHC GO.";
    }
    // seleciona todas os buttons light
    $query = "SELECT * from buttons WHERE theme='light' ORDER BY subid";
    $result = mysqli_query($con, $query);
    // array para guardar os assets - tema light
    $lightarray = [];
    if (mysqli_num_rows($result) !== 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $lightarray[] = $row['code'];
        };
    } else {
        echo "Erro: Ocurreu um erro ao carregar os buttons (light) do PHC GO.";
    }
    // array com todos os buttons do PHC GO
    $jsonarray = [$horizonarray,$forestarray,$darkarray,$lightarray];
    echo json_encode($jsonarray);
}
mysqli_close($con);

