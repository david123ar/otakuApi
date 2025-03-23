import { extractor } from "../extractors/otakuSearch.extractor.js";

export const handleReq = async (req, res) => {
  try {
    let s_keyword = req.query.s_keyword || "";
    let page = parseInt(req.query.page) || 1;
    let s_orderby = req.query.s_orderby || "";
    let s_order = req.query.s_order || "";
    let genres = req.query.genres || "";
    if (!Array.isArray(genres)) {
      genres = genres ? [genres] : "";
    }
    let status = req.query.status || "";
    if (!Array.isArray(status)) {
      status = status ? [status] : "";
    }
    let studio = req.query.studio || "";
    if (!Array.isArray(studio)) {
      studio = studio ? [studio] : "";
    }
    let producer = req.query.producer || "";
    if (!Array.isArray(producer)) {
      producer = producer ? [producer] : "";
    }
    let licensor = req.query.licensor || "";
    if (!Array.isArray(licensor)) {
      licensor = licensor ? [licensor] : "";
    }
    let type = req.query.type || "";
    if (!Array.isArray(type)) {
      type = type ? [type] : "";
    }
    let s_season = req.query.s_season || "";
    let s_year = req.query.s_year || "";

    const { data } = await extractor(
      page,
      s_keyword,
      s_orderby,
      s_order,
      genres,
      status,
      studio,
      producer,
      licensor,
      type,
      s_season,
      s_year
    );

    res.json({ success: true, results: { data } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
