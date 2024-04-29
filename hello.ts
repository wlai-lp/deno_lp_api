// import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
// import GetAgentVep from "./src/services/AgentVepService.ts";
import getLPDomain from "./src/services/DomainService.ts";
// import GetConversation from "./src/services/MsgHistService.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

const env = await load();
const password = env["PASSWORD"];

console.log(password);

interface Person {
  firstName: string;
  lastName: string;
}

function sayHello(p: Person): string {
  return `Hello, ${p.firstName}!`;
}

const ada: Person = {
  firstName: "Ada",
  lastName: "Lovelace",
};

console.log(sayHello(ada));

// const site = await fetch("https://www.deno.com");

// console.log(await site.text());

const domains = await getLPDomain('36416044')
// console.log("🚀 ~ domains:", JSON.stringify(domains))
// GetConversation(domains)
// GetAgentVep(domains)

