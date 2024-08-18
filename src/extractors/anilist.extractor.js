import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import extractPage from "../helper/extractAnilist.js";

async function extractor(page) {
  try {
    const [data] = await Promise.all([extractPage(page)]);

    return { data };
  } catch (error) {
    console.error(
      `Error extracting data for from page ${page}:`,
      error.message
    );
    throw error;
  }
}

export { extractor };
