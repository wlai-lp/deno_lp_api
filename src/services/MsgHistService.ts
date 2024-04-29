import { LPConfig, Domains } from "../types/api.d.ts";
import { MsgHistResponse } from "../util/MsgHistResponse.ts";
import AgentVepService from "./AgentVepService.ts";
import getLPDomain from "./DomainService.ts";

const serviceName = "msgHist";

const preset: string[] = [
  "campaign",
  "consumerParticipants",
  "sdes",
  "monitoring",
  "unAuthSdes",
  "pageView",
  "messageRecords",
];

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
  config: LPConfig;
  domains?: Domains | undefined = undefined;
  constructor(config: LPConfig) {
    this.config = config;
  }

  /**
   * this use the preset payload to query
   */
  async GetConvoById(id: string) : Promise<MsgHistResponse> {
    const serviceURL = await this.getMsgHistUrl();
    const requestOptions = this.buildRequestOptions(id);

    const url = `https://${serviceURL}/messaging_history/api/account/${this.config.siteId}/conversations/conversation/search?v=2`

    const response = await fetch(url, requestOptions)
    const jsonObj = await response.json()
    return new MsgHistResponse(jsonObj)
    
  }

  private buildRequestOptions(id: string) {
    const myHeaders = new Headers();
    myHeaders.append("authorization", `Bearer ${this.config.bearer}`);
    myHeaders.append("content-type", "application/json");

    const raw = JSON.stringify({
      conversationId: id,
      contentToRetrieve: [
        "campaign",
        "consumerParticipants",
        "sdes",
        "monitoring",
        "unAuthSdes",
        "pageView",
        "messageRecords",
      ],
      cappingConfiguration: "ConversationSummaryEvent:1:desc,CartStatusEvent:1:desc,ServiceActivityEvent:1:desc,CustomerInfoEvent:1:desc,MarketingCampaignInfoEvent:1:desc,PersonalInfoEvent:1:desc,PurchaseEvent:10:desc,ViewedProductEvent:50:desc,VisitorErrorEvent:10:desc,LeadEvent:10:desc,SearchContentEvent:30:desc",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    return requestOptions;
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
}

export class contentToRetrieveBuilder {
  params: string[];

  constructor() {
    this.params = [];
  }

  addParam(param: ContentParams) {
    this.params.push(param);
    return this;
  }

  build() {
    return this.params;
  }
}
