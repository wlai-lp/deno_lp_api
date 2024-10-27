// fetchDataFromUrls.js
export async function fetchDataFromUrls(urls) {
    const fetchPromises = urls.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }
      return response.json();
    });
  
    return Promise.all(fetchPromises);
  }
  