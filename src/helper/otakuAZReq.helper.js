import { extractor } from "../extractors/otakuAZ.extractor.js";

export const handleReq = async (req, res) => {
  let page = req.query.page || "";

  try {
    const { data } = await extractor(page);

    res.json({ success: true, results: { data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
