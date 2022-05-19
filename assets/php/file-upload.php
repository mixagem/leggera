<?php

if (isset($_FILES['file']['name'])) {

    $uploadOk = 1;
    /* Getting file name */
    $filename = $_FILES['file']['name'];

    /* Location */
    $location = "uploads/" . $filename;
    $imageFileType = pathinfo($location, PATHINFO_EXTENSION);
    $imageFileType = strtolower($imageFileType);

    /* Valid extensions */
    $valid_extensions = array("jpg", "jpeg", "png");

    // Check if file already exists
    if (file_exists($location)) {
        echo "Sorry, file already exists.";
        $uploadOk = 0;
    }

    // Check file size
    if ($_FILES["file"]["size"] > 500000) {
        echo "Sorry, your file is too large.";
        $uploadOk = 0;
    }

    $response = 0;

    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    } else {
        /* Check file extension */
        if (in_array(strtolower($imageFileType), $valid_extensions)) {
            /* Upload file */
            if (move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
                $response = 'data:image/' . $imageFileType . ';base64,' . base64_encode(file_get_contents($location));
                unlink($location);
                // $response = $location;
            }
        }
    }

    echo $response;
    exit;
}
