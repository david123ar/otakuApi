import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage(tag,categ) {
  try {
    const resp = await axiosInstance.get(`https://www.desidubanime.me/${tag}/${categ}/`);
    const $ = cheerio.load(resp.data);

    const animeData = [];

    $('section .grid .bg-gradient-to-t').each((index, element) => {
      const titleEnglish = $(element).find('h2 a span[data-en-title]').text().trim();
      const titleNative = $(element).find('h2 a span[data-nt-title]').text().trim();
      const thumbnail = $(element).find('img.lazyload').attr('data-src');
      const episode = $(element).find('.bg-accent-3').text().trim();
      const audioType = $(element).find('span.text-text-accent.mie-px').text().trim();
      const animeType = $(element).find('.text-text-color span.uppercase').text().trim();
      const duration = $(element).find('.text-text-color span:not(.uppercase)').text().trim();
      const animeUrl = $(element).find('h2 a').attr('href');

      animeData.push({
        titleEnglish,
        titleNative,
        thumbnail,
        episode,
        audioType,
        animeType,
        duration,
        animeUrl,
      });
    });

    const data = {
        animeData
    };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
