const fs = require('fs');
const path = require('path');

// Путь к файлу products.ts
const productsPath = path.join(__dirname, 'src', 'data', 'products.ts');

// Читаем файл
let content = fs.readFileSync(productsPath, 'utf8');

console.log('🎨 Начинаем обновление изображений товаров...\n');

// Счетчики замен
const replacements = {
  accessories: 0,
  filter: 0,
  pump: 0,
  dosage: 0,
  chlorine: 0,
  algicide: 0,
  coagulant: 0,
  phRegulator: 0
};

// Разбиваем файл на секции товаров
const products = content.split(/(?=\s{2,4}\{\s*\n\s{4}id:)/);

for (let i = 0; i < products.length; i++) {
  const product = products[i];

  // Проверяем есть ли placeholder
  if (!product.includes("images: ['/products/placeholder.jpg']")) {
    continue;
  }

  // Определяем категорию
  let newImage = null;

  if (product.includes("category: 'accessories'")) {
    newImage = '/products/accessories.jpg';
    replacements.accessories++;
  }
  else if (product.includes("category: 'filtration'")) {
    newImage = '/products/filter.jpg';
    replacements.filter++;
  }
  else if (product.includes("category: 'pumps'")) {
    newImage = '/products/pump.jpg';
    replacements.pump++;
  }
  else if (product.includes("category: 'dosage'")) {
    newImage = '/products/dosage.jpg';
    replacements.dosage++;
  }
  else if (product.includes("category: 'chemistry'")) {
    // Для химии проверяем название
    const nameMatch = product.match(/name:\s*['"]([^'"]+)['"]/);
    if (nameMatch) {
      const name = nameMatch[1].toLowerCase();

      if (name.includes('хлор') || name.includes('chlor')) {
        newImage = '/products/chlorine.jpg';
        replacements.chlorine++;
      }
      else if (name.includes('альгицид') || name.includes('algicid')) {
        newImage = '/products/algicide.jpg';
        replacements.algicide++;
      }
      else if (name.includes('коагулянт') || name.includes('coagul')) {
        newImage = '/products/coagulant.jpg';
        replacements.coagulant++;
      }
      else if (name.includes('ph') || name.includes('pH')) {
        newImage = '/products/ph-regulator.jpg';
        replacements.phRegulator++;
      }
      else {
        // По умолчанию для химии - chlorine
        newImage = '/products/chlorine.jpg';
        replacements.chlorine++;
      }
    }
  }

  // Если нашли подходящее изображение - заменяем
  if (newImage) {
    products[i] = product.replace(
      "images: ['/products/placeholder.jpg']",
      `images: ['${newImage}']`
    );
  }
}

// Собираем обратно
content = products.join('');

// Записываем файл
fs.writeFileSync(productsPath, content, 'utf8');

console.log('✅ Обновление завершено!\n');
console.log('📊 Статистика замен:');
console.log(`  🛠️  Аксессуары (accessories.jpg): ${replacements.accessories}`);
console.log(`  🔧 Фильтры (filter.jpg): ${replacements.filter}`);
console.log(`  ⚙️  Насосы (pump.jpg): ${replacements.pump}`);
console.log(`  💉 Дозирование (dosage.jpg): ${replacements.dosage}`);
console.log(`  🧪 Хлор (chlorine.jpg): ${replacements.chlorine}`);
console.log(`  🌿 Альгициды (algicide.jpg): ${replacements.algicide}`);
console.log(`  💧 Коагулянты (coagulant.jpg): ${replacements.coagulant}`);
console.log(`  🧬 pH-регуляторы (ph-regulator.jpg): ${replacements.phRegulator}`);

const total = Object.values(replacements).reduce((a, b) => a + b, 0);
console.log(`\n🎉 Всего обновлено: ${total} товаров\n`);
