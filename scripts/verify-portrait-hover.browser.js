// Run against the local preview using Playwright's browser_run_code_unsafe.
async (page) => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://127.0.0.1:3117/');
  const measurements = [];

  for (const selector of [
    'section[aria-label="Tokyo 2027 campaign"] img',
    'img[alt="Patrick Wingert"]',
  ]) {
    const portrait = page.locator(selector);
    await portrait.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await page.waitForFunction(selector => {
      const image = document.querySelector(selector);
      return image.complete && image.naturalWidth > 0 &&
        getComputedStyle(image).filter.includes('grayscale(1)');
    }, selector);
    const transition = await portrait.evaluate(image => {
      const css = getComputedStyle(image);
      return { duration: parseFloat(css.transitionDuration), property: css.transitionProperty };
    });
    check(transition.duration >= 1 && transition.duration <= 1.5,
      `Portrait needs a gradual color fade: ${selector} currently uses ${transition.duration}s`);
    check(transition.property === 'filter', 'The portrait transition should target its color filter');

    await portrait.hover();
    await page.waitForFunction(selector => {
      const amount = Number(getComputedStyle(document.querySelector(selector)).filter.match(/grayscale\(([^)]+)\)/)?.[1]);
      return amount > 0 && amount < 1;
    }, selector);
    await page.waitForFunction(selector =>
      getComputedStyle(document.querySelector(selector)).filter.includes('grayscale(0)'), selector);

    await page.mouse.move(0, 0);
    await page.waitForFunction(selector => {
      const amount = Number(getComputedStyle(document.querySelector(selector)).filter.match(/grayscale\(([^)]+)\)/)?.[1]);
      return amount > 0 && amount < 1;
    }, selector);
    await page.waitForFunction(selector =>
      getComputedStyle(document.querySelector(selector)).filter.includes('grayscale(1)'), selector);
    measurements.push({ selector, ...transition, fadesInBothDirections: true });
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const result of measurements) {
    const duration = await page.locator(result.selector).evaluate(image =>
      parseFloat(getComputedStyle(image).transitionDuration));
    check(duration < 0.02, 'Portrait fade must respect reduced-motion preferences');
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return { passed: true, measurements, reducedMotionRespected: true };
}
