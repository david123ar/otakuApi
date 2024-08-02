import { extractor } from "../extractors/hentai.extractor.js";

export const handleReq = async (req, res) => {
  try {
    const { data } = await extractor();

    res.json({ success: true, results: { data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
