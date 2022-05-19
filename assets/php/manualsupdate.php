<?php

$un = trim($_POST['username']);
$manual = trim($_POST['manual']);
$action = trim($_POST['action']);
$timestamp = trim($_POST['timestamp']);
$code = trim($_POST['code']);

// ligação à BD
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

if ($action === 'delete') {
    // buscar o nome
    $query = "SELECT * from manuals WHERE (author = '$un' AND title = '$manual')";
    $result = mysqli_query($con, $query);
    if (mysqli_num_rows($result) == 1) {
        $query = "DELETE FROM manuals WHERE (author = '$un' AND title = '$manual')";
        $result = mysqli_query($con, $query);
        $apagueimanual = mysqli_affected_rows($con);
        if ($apagueimanual = 1) {
            echo "Manual apagado com sucesso";
        } else {
            echo "Err: Deu merda ao apagar";
        }
    } else {
        echo "Err: não encontrei esse tópico para esse user chico, aperta contigo";
    }
}

if ($action === 'save') {
    // buscar o nome
    $query = "SELECT * from manuals WHERE (author = '$un' AND title = '$manual')";
    $result = mysqli_query($con, $query);
    if (mysqli_num_rows($result) == 1) {
        $query = "UPDATE manuals SET code ='$code', timestamp='$timestamp' WHERE (author = '$un' AND title = '$manual')";
        $result = mysqli_query($con, $query);
        $apagueimanual = mysqli_affected_rows($con);
        if ($apagueimanual = 1) {
            echo "Manual atualizado com sucesso";
        } else {
            echo "Err: Deu merda ao apagar";
        }
    } else {
        $query = "INSERT INTO manuals (author, title, code, timestamp)
        VALUES ('$un', '$manual', '$code', '$timestamp')";
        $result = mysqli_query($con, $query);
        $crieimanual = mysqli_affected_rows($con);
        if ($crieimanual = 1) {
            echo "Manual criado com sucesso";
        } else {
            echo "Err: Deu merda ao criar";
        }
    }
}
mysqli_close($con);
