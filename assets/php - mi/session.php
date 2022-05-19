<?php

$un = trim($_POST['username']);
$bolacha = trim($_POST['sessioncookie']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');
// nem sei o que esta merda faz, veio direitinho do stackoverflow nem vou tocar
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
// fodass tava duro, necessário quando o servidor não tem a mesma collation que a bd. 
$con->set_charset('utf8mb4');
$con->query("SET collation_connection = utf8mb4_bin");

// guarda a cookie gerada no registo do utilizador
$query = "SELECT * from users WHERE (username = '$un' AND session = '$bolacha')";
$result = mysqli_query($con, $query);
if (mysqli_num_rows($result) == 1) {
    echo "Session OK";
    $query = "SELECT sessionticks from users WHERE (username = '$un' AND session = '$bolacha')";
    $result = mysqli_query($con, $query);
    $ticks;
    while ($row = $result->fetch_assoc()) {
        $ticks = $row['sessionticks'];
    }
    $query = "UPDATE users SET sessionticks ='$ticks'+1 WHERE (username = '$un' AND session = '$bolacha')";
    $result = mysqli_query($con, $query);
} else {
    echo "Disconnected from LEGGERA";
}
mysqli_close($con);
