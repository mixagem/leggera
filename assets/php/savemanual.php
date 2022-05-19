<?php
    // obtem os valores do formulário
    $manual = trim($_POST['manual']);
    $un = trim($_POST['logged-user']);
    $code = trim($_POST['manual-code']);
    $timestamp = trim($_POST['last-updated']);

    // ligação à BD
    $con = mysqli_connect ('localhost', 'root', '', 'superliggera');

    // query
    $query = "SELECT * FROM manuals WHERE (title = $manual AND author = $un)";
    $result = mysqli_query($con, $query);
    $existemanual = mysqli_num_rows($result);

    if ($existemanual == 1) {
        $query2 = "UPDATE manuals
        SET title = $manual
        SET author = $un
        SET code = $code
        SET timestamp = $timestamp
        WHERE (title = $manual AND author = $un)";
        $result2 = mysqli_query($con, $query2);
        $atualizeimanual = mysqli_affected_rows($con);
        if ($atualizeimanual = 1) {
            echo "Manual atualizado com sucesso";
        } else {
            echo "Deu merda a atualizar";
        }
    }

    if ($existemanual == 0) {
        $query3 = "INSERT INTO manuals (title, author, code, timestamp)
        VALUES ('$manual', '$un', '$code', '$timestamp')";
        $result3 = mysqli_query($con, $query3);
        $introduzimanual = mysqli_affected_rows($con);
        if ($introduzimanual = 1) {
            echo "Manual guardado com sucesso";
        } else {
            echo "Deu merda a guardar";
        }
    }
    mysqli_close($con);
?>