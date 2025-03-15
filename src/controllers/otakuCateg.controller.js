import * as handleReqHelper from "../helper/otakuCategReq.helper.js";

export const getOtakuCateg = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};