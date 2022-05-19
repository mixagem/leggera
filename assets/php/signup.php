<?php

$un = trim($_POST['username']);
$pw = trim($_POST['password']);
$nome = trim($_POST['nome']);
$email = trim($_POST['email']);
$con = mysqli_connect('localhost', 'root', '', 'superleggera');

// AES
$data = $pw;
$method = "AES-256-CTR";
$ivlength = openssl_cipher_iv_length($method);//não faço ideia q'isto faz, veio do stackoverflow assim maré
$iv = "6543210987654321";
$key = "2855";
$options = 0;
$newpw = openssl_encrypt($data, $method, $key, $options, $iv);

// Import PHPMailer classes into the global namespace 
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
$mail = new PHPMailer;
$mail->CharSet = 'UTF-8';
$mail->isSMTP();                      // Set mailer to use SMTP 
$mail->Host = 'mail.mambosinfinitos.pt';       // Specify main and backup SMTP servers 
$mail->SMTPAuth = true;               // Enable SMTP authentication 
$mail->Username = 'geral@mambosinfinitos.pt';   // SMTP username 
$mail->Password = ')QjMf^wH2bqI';   // SMTP password 
$mail->SMTPSecure = 'ssl';            // Enable TLS encryption, `ssl` also accepted 
$mail->Port = 465;                    // TCP port to connect to 
// Sender info 
$mail->setFrom('geral@mambosinfinitos.pt', 'SUPERLEGGERA Admin');
// Add a recipient 
$mail->addAddress($email);
// Set email format to HTML 
$mail->isHTML(true);
// Mail subject 
$mail->Subject = 'SUPPERLEGGERA - Recuperação da conta "' . $un . '"';

// token generator
function generateRandomString($length = 10)
{return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);};
$token = trim(generateRandomString(25));

// obtém o numero total de users (para gerar id)
$query = "SELECT * FROM users";
$result = mysqli_query($con, $query);
$totalusers = mysqli_num_rows($result);
// verifica se ja existe utilizador com esse nome
$query = "SELECT * FROM users WHERE username = '$un'";
$result = mysqli_query($con, $query);
$temuserigual = mysqli_num_rows($result);
if ($temuserigual == 0) {
    // introduz um novo utilizador
    $query = "INSERT INTO users (id, username, password, name, email, unlocktoken) 
    VALUES ('$totalusers'+1, '$un', '$newpw', '$nome', '$email', '$token')";
    $result = mysqli_query($con, $query);
    if (mysqli_affected_rows($con) == 1) {
        // envia o email
        $mail->Body = "<div style='width:100%'>
        <span style='display:flex;justify-content:center;align-self:center;'><img style='max-width:100%;height:auto;'
                src='data:image/png;base64,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'></span>
        <h1 style='font-family:Segoe UI, Tahoma, Geneva, Verdana, sans-serif;padding-left:40px;padding-top:40px;'>Olá
            " . $nome . ",</h1>
        <p style='font-family:Segoe UI, Tahoma, Geneva, Verdana, sans-serif;padding-left:20px'>A tua conta <span style='font-weight: bold;color:rgb(56,92,255)'>SUPPERLEGGERA</span> foi criada com sucesso!<br>
        Para validares o teu endereço de e-mail e ativares a tua conta, carrega na ligação seguinte:</p>
        <div style='display:flex;justify-content:center;align-self:center;padding:20px 0px;'>
            <a style='border:1px solid black;padding:5px 20px;font-size:20px;color:rgb(56,92,255);font-weight:bold;font-family:Segoe UI, Tahoma, Geneva, Verdana, sans-serif;border-radius: 5px;'>http://localhost/v10/assets/php/activate.php?t=" . $token . "&u=" . $un . "</a>
        </div>
        <span style='font-family:Segoe UI, Tahoma, Geneva, Verdana, sans-serif;display:flex;justify-content:center;align-self:center;font-size:10px;'>&copy;&nbsp;&nbsp;Mambos Infinitos 2022</span>
    </div>";
        // body alternativo sem HTML
        $mail->AltBody = "Olá " . $nome . "\nA tua conta SUPPERLEGGERA foi criada com sucesso!\nPara validares o teu endereço de e-mail e ativares a tua conta, carrega na ligação seguinte:\n\n>http://localhost/v10/assets/php/activate.php?t=" . $token . "&u=" . $un;
        if (!$mail->send()) {
            echo 'Error, message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Token enviado para o endereço selecionado.';
        }
    } else {
        echo "Erro: Ocorreu um erro ao introduzir o utilizador.";
    }
} else {
    echo "Erro: Nome de utilizador reservado.";
}
mysqli_close($con);