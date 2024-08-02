import * as handleReqHelper from "../helper/henRecent.helper.js";

export const getHentaiRecent = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};
