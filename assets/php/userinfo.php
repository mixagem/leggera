<?php

$un = trim($_POST['username']);
$userInfo = [];

// ligação à BD
$con = mysqli_connect('localhost', 'root', '', 'superliggera');
$query = "SELECT name, email, cookie, totallogins, image from users WHERE username = '$un'";


$result = mysqli_query($con, $query);
if (mysqli_num_rows($result) == 1) {
    while ($row = mysqli_fetch_array($result)) {
        $nome = $row['name'];
        $email = $row['email'];
        $cookie = $row['cookie'];
        $totallogins = $row['totallogins'];
        $img = $row['image'];
    }
}

$query = "SELECT * from manuals where author='$un'";
$result = mysqli_query($con, $query);
if (mysqli_num_rows($result) !== 0) {
    $totalmanuals = mysqli_num_rows($result);
}

echo "<br><div class='container-fluid'>
        <div style='padding-top:20px;' class='row'>

            <div style='display: flex;justify-content: center;' class='col-md-4'>

                <img style='max-height: 200px;border-radius: 50%;box-shadow: 2px 2px white,4px 4px #0b4b9d;border: 1px solid #00000080;' src='" . $img . "'>

            </div>


            <div id='user-info' class='col-md-8'>

                <div>
                    <div style='color:rgb(0, 40, 255);width:100%;font-size:35px;font-weight: bold;'>" . $nome . "</div>
                    <div style='width:100%;font-size:20px'>" . $email . "</div>
                    <div style='width:100%;padding-top:5px;'>" . $cookie . "</div>
                </div>
                <div style='display: flex;text-align: center; padding-top: 2%;font-size: 20px;'>
                    <div style='width:50%;'>Número de logins<br>
                        <div style='padding:5px;color:rgb(0, 40, 255);width:100%;font-size:30px;font-weight: bold;'>" . $totallogins . "</div>
                    </div>
                    <div style='width:50%;'>Número de manuais<br>
                        <div style='padding:5px;color:rgb(0, 40, 255);width:100%;font-size:30px;font-weight: bold;'>" . $totalmanuals . "</div>
                    </div>
                </div>





            </div>";