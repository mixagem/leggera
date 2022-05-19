<?php
    // obtem os valores do formulário
    $un = trim($_POST['username']);

    // ligação à BD
    $con = mysqli_connect ('localhost', 'root', '', 'superliggera');

    // query
    $query = "SELECT title, code, timestamp FROM manuals WHERE author = '$un'";
    $result = mysqli_query($con, $query);

    $jsonarray = array();

    // se da query resultar 1 match (ou seja, credenciais corretas)
    if (mysqli_num_rows($result) !== 0) {

        while($row = mysqli_fetch_assoc($result)) {
            $jsonarray[] = $row;
        };

        echo json_encode($jsonarray);

    } else {
        echo "you have no manuals";
    }   
    mysqli_close($con);
?>

