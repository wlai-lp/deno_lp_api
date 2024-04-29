import { assert } from "https://deno.land/std@0.223.0/assert/mod.ts";
import AgentVepService from "../src/services/AgentVepService.ts";
import { testConfig } from "./TestConfig.ts";
import { assertExists } from "https://deno.land/std@0.223.0/assert/assert_exists.ts";

Deno.test("AgentVep Service function", () => {
  
  const agentVep = new AgentVepService(testConfig);
  assert(agentVep instanceof AgentVepService);
});


Deno.test("AgentVep Service getToken function", async () => {
    const agentVep = new AgentVepService(testConfig);
    const bearer = await agentVep.getUserBearerToken()
    assertExists(bearer)
  });
  