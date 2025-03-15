import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage(page,keyword) {
  try {
    const resp = await axiosInstance.get(`https://www.desidubanime.me/search${'?asp='+page.toString()}${keyword ? '&s_keyword='+keyword : ''}&s_orderby=popular&s_order=desc`);
    const $ = cheerio.load(resp.data);

    console.log("key", keyword);

    const animeList = [];

    $("#first_load_result .w-full.bg-gradient-to-t").each((index, element) => {
      const image = $(element).find("img.lazyload").attr("data-src");
      const titleEnglish = $(element).find("[data-en-title]").text().trim();
      const titleNative = $(element).find("[data-nt-title]").text().trim();
      const episode = $(element).find("span.mie-px").text().trim();
      const audioType = $(element).find("span.mis-auto").text().trim();
      const duration = $(element)
        .find(".text-xs .inline-block.md\\:mlb-3")
        .last()
        .text()
        .trim();
      const animeType = $(element)
        .find(".text-xs .inline-block.md\\:mlb-3")
        .first()
        .text()
        .trim();
      const animeUrl = $(element).find("a").attr("href");

      animeList.push({
        titleEnglish,
        titleNative,
        episode,
        audioType,
        duration,
        animeType,
        image,
        animeUrl,
      });
    });

    const data = {
      animeList,
    };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
