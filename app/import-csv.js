// Скрипт для импорта товаров из CSV в products.ts
const fs = require('fs');

// Парсинг CSV данных
const csvData = `Насос Espa Silen I 33 0,45 кВт  от 2м3 до 10м3 ,h 1-10м;шт;36500
Насос Espa Silen I 50 0,65 кВт  от 2м3 до 4м3 ,h 1-14м,h 1 - 12м;шт;38700
Насос Espa Silen S 75  1,2кВт  от 9м3 до 18м3 ,h 5 - 13м;шт;48400
Насос Espa Silen S 100  1,3кВт  от 9м3 до 20м3 ,h 5-15м;шт;48400
Ящик коммутации,управления,защита Hager;шт;15900
Щиток пластик ,белый;шт;4000
Насос JCP10-50 0,37 кВт,220V-240V,50HZ/60HZ,1.5" port ,  от3м3 до10м3 h 1 - 10 м;шт;13000
Насос JCP10-75 0,55 кВт,220V-240V,50HZ/60HZ,1.5" port , от 3м3 до 13 м3 h 1 - 10 м;шт;14600
Насос JCP10-100 0,75кВт,220V-240V,50HZ/60HZ,1.5" port  от 3 м3 до 15 м3 h 1 -10 м;шт;15000
Насос JCP10-120  0, 9 кВт,220V-240V,50HZ/60HZ от 3м3 до 18 м3 h 1- 12м;шт;16400
Насос JCP10-150 1,1 кВт.220V-240V,50HZ/60HZ,2" port  от4 м3 до 24 м3 h 6-15;шт;23100
Насос JCP10-200 1,5 кВт,220V-240V,50HZ/60HZ,2" port  от 4 м3 до 30 м3 h 8 - 17м;шт;25100
Насос JCP10-300 2,2 кВт,220V-240V,50HZ/60HZ,2" port  от 4м3 до 36м3 h 3-18 м3;шт;30300
Насос JSP3-400 4HP,380V,50HZ/60HZ,2.5",3",4" port ,3кВт, от 10 м3 до 75 м3,h 7-13 м;шт;37000
Насос JSP3-550 5.5HP,380V,50HZ/60HZ,2.5",3",4" port ,4 кВт, от 20 м3 до 84 м3 h8-16м;шт;38000
Воздуходув алюминевый Aluminium alloy Air Blower 1,3 кВт;шт;23600
Воздуходув алюминевый Aluminium alloy Air Blower 1,5 кВт;шт;28000
Воздуходув алюминевый JAB2-700 700W,220V,0.8m³/Min,Low Voice,Double Speed;шт;9200
Воздуходув алюминевый JAB2-900 900W,220V,0.8m³/Min,Low Voice,Double Speed;шт;9800
Нагреватель Pahlen 6 кВт;шт;40000
Нагреватель Pahlen 9 кВт;шт;43000
Нагреватель Pahlen 12 кВт;шт;45000
Нагреватель Pahlen 15 кВт;шт;48000
Нагреватель Pahlen 18 кВт;шт;50000
Фильтр песчаный боковой подкллючение JFT3-400 diameter:400mm. Flow rate:6m³/h Connection:1.5";шт;16100
Фильтр песчаный боковой подкллючение  JFT3-500 diameter:500mm. Flow rate:10m³/h Connection:1.5;шт;21400
Фильтр песчаный боковой подкллючение  JFT3-650 diameter:650mm. Flow rate:17m³/h Connection:1.5";шт;25000
Фильтр песчаный боковой подкллючение  JFT3-750 diameter:750mm. Flow rate:22m³/h Connection:2";шт;34500
Фильтр песчаный боковой подкллючение  JFT3-900 diameter:900mm. Flow rate:30m³/h Connection:2";шт;42900
Кварцевый песок 0,4мм - 0,9мм ,мешок 25 кг;шт;55
Кварцевый песок 1мм - 3мм ,мешок 25кг;шт;55
Вентил для фильтра Top mount valve JFT3-V15;шт;9000
Вентил для фильтра Top mount valve  JFT3-V20;шт;9800
Озонатор басса JSC1 PLUS-8 8g/h about 35m³pool;шт;35000
Озонатор басса JSC1 PLUS-12 12g/h about 50m³pool;шт;37800
Озонатор басса JSC1 PLUS-20 20g/h about 85m³pool;шт;46400
Озонатор басса JSC3-50 50g/h,2 in 1 Chlorinator,chlorine&light.(solar;шт;88500
Солярия 3 кВт;шт;112400
Теплообменик JHE135 40kw 304;шт;9400
Теплообменик JHE260 75kw 304;шт;12200
Теплообменик JHE400 120kw 304;шт;16300
Светильни подводная для залевантого JLL1-18W Material:stainless steel 18w,DN23CM,blue/white/rgb;шт;4500
Светильни подводная пластик JLL12-18W Material:ABS,DN23CM,18w;шт;4000
Светильни врезаемыая JLL32-290-Recessed liner pool light 25w RGB;шт;8000
Прожектор басса для залевантого JPAR56-25W , Led;шт;3600
Прожектор басса для залевантого JPAR56-300W , галоген;шт;2700
Трансформатор JLLT-300 300W/12V/AC,(24V optional);шт;6000
Трансформатор JLLT-30 30W/12V/AC,(24V optional);шт;2000
Термтерм большого пласмасовый;шт;1200
Термтерм большого металический;шт;2300
Сетка поверхносная;шт;500
Сетка поверхносная с ручкой;шт;1400
Щетка донная;шт;600
Пылисосас для бассейна сосса;шт;300
Штангна нижнего высасывание  для басейн;шт;1700
Переливнные решет широкая;шт;2000
Переливнные решет узконная;шт;1700
Шланг для пылисоса JCT7-7.5M Sprial wound EVA vacuum hose 1.5"x25' (38mm x7.5m);шт;2300
Шланг для пылисоса JCT7-9M Sprial wound EVA vacuum hose 1.5"x30' (38mm x9m);шт;2600
Шланг для пылисоса JCT7-12M Sprial wound EVA vacuum hose 1.5"x40' (38mm x12m);шт;3500
Шланг для пылисоса JCT7-15M Sprial wound EVA vacuum hose 1.5"x50' (38mm x15m);шт;4300
Телескопичной штанк JCT8-480 2X240 cm Ribbed pole - 1.1mm thick (Color:Blue,Silver;шт;2000
Телескопичной штанк JCT8-900 3X300 cm Ribbed pole - 1.1mm thick (Color:Blue,Silver);шт;3700
Тестер CL/PH;шт;500
Средствам очистки боковая соединение;шт;2000
Средствам соль,таблетка , гранулата;шт;800
Средствам применея;шт;600
Линия 25 мм;шт;1600
Лестница нерж. 3 ст. JL1-3S Stainless steel 316,3 steps,1.0mm;шт;12000
Лестница нерж. 4 ст.JL1-4S Stainless steel 316,4 steps,1.0mm;шт;13500
Лестница нерж. 5 ст.JL1-5S Stainless steel 316,5 steps,1.0mm;шт;15000
Прожектр большого с лампам;шт;650
Лампа PHILP с лампам;шт;2500
Прожектр большого;шт;2500
Скиммерка обрезная;шт;500
Прожектр малого;шт;700
Скиммер басса с линне Swimming Pool Skimmer JPA29;шт;3900
Скиммер басса с лайнер Swimming Pool Skimmer (liner pool) JPA32 for Liner Pool;шт;5100
Скиммер большого с лайнер Swimming Pool Skimmer(liner pool) JPA33 for Liner Pool;шт;7000
Скиммер большого с лайнер Swimming Pool Skimmer JPA111 38*38*43cm,liner pool;шт;5500
Переливное решетка high quality PP Steady Grating JPA42-20 20cm;м,п;900
Переливное решетка high quality PP Steady Grating PA42-25 25cm;м,п;1100
Водопад басса ширн. 600 мм Waterfall Nozzle JPA64-600 SS304,Height:1100mm open mouth width 600mm;шт;54300
Водопад Waterfall Nozzle JPA66 SS304,Height:920mm open mouth width:500mm;шт;50600
Водопад Waterfall Nozzle JPA68 SS304,Height:600mm open mouth width:400mm;шт;24400
Водопад басса линер с подсветкай Acrylic Waterfall Nozzle with RGB JPA99-650 H650*W300/12W/DC12V/Inlet 46mm;шт;40500
Донна воздухович Square bubble plate JPA69 diameter:300mm;шт;4200
Донна воздухович Square floating bath board JPA70 350*350mm;шт;7200
Лайнер для Pool Liner 1.5mm colour пвех Adriatic blue 2м * 25 м;м;1400
Лайнер для Pool Liner 1.5mm colour пвех ростция 2м * 25 м;м;1600
Лайнер для Pool Liner 1.5mm colour пвех голубого цветного 2м * 25 м;м;2000
Возвратная;м2;200
Закладные форно три или штука;шт;700
Гидромасажна форно, сопло пжэ;шт;6700
Уголок 45/50;шт;200
Уголок 45/63;шт;450
Уголок 45/75;шт;270
Уголок 90/50;шт;200
Уголок 90/63;шт;450
Уголок 90/75;шт;600
Муфта 50;шт;150
Муфта 63;шт;200
Муфта 75;шт;400
Отводка 50;шт;270
Отводка 63;шт;530
Отводка 75;шт;640
Сгонобника 50 1,2 вну.резба;шт;200
Сгонобника 50 1,2 нар.резба;шт;200
Сгонобника 63 2 вну.резба;шт;250
Сгонобника 63 2 нар.резба;шт;250
Крамка 50 х 1,5 нар.резба;шт;1000
Крамка 63 х 2 нар.резба;шт;2600
Заглужка треб 50;шт;2350
Заглужка треб 63;шт;4050
Заглужка треб 75;шт;7660
Клея для трбе 118 мл;шт;800
Клея для трбе 237 мл;шт;1000
Клея для трбе 473 мл;шт;2000
Клея для трбе 1 л;шт;2500
Очистки трубку 50;шт;1650
Очистки трубку 63;шт;2260`;

