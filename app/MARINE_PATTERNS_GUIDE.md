# Морские паттерны и декорации - Руководство

## Обзор

В проект добавлены красивые морские паттерны и декоративные элементы, которые делают белый фон более живым и интересным. Все эффекты оптимизированы для производительности и адаптивны.

---

## Компоненты

### 1. **MarineBackground** - Основные паттерны

Компонент с SVG-паттернами в морском стиле.

#### Варианты (variant):

- **`waves`** - Волновые узоры
- **`bubbles`** - Пузырьки воздуха
- **`ripples`** - Круги на воде (рябь)
- **`drops`** - Капли воды
- **`combined`** - Все паттерны вместе (по умолчанию)

#### Пример использования:

```tsx
import { MarineBackground } from '@/components/ui/marine-background';

<section className="relative overflow-hidden">
  <MarineBackground
    variant="waves"
    opacity={0.1}
    animated={true}
  />
  {/* Ваш контент */}
</section>
```

#### Параметры:

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| variant | 'waves' \| 'bubbles' \| 'ripples' \| 'drops' \| 'combined' | 'combined' | Тип паттерна |
| opacity | number | 0.15 | Прозрачность (0-1) |
| animated | boolean | true | Включить анимацию |

---

### 2. **FloatingElements** - Плавающие элементы

Анимированные круглые элементы, имитирующие пузырьки воздуха.

#### Пример использования:

```tsx
import { FloatingElements } from '@/components/ui/marine-background';

<section className="relative overflow-hidden">
  <FloatingElements count={8} />
</section>
```

#### Параметры:

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| count | number | 8 | Количество элементов |

---

### 3. **DecorativeWaves** - Декоративные волны

Слоистые волны в стиле SVG для украшения границ секций.

#### Позиции (position):

- **`top`** - Только сверху
- **`bottom`** - Только снизу
- **`both`** - Сверху и снизу

#### Варианты (variant):

- **`subtle`** - Тонкие (opacity 0.15)
- **`normal`** - Средние (opacity 0.25)
- **`bold`** - Яркие (opacity 0.35)

#### Пример использования:

```tsx
import { DecorativeWaves } from '@/components/ui/decorative-waves';

<section className="relative overflow-hidden">
  <DecorativeWaves
    position="bottom"
    variant="subtle"
    animated={true}
  />
</section>
```

---

### 4. **WaterDroplets** - Капли воды

Маленькие декоративные капли, разбросанные по фону.

```tsx
import { WaterDroplets } from '@/components/ui/decorative-waves';

<WaterDroplets count={15} />
```

---

### 5. **WaterCaustics** - Каустики (световые блики)

Эффект световых бликов на воде.

```tsx
import { WaterCaustics } from '@/components/ui/decorative-waves';

<WaterCaustics intensity="medium" />
```

#### Интенсивность:
- `low` - Низкая (opacity 0.05)
- `medium` - Средняя (opacity 0.1)
- `high` - Высокая (opacity 0.15)

---

## Рекомендации по использованию

### Для белых секций:

```tsx
<section className="relative py-20 bg-gradient-to-br from-white via-[#F8F9FA] to-white overflow-hidden">
  <MarineBackground variant="combined" opacity={0.12} animated />
  <FloatingElements count={6} />
  <DecorativeWaves position="bottom" variant="subtle" />

  <div className="relative z-10">
    {/* Контент */}
  </div>
</section>
```

### Для серых секций:

```tsx
<section className="relative py-20 bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] overflow-hidden">
  <MarineBackground variant="bubbles" opacity={0.1} animated />
  <FloatingElements count={10} />

  <div className="relative z-10">
    {/* Контент */}
  </div>
</section>
```

### Для светлых секций с акцентом:

```tsx
<section className="relative py-20 bg-gradient-to-br from-white via-[#F8FAFB] to-white overflow-hidden">
  <MarineBackground variant="ripples" opacity={0.08} animated />
  <FloatingElements count={8} />
  <DecorativeWaves position="bottom" variant="subtle" animated />
  <WaterCaustics intensity="low" />

  <div className="relative z-10">
    {/* Контент */}
  </div>
</section>
```

---

## Примененные секции

### ✅ Contact Section
- Pattern: `combined`
- Opacity: `0.12`
- Floating Elements: `6`

### ✅ Features Section
- Pattern: `waves`
- Opacity: `0.1`
- Floating Elements: `5`
- Waves: `both` (top & bottom)

### ✅ About Section
- Pattern: `ripples`
- Opacity: `0.08`
- Floating Elements: `8`
- Waves: `bottom`

### ✅ Calculator Section
- Pattern: `bubbles`
- Opacity: `0.1`
- Floating Elements: `10`

