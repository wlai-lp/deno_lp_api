import { MsgHistResponse } from "../../src/util/MsgHistResponse.ts";

const filename = '53.json';
try {
    // Read the file as bytes
    const data = await Deno.readFile(filename);

    // Convert bytes to string
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(data);

    // Parse the JSON string into a JavaScript object
    const jsonObject = JSON.parse(jsonString);

    const msgHistResponse : MsgHistResponse = new MsgHistResponse(jsonObject)
    console.log(msgHistResponse.responseJson._metadata.count)

    const result = msgHistResponse.responseJson.conversationHistoryRecords.filter(item => {
        if(item.info.latestSkillId === 1729987630 && item.info.status === "CLOSE"){
            return item;
        }
    })

    console.log(result.length)

    // console.log(jsonObject);
} catch (error) {
    console.error("Error reading file:", error);
}