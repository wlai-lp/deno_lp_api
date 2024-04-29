import { Domains } from "../types/api.d.ts"


async function getLPDomain(siteId:string){
    const site = await fetch(`https://api.liveperson.net/api/account/${siteId}/service/baseURI?version=1.0`)
    const domain:Domains = await site.json()
    return domain
}

export default getLPDomain 