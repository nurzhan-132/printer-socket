<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="./this.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    body {
        font-family: Arial, sans-serif;
        font-size: 18px;
    }

    form {
        text-align: center; /* Center align the content within the form */
    }

    button, textarea, input, select {
        border-radius: 5px;
        padding: 5px;
        font-size: 18px;
        margin-bottom: 15px;
        width: 90%;
        border: 3px double black;
    }

    button {
        padding: 10px; /* Increase button padding for a more visually appealing button */
    }

    /* Additional styling for textarea if needed */
    textarea {
        height: 100px; /* Adjust the height based on your design */
    }

    /* Add hover or focus effects for better user interaction */
    button:hover, textarea:hover, input:hover, select:hover,
    button:focus, textarea:focus, input:focus, select:focus {
        border-color: grey; /* Change the border color on hover/focus */
    }
    .message-container {
        margin-top: 15px; /* Add some space between the form and the message container */
        text-align: center;
    }

    .success-message {
        color: green;
    }

    .error-message {
        color: red;
    }
</style>
    <title>Print Server</title>
</head>
<body>
    <h2>Print Server</h2>
    <form method="post" action="" enctype="multipart/form-data">
        <label for="printer_ip">Printer IP:</label>
        <input type="text" id="printer_ip" name="printer_ip" required><br>

        <label for="print_data">Command:</label>
        <textarea id="print_data" name="print_data" rows="12"></textarea><br>

        <label for="file">Select File:</label>
        <input type="file" id="file" name="file" accept=".txt"><br>

        <button  style="width:20%" type="submit">Send</button>
    </form>
    <div class="message-container">
    <?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve values from the form
    $printer_ip = isset($_POST['printer_ip']) ? $_POST['printer_ip'] : '';

    // Check if a file is uploaded
    if (!empty($_FILES['file']['tmp_name'])) {
        $data = file_get_contents($_FILES['file']['tmp_name']);
    } else {
        $data = isset($_POST['print_data']) ? $_POST['print_data'] : '';
    }

    // Validate the printer IP address and data
    if (filter_var($printer_ip, FILTER_VALIDATE_IP) && !empty($data)) {
        // Open a socket connection to the printer
        $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        if ($socket === false) {
            die("Unable to create socket: " . socket_strerror(socket_last_error()));
        }

        $result = socket_connect($socket, $printer_ip, 9100);
        if ($result === false) {
            die("Unable to connect to printer: " . socket_strerror(socket_last_error()));
        }

        // Send the print data to the printer
        socket_write($socket, $data, strlen($data));

        // Close the socket connection
        socket_close($socket);

        echo "<p class='success-message'>Print command sent successfully.</p>";
    } else {
        echo "<p class='error-message'>Invalid printer IP address or empty print data.</p>";
    }
}

?>
</div>
</body>
</html>
