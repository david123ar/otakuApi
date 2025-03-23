import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/hentaiUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage(id) {
  try {
    const resp = await axiosInstance.get(
      `https://www.desidubanime.me/watch/${id}/`
    );
    const $ = cheerio.load(resp.data);

    const episodes = [];

    // Loop through each episode link within the hidden episode list
    $(".episode-list-display-box a").each((index, element) => {
      // Extract data for each episode
      const episodeNumber = $(element)
        .find(".episode-list-item-number")
        .text()
        .trim();
      const episodeTitle = $(element)
        .find(".episode-list-item-title")
        .text()
        .trim();
      const episodeLink = $(element).attr("href");

      // Store the extracted episode data in an array
      episodes.push({
        episodeNumber,
        episodeTitle,
        episodeLink,
      });
    });

    // Extract iframe source (video source)
    const iframeSrc = $(".episode-player-box iframe").attr("src");

    // Extract episode number and title from the episode player info
    const episodeInfo = $(".episode-player-info .top-side .episode-information")
      .text()
      .trim();
    const episodeNumber = episodeInfo.split("\n")[1].trim(); // Extract the episode number from the text

    // Extract subtitle and dub options
    const subtitles = [];
    $(".player-sub span").each((index, element) => {
      subtitles.push($(element).text().trim());
    });

    const dubs = [];
    $(".player-dub span").each((index, element) => {
      dubs.push($(element).text().trim());
    });

    // Extract next episode URL from the navigation
    const nextEpisodeLink = $(".episode-navigation.next-episode").attr(
      "data-open-nav-episode"
    );

    // Extract "Report Problem" link (optional)

    const emoji = $(".bottom-side .text-base").text().trim();

    // Extract the text about the next episode
    const episodeText = $(".bottom-side span").eq(1).text().trim();

    // Extract the scheduled time (including timezone and countdown)
    const scheduledTime = $(".bottom-side span[data-countdown]").attr(
      "data-countdown"
    );
    const timezone = $(".bottom-side span[data-timezone]").attr(
      "data-timezone"
    );

    // Return the extracted details in an object
    const nextEpisodeDetails = {
      emoji,
      episodeText,
      scheduledTime,
      timezone,
    };

    let postDataId;

    // Find the script tag containing the variable
    const scriptContent = $("script")
      .toArray()
      .find((el) => {
        const content = $(el).html();
        return content && content.includes("current_post_data_id");
      });

    if (scriptContent) {
      const scriptText = $(scriptContent).html();
      const match = scriptText.match(/var\s+current_post_data_id\s*=\s*(\d+);/);
      if (match) {
        postDataId = parseInt(match[1], 10);
      }
    }

    // Return the extracted details in an object
    const episodeDetails = {
      video: {
        iframeSrc,
      },
      episode: {
        episodeNumber,
      },
      player: {
        subtitles,
        dubs,
      },
      navigation: {
        nextEpisodeLink,
      },
      nextEpisodeDetails,
    };

    // Extract anime image source (thumbnail)
    const thumbnailSrc = $(".anime-featured img").attr("data-src");

    // Extract anime title and URL
    const animeTitle = $(".anime-data h4 a span.line-clamp-2")
      .first()
      .text()
      .trim();
    const animeUrl = $(".anime-data h4 a").attr("href");

    // Extract metadata (Rating, Audio, Type, Views)
    const metadata = [];
    $(".anime-metadata span").each((index, element) => {
      metadata.push($(element).text().trim());
    });

    // Extract anime synopsis
    const synopsis = $(".anime-synopsis .anime-synopsis.synopsis-content p")
      .text()
      .trim();

    // Extract the score and vote count
    const score = $(".anime-score-counts span").first().text().trim();
    const votes = $(".anime-score-counts span").last().text().trim();

    // Return the extracted details in an object
    const animeDetails = {
      thumbnail: thumbnailSrc,
      title: {
        name: animeTitle,
        url: animeUrl,
      },
      metadata,
      synopsis,
      score: {
        rating: score,
        votes: votes,
      },
    };

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
      episodes,
      episodeDetails,
      animeDetails,
      mostPopular,
    };

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
