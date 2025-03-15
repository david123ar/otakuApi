import { extractor } from "../extractors/otakuCateg.extractor.js";

export const handleReq = async (req, res) => {
  let tag = req.query.tag || "";
  let categ = req.query.categ || "";
  try {
    const { data } = await extractor(tag, categ);

    res.json({ success: true, results: { data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
