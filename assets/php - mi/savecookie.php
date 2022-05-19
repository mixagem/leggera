<?php

$un = trim($_POST['username']);
$bolacha = trim($_POST['cookie']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');
// nem sei o que esta merda faz, veio direitinho do stackoverflow nem vou tocar
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
// fodass tava duro, necessário quando o servidor não tem a mesma collation que a bd. 
$con->set_charset('utf8mb4');
$con->query("SET collation_connection = utf8mb4_bin");

// guarda a cookie gerada no registo do utilizador
$query = "UPDATE users SET cookie = '$bolacha' WHERE username = '$un'";
$result = mysqli_query($con, $query);
if (mysqli_affected_rows($con) == 1) {
    echo "Cookie guardada com sucesso.";
} else {
    echo "Erro ao guardar cookie.";
}
mysqli_close($con);
