import {
  BotAuthUser,
  BotGroupEntity,
  BotGroupsResult,
  LPConfig,
  BotEntity,
  GroupedBotResult,
} from "../types/api.d.ts";
import {
  BOT_AUTH_URL,
  BOT_GET_GROUPS_URL,
  BOT_GET_UNGROUPED_URL,
  BOT_EXPORT_URL,
  BOT_GET_GROUP_ID_URL,
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
  botIds: string[] = new Array(0);

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
        // TODO: get bot ids from group ids
        await this.getGroupIdsFromGroupBotResult(); // then loop each group to get bot entities
        return true;    
    } catch (error) {
        throw new Error("Init error " + error);        
    }    
  }

  // TODO: WIP getting the entity to merge, has the ids now
  async getBotEntitiesByGroupId(groupId: string) {
    console.log(
      "🚀 ~ BotService ~ getBotEntitiesByGroupId ~ groupId:",
      groupId
    );
    const URL = BOT_GET_GROUP_ID_URL + groupId;
    console.log("🚀 ~ BotService ~ getBotEntitiesByGroupId ~ URL:", URL);
    const result: GroupedBotResult = await this.botAPI(URL);
    const resultBotEntities: BotEntity[] = result.successResult.data;    
    console.log(result.success);

    this.botEntities = [...this.botEntities!, ...resultBotEntities]
    //console.log("🚀 ~ BotService ~ getBotEntitiesByGroupId ~ botEntities:", this.botEntities)


    const ids = resultBotEntities.map((entity) => entity.botId);
    console.log(ids);
    this.botIds = [...this.botIds, ...ids];
    console.log(this.botIds);
    // if(this.botEntities !== undefined){
    //     this.botEntities = [this.botEntities, ...resultBotEntities]
    // }
    // const result = await this.botAPI(BOT_EXPORT_URL + id)
    return result;
  }

  /**
   * get all group ids
   * for each group id, call get get groupby id to get bot entities
   * return bot entities
   * @returns
   */
  async getGroupIdsFromGroupBotResult() {
    const groupIds = this.botGroupEntities?.map((bge) => bge.botGroupId);
    console.log(
      "🚀 ~ BotService ~ getGroupIdsFromGroupBotResult ~ groupIds:",
      groupIds
    );

    for (const value of groupIds!) {
      await this.getBotEntitiesByGroupId(value);
    }
    return groupIds;
  }

  async getBotGroups() {
    // const botGroupsResult: BotGroupsResult = await this.testURL();
    const botGroupsResult: BotGroupsResult = await this.botAPI(
      BOT_GET_GROUPS_URL
    );
    console.log(
      "🚀 ~ BotService ~ getBotGroups ~ botGroupsResult:",
      botGroupsResult.success
    );
    this.botGroupEntities = botGroupsResult.successResult.data;
    return botGroupsResult;
  }

  async getAllBotEntities() {
    await this.getUngroupedBotResult();
    // await this.getGroupedBotResult()
  }


  async getBotById(id: string) {
    const result = await this.botAPI(BOT_EXPORT_URL + id);
    return result;
  }

  

  getBotIds() {
    const botIds = this.botEntities?.map((bot) => bot.botId)
    // return this.botIds;
    return botIds;
  }

  async getUngroupedBotResult() {
    const ungroupedBotResult: GroupedBotResult = await this.botAPI(
      BOT_GET_UNGROUPED_URL
    );
    this.botEntities = ungroupedBotResult.successResult.data;
    console.log(
      "🚀 ~ BotService ~ getUngroupedBotResult:",
      ungroupedBotResult.success
    );
    // TODO: doesn't belong there, short term solution to get the ids
    const ids = this.botEntities.map((bot) => bot.botId);
    this.botIds = [...this.botIds, ...ids];
    return ungroupedBotResult;
  }

  async testURL() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "b6528493-ecd8-4675-8809-d08f8b361e58");
    // myHeaders.append("Connection", "keep-alive");
    myHeaders.append("OrganizationId", "8c8e49dd-603f-49c3-9a53-7646d20713f4");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const response = await fetch(
      "https://va.bc-platform.liveperson.net/bot-platform-manager-0.1/bot-groups?expand-all=true",
      requestOptions
    );
    return await response.json();
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
        console.log(
          "🚀 ~ BotService ~ authUser ~ organizationId:",
          this.organizationId
        );
        console.log(
          "🚀 ~ botService ~ authUser ~ accessToken:",
          this.accessCode
        );
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
    return await response.json();
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
