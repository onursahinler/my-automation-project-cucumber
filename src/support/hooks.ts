import * as fs from 'fs';
/* allure-cucumberjs global test runtime'ını kurar (BeforeAll + skip fixture).
   Formatter'ın kendisi bunu yüklemez; adım/hook içindeki allure-js-commons
   çağrılarının çalışması için burada import edilmesi gerekir. */
import 'allure-cucumberjs';
import {
  BeforeAll,
  AfterAll,
  Before,
  After,
  Status,
  ITestCaseHookParameter,
} from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';

import { ENV } from '../../config/env';
import { CustomWorld } from './world';

/**
 * hooks.ts
 * --------
 * Playwright versiyonundaki fixture'ların (`app` / `loggedInApp`) ve
 * `playwright.config.ts` içindeki `use` bloğunun Cucumber karşılığı:
 *
 *  - BeforeAll / AfterAll : tüm koşum boyunca TEK tarayıcı (performans)
 *  - Before               : senaryo başına context + sayfa + login ekranı
 *  - After                : trace/screenshot/video toplama + context kapatma
 */

let browser: Browser;

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: ENV.HEADLESS,
    slowMo: ENV.SLOW_MO,
  });
});

AfterAll(async function () {
  await browser?.close();
});

Before(async function (this: CustomWorld) {
  await this.init(browser);

  /* Her senaryonun ortak ilk adımı: login ekranını aç.
     (Allure severity tag'lerden, feature/story ise .feature dosyasından
     cucumber.js -> formatOptions.labels ile otomatik türetilir.) */
  await this.openApp();
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const failed = scenario.result?.status === Status.FAILED;
  const stamp = Date.now();
  const tracePath = `test-results/trace-${stamp}.zip`;

  /* Trace: hata varsa diske yaz, yoksa sessizce durdur */
  if (this.context) {
    await this.context.tracing.stop(failed ? { path: tracePath } : undefined);
  }

  /* Hata anı ekran görüntüsü (context kapanmadan önce) */
  if (failed && this.page && !this.page.isClosed()) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, { mediaType: 'image/png', fileName: 'Hata ekran görüntüsü' });
  }

  const video = this.page?.video();
  await this.page?.close();
  await this.context?.close();

  /* Kanıtları rapora iliştir (video ancak context kapandıktan sonra kesinleşir) */
  if (failed) {
    if (fs.existsSync(tracePath)) {
      await this.attach(fs.readFileSync(tracePath), {
        mediaType: 'application/zip',
        fileName: 'Playwright trace (trace.playwright.dev ile açın)',
      });
    }
    if (video) {
      try {
        const videoPath = await video.path();
        if (fs.existsSync(videoPath)) {
          await this.attach(fs.readFileSync(videoPath), {
            mediaType: 'video/webm',
            fileName: 'Senaryo videosu',
          });
        }
      } catch {
        /* video kaydı yoksa yok say */
      }
    }
  }
});
