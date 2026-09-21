// Run this function with Playwright's browser_run_code_unsafe against the local
// production preview on port 3117. No forms, mail links, or external CTAs are submitted.
async (page) => {
  const origin = 'http://127.0.0.1:3117';
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin);

  const feature = page.getByRole('region', { name: 'Tokyo 2027 campaign' });
  check(await feature.count() === 1, 'Homepage campaign feature is missing');
  const hero = page.locator('section').filter({ has: page.locator('h1') });
  check(await hero.locator('a[href="/tokyo"]').count() === 0,
    'Homepage hero should not duplicate the Tokyo feature link');
  await feature.getByRole('link', { name: 'Explore Tokyo 2027' }).click();
  await page.waitForURL(`${origin}/tokyo`);
  check(await page.locator('h1').count() === 1, 'Campaign must have one primary heading');
  const heroPhoto = page.locator('main img').first();
  const communityPhoto = page.locator('main img').nth(1);
  check(await heroPhoto.getAttribute('fetchpriority') === 'high', 'Hero photo must keep loading priority');
  check(await communityPhoto.getAttribute('loading') === 'lazy', 'Below-fold community photo must lazy-load');
  await heroPhoto.evaluate(image => image.decode());
  await communityPhoto.scrollIntoViewIfNeeded();
  await communityPhoto.evaluate(image => image.decode());
  check(await communityPhoto.evaluate(image => image.complete && image.naturalWidth > 0),
    'Community photo must load when scrolled into view');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  check(await page.evaluate(() => !window.lenis), 'Tokyo must use native scrolling');
  check(await page.locator('header').count() === 0, 'Tokyo must not have a separate campaign header');
  for (const name of ['Tokyo 2027 campaign', 'Schedule', 'Supporters', 'Team']) {
    check(await page.getByRole('link', { name, exact: true }).count() === 1,
      `Tokyo is missing the shared ${name} menu link`);
  }
  check(await page.getByTitle('Unmute sound').count() === 1, 'Tokyo needs the shared sound toggle');

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    // Let responsive media queries settle before reading narrow-screen geometry.
    await page.evaluate(() => new Promise(resolve =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))));
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Campaign overflows at ${width}px`);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const backLink = page.getByRole('link', { name: 'Back to main site', exact: true });
    check(await backLink.count() === 1, 'Tokyo needs an explicit back-to-main-site control');
    const backBox = await backLink.boundingBox();
    const menuBox = await page.getByRole('link', { name: 'Tokyo 2027 campaign', exact: true }).boundingBox();
    check(backBox && menuBox && backBox.x + backBox.width <= menuBox.x,
      `Tokyo back control overlaps the shared menu at ${width}px`);
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    const scrolledBox = await backLink.boundingBox();
    check(scrolledBox && scrolledBox.y >= 0 && scrolledBox.y + scrolledBox.height <= 900,
      `Tokyo back control is not visible after scrolling at ${width}px`);
  }
  const faq = page.locator('details').first();
  await faq.locator('summary').focus();
  await page.keyboard.press('Enter');
  check(await faq.evaluate(element => element.open), 'FAQ did not open with keyboard');
  await page.keyboard.press('Enter');
  check(await faq.evaluate(element => !element.open), 'FAQ did not close with keyboard');
  check((await page.getByRole('link', { name: 'Talk Tokyo' }).getAttribute('href')).startsWith('mailto:patrick@patrickwingert.com?'),
    'Personal support must open a direct inquiry, not the charity donation destination');
  check(await page.getByRole('link', { name: /Support Dare2Tri/ }).getAttribute('href') === 'https://dare2tri.org/support-us/',
    'Dare2Tri support must lead to the organization');
  check((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'),
    'Pre-announcement page must remain noindex');

  await page.getByRole('link', { name: 'Back to main site', exact: true }).click();
  await page.waitForURL(`${origin}/`);
  await page.waitForFunction(() => !!window.lenis);
  await page.evaluate(() => {
    const Original = window.AudioContext;
    window.__tokyoTestAudio = [];
    window.AudioContext = class extends Original {
      constructor(...args) { super(...args); window.__tokyoTestAudio.push(this); }
    };
  });
  await page.getByTitle('Unmute sound').click();
  await page.getByRole('link', { name: 'Tokyo 2027 campaign', exact: true }).click();
  await page.waitForURL(`${origin}/tokyo`);
  check(await page.getByTitle('Mute sound').count() === 1, 'Shared sound control state must persist on Tokyo');
  await page.getByTitle('Mute sound').click();

  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(`${origin}/team`);
  const home = await page.getByRole('link', { name: 'Back to main site', exact: true }).boundingBox();
  const tokyo = await page.getByRole('link', { name: 'Tokyo 2027 campaign', exact: true }).boundingBox();
  check(home && tokyo && home.x + home.width <= tokyo.x,
    'Homepage and Tokyo navigation targets overlap at 320px');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${origin}/tokyo`);
  return { passed: true, checks: ['homepage discovery', 'campaign navigation', 'photos', 'responsive layout', 'shared site menu', 'persistent home control', 'keyboard FAQ', 'separate support paths', 'noindex', 'scroll lifecycle', 'shared audio control', '320px navigation'] };
}
