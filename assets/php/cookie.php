<?php
    // obtem os valores do formulário
    $cookie = trim($_POST['cookie']);
 
    // ligação à BD
    $con = mysqli_connect ('localhost', 'root', '', 'superliggera');

    // query
    $query = "SELECT nome FROM users WHERE cookie = '$cookie'";
    $result = mysqli_query($con, $query);

    // se da query resultar 1 match (ou seja, credenciais corretas)
    if (mysqli_num_rows($result) == 1) {
        while($row = mysqli_fetch_array($result)) {
            echo $row['nome'];
        }
    } else {
        echo "login-failed";
    }   
    mysqli_close($con);
?>


