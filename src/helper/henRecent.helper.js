import { extractor } from "../extractors/henRecent.extractor.js";

export const handleReq = async (req, res) => {
  try {
    let requestedPage = parseInt(req.query.page) || 1;
    const { data } = await extractor(requestedPage);


    if (requestedPage !== parseInt(req.query.page)) {
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
