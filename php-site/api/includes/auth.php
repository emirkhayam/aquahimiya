<?php
// Авторизация через токен (X-Admin-Token заголовок или adminToken в теле)
// Токен хранится в data/settings.json, генерируется при логине

require_once __DIR__ . '/db.php';

define('TOKEN_TTL', 86400 * 7); // 7 дней

function get_token_from_request(): string {
    // Из заголовка X-Admin-Token (через getallheaders или $_SERVER)
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower($k) === 'x-admin-token') return trim($v);
        }
    }
    // Резервный способ через $_SERVER (nginx)
    if (!empty($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
        return trim($_SERVER['HTTP_X_ADMIN_TOKEN']);
    }
    return '';
}

function is_admin(): bool {
    $token = get_token_from_request();
    if (empty($token)) return false;
    $s = get_settings();
    $stored = $s['_token'] ?? '';
    $expires = $s['_tokenExpires'] ?? 0;
    if (empty($stored) || $token !== $stored) return false;
    if ($expires > 0 && time() > $expires) return false;
    return true;
}

function require_admin(): void {
    if (!is_admin()) { json_error('Unauthorized', 401); }
}

function admin_login(string $password): string|false {
    $s = get_settings();
    $hash = $s['adminPassword'] ?? '';
    $ok = empty($hash) ? ($password === 'admin123') : password_verify($password, $hash);
    if (!$ok) return false;

    // Генерируем токен
    $token = bin2hex(random_bytes(32));
    $s['_token'] = $token;
    $s['_tokenExpires'] = time() + TOKEN_TTL;
    save_settings($s);
    return $token;
}

function admin_logout(): void {
    $s = get_settings();
    unset($s['_token'], $s['_tokenExpires']);
    save_settings($s);
}

function json_ok(mixed $data = null): never {
    echo json_encode(['ok' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error(string $msg, int $code = 400): never {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}
