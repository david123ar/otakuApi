import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage(page, search) {
  try {
    const resp = await axiosInstance.get(
      `${baseUrl}/page/${page}/?s=${search ? search : ""}`
    );
    const $ = cheerio.load(resp.data);

    const all = $("#aawp .flex .crsl-slde")
      .map((index, element) => {
        const poster = $(".crsl-slde img", element).attr("src");
        const title = $(".crsl-slde a", element).text().trim();
        const id = $(".crsl-slde a", element)
          .attr("href")
          .replace("https://hentai.tv/hentai/", "/");
        const views = $(".crsl-slde p", element).text().trim();

        return {
          id,
          poster,
          title,
          views,
        };
      })
      .get(); // .get() converts Cheerio object to an array

    const data = { all };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