const lines = csvData.split('\n');
let idCounter = 100;

const categoryMap = {
  'Насос': 'pumps',
  'Воздуходув': 'blowers',
  'Нагреватель': 'heaters',
  'Фильтр': 'filters',
  'Кварцевый': 'filters',
  'Вентил': 'filters',
  'Озонатор': 'ozone',
  'Солярия': 'heaters',
  'Теплообменик': 'heaters',
  'Светильни': 'lighting',
  'Прожектор': 'lighting',
  'Трансформатор': 'lighting',
  'Термтерм': 'accessories',
  'Сетка': 'accessories',
  'Щетка': 'accessories',
  'Пылисосас': 'accessories',
  'Штангна': 'accessories',
  'Переливнные': 'accessories',
  'Шланг': 'accessories',
  'Телескопичной': 'accessories',
  'Тестер': 'accessories',
  'Средствам': 'chemistry',
  'Линия': 'accessories',
  'Лестница': 'accessories',
  'Лампа': 'lighting',
  'Скиммерка': 'accessories',
  'Скиммер': 'accessories',
  'Переливное': 'accessories',
  'Водопад': 'waterfalls',
  'Донна': 'accessories',
  'Лайнер': 'liner',
  'Возвратная': 'fittings',
  'Закладные': 'fittings',
  'Гидромасажна': 'accessories',
  'Уголок': 'fittings',
  'Муфта': 'fittings',
  'Отводка': 'fittings',
  'Сгонобника': 'fittings',
  'Крамка': 'fittings',
  'Заглужка': 'fittings',
  'Клея': 'fittings',
  'Очистки': 'fittings',
  'Ящик': 'accessories',
  'Щиток': 'accessories',
};

