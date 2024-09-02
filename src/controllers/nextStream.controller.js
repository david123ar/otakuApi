import * as handleReqHelper from "../helper/nextStream.helper.js";

export const getnextStream = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};
