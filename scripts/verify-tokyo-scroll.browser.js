// Verify the homepage campaign reveals on scroll once, without disturbing layout.
async (page) => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const results = [];
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize(viewport);
    await page.goto('http://127.0.0.1:3117/');
    await page.waitForFunction(() => Boolean(window.lenis));
    await page.evaluate(() => { window.lenis.stop(); window.scrollTo(0, 0); });
    const feature = page.getByRole('region', { name: 'Tokyo 2027 campaign' });
    const before = await feature.evaluate(element => {
      const heading = element.querySelector('h2');
      let opacity = 1;
      for (let node = heading; node && node !== element; node = node.parentElement) {
        opacity *= Number(getComputedStyle(node).opacity);
      }
      return { opacity, height: element.getBoundingClientRect().height };
    });
    check(before.opacity === 0, 'Tokyo should wait until it enters view before revealing');
    await feature.locator('h2').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const heading = document.querySelector('section[aria-label="Tokyo 2027 campaign"] h2');
      const style = getComputedStyle(heading.parentElement);
      const y = new DOMMatrixReadOnly(style.transform).m42;
      return Number(style.opacity) > 0 && Number(style.opacity) < 1 && y > 0 && y < 60;
    }, null, { timeout: 5000 });
    // Each group must become readable as it enters view, including on a short screen.
    for (const child of ['h2', 'img', 'a']) {
      const target = feature.locator(child);
      await target.scrollIntoViewIfNeeded();
      await page.waitForFunction(child => {
        const section = document.querySelector('section[aria-label="Tokyo 2027 campaign"]');
        for (let node = section.querySelector(child); node && node !== section; node = node.parentElement) {
          if (Number(getComputedStyle(node).opacity) < 1) return false;
        }
        return true;
      }, child);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    // Observe two frames after leaving, then return; a once-only reveal stays visible.
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const after = await feature.evaluate(element => ({
      height: element.getBoundingClientRect().height,
      opacity: Number(getComputedStyle(element.querySelector('h2').parentElement).opacity),
    }));
    check(after.opacity === 1, 'Tokyo must not hide again when scrolling away');
    check(Math.abs(after.height - before.height) < 1, 'Entrance animation must not shift section layout');
    await feature.locator('h2').scrollIntoViewIfNeeded();
    check(await feature.locator('h2').evaluate(heading =>
      getComputedStyle(heading.parentElement).opacity === '1'), 'Tokyo must not replay on return');
    results.push({ ...viewport, reveal: true, onceOnly: true, stableLayout: true });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:3117/');
  const feature = page.getByRole('region', { name: 'Tokyo 2027 campaign' });
  await feature.locator('h2').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const heading = document.querySelector('section[aria-label="Tokyo 2027 campaign"] h2');
    return Number(getComputedStyle(heading.parentElement).opacity) > 0;
  });
  const reducedY = await feature.locator('h2').evaluate(heading =>
    new DOMMatrixReadOnly(getComputedStyle(heading.parentElement).transform).m42);
  check(reducedY === 0, 'Reduced-motion users should not get a sliding entrance');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return { passed: true, results, reducedMotionRespected: true };
}
