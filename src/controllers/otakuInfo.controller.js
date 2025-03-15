import * as handleReqHelper from "../helper/otakuInfoReq.helper.js";

export const getOtakuInfo = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};