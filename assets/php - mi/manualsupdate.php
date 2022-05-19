<?php

$un = trim($_POST['username']);
$manual = trim($_POST['manual']);
$action = trim($_POST['action']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');
// nem sei o que esta merda faz, veio direitinho do stackoverflow nem vou tocar
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
// fodass tava duro, necessário quando o servidor não tem a mesma collation que a bd. 
$con->set_charset('utf8mb4');
$con->query("SET collation_connection = utf8mb4_bin");

switch ($action) {
    case 'delete':
        // buscar o manual escrito pelo utilizador 
        $query = "SELECT * from manuals WHERE (author = '$un' AND title = '$manual')";
        $result = mysqli_query($con, $query);
        if (mysqli_num_rows($result) == 1) {
            // apaga o manual
            $query = "DELETE FROM manuals WHERE (author = '$un' AND title = '$manual')";
            $result = mysqli_query($con, $query);
            $apagueimanual = mysqli_affected_rows($con);
            if ($apagueimanual = 1) {
                echo "Manual removido com sucesso.";
            } else {
                echo "Erro: O manual não foi removido.";
            }
        } else {
            echo "Erro: não encontrei nenhum tópico com esse nome, escrito pelo utilizador logado.";
        }
        break;
    case 'save':
        $code = trim($_POST['code']);
        $timestamp = trim($_POST['timestamp']);
        // buscar o manual escrito pelo utilizador 
        $query = "SELECT * from manuals WHERE (author = '$un' AND title = '$manual')";
        $result = mysqli_query($con, $query);
        if (mysqli_num_rows($result) == 1) {
            // atualiza o manual e o timestamp
            $query = "UPDATE manuals SET code ='$code', timestamp='$timestamp' WHERE (author = '$un' AND title = '$manual')";
            $result = mysqli_query($con, $query);
            $apagueimanual = mysqli_affected_rows($con);
            if ($apagueimanual == 1) {
                echo "Manual atualizado com sucesso.";
            } else {
                echo "Erro: O manual não foi atualizado.";
            }
        } else {
            // introduz o manual
            $query = "INSERT INTO manuals (author, title, code, timestamp)
        VALUES ('$un', '$manual', '$code', '$timestamp')";
            $result = mysqli_query($con, $query);
            $crieimanual = mysqli_affected_rows($con);
            if ($crieimanual == 1) {
                echo "Manual introduzido com sucesso";
            } else {
                echo "Erro: O manual não foi introduzido.";
            }
        }
        break;
}


mysqli_close($con);
