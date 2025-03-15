import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage() {
  try {
    const resp = await axiosInstance.get(`https://www.desidubanime.me/`);
    const $ = cheerio.load(resp.data);

    const spotlightList = [];
    $(".swiper-slide").each((i, element) => {
      const englishTitle = $(element)
        .find("h2 span.line-clamp-2")
        .eq(0)
        .text()
        .trim();
      const japaneseTitle = $(element)
        .find("h2 span.line-clamp-2")
        .eq(1)
        .text()
        .trim();
      const poster = $(element).find("img").attr("data-src");

      // Clean up spotlight rank and remove unwanted text
      let spotlightRank = $(element).find(".text-xs").text().trim();
      spotlightRank = spotlightRank.replace(/\s+/g, " "); // Remove extra spaces
      spotlightRank = spotlightRank.split("\t")[0]; // Get the actual rank

      // Clean and format URLs
      let watchUrl = $(element).find('a[href*="/watch/"]').attr("href");
      let detailsUrl = $(element).find('a[href*="/anime/"]').attr("href");
      watchUrl = watchUrl ? watchUrl : "N/A";
      detailsUrl = detailsUrl ? detailsUrl : "N/A";

      // Clean and fix the type text
      let type = $(element)
        .find(".uppercase.flex.items-center.gap-1")
        .text()
        .trim();
      type = type.replace(/play_circle\s+/g, "").trim();

      // Clean and fix the views text
      let views = $(element)
        .find(".flex.items-center.gap-1")
        .eq(1)
        .text()
        .trim();
      views = views.replace(/watch_later\s+/g, "").trim();

      // Clean and fix the date text
      let date = $(element)
        .find(".flex.items-center.gap-1")
        .eq(2)
        .text()
        .trim();
      date = date.replace(/event\s+/g, "").trim();

      const audioQuality = $(element).find(".quality").text().trim();
      const description = $(element).find(".text-[13px]").text().trim();

      if (englishTitle && poster) {
        spotlightList.push({
          englishTitle,
          japaneseTitle,
          poster,
          watchUrl,
          detailsUrl,
          type,
          views,
          date,
          audioQuality,
          description,
        });
      }
    });

    const trendingList = [];
    $(".swiper-slide").each((i, element) => {
      const englishTitle = $(element).find("span[data-en-title]").text().trim();

      const japaneseTitle = $(element)
        .find("span[data-nt-title]")
        .text()
        .trim();
      const poster = $(element).find("img").attr("data-src");

      const spotlightRank = $(element).find(".text-xs").text().trim();

      const watchUrl = $(element).find("a").attr("href") || "N/A";

      const audioQuality = $(element).find(".quality").text().trim();
      const description = $(element).find(".text-[13px]").text().trim();

      if (englishTitle && poster) {
        trendingList.push({
          englishTitle,
          japaneseTitle,
          poster,
          watchUrl,
          audioQuality,
          description,
        });
      }
    });

    const getAnimeList = (headerText) => {
      const section = $(`h2:contains(${headerText})`).closest("section");
      const list = [];
      section.find("li").each((_, element) => {
        const title = $(element).find("h3 a span[data-en-title]").text().trim();
        const japaneseTitle = $(element)
          .find("h3 a span[data-nt-title]")
          .text()
          .trim();
        const imageUrl = $(element).find("a img").attr("data-src");
        const link = $(element).find("a").attr("href");
        const episodeCount = $(element)
          .find("span:contains('E')")
          .text()
          .trim();
        const duration = $(element).find(".fdi-duration").text().trim();
        const views = $(element)
          .find("span.flex.items-center.gap-1")
          .text()
          .trim();

        list.push({
          title,
          japaneseTitle,
          imageUrl,
          link,
          episodeCount,
          duration,
          views,
        });
      });
      return list;
    };

    const mostPopular = getAnimeList("Most Popular");
    const topAiring = getAnimeList("Top Airing!");
    const completedSeries = getAnimeList("Completed Series");

    const latestEpisode = [];

    const section = $(`.mie-4 h2:contains(Latest Episode)`).closest("section");

    section.find(".w-full.bg-gradient-to-t").each((index, element) => {
      const title =
        $(element).find("h3 a span[data-en-title]").text().trim() || "";
      const japaneseTitle =
        $(element).find("h3 a span[data-nt-title]").text().trim() || "";
      const animeUrl = $(element).find(".kira-anime a").attr("href") || "";
      const imageUrl =
        $(element).find(".kira-anime img").attr("data-src") || "";
      const dubStatus =
        $(element).find(".kira-anime .min-w-max span").text().trim() || "";
      const episode =
        $(element)
          .find(".kira-anime .bg-accent-3")
          .text()
          .replace("E", "")
          .trim() || "";

      // Type and duration extraction
      const type = $(element).find(".text-xs span").first().text().trim() || "";
      const duration =
        $(element).find(".text-xs span").last().text().trim() || "";

      latestEpisode.push({
        title,
        japaneseTitle,
        episode,
        animeUrl,
        imageUrl,
        dubStatus,
        type,
        duration,
      });
    });

    const latestMovie = [];

    const section2 = $(`.mie-4 h2:contains(Latest Movies)`).closest("section");

    section2.find(".w-full.bg-gradient-to-t").each((index, element) => {
      const title =
        $(element).find("h3 a span[data-en-title]").text().trim() || "";
      const japaneseTitle =
        $(element).find("h3 a span[data-nt-title]").text().trim() || "";
      const animeUrl = $(element).find(".kira-anime a").attr("href") || "";
      const imageUrl =
        $(element).find(".kira-anime img").attr("data-src") || "";
      const dubStatus =
        $(element).find(".kira-anime .min-w-max span").text().trim() || "";
      const episode =
        $(element)
          .find(".kira-anime .bg-accent-3")
          .text()
          .replace("E", "")
          .trim() || "";

      // Type and duration extraction
      const type = $(element).find(".text-xs span").first().text().trim() || "";
      const duration =
        $(element).find(".text-xs span").last().text().trim() || "";

      latestMovie.push({
        title,
        japaneseTitle,
        episode,
        animeUrl,
        imageUrl,
        dubStatus,
        type,
        duration,
      });
    });

    const genres = new Set();

    // Select all genre list links using a more precise selector
    $('li.genre-list a').each((_, element) => {
      const genreName = $(element).text().trim();
      const genreLink = $(element).attr('href');

      // Add unique genres to the set
      if (genreName && genreLink) {
        genres.add(JSON.stringify({ name: genreName, link: genreLink }));
      }
    });

    // Convert the set of unique genres to an array of objects
    const uniqueGenres = Array.from(genres).map((item) => JSON.parse(item));

    const results = {
      day: [],
      week: [],
      month: [],
    };

    const sections = ["day", "week", "month"];

    sections.forEach((section) => {
      $(`div[data-tab-content='${section}'] li`).each((index, element) => {
        const title = $(element).find("h3 a span[data-en-title]").text().trim();
        const url = $(element).find("h3 a").attr("href");
        const image = $(element).find("img").attr("data-src");
        const views = $(element).find("div.text-xs span.flex").text().trim();

        results[section].push({ title, url, image, views });
      });
    });

    const data = {
      spotlightList,
      trendingList,
      mostPopular,
      topAiring,
      completedSeries,
      latestEpisode,
      latestMovie,
      uniqueGenres,
      results,
    };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
