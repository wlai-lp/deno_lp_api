import { MsgHistoryResponseJSON } from "../types/api.d.ts";


export class MsgHistResponse{
    responseJson: MsgHistoryResponseJSON;
    constructor(response:MsgHistoryResponseJSON) {        
        this.responseJson = response
    }

    getConvoRecordCount() {
        return this.responseJson.conversationHistoryRecords.length
    }

}