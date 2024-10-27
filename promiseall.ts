
const jsonData = {
    "success": true,
    "successResult": {
        "pageContext": {
            "page": 1,
            "size": 50,
            "totalSize": 9
        },
        "data": [
            { "botId": "e9d8f6a8-5d7e-496b-98b2-1b37a8c0a080" },
            { "botId": "02bcaffc-fb22-4282-9208-bbcf9d0f7d0e" },
            { "botId": "cf3d1849-9c12-421d-81c1-5f9f273c279f" },
            { "botId": "e2870ae1-179f-45c4-8a26-1a45ab62c7c2" },
            { "botId": "54cf8893-0db9-427e-8f85-d2473fe5cc2c" },
            { "botId": "ddabf9ff-ebc9-4dd5-a112-9ad60fc53d23" },
            { "botId": "b184e7c5-1b19-4482-88ec-b5593ff34d30" },
            { "botId": "6223dfbd-3d9f-4c1e-b5e2-c2733a5b1bff" },
            { "botId": "e6dd80d0-a0b6-4da8-b6c8-ce59d78ed9a5" }
        ]
    }
};

// Example URL template (replace with your actual API endpoint)
// const apiUrl = (botId: string) => `https://api.example.com/bots/${botId}`;
const apiUrl = (botId: string) => `https://622b7f2314ccb950d23c2b04.mockapi.io/api/v1/OrderStatus`;

// Function to fetch data for a specific bot ID
const fetchBotData = async (botId: string) => {
    const response = await fetch(apiUrl(botId));
    if (!response.ok) {
        throw new Error(`Failed to fetch data for bot ID: ${botId}`);
    }
    return response.json();
};

// Function to get all bot IDs from the JSON data
const getBotIds = (data: any): string[] => {
    return data.successResult.data.map((bot: { botId: string }) => bot.botId);
};

// Main function to fetch data for all bot IDs and merge results
const fetchAllBotData = async () => {
    const botIds = getBotIds(jsonData);
    const fetchPromises = botIds.map(fetchBotData);

    try {
        const results = await Promise.all(fetchPromises);
        // Merge all results into a single array (or object depending on the structure of your API response)
        const mergedResults = [].concat(...results);
        console.log(mergedResults);
        return mergedResults;
    } catch (error) {
        console.error('Error fetching bot data:', error);
    }
};

// Execute the main function
// export default fetchAllBotData();
fetchAllBotData();
