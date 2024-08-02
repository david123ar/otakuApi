import { extractor } from "../extractors/henCat.extractor.js";

export const handleReq = async (req, res) => {
  try {
    let requestedPage = parseInt(req.query.page) || 1;
    let impo = req.query.brand
    let item = req.query.item
    const { data } = await extractor(requestedPage,impo,item);

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
