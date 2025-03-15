import * as handleReqHelper from "../helper/otakuStreamReq.helper.js";

export const getOtakuStream = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};