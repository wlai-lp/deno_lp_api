import {
  BotAuthUser,
  BotGroupEntity,
  BotGroupsResult,
  LPConfig,
  BotEntity,
  GroupedBotResult,
  BotAgentsResult,
} from "../types/api.d.ts";
import {
  BOT_AUTH_URL,
  BOT_GET_GROUPS_URL,
  BOT_GET_UNGROUPED_URL,
  BOT_EXPORT_URL,
  BOT_GET_GROUP_ID_URL,
  BOT_AGENT_URL,
} from "../util/LPConst.ts";
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
  botGroupEntities: BotGroupEntity[] | undefined;
  botEntities: BotEntity[] | undefined;

  constructor(config: LPConfig) {
    this.config = config;
  }

  
  /**
   * if you have the code and org id, you can init this way
   */
  initWithCodeAndOrg(code: string, orgid: string) {
    this.accessCode = code;
    this.organizationId = orgid;
  }

  /**
   * This uses LPConfig object to get access token and code
   * then
   * @returns
   */
  async init() {
    try {
        await this.getUserAuthorizationCode(BOT_AUTH_URL);
        await this.getUngroupedBotResult(); // this gets all ungrouped bot entities
        await this.getBotGroups(); // this gets all group ids
        await this.getGroupIdsFromGroupBotResult(); // then loop each group to get bot entities
        await this.getAgentConnector();
        return true;    
    } catch (error) {
        throw new Error("Init error " + error);        
    }    
  }

  async getAgentConnector(){
    const fetchPromises = this.botEntities?.map(async (bot) =>{
        const result : Promise<BotAgentsResult> = this.botAPI(BOT_AGENT_URL + bot.botId)
        // console.log("agent id = " + result.agents[0].lpUserId)
        return result;
    })

    try {
        // Wait for all fetch calls to complete
        const results = await Promise.all(fetchPromises!);

        // Process the results
        results.forEach((result, index) => {
            console.log(`Data for ID `, result);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
  }

  async getBotEntitiesByGroupId(groupId: string) {    
    const URL = BOT_GET_GROUP_ID_URL + groupId;
    const result: GroupedBotResult = await this.botAPI(URL);
    const resultBotEntities: BotEntity[] = result.successResult.data;    
    if (result.success) {
        this.botEntities = [...this.botEntities!, ...resultBotEntities]    
        return result;
    } else {
        throw new Error("Search by group id not successful");        
    }    
  }

  /**
   * get all group ids
   * for each group id, call get get groupby id to get bot entities
   * return bot entities
   * @returns
   */
  async getGroupIdsFromGroupBotResult() {
    const groupIds = this.botGroupEntities?.map((bge) => bge.botGroupId);    
    for (const value of groupIds!) {
      await this.getBotEntitiesByGroupId(value);
    }
    return groupIds;
  }

  async getBotGroups() {
    const botGroupsResult: BotGroupsResult = await this.botAPI(BOT_GET_GROUPS_URL);    
    this.botGroupEntities = botGroupsResult.successResult.data;
    return botGroupsResult;
  }

  async getBotById(id: string) {
    const result = await this.botAPI(BOT_EXPORT_URL + id);
    return result;
  }  

  getBotIds() {
    const botIds = this.botEntities?.map((bot) => bot.botId)
    return botIds;
  }

  async getUngroupedBotResult() {
    const ungroupedBotResult: GroupedBotResult = await this.botAPI(BOT_GET_UNGROUPED_URL);
    this.botEntities = ungroupedBotResult.successResult.data;    
    return ungroupedBotResult;
  }

  async getUserBearerToken() {
    const agentVep = new AgentVepService(this.config);
    this.bearer = (await agentVep.getUserBearerToken()) || "";
    return this.bearer;
  }

  /**
   * bot uses SSO, need to send CC's bears token to get a bot auth code
   * @returns
   */
  async getUserAuthorizationCode(URL: string) {
    await this.getUserBearerToken();
    if (this.bearer === "") {
      throw new Error("No bearer token value");
    } else {
      const botUserAuth: BotAuthUser = await this.botAuthAPI(URL);
      if (botUserAuth.success) {
        this.accessCode = botUserAuth.successResult.apiAccessToken;
        this.organizationId = botUserAuth.successResult.sessionOrganizationId;        
        return this.accessCode;
      } else {
        console.error("unable to get access code");
        throw new Error("Unable to get accessCode");
      }
    }
  }

  /**
   * generic method to all all bot API endpoints
   * @param URL bot api endpoints
   * @returns
   */
  async botAPI(URL: string) {
    console.log("🚀 ~ BotService ~ botAPI ~ URL:", URL);
    const response = await fetch(URL, this.botApiRequestOptions());
    // const botUserAuth: BotAuthUser = await response.json();
    return response.json();
  }

  /**
   * botAuthAPI method to all all bot API endpoints
   * @param URL bot api endpoints
   * @returns
   */
  async botAuthAPI(URL: string) {
    console.log("🚀 ~ BotService ~ botAPI ~ URL:", URL);
    const response = await fetch(URL, this.botAuthApiRequestOptions());
    // const botUserAuth: BotAuthUser = await response.json();
    return response.json();
  }

  /**
   * Bot auth is SSO that takes bearer token
   * @returns request option for Bot Auth call
   */
  private botAuthApiRequestOptions() {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("Authorization", `Bearer ${this.bearer}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    return requestOptions;
  }

  /**
   * All bot api calls takes access code and orgid in header
   * @returns request option for all other Bot related API call
   */
  private botApiRequestOptions() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${this.accessCode}`);
    myHeaders.append("OrganizationId", `${this.organizationId}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    return requestOptions;
  }
}
