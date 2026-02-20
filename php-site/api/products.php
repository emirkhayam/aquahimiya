<?php
require_once __DIR__ . '/../includes/cors.php';
require_once __DIR__ . '/../includes/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

// GET — публичный, возвращает все товары
if ($method === 'GET') {
    json_ok(get_products());
}

// Все остальные методы — только для админа
require_admin();

// POST — создать товар
if ($method === 'POST') {
    $products = get_products();
    $data = sanitize_product($body);
    $data['id'] = next_id($products);
    if (empty($data['slug'])) $data['slug'] = make_slug($data['name']);
    // Уникальность slug
    $slugs = array_column($products, 'slug');
    if (in_array($data['slug'], $slugs)) $data['slug'] .= '-' . $data['id'];

    $products[] = $data;
    save_products($products);
    json_ok($data);
}

// PUT — обновить товар
if ($method === 'PUT') {
    $id = (int)($body['id'] ?? 0);
    if (!$id) json_error('ID required');

    $products = get_products();
    $found = false;
    foreach ($products as &$p) {
        if ((int)$p['id'] === $id) {
            $update = sanitize_product($body);
            $update['id']   = $id;
            $update['slug'] = $p['slug']; // slug не меняем
            $p = array_merge($p, $update);
            $found = true;
            break;
        }
    }
    unset($p);
    if (!$found) json_error('Product not found', 404);
    save_products($products);
    json_ok(null);
}

// DELETE — удалить товар
if ($method === 'DELETE') {
    $id = (int)($body['id'] ?? $_GET['id'] ?? 0);
    if (!$id) json_error('ID required');

    $products = get_products();
    $filtered = array_filter($products, fn($p) => (int)$p['id'] !== $id);
    save_products(array_values($filtered));
    json_ok(null);
}

json_error('Method not allowed', 405);

function sanitize_product(array $d): array {
    return [
        'slug'            => trim($d['slug'] ?? ''),
        'name'            => trim($d['name'] ?? ''),
        'category'        => trim($d['category'] ?? ''),
        'brand'           => trim($d['brand'] ?? ''),
        'article'         => trim($d['article'] ?? ''),
        'specs'           => trim($d['specs'] ?? ''),
        'description'     => trim($d['description'] ?? ''),
        'fullDescription' => trim($d['fullDescription'] ?? ''),
        'price'           => (float)($d['price'] ?? 0),
        'oldPrice'        => !empty($d['oldPrice']) ? (float)$d['oldPrice'] : null,
        'unit'            => trim($d['unit'] ?? ''),
        'inStock'         => (bool)($d['inStock'] ?? true),
        'featured'        => (bool)($d['featured'] ?? false),
        'images'          => array_values(array_filter((array)($d['images'] ?? []))),
        'characteristics' => (object)($d['characteristics'] ?? []),
    ];
}
