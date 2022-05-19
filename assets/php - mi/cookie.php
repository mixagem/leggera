<?php

$cookie = trim($_POST['cookie']);
$con = mysqli_connect('localhost', 'mambosin_leggeraroot', '?Rq3~Am}@%mb', 'mambosin_superleggera');
// nem sei o que esta merda faz, veio direitinho do stackoverflow nem vou tocar
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
// fodass tava duro, necessário quando o servidor não tem a mesma collation que a bd. 
$con->set_charset('utf8mb4');
$con->query("SET collation_connection = utf8mb4_bin");

// token generator
function generateRandomString($length = 10)
{
    return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);
};
$session = trim(generateRandomString(25));


// caso exista cookie em cache
if ($cookie !== '') {
    // procura algum user com esta cookie
    $query = "SELECT * FROM users WHERE cookie = '$cookie'";
    $result = mysqli_query($con, $query);
    // caso encontre algum user
    if (mysqli_num_rows($result) == 1) {
        // vai buscar as informações do user
        while ($row = mysqli_fetch_array($result)) {
            $name = $row['name'];
            $un = $row['username'];
            $darktheme = $row['theme'];
            $numlogins = $row['totallogins'];
            $active = $row['active'];
        }
        if ($active == 0) {
            echo 'conta inativa';
        } else {
            // devolve o nome, o tema e o utilizador ativo
            echo json_encode(array($name, $darktheme, $un, $session));
            // incrementa o número de logins
            $novoNumLogins = $numlogins + 1;
            $query = "UPDATE users SET totallogins = '$novoNumLogins', session = '$session' WHERE cookie = '$cookie'";
            $result = mysqli_query($con, $query);
        }
    } else {
        echo "Erro: Cookie inválida.";
    }
    mysqli_close($con);
}
