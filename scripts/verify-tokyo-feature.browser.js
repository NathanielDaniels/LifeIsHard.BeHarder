// Run with Playwright's browser_run_code_unsafe against the local preview.
// Check both breathing room and bounded spacing, including a tall desktop viewport.
async (page) => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const measurements = [];

  for (const viewport of [
    { width: 1010, height: 2000 },
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
    { width: 320, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('http://127.0.0.1:3117/');
    const feature = page.getByRole('region', { name: 'Tokyo 2027 campaign' });
    await feature.scrollIntoViewIfNeeded();
    const geometry = await feature.evaluate(element => {
      const story = [...document.querySelectorAll('section')].find(section =>
        section.querySelector('h2')?.textContent.includes('THEY SAID'));
      const rect = element.getBoundingClientRect();
      const heading = element.querySelector('h2');
      return {
        width: innerWidth,
        height: innerHeight,
        featureHeight: rect.height,
        leadIn: element.querySelector('p').getBoundingClientRect().top - rect.top,
        contentGap: story.querySelector('h2').getBoundingClientRect().top -
          element.querySelector('a + p').getBoundingClientRect().bottom,
        storyGap: story.querySelector('h2').getBoundingClientRect().top - rect.bottom,
        headingWeight: getComputedStyle(heading).fontWeight,
        storyHeadingWeight: getComputedStyle(story.querySelector('h2')).fontWeight,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    check(geometry.leadIn >= 120 && geometry.leadIn <= 220,
      `Tokyo needs consistent section breathing room at ${viewport.width}px: ${geometry.leadIn}px`);
    const minimumContentGap = viewport.width >= 768 ? 350 : 230;
    check(geometry.contentGap >= minimumContentGap && geometry.contentGap <= 500,
      `Tokyo-to-story spacing is too tight or too large at ${viewport.width}px: ${geometry.contentGap}px`);
    check(geometry.storyGap >= 0 && geometry.storyGap <= 260,
      `Excessive gap after Tokyo at ${viewport.width}x${viewport.height}: ${geometry.storyGap}px`);
    check(geometry.headingWeight === geometry.storyHeadingWeight,
      'Tokyo heading weight does not match the existing homepage headings');
    check(!geometry.overflow, `Homepage overflows at ${viewport.width}px`);
    await feature.locator('img').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const image = document.querySelector('section[aria-label="Tokyo 2027 campaign"] img');
      return image.complete && image.naturalWidth > 0;
    }, null, { timeout: 10000 });
    measurements.push(geometry);
  }

  const feature = page.getByRole('region', { name: 'Tokyo 2027 campaign' });
  await feature.evaluate(element => element.style.setProperty('--theme-color', '#fbbf24'));
  // The site's global reduced-motion rule still leaves a one-frame color transition.
  await page.waitForFunction(() => {
    const accent = document.querySelector('section[aria-label="Tokyo 2027 campaign"] h2 span');
    return getComputedStyle(accent).color === 'rgb(251, 191, 36)';
  });
  await feature.evaluate(element => element.style.removeProperty('--theme-color'));
  await feature.getByRole('link', { name: 'Explore Tokyo 2027' }).click();
  await page.waitForURL('http://127.0.0.1:3117/tokyo');
  return { passed: true, measurements, featureLinkWorks: true, accentFollowsTheme: true };
}
