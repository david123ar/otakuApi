import * as handleReqHelper from "../helper/otakuSearchReq.helper.js";

export const getOtakuSearch = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};