<?php
define('DATA_DIR', __DIR__ . '/../data/');
define('UPLOADS_DIR', __DIR__ . '/../uploads/products/');

function db_read(string $file): array {
    $path = DATA_DIR . $file . '.json';
    if (!file_exists($path)) return [];
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function db_write(string $file, array $data): bool {
    $path = DATA_DIR . $file . '.json';
    return file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) !== false;
}

function get_settings(): array {
    $path = DATA_DIR . 'settings.json';
    if (!file_exists($path)) return [];
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function save_settings(array $data): bool {
    $path = DATA_DIR . 'settings.json';
    return file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) !== false;
}

function get_products(): array { return db_read('products'); }
function save_products(array $p): bool { return db_write('products', array_values($p)); }

function get_categories(): array { return db_read('categories'); }
function save_categories(array $c): bool { return db_write('categories', array_values($c)); }

function next_id(array $items): int {
    $max = 0;
    foreach ($items as $i) { if ((int)($i['id'] ?? 0) > $max) $max = (int)$i['id']; }
    return $max + 1;
}

function make_slug(string $str): string {
    $ru = ['а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я'];
    $en = ['a','b','v','g','d','e','yo','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','shch','','y','','e','yu','ya'];
    $str = mb_strtolower($str);
    $str = str_replace($ru, $en, $str);
    $str = preg_replace('/[^a-z0-9]+/', '-', $str);
    return trim($str, '-') ?: 'product-' . time();
}

function format_price(float $price): string {
    return number_format($price, 0, '.', ' ') . ' сом';
}
