import * as handleReqHelper from "../helper/henCat.helper.js";

export const gethenCat = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};
