import { assert } from "https://deno.land/std@0.223.0/assert/mod.ts";
import getLPDomain from "../src/services/DomainService.ts";


Deno.test("getLPDomain function", async () => {
    const siteId = "90412079"
    const domain = await getLPDomain(siteId)
    domain.baseURIs.length
    assert(domain.baseURIs.length > 0)
  });