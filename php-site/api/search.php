<?php
/**
 * api/search.php — Поиск товаров для автодополнения
 */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

$q = trim($_GET['q'] ?? '');
if (strlen($q) < 2) { echo '[]'; exit; }

$products = get_products();
$q_lower  = mb_strtolower($q);

$matches = array_filter($products, fn($p) =>
    str_contains(mb_strtolower($p['name'] ?? ''), $q_lower) ||
    str_contains(mb_strtolower($p['article'] ?? ''), $q_lower) ||
    str_contains(mb_strtolower($p['brand'] ?? ''), $q_lower)
);

$result = array_map(fn($p) => [
    'slug'  => $p['slug'],
    'name'  => $p['name'],
    'price' => format_price($p['price']),
], array_slice(array_values($matches), 0, 6));

echo json_encode($result, JSON_UNESCAPED_UNICODE);
