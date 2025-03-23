import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage(page) {
  try {
    const resp = await axiosInstance.get(
      `https://www.desidubanime.me/az-list/page/${page}/`
    );
    const $ = cheerio.load(resp.data);

    const animeList = [];

    $(".kira-grid > div").each((index, element) => {
      const image = $(element).find("img.lazyload").attr("data-src");
      const title = $(element).find("h2 a span[data-en-title]").text().trim();
      const episode = $(element).find("span.bg-accent-3").text().trim();
      const type = $(element).find("div.text-xs span:first").text().trim();
      const duration = $(element).find("div.text-xs span:last").text().trim();
      let link = "";
      let qtip = "";
      
      // Find the anchor tag with the data-tippy-content-to attribute within the current element
      const anchor = $(element).find("a[data-tippy-content-to]");
      
      if (anchor.length > 0) {
        qtip = anchor.attr("data-tippy-content-to").trim();
        link = anchor.attr("href");
      }

      animeList.push({ title, episode, type, duration, image, link, qtip });
    });

    // Select the last page number from the pagination list
    const lastPageNumber = $("ul.page-numbers li a.page-numbers").last().text();

    console.log(`Last page number: ${lastPageNumber}`);

    const data = { page, lastPageNumber, animeList };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
