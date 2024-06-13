import { assert } from "https://deno.land/std@0.223.0/assert/mod.ts";
import BotService from "../src/services/BotService.ts";
import { testConfig } from "./TestConfig.ts";
import { assertExists } from "https://deno.land/std@0.223.0/assert/assert_exists.ts";

Deno.test("Bot Service function", () => {
  const botService = new BotService(testConfig);
  assert(botService instanceof BotService);
});

Deno.test("Bot Service get bearer token", async () => {
  const botService = new BotService(testConfig);
  const bearer = await botService.getUserBearerToken();
  assertExists(bearer);
});

Deno.test("Bot Service get access code function", async () => {
  const botService = new BotService(testConfig);
  const code = await botService.getUserAuthorizationCode();
  assertExists(code);
});

Deno.test("Bot Service get access code function", async () => {
    const botService = new BotService(testConfig);
    const code = await botService.getUserAuthorizationCode();
    assertExists(code);
});