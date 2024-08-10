import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage() {
  try {
    const resp = await axiosInstance.get(`${baseUrl}/random/`);
    const $ = cheerio.load(resp.data);

    const bata = $("#aawp .flex-1 section [data-results] .flex")
      .map((index, element) => {
        const poster = $(element).find(".bg-black img").attr("src") || "";
        const title = $(element).find(".p-3 a").text().trim() || "";
        const href = $(element).find(".p-3 a").attr("href") || "";
        const id = href ? href.replace("https://hentai.tv/hentai/", "/") : null;
        const date = $(element).find(".p-3 p:first-child").text().trim() || "";
        const views = $(element).find(".p-3 p:last-child").text().trim() || "";

        // Only return non-empty items
        if (id && poster && title && date && views) {
          return {
            id,
            poster,
            title,
            date,
            views,
          };
        }
      })
      .get(); // .get() converts Cheerio object to an array

    // Filter out duplicate entries based on 'id'
    const data = Array.from(new Set(bata.map((item) => item.id))).map((id) =>
      bata.find((item) => item.id === id)
    );

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
