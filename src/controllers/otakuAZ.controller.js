import * as handleReqHelper from "../helper/otakuAZReq.helper.js";

export const getOtakuAZ = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};