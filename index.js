const puppeteer = require('puppeteer');

const VOTE_URL = 'https://www.cutebabyvote.com/july-2025/?contest=photo-detail&photo_id=448501';
const VOTE_INTERVAL_MINUTES = 33;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let voteCount = 1;

  while (true) {
    try {
      console.log(`[${new Date().toLocaleString()}] Navigating to voting page...`);
      await page.goto(VOTE_URL, { waitUntil: 'networkidle2', timeout: 60000 });

      await page.waitForSelector('a.vote-button', { timeout: 15000 });
      await page.click('a.vote-button');
      console.log(`[${new Date().toLocaleString()}] Vote cast successfully.`);

      await page.screenshot({ path: `vote_${voteCount}.png` });
      voteCount++;

      const client = await page.target().createCDPSession();
      await client.send('Network.clearBrowserCookies');
      await client.send('Network.clearBrowserCache');

    } catch (error) {
      console.error(`[${new Date().toLocaleString()}] Error during voting:`, error.message);
    }

    console.log(`[${new Date().toLocaleString()}] Waiting ${VOTE_INTERVAL_MINUTES} minutes before next vote...`);
    await new Promise(resolve => setTimeout(resolve, VOTE_INTERVAL_MINUTES * 60 * 1000));
  }
})();
