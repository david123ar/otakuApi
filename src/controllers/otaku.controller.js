import * as handleReqHelper from "../helper/otakuReq.helper.js";

export const getOtakuHome = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};
