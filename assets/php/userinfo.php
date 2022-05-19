<?php

$un = trim($_POST['username']);
$action = trim($_POST['action']);
$con = mysqli_connect('localhost', 'root', '', 'superleggera');


switch ($action) {
    case 'userstats':
        // vai buscar os dados do utilizador
        $query = "SELECT * from users WHERE username = '$un'";
        $result = mysqli_query($con, $query);
        if (mysqli_num_rows($result) == 1) {
            while ($row = mysqli_fetch_array($result)) {
                // guarda os dados do utilizador necessários
                $nome = $row['name'];
                $email = $row['email'];
                $cookie = $row['cookie'];
                $totallogins = $row['totallogins'];
                $img = $row['image'];
                $alertas = $row['wantalerts'];
            }
        }

        // vai buscar os manuais do utilizador
        $query = "SELECT * from manuals where author='$un'";
        $result = mysqli_query($con, $query);
        if (mysqli_num_rows($result) !== 0) {
            $totalmanuals = mysqli_num_rows($result);
        } else {
            $totalmanuals = 0;
        }
        $jsonarray = [];
        $jsonarray[] = "<br><div class='container-fluid'>
        <div style='padding-top:20px;' class='row'>
            <div style='display: flex;justify-content: center;' class='col-md-4'>
                <img id='user-pic' style='max-height: 200px;border-radius: 50%;' src='" . $img . "'>
            </div>
            <div id='user-info-wrapper' class='col-md-8'>
                <div id='user-info'>
                    <div style='width:100%;font-size:35px;font-weight: bold;'>" . $nome . "</div>
                    <div style='width:100%;font-size:20px'><span class='material-icons' style='vertical-align:sub;font-size:22px'>contact_mail</span>&nbsp;&nbsp;&nbsp;" . $email . "</div>
                    <div style='width:100%;padding-top:5px;'><span class='material-icons' style='vertical-align:top;font-size:22px'>cookie</span>&nbsp;&nbsp;&nbsp;&nbsp;" . $cookie . "</div>
                </div>
                <div id='user-stats' style='display: flex;text-align: center; padding-top: 2%;font-size: 20px;'>
                    <div style='width:50%;'>Número de logins<br>
                        <div style='padding:5px;;width:100%;font-size:30px;font-weight: bold;'>" . $totallogins . "</div>
                    </div>
                    <div style='width:50%;'>Número de manuais<br>
                        <div style='padding:5px;;width:100%;font-size:30px;font-weight: bold;'>" . $totalmanuals . "</div>
                    </div>
                </div>
            </div>";
        $jsonarray[] =  $alertas;
        echo json_encode($jsonarray);
        break;

    case 'theme-update':
        $theme = trim($_POST['theme']);
        // vai buscar os dados do utilizador
        $query = "SELECT * from users WHERE username = '$un'";
        $result = mysqli_query($con, $query);
        if (mysqli_num_rows($result) == 1) {
            $query = "UPDATE users SET theme = '$theme' WHERE username = '$un'";
            $result = mysqli_query($con, $query);
        } else {
        };
        break; 
        
    case 'alerts-update':
        $alertas = trim($_POST['alerts']);
        // vai buscar os dados do utilizador
        $query = "SELECT * from users WHERE username = '$un'";
        $result = mysqli_query($con, $query);
        if (mysqli_num_rows($result) == 1) {
            $query = "UPDATE users SET wantalerts = '$alertas' WHERE username = '$un'";
            $result = mysqli_query($con, $query);
        } else {
        };
        echo "<br><div class='container-fluid'>
        <div style='padding-top:20px;' class='row'>
            <div style='display: flex;justify-content: center;' class='col-md-4'>
                <img id='user-pic' style='max-height: 200px;border-radius: 50%;' src='" . $img . "'>
            </div>
            <div id='user-info-wrapper' class='col-md-8'>
                <div id='user-info'>
                    <div style='width:100%;font-size:35px;font-weight: bold;'>" . $nome . "</div>
                    <div style='width:100%;font-size:20px'><span class='material-icons' style='vertical-align:sub;font-size:22px'>contact_mail</span>&nbsp;&nbsp;&nbsp;" . $email . "</div>
                    <div style='width:100%;padding-top:5px;'><span class='material-icons' style='vertical-align:top;font-size:22px'>cookie</span>&nbsp;&nbsp;&nbsp;&nbsp;" . $cookie . "</div>
                </div>
                <div id='user-stats' style='display: flex;text-align: center; padding-top: 2%;font-size: 20px;'>
                    <div style='width:50%;'>Número de logins<br>
                        <div style='padding:5px;;width:100%;font-size:30px;font-weight: bold;'>" . $totallogins . "</div>
                    </div>
                    <div style='width:50%;'>Número de manuais<br>
                        <div style='padding:5px;;width:100%;font-size:30px;font-weight: bold;'>" . $totalmanuals . "</div>
                    </div>
                </div>
            </div>";
}
