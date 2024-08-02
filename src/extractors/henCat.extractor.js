import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import extractPage from "../helper/extracthenCat.helper.js";

async function extractor(page,impo,item) {
  try {
    const [data] = await Promise.all([extractPage(page,impo,item)]);

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
