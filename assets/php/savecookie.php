<?php
    // obtem os valores do formulário
    $un = trim($_POST['username']);
    $bolacha = trim($_POST['cookie']);

    // ligação à BD
    $con = mysqli_connect ('localhost', 'root', '', 'superliggera');

    // query
    $query = "UPDATE users SET cookie = '$bolacha' WHERE username = '$un'";
    $result = mysqli_query($con, $query);

    // se da query resultar 1 match (ou seja, credenciais corretas)
    if (mysqli_affected_rows($con) == 1) {
        echo "cookie-login-sucessfull";
    } else {
        echo "cookie-login-failed";
    }   
    mysqli_close($con);
?>