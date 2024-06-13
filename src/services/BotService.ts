import { BotAuthUser, LPConfig } from "../types/api.d.ts";
import { BOT_AUTH_URL } from "../util/LPConst.ts"
import AgentVepService from "./AgentVepService.ts";

/**
 * use AgentVep service to get token
 * send token to bot auth endpoint to get access code
 */
export default class BotService {
  config: LPConfig;
  bearer: string = "";
  accessCode: string = "";
  organizationId: string = "";
  authCode: string = "";

  constructor(config: LPConfig) {
    this.config = config;
  }

  async init(){
    await this.getUserBearerToken();
    await this.getUserAuthorizationCode();

  }

  async getUserBearerToken() {
    const agentVep = new AgentVepService(this.config);
    this.bearer = await agentVep.getUserBearerToken();
    return this.bearer;
  }

  /**
   * bot uses SSO, need to send CC's bears token to get a bot auth code
   * @returns
   */
  async getUserAuthorizationCode() {
    await this.getUserBearerToken();
    if (this.bearer === "") {
        throw new Error("No bearer token value");
    } else {
      return await this.authUser();
    }
  }

  /**
   * 
   * @returns accessToken
   */
  async authUser() {

    const requestOptions = {
      method: "GET",
      headers: this.botApiHeader()
    };

    const response = await fetch(BOT_AUTH_URL, requestOptions);
    const botUserAuth: BotAuthUser = await response.json();
    this.authCode = botUserAuth.successResult.apiAccessToken;
    this.organizationId = botUserAuth.successResult.sessionOrganizationId
    console.log("🚀 ~ BotService ~ authUser ~ organizationId:", this.organizationId)
    console.log("🚀 ~ botService ~ authUser ~ accessToken:", this.authCode);
    return this.authCode;    
  }

  private botApiHeader() {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("Authorization", `Bearer ${this.bearer}`);
    return myHeaders;
  }

  async getBotGroups() {

  }
  
  
}
