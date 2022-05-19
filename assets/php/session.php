<?php

$un = trim($_POST['username']);
$bolacha = trim($_POST['sessioncookie']);
$con = mysqli_connect('localhost', 'root', '', 'superleggera');
// guarda a cookie gerada no registo do utilizador
$query = "SELECT * from users WHERE (username = '$un' AND session = '$bolacha')";
$result = mysqli_query($con, $query);
if (mysqli_num_rows($result) == 1) {
    echo "Session OK";
    $query = "SELECT sessionticks from users WHERE (username = '$un' AND session = '$bolacha')";
    $result = mysqli_query($con, $query);
    while($row = mysqli_fetch_array($result))  {
        $ticks = $row['sessionticks']; 
        $query = "UPDATE users SET sessionticks ='$ticks'+1 WHERE (username = '$un' AND session = '$bolacha')";
        $result = mysqli_query($con, $query);
    }
} else {
    echo "Disconnected from LEGGERA";
}
mysqli_close($con);
