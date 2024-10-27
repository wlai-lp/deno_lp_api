// import MessageHistory from "https://deno.land/x/deno_lp_api@v0.1.0/src/services/MsgHistService.ts";
import { testConfig } from "./test/TestConfig.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

// use this to reference the local modules
import { BaseService, MsgHistService } from "./src/mod.ts";

// use this to reference the jsr published modules
// import { BaseService, MsgHistService } from "jsr:@lp/denosdk";


const baseService = new BaseService(testConfig, "accountConfigReadOnly");
console.log(await baseService.getServiceUrl()); //


const env = await load();
const convoId = env["CONVERSATIONID"];

const msgHist = new MsgHistService(testConfig);
const convo = await msgHist.GetConvoById(convoId)
console.log(convo.getConvoRecordCount())
console.log(convo.responseJson.conversationHistoryRecords[0].messageRecords[0].messageData.msg.text);
convo.responseJson.conversationHistoryRecords[0].info.latestAgentNickname
    

