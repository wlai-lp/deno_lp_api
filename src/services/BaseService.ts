import { LPConfig, Domains, MsgHistDateRangePayload, MsgHistByIdPayload } from "../types/api.d.ts";
import AgentVepService from "./AgentVepService.ts";
import getLPDomain from "./DomainService.ts";

export default class BaseService {
  serviceName: string;
  config: LPConfig;
  domains?: Domains | undefined = undefined;
  constructor(config: LPConfig, serviceName:string) {
    this.config = config;
    this.serviceName = serviceName
  }

  /*************begin public methods */

  public async getServiceUrl() : Promise<string | undefined> {
    await this.checkDomains();
    await this.checkBearer();
    const serviceUrl = this.domains!.baseURIs.find(
      (entry) => entry.service == this.serviceName
    )?.baseURI;
    console.log("🚀 ~ BaseService ~ getServiceUrl:", serviceUrl);
    return serviceUrl;
  }

  /*************end public methods */



  /****************** Start private Helper functions  *************/

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