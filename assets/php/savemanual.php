<?php
    // obtem os valores do formulário
    $manual = trim($_POST['manual']);
    $un = trim($_POST['logged-user']);
    $code = trim($_POST['manual-code']);
    $timestamp = trim($_POST['last-updated']);

    // ligação à BD
    $con = mysqli_connect ('localhost', 'root', '', 'superliggera');

    // query
    $query = 

    // pega no nome do manual e no utilizador, e procura na BD uma linha com esse nome
    // se encontrar, faz update a essa linha
    // se não encontrar, adiciona uma nova linha


    $result = mysqli_query($con, $query);

    // se da query resultar 1 match (ou seja, credenciais corretas)
    if (mysqli_affected_rows($con) == 1) {
        echo "cookie-login-sucessfull";
    } else {
        echo "cookie-login-failed";
    }   
    mysqli_close($con);
?>