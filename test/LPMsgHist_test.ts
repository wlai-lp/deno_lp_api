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
    assert(convo.getConvoRecordCount() == 1)
  });

  Deno.test("MsgHistService GetConvo v2 function", async () => {
    const msgHist = new MessageHistory(testConfig);
    const convo = await msgHist.GetConvoByIdv2(convoId)
    console.log(`should found 1 convo count = ${convo.getConvoRecordCount()}`)
    assert(convo.getConvoRecordCount() == 1)
  });


  Deno.test("MsgHistService GetConvoByDate function", async () => {
    const msgHist = new MessageHistory(testConfig);
    const convo = await msgHist.GetConvoByDateRange(1712084400000, 1714510193033)
    // console.log(convo.getConvoRecordCount())
    console.log(convo)
    assert(true)
  });
  