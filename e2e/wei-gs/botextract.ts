import BotService from "../../src/services/BotService.ts";
import { testConfig } from "./gsConfig.ts";
// import { writeTextFile } from "https://deno.land/std@0.110.0/fs/mod.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

const env = await load();

const botService = new BotService(testConfig);
const code = env["BCACCESSCODE"]
const orgid = env["BCORGID"]
await botService.initWithCodeAndOrg(code, orgid);
const ug = await botService.getUngroupedBotResult();
// const result = await botService.getGroupIdsFromGroupBotResult();
const ids = botService.getBotIds();
console.log("🚀 ~ Deno.test ~ ids:", ids);

for (const value of ids ?? []) {
    console.log(value);
    const extract = await botService.getBotById(value);
    await Deno.writeTextFile(`./bots/${value}.json`, JSON.stringify(extract));
}

const filePath = "./example.txt";
const content = "Hello, Deno!123";

// Write to the file
await Deno.writeTextFile(filePath, content);

console.log(`File written to ${filePath}`);