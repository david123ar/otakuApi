import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";
import { fetchServerData_v2 } from "../parsers/idFetch_v2.parser.js";
import { fetchServerData_v1 } from "../parsers/idFetch_v1.parser.js";
import { decryptAllServers } from "../parsers/decryptors/decryptAllServers.decryptor.js";

// Function to extract other episodes from the provided `id`
async function extractOtherEpisodes(id) {
  try {
    // Extract the final ID by splitting based on "-" and "?" characters
    const finalId = id.split("?").shift().split("-").pop();

    // Fetch the list of episodes using the final ID
    const resp = await axios.get(`${baseUrl}/ajax/episode/list/${finalId}`);

    // Use cheerio to load and parse the HTML response
    const $ = cheerio.load(resp.data.html);

    // Extract episode information using the relevant DOM selectors
    const elements = $(
      ".seasons-block > #detail-ss-list > .detail-infor-content > .ss-list > a"
    );

    const episode = elements
      .map((index, element) => {
        const title = $(element).attr("title");
        const episode_no = $(element).attr("data-number");
        const data_id = $(element).attr("data-id");
        const japanese_title = $(element)
          .find(".ssli-detail > .ep-name")
          .attr("data-jname");

        return { data_id, episode_no, title, japanese_title };
      })
      .get();

    // Extract the next episode information (if available)
    const nextEpisode = $(".main-wrapper > .schedule-alert > .alert > span:last-child").text().trim();

    const episodes = {
      nextEpisode,
      episode,
    };

    return episodes;
  } catch (error) {
    console.error("An error occurred while extracting episodes:", error);
    return [];
  }
}

// Function to extract streaming information, including decrypting server data
async function extractStreamingInfo(id) {
  try {
    // Fetch data from version 1 and version 2 APIs concurrently
    const [data_v1, data_v2] = await Promise.all([
      fetchServerData_v1(id),
      fetchServerData_v2(id),
    ]);

    // Combine and sort the data by type (e.g., sub, dub, raw)
    const sortedData = [...data_v1, ...data_v2].sort((a, b) =>
      a.type.localeCompare(b.type)
    );

    // Decrypt the server data using a decryption function
    const decryptedResults = await decryptAllServers(sortedData);

    // Modify the decrypted results to rename the second occurrence of "Vidstreaming" to "Vidcloud"
    let vidstreamingCount = 0;
    decryptedResults.forEach((result) => {
      if (result.value.decryptionResult.server === "Vidstreaming") {
        vidstreamingCount++;
        if (vidstreamingCount === 2) {
          result.value.decryptionResult.server = "Vidcloud"; // Rename the second occurrence
        }
        if (vidstreamingCount === 4) {
          result.value.decryptionResult.server = "Vidcloud"; // Rename the second occurrence
        }
      }
    });

    return decryptedResults;
  } catch (error) {
    console.error("An error occurred while extracting streaming info:", error);
    return [];
  }
}

export { extractOtherEpisodes, extractStreamingInfo };
