import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage(tag, categ) {
  try {
    const resp = await axiosInstance.get(
      `https://www.desidubanime.me/${tag}/${categ}/`
    );
    const $ = cheerio.load(resp.data);

    // Get the current page
    const currentPage = $("ul.page-numbers .current").text().trim();

    // Get the total pages (last page number link)
    const totalPages = $("ul.page-numbers li a").last().text().trim();

    console.log(`Current Page: ${currentPage}`);
    console.log(`Total Pages: ${totalPages}`);

    // Find the script tag containing the 'firstPage' variable
    // const scriptTag = $("script")
    //   .filter((i, el) => $(el).html().includes("var firstPage"))
    //   .html();

    // // Use a regular expression to extract the JSON object
    // const match = scriptTag.match(/var firstPage = (.*?);/);
    // let firstPageData
    // if (match && match[1]) {
    //   firstPageData = JSON.parse(match[1]);
    //   console.log("First Page Data:", firstPageData);
    // } else {
    //   console.log("Unable to find firstPage data.");
    // }

    const animeData = [];

    $("section .grid .bg-gradient-to-t").each((index, element) => {
      const titleEnglish = $(element)
        .find("h2 a span[data-en-title]")
        .text()
        .trim();
      const titleNative = $(element)
        .find("h2 a span[data-nt-title]")
        .text()
        .trim();
      const thumbnail = $(element).find("img.lazyload").attr("data-src");
      const episode = $(element).find(".bg-accent-3").text().trim();
      const audioType = $(element)
        .find("span.text-text-accent.mie-px")
        .text()
        .trim();
      const animeType = $(element)
        .find(".text-text-color span.uppercase")
        .text()
        .trim();
      const duration = $(element)
        .find(".text-text-color span:not(.uppercase)")
        .text()
        .trim();
      let link = "";
      let qtip = "";

      // Find the anchor tag with the data-tippy-content-to attribute within the current element
      const anchor = $(element).find("a[data-tippy-content-to]");

      if (anchor.length > 0) {
        qtip = anchor.attr("data-tippy-content-to").trim();
        link = anchor.attr("href");
      }

      animeData.push({
        titleEnglish,
        titleNative,
        thumbnail,
        episode,
        audioType,
        animeType,
        duration,
        qtip,
        link,
      });
    });

    const data = {
      currentPage,
      totalPages,
      animeData,
    };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
