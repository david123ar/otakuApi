import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage() {
  try {
    const resp = await axiosInstance.get(`${baseUrl}`);
    const $ = cheerio.load(resp.data);

    const recent = $("#aawp .flex-1 .container:first-child  .crsl-slde")
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

    const trending = $("#aawp .flex-1 .crslC .crsl-slde")
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

    const random = $("#aawp .flex-1 .crslD .crsl-slde")
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
    const data = { recent, trending, random };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
