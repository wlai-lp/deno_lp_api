import { assert, assertInstanceOf } from "https://deno.land/std@0.223.0/assert/mod.ts";
import BotService from "../src/services/BotService.ts";
import { testConfig } from "./TestConfig.ts";
import { assertExists } from "https://deno.land/std@0.223.0/assert/assert_exists.ts";
import { BOT_AUTH_URL } from "../src/util/LPConst.ts";
import { assertIsError } from "https://deno.land/std@0.224.0/assert/assert_is_error.ts";
// import fetchAllBotData from "../promiseall.ts"

Deno.test("Bot Service start", () => {
  const botService = new BotService(testConfig);
  assert(botService instanceof BotService);
});

Deno.test("Bot Service get bearer token", async () => {
  const botService = new BotService(testConfig);
  const bearer = await botService.getUserBearerToken();
  assertExists(bearer);
});

Deno.test("Bot Service get bearer token with bearer", async () => {
  testConfig.bearer = "dummy-bearer-value"
  const botService = new BotService(testConfig);
  const bearer = await botService.getUserBearerToken();
  assertExists(bearer);
});


Deno.test("Bot Service init", async () => {
  const botService = new BotService(testConfig);
  const code = await botService.init();
  assertExists(code);
});

Deno.test("Bot Service init with bearer throw error", async () => {
  testConfig.bearer = "dummy-bearer-value"
  const botService = new BotService(testConfig);
  try {
    await botService.init()
    assertIsError(null)
  } catch (error) {
    assertIsError(error);    
  }
});


Deno.test("Bot Service export bot", async () => {
  const botService = new BotService(testConfig);
  await botService.init();  
  const botExport = await botService.getBotById("9cef068d-2f16-4437-8a22-ff24a84f8bf7")
  assertExists(botExport);
});


Deno.test("Bot Service get access code function", async () => {
  const botService = new BotService(testConfig);
  const code = await botService.getUserAuthorizationCode(BOT_AUTH_URL);  
  assertExists(code);
});

Deno.test("Bot Service get bot entity by group id", async () => {
  const botService = new BotService(testConfig);
  await botService.init(); 
  const gid = "210cba4c-7a16-407e-bd8e-716f0af4ae2c"
  const result = await botService.getBotEntitiesByGroupId(gid)
  assertExists(result);
});

Deno.test("Bot Service get all groups", async () => {
  const botService = new BotService(testConfig);
  await botService.init(); 
  const ug = await botService.getUngroupedBotResult()
  const result = await botService.getGroupIdsFromGroupBotResult()
  const ids = botService.getBotIds()
  console.log("🚀 ~ Deno.test ~ ids:", ids)
  
  assertExists(result);
});

Deno.test("Bot Service get all bot ids", async () => {
  const botService = new BotService(testConfig);
  await botService.init();
  const botIds = botService.getBotIds()
  //botService.getGroupIdsFromGroupBotResult()
  // const botExport = await botService.getBotById("9cef068d-2f16-4437-8a22-ff24a84f8bf7")
  assertExists(botService);
  assert(Array.isArray(botIds))
  assert(botIds.length == 23)
});

Deno.test("fetch all", async () => {
  // fetchAllBotData.fetach
});
