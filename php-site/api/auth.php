<?php
require_once __DIR__ . '/../includes/cors.php';
require_once __DIR__ . '/../includes/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET /api/auth.php — проверить статус по токену
if ($method === 'GET') {
    json_ok(['admin' => is_admin()]);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];

// POST /api/auth.php — логин или логаут
if ($method === 'POST') {
    $action = $body['action'] ?? 'login';

    if ($action === 'logout') {
        admin_logout();
        json_ok(['admin' => false]);
    }

    // login
    $password = $body['password'] ?? '';
    if (empty($password)) json_error('Password required');

    $token = admin_login($password);
    if ($token !== false) {
        json_ok(['admin' => true, 'token' => $token]);
    } else {
        sleep(1);
        json_error('Неверный пароль', 401);
    }
}

json_error('Method not allowed', 405);
