require('ts-node/register/transpile-only');
const { ENV } = require('./config/env');

/**
 * Cucumber.js konfigürasyonu
 * --------------------------
 * - Adım tanımları ve support kodu TypeScript; `ts-node/register` ile derlenir.
 * - Ortama bağlı değerler (retry, headless, baseURL) `config/env.ts` -> `.env`'den gelir.
 * - Raporlama: konsol (progress-bar) + Cucumber HTML + Cucumber JSON + Allure.
 *
 * Profiller:
 *   default     -> tüm senaryolar
 *   smoke       -> yalnızca @smoke
 *   regression  -> yalnızca @regression
 *   ci          -> CI ayarları (retry, publish kapalı)
 */

const common = {
  requireModule: ['ts-node/register/transpile-only'],
  require: ['src/support/**/*.ts', 'src/step-definitions/**/*.ts'],
  /* `paths` kasıtlı olarak burada TANIMLANMADI: cucumber-js zaten
     varsayılan olarak `features/` klasörünü tarar. Config'te path
     tanımlarsak, CLI'dan verilen path (örn. `cucumber-js features/login.feature`)
     bununla BİRLEŞİYOR ve tüm testler de çalışıyor — istenen değil. */
  formatOptions: {
    snippetInterface: 'async-await',
    // ----- Allure (allure-cucumberjs/reporter) -----
    resultsDir: 'allure-results',
    environmentInfo: {
      BASE_URL: ENV.BASE_URL,
      HEADLESS: String(ENV.HEADLESS),
      CI: String(ENV.IS_CI),
      Node: process.version,
      OS: `${process.platform} ${process.arch}`,
    },
    labels: [
      { pattern: [/@severity:(.*)/], name: 'severity' },
      { pattern: [/@epic:(.*)/], name: 'epic' },
      { pattern: [/@feature:(.*)/], name: 'feature' },
      { pattern: [/@story:(.*)/], name: 'story' },
    ],
    categories: [
      {
        name: 'Timeout hataları',
        messageRegex: '.*Timeout.*exceeded.*',
        matchedStatuses: ['broken', 'failed'],
      },
      {
        name: 'Element bulunamadı',
        messageRegex: '.*(strict mode violation|waiting for locator).*',
        matchedStatuses: ['failed', 'broken'],
      },
      {
        name: 'Assertion hataları',
        messageRegex: '.*expect.*',
        matchedStatuses: ['failed'],
      },
    ],
  },
  format: [
    'progress-bar',
    'html:cucumber-report/cucumber-report.html',
    'json:cucumber-report/cucumber-report.json',
    'allure-cucumberjs/reporter',
    'rerun:@rerun.txt',
  ],
  retry: ENV.IS_CI ? 2 : ENV.RETRIES,
  parallel: 0,
  publishQuiet: true,
};

module.exports = {
  default: common,
  smoke: { ...common, tags: '@smoke' },
  regression: { ...common, tags: '@regression' },
  ci: { ...common, retry: 2, parallel: 0 },
};
