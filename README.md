# Energy Lab PWA v10.2.2

## Critical fix
v10.2.1 утрымлівала сінтаксічную памылку ў JavaScript template literal,
з-за якой прыкладанне не магло выканаць render і UI-кнопкі знікалі.

v10.2.2 выпраўляе гэтую памылку.

## Даныя
LocalStorage key **не змяняўся**:
`energyLabV10Clean`

Таму даныя, створаныя ў папярэдніх сумяшчальных версіях на тым жа origin,
павінны застацца і зноў з'явіцца пасля загрузкі выпраўленай версіі.

## Функцыі
- незалежны `⚡ Energy зараз`;
- work-scoped Energy checkpoints;
- Energy да/пасля event і delta;
- event rating 0–10;
- рэдагаванне і выдаленне events/checkpoints;
- day/week charts;
- сон, рэйтынг дня;
- custom categories/tags;
- JSON/CSV export.

## PWA
Service worker/cache version: `energy-lab-10.2.2`.
Замяні ўсе файлы GitHub Pages файламі з гэтага архіва.
