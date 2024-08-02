import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import extractPage from "../helper/extracthenAll.pages.js";

async function extractor(page,search) {
  try {
    const [data] = await Promise.all([extractPage(page,search)]);

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
