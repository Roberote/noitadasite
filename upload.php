<?php
// Configurações básicas
header('Content-Type: application/json');
$response = ['success' => false, 'message' => ''];

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Método não permitido';
    echo json_encode($response);
    exit;
}

// Verificar se os dados foram enviados
if (!isset($_FILES['clipe']) || !isset($_POST['player'])) {
    $response['message'] = 'Dados incompletos';
    echo json_encode($response);
    exit;
}

// Pasta de uploads
$uploadDir = '../uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Informações do arquivo
$file = $_FILES['clipe'];
$player = $_POST['player'];
$fileName = uniqid($player . '_') . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
$filePath = $uploadDir . $fileName;

// Mover arquivo para a pasta de uploads
if (move_uploaded_file($file['tmp_name'], $filePath)) {
    $response['success'] = true;
    $response['message'] = 'Clipe enviado com sucesso!';
    $response['filePath'] = $filePath;
} else {
    $response['message'] = 'Erro ao enviar o clipe';
}

echo json_encode($response);
?>
