import { extractor } from "../extractors/otakuInfo.extractor.js";

export const handleReq = async (req, res) => {
  let id = req.query.id || '';

  try {
    const { data } = await extractor(id);

    res.json({ success: true, results: { data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};