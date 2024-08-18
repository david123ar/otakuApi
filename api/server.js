import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { handleHomePage } from "../src/controllers/home.controller.js";
import { handle404 } from "../src/controllers/404.controller.js";
import { routeTypes } from "../src/routes/category.route.js";
import * as homeInfoController from "../src/controllers/homeInfo.controller.js";
import * as categoryController from "../src/controllers/category.controller.js";
import * as topTenController from "../src/controllers/topten.controller.js";
import * as animeInfoController from "../src/controllers/animeInfo.controller.js";
import * as streamController from "../src/controllers/streamInfo.controller.js";
import * as searchController from "../src/controllers/search.controller.js";
import * as azController from "../src/controllers/azlist.controller.js";
import { routeaz } from "../src/routes/az.route.js";
import { routeTypo } from "../src/routes/azmore.route.js";
import * as azmoreController from "../src/controllers/azmore.controller.js";
import * as hentaiController  from "../src/controllers/hentai.controller.js";
import *  as henRecentController from "../src/controllers/henrecent.controller.js";
import *  as henAllController from "../src/controllers/henall.controller.js";
import *  as henBrowseController from "../src/controllers/henbrowse.controller.js";
import *  as henRandomController from "../src/controllers/henRandom.controller.js";
import *  as henCatController from "../src/controllers/hencat.controller.js";
import *  as henStreamController from "../src/controllers/henStream.js";
import *  as AnilistController from "../src/controllers/anilist.controller.js";

const app = express();
const port = process.env.PORT || 4444;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(dirname(__dirname), "public")));

app.get("/", handleHomePage);

app.get("/api/", async (req, res) => {
  await homeInfoController.getHomeInfo(req, res);
});

routeTypes.forEach((routeType) => {
  app.get(`/api/${routeType}`, async (req, res) => {
    await categoryController.getCategory(req, res, routeType);
  });
});

routeTypo.forEach((routeType) => {
  app.get(`/api/${routeType}`, async (req, res) => {
    await azmoreController.getAZMore(req, res, routeType);
  });
});

app.get("/api/top-ten", async (req, res) => {
  await topTenController.getTopTen(req, res);
});

app.get("/api/hen-home", async (req, res) => {
  await hentaiController.getHentaiHome(req, res);
});

app.get("/api/hen-trend", async (req, res) => {
  await henRecentController.getHentaiRecent(req, res);
});

app.get("/api/hen-all", async (req, res) => {
  await henAllController.gethenAll(req, res);
});

app.get("/api/hen-cat", async (req, res) => {
  await henCatController.gethenCat(req, res);
});

app.get("/api/hen-browse", async (req, res) => {
  await henBrowseController.getHentaiBrowse(req, res);
});

app.get("/api/anilist", async (req, res) => {
  await AnilistController.getAnilistController(req, res);
});

app.get("/api/hen-random", async (req, res) => {
  await henRandomController.getHentaiRandom(req, res);
});

app.get("/api/hen-stream", async (req, res) => {
  await henStreamController.gethenStream(req, res);
});

app.get("/api/az-list", async (req, res) => {
  await azController.getAZList(req, res, routeaz);
});

app.get("/api/info", async (req, res) => {
  await animeInfoController.getAnimeInfo(req, res);
});

app.get("/api/stream", async (req, res) => {
  await streamController.getStreamInfo(req, res);
});

app.get("/api/search", async (req, res) => {
  await searchController.search(req, res);
});

app.get("*", handle404);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
