import { extractor } from "../extractors/nextStream.extractor.js";

export const handleReq = async (req, res) => {
  try {
    let impo = req.query.id;
    const { data } = await extractor(impo);

    res.json({ success: true, results: { data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
