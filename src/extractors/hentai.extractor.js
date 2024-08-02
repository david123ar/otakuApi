import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import extractPage from "../helper/hentaiHome.helper.js";

async function extractor() {
  try {
    const [data] = await Promise.all([
      extractPage(),
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
