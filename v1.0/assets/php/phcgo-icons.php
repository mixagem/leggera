<?php

    // ligação à BD
    $con = mysqli_connect ('localhost', 'root', '', 'superliggera');

    // query
    $query = "SELECT code, align FROM icons";
    $result = mysqli_query($con, $query);

    $json = array();

        while($row = mysqli_fetch_assoc($result)) {
            $json[] = "<span style='verfical-align:" . $row['align'] . "; class='material-icons'>" . $row['code'] . "</span>"
        }

    echo json_encode($json)
 
    mysqli_close($con);
?>

<!--
    while($row = mysqli_fetch_array($result)) {
            echo "<span style='verfical-align:"
            echo $row['align']; 
            echo "; class='material-icons'>"
            echo $row['code'];
            echo "</span>"
        }
    -->