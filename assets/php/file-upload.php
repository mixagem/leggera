<?php

if (isset($_FILES['file']['name'])) {
    $uploadOk = 1;
    // obtem o nome do ficheiro
    $filename = $_FILES['file']['name'];
    // dir onde guardar o ficheiro
    $location = "uploads/" . $filename;
    $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
    $imageFileType = strtolower($imageFileType);
    // extensões suportadas
    $valid_extensions = array("jpg", "jpeg", "png");
    // verifica se o ficheiro já existe
    if (file_exists($location)) {
        echo "Desculpa, já existe um ficheiro com esse nome.";
        $uploadOk = 0;
    }
    // verifica o tamanho do ficheiro (5MB max)
    if ($_FILES["file"]["size"] > 5242880) {
        echo "Desculpa, o tamanho máximo suportado para imagens é 5MB.";
        $uploadOk = 0;
    }
    if ($uploadOk != 0) {
        // verifica se o ficheiro tem uma das extensões suportadas
        if (in_array(strtolower($imageFileType), $valid_extensions)) {
            // faz upload do icheiro
            if (move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
                // devolve a imagem
                echo 'data:image/' . $imageFileType . ';base64,' . base64_encode(file_get_contents($location));
                // apaga o ficheiro
                unlink($location);
            }
        } else {
            echo "Desculpa, o ficheiro não tem uma das extensões suportadas (.jpg, .jpeg, e .png)";
        }
    }
    exit;
}
