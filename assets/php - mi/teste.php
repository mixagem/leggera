<?php

$manual = trim($_POST['manual']);
$code = trim($_POST['code']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');
// nem sei o que esta merda faz, veio direitinho do stackoverflow nem vou tocar
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
// fodass tava duro, necessário quando o servidor não tem a mesma collation que a bd. 
$con->set_charset('utf8mb4');
$con->query("SET collation_connection = utf8mb4_bin");


// introduz o manual
$query = "INSERT INTO manuals (author, title, code, timestamp)
        VALUES ('teste', '$manual', '$code', '1')";
$result = mysqli_query($con, $query);

echo $code;

mysqli_close($con);

//áéíúóàèìòùÁÉÍÓÚÀÈÌÒÙäëïöüÄËÏaÖÜÇçÃÕãõâêîôûÂÊÎÔÛ