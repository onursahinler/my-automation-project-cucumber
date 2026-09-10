# E-Commerce BDD Automation Framework (Cucumber + Playwright & TypeScript)

Bu proje, **Sauce Demo** e-ticaret platformunun kullanıcı senaryolarını **BDD (Davranış Odaklı Geliştirme)** yaklaşımıyla test eden, sürdürülebilir ve ölçeklenebilir bir **Web Otomasyon Framework**'üdür.

Senaryolar Gherkin (`.feature`) dosyalarında iş dilinde yazılır; adım tanımları bu cümleleri Playwright aksiyonlarına bağlar. Tarayıcı otomasyonu **Page Object Model** üzerine kuruludur, ortak davranışlar `BasePage` ile miras alınır, kurulum/temizlik `Cucumber World + hook`'larında merkezîleştirilir, sabit ile ortama bağlı değerler birbirinden ayrılır.

> Bu depo, [Playwright Test Runner ile yazılmış sürümün](https://github.com/onursahinler/my-automation-project) BDD/Cucumber karşılığıdır. `pages/`, `constants/`, `config/`, `data/`, `utils/` katmanları iki projede de aynıdır; yalnızca **koşum katmanı** (runner + senaryo ifadesi + raporlama adaptörü) değişir.

---

## Öne Çıkan Teknik Konseptler & Mimari

* **BDD / Gherkin:** Senaryolar `features/*.feature` içinde Türkçe (`# language: tr`) iş dilinde yazılır. Teknik olmayan paydaşlar da senaryoyu okuyup doğrulayabilir.
* **Adım Tanımları (Step Definitions):** Gherkin cümleleri `src/step-definitions/` altında Page Object çağrılarına bağlanır. Adım dosyalarında tek bir ham `page.locator()` çağrısı bulunmaz.
* **Page Object Model (POM):** Element locator'ları ile test adımları birbirinden ayrıldı; her sayfa kendi locator'larını ve iş kurallarını tanımlar.
* **BasePage & Kalıtım:** Tüm sayfa sınıflarının ortak davranışı (`page` yönetimi, navigasyon, etkileşim ve assertion sarmalayıcıları) `BasePage` içinde toplandı.
* **Cucumber World & Merkezî Hook Yönetimi:** Playwright versiyonundaki `app` / `loggedInApp` fixture'larının karşılığı; `src/support/world.ts` tüm Page Object'leri tek noktada üretir, `src/support/hooks.ts` tarayıcı yaşam döngüsünü (senaryo başına izole `BrowserContext`) yönetir.
* **Constants & Environment Ayrımı:** Değişmeyen değerler (beklenen mesajlar, URL kalıpları, dropdown value'ları) `constants/Constants.ts`'te; ortama göre değişen değerler (`BASE_URL`, parola, `HEADLESS`, `SLOW_MO`) `.env` dosyasında tutulur. **Beklenen mesaj metinleri Gherkin'e yazılmaz**, senaryolar `Constants`'a referans veren adımları kullanır.
* **Data-Driven Testing (DDT):** Kullanıcı adları `users.json`'dan, parolalar `.env`'den, checkout formu verileri ise **Faker** ile rastgele üretilir. Gherkin'deki `"standart"` / `"kilitli"` gibi roller `data/userByRole.ts` üzerinden kimlik bilgilerine eşlenir.
* **Test Etiketleme:** Senaryolar `@smoke`, `@regression`, `@e2e` ve `@severity:*` etiketleriyle sınıflandırıldı; `--tags` ve profillerle filtrelenerek koşulur.
* **Detaylı Raporlama:** Allure Report (`allure-cucumberjs`) + Cucumber HTML/JSON raporu. Senaryolar feature/severity ile sınıflandırılır; hata anına ait ekran görüntüsü / video / Playwright trace rapora otomatik iliştirilir.
* **Smart Wait & Auto-Wait:** Playwright'ın gömülü akıllı bekleme mekanizması kullanıldı; `sleep` / sabit bekleme yoktur (`performance_glitch_user` senaryosu bunu kanıtlar).
* **Rerun:** Başarısız senaryolar `@rerun.txt`'e yazılır; `npm run test:rerun` yalnızca onları tekrar koşar.

---

## Kullanılan Teknolojiler

| Alan | Teknoloji |
|---|---|
| Test Runner | [Cucumber.js](https://github.com/cucumber/cucumber-js) (`@cucumber/cucumber`) |
| Tarayıcı Otomasyonu | [Playwright](https://playwright.dev/) |
| Senaryo Dili | Gherkin (Türkçe) |
| Programlama Dili | TypeScript (`ts-node` ile derlenir) |
| Test Verisi Üretimi | [@faker-js/faker](https://fakerjs.dev/) (locale: `fakerTR`) |
| Raporlama | [Allure Report](https://allurereport.org/) (`allure-cucumberjs`) + Cucumber HTML Reporter |
| Ortam Yönetimi | `.env` + Node yerleşik `process.loadEnvFile()` (ek bağımlılık yok) |
| CI/CD | GitHub Actions |
| Sürüm Kontrolü | Git & GitHub |

---

## Klasör Yapısı

```text
my-automation-project-cucumber/
├── config/
│   └── env.ts                  # .env okuyucu — ortama bağlı tüm parametreler
├── constants/
│   └── Constants.ts            # Değişmeyen değerler: mesajlar, URL'ler, sort option'ları
├── data/
│   ├── users.json              # Kullanıcı adları (parola içermez)
│   ├── users.ts                # users.json + .env parolasını birleştirir
│   └── userByRole.ts           # Gherkin'deki rol adı -> kimlik bilgisi eşlemesi
├── pages/                      # Page Object Model
│   ├── BasePage.ts             # Ortak davranışlar (tüm sayfaların atası)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── CommonPage.ts           # Header + yan menü bileşeni
├── utils/
│   ├── DataFactory.ts          # Faker ile rastgele test verisi üretimi
│   └── AllureHelper.ts         # Allure meta verileri (etiket, adım, ek dosya)
├── features/                   # Gherkin senaryoları (# language: tr)
│   ├── login.feature
│   ├── checkout.feature
│   ├── cart-checkout-flow.feature
│   ├── performance-glitch-user.feature
│   └── sidebar.feature
├── src/
│   ├── support/
│   │   ├── world.ts            # CustomWorld: Page Object'ler + ortak akış yardımcıları
│   │   └── hooks.ts            # BeforeAll/Before/After: tarayıcı + context + kanıt toplama
│   └── step-definitions/       # Gherkin cümlelerini Page Object'lere bağlar
│       ├── common.steps.ts
│       ├── login.steps.ts
│       ├── inventory.steps.ts
│       ├── cart.steps.ts
│       ├── checkout.steps.ts
│       └── navigation.steps.ts
├── .github/workflows/
│   └── cucumber.yml            # CI pipeline
├── cucumber.js                 # Cucumber konfigürasyonu + profiller (default/smoke/regression/ci)
├── tsconfig.json               # ts-node ayarları (preferTsExts)
├── .env                        # Gizli/ortama bağlı değerler (git'e gönderilmez)
├── .env.example                # .env şablonu (git'e gönderilir)
└── package.json                # Bağımlılıklar ve npm script'leri
```

---

## Katmanların Sorumlulukları

| Katman | Sorumluluk | Örnek |
|---|---|---|
| `features/` | **Ne** test edileceği — iş dilinde senaryo | `Eğer ki en pahalı 2 ürünü sepete eklerim` |
| `src/step-definitions/` | Gherkin cümlesi -> Page Object aksiyonu köprüsü | `this.inventoryPage.addTopExpensiveProductsToCart(2)` |
| `src/support/world.ts` | Page Object'lerin üretimi + ortak akış yardımcıları | `loginAndLandOnInventory()` |
| `src/support/hooks.ts` | Tarayıcı/context yaşam döngüsü + kanıt toplama | `Before` / `After` |
| `pages/` | **Nasıl** etkileşileceği — locator'lar ve sayfa aksiyonları | `LoginPage.login()` |
| `pages/BasePage.ts` | Tüm sayfalarda tekrar eden teknik davranış | `expectText()`, `click()`, `goto()` |
| `constants/` | Değişmeyen değerler | `MESSAGES.ORDER_SUCCESS` |
| `config/` + `.env` | Ortama göre değişen değerler | `BASE_URL`, `HEADLESS` |
| `data/` | Test verisi (kimlik bilgileri, rol eşlemesi) | `userByRole['kilitli']` |
| `utils/DataFactory.ts` | Rastgele test verisi üretimi | `DataFactory.customerInfo()` |
| `utils/AllureHelper.ts` | Rapor meta verisi | `AllureHelper.attachJson(...)` |

### `loggedInApp` fixture'ının Cucumber karşılığı

Playwright versiyonunda giriş yapılmış durumla başlayan süitler `loggedInApp` fixture'ını kullanıyordu. Burada bunun yerine bir **`Geçmiş` (Background)** bloğu kullanılır:

```gherkin
Geçmiş:
  Diyelim ki standart kullanıcı olarak giriş yaptım
```

Bu Given adımı `src/step-definitions/common.steps.ts` içinde `world.loginAndLandOnInventory()` çağırır — giriş yapar, inventory URL'ini ve ürün listesini doğrular.

---

## Test Senaryoları

| Feature | Senaryo | Etiket |
|---|---|---|
| `login.feature` | Standart kullanıcı başarıyla giriş yapar | `@smoke` `@regression` |
| `login.feature` | Kilitli kullanıcı giriş yapamaz | `@regression` |
| `login.feature` | Geçersiz kimlik bilgisi reddedilir | `@regression` |
| `checkout.feature` | En pahalı iki ürün satın alınır (E2E) | `@smoke` `@regression` `@e2e` |
| `cart-checkout-flow.feature` | 3 ürün ekle → en ucuzunu sil → tekrar ekle → satın al | `@regression` |
| `performance-glitch-user.feature` | Yavaş ağ koşullarında satın alma | `@regression` |
| `sidebar.feature` | Sepetten "All Items" ile envantere dönüş | `@regression` |
| `sidebar.feature` | Yan menüyü açma/kapatma | `@regression` |
| `sidebar.feature` | Logout ile oturum sonlandırma | `@smoke` `@regression` |

---

## Ortam Değişkenleri

`.env` dosyası `.gitignore`'dadır; repoya yalnızca `.env.example` şablonu gönderilir.

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | Testlerin koşacağı ortam |
| `USER_PASSWORD` | `secret_sauce` | Geçerli kullanıcıların parolası |
| `HEADLESS` | `true` | Tarayıcı arka planda mı koşsun |
| `SLOW_MO` | `0` | Her adım arası gecikme (ms) — debug için |
| `ACTION_TIMEOUT` | `15000` | Tek bir aksiyonun süre limiti (ms) |
| `TEST_TIMEOUT` | `60000` | Tek bir senaryonun süre limiti (ms) |
| `RETRIES` | `0` | Başarısız senaryonun tekrar deneme sayısı (CI'da 2) |

---

## Kurulum

### 1. Projeyi klonlayın ve bağımlılıkları kurun

```bash
git clone https://github.com/onursahinler/my-automation-project-cucumber.git
cd my-automation-project-cucumber
npm install
```

### 2. Ortam dosyasını oluşturun

```bash
cp .env.example .env      # ardından USER_PASSWORD değerini doldurun (secret_sauce)
```

### 3. Tarayıcıyı kurun

```bash
npm run install:browsers
```

### 4. Java kurulumunu doğrulayın (Allure için)

Allure raporunu üreten CLI, Java 8+ gerektirir:

```bash
java -version      # yoksa: brew install openjdk
```

---

## Test Koşumu

| Komut | Açıklama |
|---|---|
| `npm test` | Tüm senaryolar (önce eski raporları temizler) |
| `npm run test:smoke` | Yalnızca `@smoke` etiketli kritik senaryolar |
| `npm run test:regression` | `@regression` etiketli tam kapsam |
| `npm run test:e2e` | `@e2e` etiketli uçtan uca akışlar |
| `npm run test:login` | Tek bir feature dosyası (`features/login.feature`) |
| `npm run test:headed` | Tarayıcı görünür şekilde (`HEADLESS=false`) |
| `npm run test:rerun` | Yalnızca son koşumda fail olan senaryolar (`@rerun.txt`) |
| `npm run test:ci` | CI profili (retry: 2) |
| `npm run allure:serve` | Allure raporunu üretip tarayıcıda aç (tek komut) |
| `npm run report:allure` | Allure raporunu üret + aç |
| `npm run allure:generate` | `allure-results` → `allure-report` HTML üret |
| `npm run allure:open` | Üretilmiş Allure raporunu aç |
| `npm run clean` | Rapor ve çıktı klasörlerini temizle |

### Etiket ifadeleriyle koşum

```bash
npx cucumber-js --tags "@smoke and not @e2e"
npx cucumber-js --tags "@regression"
npx cucumber-js features/checkout.feature
```

---

## Raporlama

Her koşumda iki rapor üretilir:

| Rapor | Klasör | Amaç |
|---|---|---|
| Cucumber HTML | `cucumber-report/cucumber-report.html` | Hızlı bakış, adım adım sonuç |
| Allure | `allure-results/` → `allure-report/` | Detaylı analiz, gruplama, trend, kanıtlar |

### Allure raporunu görüntüleme

```bash
npm test                 # senaryoları koş (allure-results üretilir)
npm run allure:serve     # raporu üret ve tarayıcıda aç
```

### Allure'ın sağladıkları

* **Overview:** geçen/başarısız dağılımı, süre, ortam bilgisi (`BASE_URL`, `HEADLESS`, Node sürümü, işletim sistemi).
* **Behaviors:** senaryolar feature adına göre gruplanır; her senaryonun `severity` etiketi (`@severity:blocker` → Allure severity) vardır.
* **Adımlar:** her Gherkin adımı (`Diyelim ki...`, `Eğer ki...`, `O zaman...`) rapora ayrı adım olarak yazılır.
* **Kanıtlar:** fail eden senaryonun ekran görüntüsü, videosu ve Playwright trace dosyası "Tear down" bölümüne otomatik iliştirilir. Trace dosyasını [trace.playwright.dev](https://trace.playwright.dev) üzerinden açabilirsiniz.
* **Ek veriler:** Faker'ın ürettiği müşteri bilgisi her checkout senaryosunda rapora JSON olarak eklenir.
* **Categories:** hatalar "Timeout hataları", "Element bulunamadı", "Assertion hataları" olarak otomatik sınıflandırılır.
* **Trends:** CI'da geçmiş koşumlar saklandığı için başarı oranı ve süre eğilimi grafiklenir.

### Senaryoya Allure meta verisi ekleme

`severity` senaryo etiketinden gelir:

```gherkin
@regression @severity:critical
Senaryo: Kilitli kullanıcı giriş yapamaz
```

Adım tanımı içinden ek/adım/parametre eklemek için `utils/AllureHelper.ts` kullanılır (adım tanımları `allure-js-commons`'a doğrudan bağlanmaz).

---

## CI/CD

`.github/workflows/cucumber.yml`, `main` / `master` dallarına yapılan push ve pull request'lerde çalışır:

1. Node ve Java (Allure CLI için) kurar
2. Bağımlılıkları kurar (`npm ci`)
3. Chromium'u kurar (`npm run install:browsers`)
4. Senaryoları koşar (`npm run test:ci`)
5. Önceki koşumun Allure geçmişini geri yükler (trend grafiği için)
6. Allure raporunu üretir ve artifact olarak 30 gün saklar
7. Cucumber HTML raporunu da artifact olarak saklar

`.env` repoya gönderilmediği için CI değerleri workflow'un `env` bloğundan verilir; parola GitHub repo ayarlarındaki `USER_PASSWORD` secret'ından okunur.
