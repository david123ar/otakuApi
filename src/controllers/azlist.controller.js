import * as handleReqHelper from '../helper/handleReq.helper.js'

export const getAZList = async (req, res ,routeaz) => {

    await handleReqHelper.handleReq(req, res, routeaz);
};
