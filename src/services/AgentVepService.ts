import { AgentVep, Domains, LPConfig } from "../types/api.d.ts";
import getLPDomain from "./DomainService.ts";

const serviceName = "agentVep";

export default class AgentVepService {
  config: LPConfig;
  serviceURL: string | undefined;

  constructor(config: LPConfig) {
    this.config = config;
  }

  isEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined && value !== '';
}

  async getUserBearerToken() {
    if(this.isEmpty(this.config.bearer)){
      console.log("has token in the .env, return token " + this.config.bearer);
      return this.config.bearer;
      
    }
    const domain = await getLPDomain(this.config.siteId);
    await this.GetAgentVep(domain);
    return await this.authUser();
  }

  async authUser() {
    const url = `https://${this.serviceURL}/api/account/${this.config.siteId}/login?v=1.3`;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const raw = JSON.stringify({
      username: this.config.userName,
      password: this.config.password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };

    const response = await fetch(url,requestOptions)
    const jsonObj : AgentVep = await response.json()
    const bearer = jsonObj.bearer
    console.log("🚀 ~ AgentVepService ~ authUser ~ bearer:", bearer) 
    return bearer         
  }

  GetAgentVep(domains: Domains) {
    const serviceUrl = domains.baseURIs.find(
      (entry) => entry.service == serviceName
    )?.baseURI;
    console.log("🚀 ~ AgentVep service ~ serviceUrl:", serviceUrl);
    this.serviceURL = serviceUrl;
  }
}
