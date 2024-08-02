import * as handleReqHelper from "../helper/henStream.helper.js";

export const gethenStream = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};
