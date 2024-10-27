import { assert, assertEquals, assertThrowsAsync  } from "https://deno.land/std@0.223.0/assert/mod.ts";
import Person, { sayHello } from "../Person.ts"

// fetchDataFromUrls.test.js
import { fetchDataFromUrls } from './fetchDataFromUrls.js';
// import { assertEquals, assertThrowsAsync } from "https://deno.land/std@0.97.0/testing/asserts.ts";

Deno.test('fetchDataFromUrls should fetch data from multiple URLs', async () => {
  const urls = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/posts/2',
    'https://jsonplaceholder.typicode.com/posts/3',
  ];

  const expected = [
    { id: 1, title: '...', body: '...' }, // Add expected data
    { id: 2, title: '...', body: '...' },
    { id: 3, title: '...', body: '...' },
  ];

  const data = await fetchDataFromUrls(urls);
  assertEquals(data, expected);
});

Deno.test('fetchDataFromUrls should throw an error for invalid URLs', async () => {
  const urls = [
    'https://invalid-url-1.com',
    'https://invalid-url-2.com',
  ];

  await assertThrowsAsync(
    async () => {
      await fetchDataFromUrls(urls);
    },
    Error,
    'Failed to fetch from',
  );
});


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