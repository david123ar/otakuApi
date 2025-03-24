import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage(id) {
  try {
    const resp = await axiosInstance.get(
      `https://www.desidubanime.me/anime/${id}/`
    );
    const $ = cheerio.load(resp.data);

    const anime = {
      englishTitle: $("h1 span[data-en-title]").text().trim(),
      japaneseTitle: $("h1 span[data-nt-title]").text().trim(),
      poster: $(".anime-image img").attr("data-src").trim(),
      bgImg: $(".background-image img").attr("data-src").trim(),
      animeMetadata: [],
      languages: [],
      synopsis: $("div[data-synopsis]").text().trim(),
    };

    anime.animeMetadata = [];

    $(".anime-metadata li").each((_, el) => {
      const text = $(el).text().trim();
      anime.animeMetadata.push(text);
    });

    // Extract genres

    anime.languages = [];
    $(".text-spec .mbs-5 a").each((_, el) => {
      anime.languages.push($(el).text().trim());
    });

    const languages = [];
    $("div.mbs-5 a").each((_, el) => {
      languages.push($(el).text().trim());
    });

    // Extract Anime Details
    const details = {};
    $("li.mbe-1").each((_, el) => {
      const label = $(el)
        .find("span.font-semibold, span.font-semibold.mie-1")
        .text()
        .trim();
      const value = $(el)
        .find("span.font-normal, span.font-normal.leading-6")
        .text()
        .trim();

      if (label) {
        const key = label.replace(":", "").toLowerCase();
        details[key] = value;
      }
    });

    // Extract Genres
    const genres = [];
    $("li.py-2 a").each((_, el) => {
      genres.push($(el).text().trim());
    });

    // Extract Studio
    const studio = [];
    $('li:contains("Studio:") span:nth-of-type(2) a').each((_, element) => {
      studio.push($(element).text().trim());
    });

    // Extract Producers
    const producers = [];
    $('li:contains("Producer:") a').each((_, el) => {
      producers.push($(el).text().trim());
    });

    const status = $('li:contains("Status:") span:nth-of-type(2)')
      .text()
      .trim();

    // Combine the data
    const animeData = {
      premiered: details["premiered"],
      season: details["season"],
      rate: details["rate"],
      native: details["native"],
      english: details["english"],
      synonyms: details["synonyms"],
      aired: details["aired"],
      duration: details["duration"],
      episodes: details["episodes"],
      score: details["score"],
      genres,
      studio,
      producers,
      status,
    };

    const seasons = [];

    $(".swiper-season .swiper-slide").each((_, el) => {
      const title = $(el).find("a").attr("title")?.trim();
      const season = $(el).find("div.text-xs").text().trim();
      const link = $(el).find("a").attr("href")?.trim();
      const backgroundImage = $(el)
        .find('div[style*="background-image"]')
        .attr("style")
        ?.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1];

      seasons.push({ title, season, link, backgroundImage });
    });

    const episodes = [];

    $(".swiper-episode-anime .swiper-slide").each((index, element) => {
      const episodeUrl = $(element).find("a").attr("href");
      const episodeTitle = $(element).find("a").attr("title");
      const episodeImage = $(element).find("img").data("src");
      const episodeName = $(element).find("span.w-percentile").text().trim();
      const episodeNumber = $(element).find("span.absolute").text().trim();

      episodes.push({
        episodeUrl,
        episodeTitle,
        episodeImage,
        episodeName,
        episodeNumber,
      });
    });

    let postDataId;

    const scriptContent = $("script")
      .toArray()
      .find((el) => {
        const content = $(el).html();
        return content && content.includes("current_post_data_id");
      });

    if (scriptContent) {
      const scriptText = $(scriptContent).html();
      const match = scriptText.match(
        /const\s+current_post_data_id\s*=\s*(\d+);/
      );
      if (match) {
        postDataId = match[1];
        console.log("current_post_data_id:", postDataId);
      }
    }

    const mostPopular = [];
    $("li.flex.gap-5.border-b").each((index, element) => {
      // Extract data for each anime
      const title = $(element).find("h3 a span[data-en-title]").text().trim();
      const japaneseTitle = $(element)
        .find("h3 a span[data-nt-title]")
        .text()
        .trim();
      const link = $(element).find("h3 a").attr("href");
      const imageUrl = $(element).find("img").attr("data-src");
      const type = $(element).find(".text-spec span:first-child").text().trim();
      const episode = $(element)
        .find(".text-spec span:nth-child(3)")
        .text()
        .trim();
      const duration = $(element)
        .find(".text-spec span:last-child")
        .text()
        .trim();

      // Store the extracted data in an array
      mostPopular.push({
        title,
        japaneseTitle,
        link,
        imageUrl,
        type,
        episode,
        duration,
      });
    });

    const data = {
      postDataId,
      anime,
      animeData,
      seasons,
      episodes,
      mostPopular,
    };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
