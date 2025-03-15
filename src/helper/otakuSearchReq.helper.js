import { extractor } from "../extractors/otakuSearch.extractor.js";

export const handleReq = async (req, res) => {
  try {
    let keyword = req.query.keyword || '';
    let page = parseInt(req.query.page) || 1;

    const { data } = await extractor(
      page,
      keyword,
    );

    res.json({ success: true, results: { data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
