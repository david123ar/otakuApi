import * as handleReqHelper from "../helper/anilist.helper.js";

export const getAnilistController = async (req, res) => {
  await handleReqHelper.handleReq(req, res);
};
