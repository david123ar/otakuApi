import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import extractPage from "../helper/otakuCateg.helper.js";

async function extractor(tag,categ) {
  try {
    const [data] = await Promise.all([extractPage(tag, categ)]);

    return { data };
  } catch (error) {
    console.error(`Error extracting data for:`, error.message);
    throw error;
  }
}

export { extractor };
