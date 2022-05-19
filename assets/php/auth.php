<?php
    // obtem os valores do formulário
    $un = trim($_POST['username']);
    $pw = trim($_POST['password']);

    // ligação à BD
    $con = mysqli_connect ('localhost', 'root', '', 'superliggera');

    // query
    $query = "SELECT username, password, nome FROM users WHERE (username = '$un' AND password = '$pw')";
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
