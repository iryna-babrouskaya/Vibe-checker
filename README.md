# Energy Lab PWA v10.0.2

Актуальная PWA-зборка Energy Lab, згенераваная з standalone `energy-lab-v10-clean.html`.

## Версія
**10.0.2**

## Што змянілася ў v10.0.2
Гэта тэхнічны update супраць старога service worker/cache:

- service worker URL версіяваны: `sw.js?v=10.0.2`;
- `updateViaCache: "none"`;
- `registration.update()` адразу пасля рэгістрацыі;
- паўторная праверка update праз 2.5 секунды;
- waiting/installing worker атрымлівае `SKIP_WAITING`;
- `controllerchange` аўтаматычна перазагружае старонку адзін раз;
- новы worker выкарыстоўвае `skipWaiting()` і `clients.claim()`;
- выдаляюцца ўсе старыя caches `energy-lab-*`;
- navigation requests: network-first з `cache: "no-store"`;
- static assets таксама спачатку правяраюцца ў network;
- manifest, icons і start URL маюць version query.

Гэта зроблена, каб ужо ўсталяваная PWA не заставалася на старым app shell пасля новага deploy.

## Deploy
Загрузі **ўсе файлы з гэтага архіва** ў корань GitHub Pages repo, замяніўшы старыя:

- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `icon-192.png`
- `icon-512.png`
- `VERSION`
- `README.md`

Пасля GitHub Pages deploy:
1. Адкрый сайт у Chrome пры наяўнасці інтэрнэту.
2. Пачакай 3–5 секунд.
3. Калі новая версія worker была знойдзена, старонка павінна перазагрузіцца сама.
4. У `Даныя` павінна паказвацца `Energy Lab · v10.0.2`.

Калі ўсталяваная Android PWA усё роўна паказвае стары экран, адкрыццё URL у Chrome павінна прымусіць worker абнавіцца; пасля гэтага закрый і зноў адкрый PWA.