---

## CSS Анимации

Все анимации определены в `src/index.css`:

### Доступные классы:

```css
.animate-wave-slow        /* Медленные горизонтальные волны */
.animate-float-bubbles    /* Плавающие пузырьки */
.animate-pulse-ripple     /* Пульсирующая рябь */
.animate-float-up         /* Подъем вверх */
.animate-wave-layer-1     /* Слой волн 1 */
.animate-wave-layer-2     /* Слой волн 2 */
.animate-wave-layer-3     /* Слой волн 3 */
.animate-droplet-pulse    /* Пульсирующие капли */
```

---

## Производительность

### Оптимизации:

✅ **GPU-ускорение** - Используется `transform: translateZ(0)`
✅ **CSS containment** - Изоляция рендеринга секций
✅ **Lazy rendering** - Паттерны загружаются только когда видимы
✅ **Pointer-events: none** - Декорации не блокируют клики
✅ **Debounced animations** - Плавные анимации без перегрузки

### Рекомендации:

- Используйте `opacity` в диапазоне `0.08 - 0.15` для баланса между видимостью и ненавязчивостью
- Для мобильных устройств уменьшайте количество `FloatingElements` (5-8 вместо 10+)
- Комбинируйте разные паттерны для создания уникального вида каждой секции

---

## Цветовая схема

Все паттерны используют цвета из палитры проекта:

```css
--aqua-deep: #0A4F7C      /* Темно-синий */
--aqua-primary: #1DB5C6   /* Основной бирюзовый */
--aqua-bright: #4ECDC4    /* Яркий бирюзовый */
```

Градиенты автоматически адаптируются к этим цветам.

---

## Troubleshooting

### Паттерны не видны?

1. Проверьте, что секция имеет `position: relative`
2. Убедитесь, что `overflow-hidden` добавлен
3. Контент должен иметь `position: relative` и `z-index: 10`

### Анимации тормозят?

1. Уменьшите количество `FloatingElements`
2. Отключите `animated={false}` на мобильных
3. Используйте более простые варианты (`waves` вместо `combined`)

---

## Градиентные переходы между секциями

### SectionDivider - Разделители секций

Компонент для создания плавных визуальных переходов между секциями.

#### Варианты:

- **`wave`** - Волновой переход
- **`curve`** - Изогнутый переход
- **`slant`** - Наклонный переход
- **`triangle`** - Треугольный переход

#### Пример использования:

```tsx
import { SectionDivider } from '@/components/ui/section-divider';

<SectionDivider
  variant="wave"
  fromColor="#FFFFFF"
  toColor="#F8F9FA"
  height="md"
  flip={false}
/>
```

#### Параметры:

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| variant | 'wave' \| 'curve' \| 'slant' \| 'triangle' | 'wave' | Тип перехода |
| fromColor | string | '#FFFFFF' | Цвет начала |
| toColor | string | '#F8F9FA' | Цвет конца |
| height | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Высота |
| flip | boolean | false | Перевернуть |

---

### AnimatedWaveDivider - Анимированные волны

Многослойные анимированные волны для динамичных переходов.

```tsx
import { AnimatedWaveDivider } from '@/components/ui/section-divider';

<AnimatedWaveDivider
  fromColor="rgba(0, 0, 0, 0.1)"
  toColor="#FFFFFF"
  height="lg"
/>
```

---

### GradientOverlay - Градиентные наложения

Для тонкой коррекции цветовых переходов внутри секций.

```tsx
import { GradientOverlay } from '@/components/ui/section-divider';

<GradientOverlay
  from="rgba(255, 255, 255, 0)"
  to="rgba(248, 250, 251, 1)"
  direction="to-bottom"
  opacity={0.8}
  height="h-40"
/>
```

---

## Схема градиентов в проекте

```
Hero (Dark blue gradient)
   ↓ AnimatedWaveDivider
Benefits (White → Light gray → White)
   ↓ SectionDivider (wave)
Catalog (Light gray → Very light gray → White)
   ↓ SectionDivider (curve)
About (White → Very light gray → White)
   ↓ AnimatedWaveDivider
Services (Teal → Aqua → Dark blue)
   ↓ SectionDivider (wave, flipped)
Footer (Dark blue → Teal → Slate)
```

---

## Будущие улучшения

🔮 Добавить вариант с рыбками
🔮 Создать интерактивные пузырьки (реагируют на курсор)
🔮 Добавить звуковые эффекты воды (опционально)
🔮 Сделать темный режим с другими цветами
🔮 Parallax-эффекты для разделителей

---

Создано с ❤️ для проекта AQUAHIMIYA 🌊
