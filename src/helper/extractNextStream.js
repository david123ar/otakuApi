import axios from "axios";
import * as cheerio from "cheerio";
import baseUrl from "../utils/baseUrl.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

const axiosInstance = axios.create({ headers: DEFAULT_HEADERS });

async function extractPage(params) {
  try {
    const resp = await axiosInstance.get(`${baseUrl}/watch/${params}`);
    const $ = cheerio.load(resp.data);

    const scheduleDateValue = $("#schedule-date").attr("data-value");

    // Log the extracted value
    console.log(scheduleDateValue);

    const data = scheduleDateValue;

    return data;
  } catch (error) {
    console.error(`Error extracting data from page:`, error.message);
    throw error;
  }
}

export default extractPage;
