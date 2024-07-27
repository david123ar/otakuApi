import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import countPages from "../helper/countPagesAZ.helper.js";
import extractPage from "../helper/extractPagesAZ.helper.js";

async function extractor(path, page) {
  try {
    const [data, totalPages] = await Promise.all([
      extractPage(path, page),
      countPages(`${baseUrl}/${path}`),
    ]);

    return { data, totalPages };
  } catch (error) {
    console.error(
      `Error extracting data for ${path} from page ${page}:`,
      error.message
    );
    throw error;
  }
}

export { extractor, countPages };
