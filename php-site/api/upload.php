<?php
require_once __DIR__ . '/../includes/cors.php';
require_once __DIR__ . '/../includes/auth.php';

require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('Method not allowed', 405);

$allowed = ['image/jpeg','image/png','image/webp','image/gif'];
$results = [];

$files = $_FILES['images'] ?? $_FILES['image'] ?? null;
if (!$files) json_error('No file uploaded');

// Нормализуем в массив файлов
$list = [];
if (is_array($files['name'])) {
    for ($i = 0; $i < count($files['name']); $i++) {
        $list[] = [
            'name'     => $files['name'][$i],
            'type'     => $files['type'][$i],
            'tmp_name' => $files['tmp_name'][$i],
            'error'    => $files['error'][$i],
            'size'     => $files['size'][$i],
        ];
    }
} else {
    $list[] = $files;
}

$dir = __DIR__ . '/../uploads/products/';
if (!is_dir($dir)) mkdir($dir, 0755, true);

foreach ($list as $f) {
    if ($f['error'] !== UPLOAD_ERR_OK) { $results[] = ['error' => 'Upload error: ' . $f['error']]; continue; }
    if (!in_array($f['type'], $allowed)) { $results[] = ['error' => 'Invalid type: ' . $f['type']]; continue; }
    if ($f['size'] > 5 * 1024 * 1024) { $results[] = ['error' => 'Too large']; continue; }

    $ext  = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
    $name = uniqid('img_', true) . '.' . $ext;
    $dest = $dir . $name;

    if (move_uploaded_file($f['tmp_name'], $dest)) {
        $results[] = ['url' => '/uploads/products/' . $name];
    } else {
        $results[] = ['error' => 'Failed to save'];
    }
}

json_ok($results);
