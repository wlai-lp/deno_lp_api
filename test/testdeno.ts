import { assert, assertEquals  } from "https://deno.land/std@0.223.0/assert/mod.ts";
import Person, { sayHello } from "../Person.ts"

Deno.test({
  name: "a test case",
  fn() {
    const someCondition = true;
    assert(someCondition);
  },
});


Deno.test("sayHello function", () => {
    const grace: Person = {
      lastName: "Hopper",
      firstName: "Grace",
    };
  
    assertEquals("Hello, Grace!", sayHello(grace));
  });