import { Domains } from "./src/types/api.d.ts"

const serviceName = "agentVep"

function GetAgentVepxxx(domains: Domains){
    const msgHistUrl = domains.baseURIs.find(entry => entry.service == serviceName)?.baseURI
    console.log("🚀 ~ GetConversation ~ msgHistUrl:", msgHistUrl)
    

}

export default GetAgentVepxxx