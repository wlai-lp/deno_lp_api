import { LPConfig } from "../../src/types/api.js";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

const env = await load();
const password = env["PASSWORD"];
const username = env["USERNAME"];
const siteId = env["SITEID"];
const bearer = env["BEARER"]

export const testConfig: LPConfig = {
    siteId: siteId,
    userName: username,
    password: password,
    bearer: bearer,
  };