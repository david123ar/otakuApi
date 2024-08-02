import { extractor } from "../extractors/henAll.extractor.js";

export const handleReq = async (req, res) => {
  try {
    let requestedPage = parseInt(req.query.page) || 1;
    let search = req.query.search 
    const { data } = await extractor(requestedPage,search);

    requestedPage = Math.min(requestedPage);

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
