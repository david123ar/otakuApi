import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import extractPage from "../helper/otakuSearch.helper.js";

async function extractor(page, keyword) {
  try {
    const [data] = await Promise.all([extractPage( page, keyword )]);

    return { data };
  } catch (error) {
    console.error(`Error extracting data for:`, error.message);
    throw error;
  }
}

export { extractor };
