import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import extractPage from "../helper/extractNextStream.js";

async function extractor(impo) {
  try {
    const [data] = await Promise.all([extractPage(impo)]);

    return { data };
  } catch (error) {
    console.error(
      `Error extracting data for from page:`,
      error.message
    );
    throw error;
  }
}

export { extractor };
