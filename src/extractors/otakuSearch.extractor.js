import axios from "axios";
import baseUrl from "../utils/baseUrl.js";
import extractPage from "../helper/otakuSearch.helper.js";

async function extractor(
  page,
  s_keyword,
  s_orderby,
  s_order,
  genres,
  status,
  studio,
  producer,
  licensor,
  type,
  s_season,
  s_year
) {
  try {
    const [data] = await Promise.all([
      extractPage(
        page,
        s_keyword,
        s_orderby,
        s_order,
        genres,
        status,
        studio,
        producer,
        licensor,
        type,
        s_season,
        s_year
      ),
    ]);

    return { data };
  } catch (error) {
    console.error(`Error extracting data for:`, error.message);
    throw error;
  }
}

export { extractor };