function getCategory(name) {
  for (let key in categoryMap) {
    if (name.startsWith(key)) {
      return categoryMap[key];
    }
  }
  return 'accessories';
}

function extractArticle(name) {
  const matches = name.match(/([A-Z]+[\d-]+)/);
  return matches ? matches[0] : `ART-${idCounter}`;
}

function extractBrand(name) {
  if (name.includes('Espa')) return 'Espa';
  if (name.includes('Pahlen')) return 'Pahlen';
  if (name.includes('JCP') || name.includes('JSP') || name.includes('JFT') || name.includes('JSC') || name.includes('JHE') || name.includes('JLL') || name.includes('JPAR') || name.includes('JLLT') || name.includes('JCT') || name.includes('JL1') || name.includes('JPA')) {
    const match = name.match(/J[A-Z]+[\d-]+/);
    return match ? match[0].match(/J[A-Z]+/)[0] : 'Generic';
  }
  if (name.includes('Hager')) return 'Hager';
  if (name.includes('Pool Liner')) return 'Pool Liner';
  return 'Generic';
}

const products = lines.map((line, index) => {
  const parts = line.split(';');
  if (parts.length < 3) return null;

  const name = parts[0].trim();
  const unit = parts[1].trim();
  const priceStr = parts[2].replace(' сом', '').replace(' ', '').trim();
  const price = parseInt(priceStr);

  if (!name || isNaN(price)) return null;

  idCounter++;

  return {
    id: idCounter,
    slug: name.toLowerCase().replace(/[^a-zа-я0-9]+/g, '-').replace(/^-|-$/g, ''),
    name: name,
    category: getCategory(name),
    description: name,
    fullDescription: name,
    price: price,
    specs: unit,
    article: extractArticle(name),
    brand: extractBrand(name),
    unit: unit || 'шт',
    inStock: true,
    characteristics: {},
    images: ['/products/placeholder.jpg']
  };
}).filter(p => p !== null);

console.log(`// Импортировано ${products.length} товаров из прайс-листа`);
console.log(JSON.stringify(products, null, 2));
