import { LPConfig, Domains, MsgHistDateRangePayload, MsgHistByIdPayload } from "../types/api.d.ts";
import { MsgHistResponse } from "../util/MsgHistResponse.ts";
import AgentVepService from "./AgentVepService.ts";
import getLPDomain from "./DomainService.ts";

// domain is msgHist but api is Messaging Interaction API
// https://developers.liveperson.com/messaging-interactions-api-overview.html
const serviceName = "msgHist";

const preset: string[] = [
  "campaign",
  "consumerParticipants",
  "sdes",
  "monitoring",
  "unAuthSdes",
  "pageView",
  "messageRecords",
  "transfers",
];

enum URLType {
  convo = 1,
  convoByConvoId = 2,
  convoByConsumerId = 3,  
}

export enum ContentParams {
  campaign = "campaign",
  consumerParticipants = "consumerParticipants",
  sdes = "sdes",
  monitoring = "monitoring",
  unAuthSdes = "unAuthSdes",
  pageView = "pageView",
  messageRecords = "messageRecords",
}

export default class MessageHistory {
  fullUrl?: string;
  convoUrl?: string;
  convoByConvoIdUrl?: string;
  convoByConsumerIdUrl?: string;
  config: LPConfig;
  domains?: Domains | undefined = undefined;
  constructor(config: LPConfig) {
    this.config = config;
    // this.init()
  }

  /************ start public methods */
  // public methods should follow the following pattern
  // define a Partial<MsgHistPayload> 
  // set the param
  // send it to this.doPost
  // return new MsgHistResponse class
  // Create the corresponding unit test
  
  async GetConvoById(id: string) : Promise<MsgHistResponse> {
    const defaultValues: Partial<MsgHistByIdPayload> = {      
      conversationId: id    
    };
    const jsonObj = await this.doPost(defaultValues, URLType.convoByConvoId);    
    return new MsgHistResponse(jsonObj)
  }

  
  /**
   * 
   * @param fromTimestamp 
   * @param toTimeStamp 
   */
  async GetConvoByDateRange(fromTimestamp: number, toTimeStamp: number) : Promise<MsgHistResponse>{
    const defaultValues: Partial<MsgHistDateRangePayload> = {      
      start: {
          from: fromTimestamp,
          to: toTimeStamp
      }      
    };
    const jsonObj = await this.doPost(defaultValues, URLType.convo);    
    return new MsgHistResponse(jsonObj)
  }


  /*************end public methods */


  /****************** Start private Helper functions  *************/

  private async getFullURL(urlType : URLType) : Promise<string> {

    if(this.fullUrl !== undefined){
      switch (urlType) {
        case URLType.convo:
          return this.convoUrl!
        case URLType.convoByConvoId:
          return this.convoByConvoIdUrl!            
        default:
          return this.convoByConsumerIdUrl!
      }
    } else {
      await this.checkDomains();
      await this.checkBearer();
      const serviceURL = await this.getMsgHistUrl();
      const url = `https://${serviceURL}/messaging_history/api/account/${this.config.siteId}/conversations/conversation/search?v=2`;
      console.log("🚀 ~ MessageHistory ~ geFullURL ~ url:", url)
      this.fullUrl = url
      this.convoUrl = `https://${serviceURL}/messaging_history/api/account/${this.config.siteId}/conversations/search`;
      this.convoByConvoIdUrl = `https://${serviceURL}/messaging_history/api/account/${this.config.siteId}/conversations/conversation/search?v=2`;
      this.convoByConsumerIdUrl = `https://${serviceURL}/messaging_history/api/account/${this.config.siteId}/conversations/consumer/search`;
      return this.getFullURL(urlType)
    }
  }

  private buildReqOptions(payload: MsgHistDateRangePayload){
    const myHeaders = new Headers();
    myHeaders.append("authorization", `Bearer ${this.config.bearer}`);
    myHeaders.append("content-type", "application/json");

    const raw = JSON.stringify(payload)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    return requestOptions;
  }

  
  // generate dopost to msgHistocial API
  private async doPost(defaultValues: Partial<MsgHistDateRangePayload>, urlType : URLType) {

    // get the full url before calling buildReqOptions
    // because get full rul also auth user if not auth, then store the token
    // to be used by buildReqOptions
    const url = await this.getFullURL(urlType);
    const searchPayload: MsgHistDateRangePayload = { ...defaultValues } as MsgHistDateRangePayload;
    const requestOptions = this.buildReqOptions(searchPayload);

    const response = await fetch(url, requestOptions);
    const jsonObj = await response.json();
    return jsonObj;
  }

  private async getMsgHistUrl() {
    await this.checkDomains();
    await this.checkBearer();
    const msgHistUrl = this.domains!.baseURIs.find(
      (entry) => entry.service == serviceName
    )?.baseURI;
    console.log("🚀 ~ GetConversation ~ msgHistUrl:", msgHistUrl);
    return msgHistUrl;
  }

  private async checkBearer() {
    if (this.config.bearer === "" || this.config.bearer === undefined) {
      const agentService = new AgentVepService(this.config);
      this.config.bearer = await agentService.getUserBearerToken();
    }
  }

  private async checkDomains() {
    if (this.domains === undefined)
      this.domains = await getLPDomain(this.config.siteId);
  }

  /****************** end Helper functions  *************/
}