<?php

$usermail = trim($_POST['usermail']);
$un = trim($_POST['username']);


// Import PHPMailer classes into the global namespace 
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$mail = new PHPMailer;

$mail->isSMTP();                      // Set mailer to use SMTP 
$mail->Host = 'mail.mambosinfinitos.pt';       // Specify main and backup SMTP servers 
$mail->SMTPAuth = true;               // Enable SMTP authentication 
$mail->Username = 'geral@mambosinfinitos.pt';   // SMTP username 
$mail->Password = ')QjMf^wH2bqI';   // SMTP password 
$mail->SMTPSecure = 'ssl';            // Enable TLS encryption, `ssl` also accepted 
$mail->Port = 465;                    // TCP port to connect to 

// Sender info 
$mail->setFrom('geral@mambosinfinitos.pt', 'Mixagem');

// Add a recipient 
$mail->addAddress($usermail);

// Set email format to HTML 
$mail->isHTML(true);

// Mail subject 
$mail->Subject = 'Email from Localhost by Mixagem';

function generateRandomString($length = 10)
{
    return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);
};

$token = trim(generateRandomString(25));
// Mail body content 
$mail->Body    = "here's your token biatch: " . $token  . "   | Agora perde o gajo.";

// ligação à BD
$con = mysqli_connect('localhost', 'root', '', 'superliggera');

// query a ver se o user e mail bate certo
$query = "SELECT name FROM users WHERE (email = '$usermail' AND username = '$un')";
$result = mysqli_query($con, $query);


if (mysqli_num_rows($result) == 1) {
    mysqli_close($con);
    $con2 = mysqli_connect('localhost', 'root', '', 'superliggera');
    $query2 = "UPDATE users SET unlocktoken = '$token' WHERE (email = '$usermail' AND username = '$un');";
    $result2 = mysqli_query($con2, $query2);
    if (mysqli_affected_rows($con2) == 1) {
        // Send email 
        if (!$mail->send()) {
            echo 'Error, message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Token enviado para o endereço selecionado.';
        }
    } else {
        echo 'Error updating database';
    }
} else {
    echo 'Erro, credenciais inválidas';
}
mysqli_close($con2);