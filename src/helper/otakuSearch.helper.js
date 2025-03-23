import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage(
  page,
  s_keyword,
  s_orderby,
  s_order,
  genres,
  status,
  studio,
  producer,
  licensor,
  type,
  s_season,
  s_year
) {
  try {
    const genreParams = genres
      ? genres
          .map((genre) => `&s_genre[]=${encodeURIComponent(genre)}`)
          .join("")
      : "";
    const statusParams = status
      ? status
          .map((status) => `&s_status[]=${encodeURIComponent(status)}`)
          .join("")
      : "";
    const studioParams = studio
      ? studio
          .map((studio) => `&s_studio[]=${encodeURIComponent(studio)}`)
          .join("")
      : "";
    const producerParams = producer
      ? producer
          .map((producer) => `&s_producer[]=${encodeURIComponent(producer)}`)
          .join("")
      : "";
    const licensorParams = licensor
      ? licensor
          .map((licensor) => `&s_licensor[]=${encodeURIComponent(licensor)}`)
          .join("")
      : "";
    const typeParams = type
      ? type.map((type) => `&s_type[]=${encodeURIComponent(type)}`).join("")
      : "";
    const url = `https://www.desidubanime.me/search${
      "?asp=" + page.toString()
    }${s_keyword ? "&s_keyword=" + s_keyword : ""}${genreParams}${
      s_orderby ? "&s_orderby=" + s_orderby : "&s_orderby=popular"
    }${s_order ? "&s_order=" + s_order : "&s_order=desc"}${
      s_year ? "&s_year=" + s_year : ""
    }${statusParams}${studioParams}${producerParams}${licensorParams}${typeParams}${
      s_season ? "&s_season=" + s_season : ""
    }`;
    console.log(url);
    const resp = await axiosInstance.get(url);
    const $ = cheerio.load(resp.data);

    const scriptTag = $("script")
      .filter((i, el) => $(el).html().includes("var firstPage"))
      .html();

    // Use a regular expression to extract the JSON object
    const match = scriptTag.match(/var firstPage = (.*?);/);
    let firstPageData;
    if (match && match[1]) {
      firstPageData = JSON.parse(match[1]);
      console.log("First Page Data:", firstPageData);
    } else {
      console.log("Unable to find firstPage data.");
    }

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
        let link = "";
        let qtip = "";
        
        // Find the anchor tag with the data-tippy-content-to attribute within the current element
        const anchor = $(element).find("a[data-tippy-content-to]");
        
        if (anchor.length > 0) {
          qtip = anchor.attr("data-tippy-content-to").trim();
          link = anchor.attr("href");
        }

      animeList.push({
        titleEnglish,
        titleNative,
        episode,
        audioType,
        duration,
        animeType,
        image,
        qtip,
        link,
      });
    });

    const data = {
      page,
      firstPageData,
      animeList,
    };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
