import { assert } from "https://deno.land/std@0.223.0/assert/mod.ts";
import MessageHistory from "../src/services/MsgHistService.ts";
import { testConfig } from "./TestConfig.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

const env = await load();
const convoId = env["CONVERSATIONID"];

Deno.test("MsgHistService Test", () => {
  const msgHist = new MessageHistory(testConfig);
  assert(msgHist instanceof MessageHistory);
});


Deno.test("MsgHistService GetConvo function", async () => {
    const msgHist = new MessageHistory(testConfig);
    const convo = await msgHist.GetConvoById(convoId)
    console.log(convo.getConvoRecordCount())
    assert(true)
  });
  