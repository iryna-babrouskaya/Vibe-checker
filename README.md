# Energy Experiments PWA

Zero-cost, local-first PWA для 6-тыднёвых эксперыментаў з энергіяй.

## Што ёсць
- quick events: Call / Context / Noise / People / Hard task / Walk / Recovery / Flow
- energy check-in 0–10
- evening check-in
- sleep check-in
- 6 эксперыментаў па тыднях
- лакальныя insights за 7 дзён
- JSON export/import
- offline PWA
- без backend, лагіна, аналітыкі і cookies

## Запуск лакальна
PWA/service worker патрабуе HTTP, таму:
```bash
python3 -m http.server 8080
```
Пасля адкрый `http://localhost:8080`.

## Бясплатны deploy
### GitHub Pages
1. Ствары repo і пакладзі туды ўсе файлы.
2. Settings → Pages.
3. Source: Deploy from a branch.
4. Branch: `main`, folder `/root`.
5. Адкрый URL GitHub Pages.

### Cloudflare Pages
1. New project → Pages.
2. Падключы repo.
3. Framework preset: None.
4. Build command: пусты.
5. Output directory: `/`.

## Даныя
Даныя жывуць у localStorage гэтага браўзера. Калі ачысціць browser storage — яны знікнуць.
Рабі Export JSON як backup.
