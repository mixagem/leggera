<?php

    // ligação à BD
    $con = mysqli_connect ('localhost', 'root', '', 'superliggera');

    // query
    $query = "SELECT id, code FROM textbox";
    $result = mysqli_query($con, $query);

    $json = array();
    
    // devolve em json
    while($row = mysqli_fetch_assoc($result)) {
    $json[] = $row;
    }

    echo json_encode($json)

    mysqli_close($con);
?>
