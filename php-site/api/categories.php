<?php
require_once __DIR__ . '/../includes/cors.php';
require_once __DIR__ . '/../includes/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

// GET — публичный
if ($method === 'GET') {
    json_ok(get_categories());
}

require_admin();

// POST — создать категорию
if ($method === 'POST') {
    $name = trim($body['name'] ?? '');
    $icon = trim($body['icon'] ?? '📦');
    if (!$name) json_error('Name required');

    $cats  = get_categories();
    $newId = make_slug($name);
    foreach ($cats as $c) { if ($c['id'] === $newId) json_error('Category already exists'); }
    $cats[] = ['id' => $newId, 'name' => $name, 'icon' => $icon];
    save_categories($cats);
    json_ok(['id' => $newId, 'name' => $name, 'icon' => $icon]);
}

// PUT — обновить категорию
if ($method === 'PUT') {
    $id   = trim($body['id'] ?? '');
    $name = trim($body['name'] ?? '');
    $icon = trim($body['icon'] ?? '📦');
    if (!$id || !$name) json_error('ID and name required');

    $cats = get_categories();
    $found = false;
    foreach ($cats as &$c) {
        if ($c['id'] === $id) { $c['name'] = $name; $c['icon'] = $icon; $found = true; break; }
    }
    unset($c);
    if (!$found) json_error('Not found', 404);
    save_categories($cats);
    json_ok(null);
}

// DELETE — удалить категорию
if ($method === 'DELETE') {
    $id = trim($body['id'] ?? $_GET['id'] ?? '');
    if (!$id) json_error('ID required');

    $cats = array_filter(get_categories(), fn($c) => $c['id'] !== $id);
    save_categories(array_values($cats));
    json_ok(null);
}

json_error('Method not allowed', 405);
