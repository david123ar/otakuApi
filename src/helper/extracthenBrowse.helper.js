import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage() {
  try {
    const resp = await axiosInstance.get(`${baseUrl}/browse/`);
    const $ = cheerio.load(resp.data);

    const category = $("#aawp .flex-1 .grid .btn")
      .map((index, element) => {
        const imgStyle = $("span",element).attr("style");

        const urlRegex = /url\('(.+?)'\)/;
        const match = imgStyle.match(urlRegex);
        const poster = match && match[1] ? match[1] : "";

        const title = $(".btn .relative .uppercase", element).text().trim();
        const href = $(element).attr("href");
        const id = href ? href.replace("https://hentai.tv/", "/") : null;
        const description = $(".btn .relative .text-sm", element).text().trim();

        return {
          id,
          poster,
          title,
          description,
        };
      })
      .get(); // .get() converts Cheerio object to an array

    const genre = $("#aawp .flex-1 .py-8 .p-1")
      .map((index, element) => {
        const imgStyle = $(".p-1 .p-6", element).attr("style");
        let poster = "";
        if (imgStyle) {
          const urlRegex = /url\('(.+?)'\)/;
          const match = imgStyle.match(urlRegex);
          poster = match && match[1] ? match[1] : "";
        } else {
          console.warn(
            `No style attribute found for element at index ${index}`
          );
        }
        const firstPoster = $(".p-1 .p-6 .relative img").attr("src");
        const title = $(".p-1 .p-6 .relative .text-lg", element).text().trim();
        const description = $(".p-1 .p-6 .relative .text-sm", element)
          .text()
          .trim();
        const href = $(".p-1 .p-6", element).attr("href");
        const id = href ? href.replace("https://hentai.tv/", "/") : null;
        const videos = $(".p-1 .p-6 .relative .flex span", element)
          .text()
          .trim();

        return {
          id,
          poster,
          title,
          firstPoster,
          description,
          videos,
        };
      })
      .get(); // .get() converts Cheerio object to an array

    const studios = $("#aawp .flex-1 section:last-child .btn")
      .map((index, element) => {
        const title = $(element).text().trim();
        const href = $(element).attr("href");
        const id = href ? href.replace("https://hentai.tv/", "/") : null;
        const videos = $(".btn span", element).text().trim();

        return {
          id,
          title,
          videos,
        };
      })
      .get(); // .get() converts Cheerio object to an array

    const data = { category, genre, studios };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
