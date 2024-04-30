import { AgentVep, Domains, LPConfig } from "../types/api.d.ts";
import getLPDomain from "./DomainService.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

const env = await load();
const bearer = env["BEARER"];
const serviceName = "agentVep";

export default class AgentVepService {
  config: LPConfig;
  serviceURL: string | undefined;

  constructor(config: LPConfig) {
    this.config = config;
  }

  async getUserBearerToken() {
    if(bearer !== '' || bearer === undefined){
      console.log("has token in the .env, return token");
      return bearer;
      
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
