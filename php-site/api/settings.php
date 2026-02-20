<?php
require_once __DIR__ . '/../includes/cors.php';
require_once __DIR__ . '/../includes/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET — публичный (без adminPassword!)
if ($method === 'GET') {
    $s = get_settings();
    unset($s['adminPassword']);
    json_ok($s);
}

require_admin();

// POST — сохранить настройки
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $current = get_settings();

    $new = [
        'siteName'       => trim($body['siteName'] ?? $current['siteName'] ?? 'AQUAHIMIYA'),
        'whatsappNumber' => preg_replace('/\D/', '', $body['whatsappNumber'] ?? $current['whatsappNumber'] ?? ''),
        'phone'          => trim($body['phone'] ?? $current['phone'] ?? ''),
        'email'          => trim($body['email'] ?? $current['email'] ?? ''),
        'address'        => trim($body['address'] ?? $current['address'] ?? ''),
        'workingHours'   => trim($body['workingHours'] ?? $current['workingHours'] ?? ''),
        'adminPassword'  => $current['adminPassword'] ?? '',
    ];

    // Смена пароля
    if (!empty($body['newPassword'])) {
        $cur  = $body['currentPassword'] ?? '';
        $hash = $current['adminPassword'] ?? '';
        $ok   = empty($hash) ? ($cur === 'admin123') : password_verify($cur, $hash);
        if (!$ok) json_error('Неверный текущий пароль', 403);
        if (strlen($body['newPassword']) < 6) json_error('Пароль минимум 6 символов');
        $new['adminPassword'] = password_hash($body['newPassword'], PASSWORD_DEFAULT);
    }

    save_settings($new);
    unset($new['adminPassword']);
    json_ok($new);
}

json_error('Method not allowed', 405);
