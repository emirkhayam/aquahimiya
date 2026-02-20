<?php
// Общие заголовки для всех API-ответов
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Разрешаем запросы с того же домена (куки сессии)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['http://aquachemistry.kg', 'https://aquachemistry.kg', 'http://localhost:5173', 'http://localhost:3000'];
if (in_array($origin, $allowed)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
}

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
