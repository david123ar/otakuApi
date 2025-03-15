import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import extractPage from "../helper/otakuStream.helper.js";

async function extractor(id) {
  try {
    const [data] = await Promise.all([
      extractPage(id),
    ]);

    return { data };
  } catch (error) {
    console.error(
      `Error extracting data for:`,
      error.message
    );
    throw error;
  }
}

export { extractor };