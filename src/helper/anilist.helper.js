import { extractor } from "../extractors/anilist.extractor.js";

export const handleReq = async (req, res) => {
  try {
    let requestedPage = parseInt(req.query.id) || 166531;
    const { data } = await extractor(requestedPage);

    requestedPage = Math.min(requestedPage);

    if (requestedPage !== parseInt(req.query.id)) {
      return res.redirect(
        `${req.originalUrl.split("?")[0]}?page=${requestedPage}`
      );
    }
    res.json({ success: true, results: { data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
