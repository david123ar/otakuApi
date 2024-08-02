import puppeteer from 'puppeteer';

async function extractPage(impo) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();

  try {
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(`https://hentai.tv/hentai/${impo}`, { waitUntil: 'networkidle2', timeout: 120000 });

    // Check if the ad is present and click the close button
    const adSelector = '#aawp .flex-1 .container button';
    const adPresent = await page.$(adSelector) !== null;

    if (adPresent) {
      await page.click(adSelector);

      // Wait for navigation to complete
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }

    // Wait for the necessary content to load
    await page.waitForSelector('#aawp .flex-1 .container', { timeout: 30000 });

    // Extract the data
    const data = await page.evaluate(() => {
      const url = document.querySelector('#aawp iframe')?.src || '';
      const title = document.querySelector('#aawp .flex-1 .container .border-b h1')?.innerText.trim() || '';
      const views = document.querySelector('#aawp .flex-1 .container .grid .border-b p')?.innerText.trim() || '';
      const poster = document.querySelector('#aawp .flex-1 .container .flex aside:first-child img')?.src || '';

      const cenco = document.querySelector('#aawp .flex-1 .container .flex aside:last-child p:first-child a')?.innerText.trim() || '';
      const cencored = cenco === 'CENSORED' ? cenco : '';
      
      const info = {
        brand: document.querySelector(`#aawp .flex-1 .container .flex aside:last-child p:nth-child(${cenco === 'CENSORED' ? '2' : '1' }) a`)?.innerText.trim() || '',
        brandUploads: document.querySelector(`#aawp .flex-1 .container .flex aside:last-child p:nth-child(${cenco === 'CENSORED' ? '3' : '2' }) span:last-child`)?.innerText.trim() || '',
        releasedDate: document.querySelector(`#aawp .flex-1 .container .flex aside:last-child p:nth-child(${cenco === 'CENSORED' ? '4' : '3' }) span:last-child`)?.innerText.trim() || '',
        uploadDate: document.querySelector(`#aawp .flex-1 .container .flex aside:last-child p:nth-child(${cenco === 'CENSORED' ? '5' : '4' }) span:last-child`)?.innerText.trim() || '',
        alternateTitle: document.querySelector(`#aawp .flex-1 .container .flex aside:last-child div h2 span`)?.innerText.trim() || ''
      };
      
      const moreInfo = {
        tags: Array.from(document.querySelectorAll('#aawp .flex-1 .container .rounded .btn')).map(el => el.innerText.trim()),
        descripOne: document.querySelector('#aawp .flex-1 .container .rounded .prose p:first-child')?.innerText.trim() || '',
        descripTwo: document.querySelector('#aawp .flex-1 .container .rounded .prose p:last-child')?.innerText.trim() || ''
      };

      return { url, title, views, poster, cencored, info, moreInfo };
    });

    await browser.close();
    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    await browser.close();
    throw error;
  }
}

export default extractPage;
