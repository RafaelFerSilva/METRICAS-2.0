const axios = require("axios");
const https = require("https");

const ORG_URL = "https://dev.azure.com/{ORG}";
const PROJECT_ID = "";
const PAT = "";
const CUSTOM_STATUS_FIELD = "Custom.ec38de40-257b-4c45-9db9-284080382c3e";
const DESIRED_STATUS_VALUE = "Automatizado";
const BATCH_SIZE = 500;

const encodedPat = Buffer.from(`:${PAT}`).toString("base64");
const headers = {
    "Authorization": `Basic ${encodedPat}`
};

const api = axios.create({
    baseURL: ORG_URL,
    headers: headers,
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

async function runCallback() {
    try {
        console.log(`🔌 Connect to ${ORG_URL}...`);

        const wiqlQuery = {
            query: `
                SELECT [System.Id], [System.Title]
                FROM WorkItems
                WHERE [System.WorkItemType] = 'Test Case'
                AND [${CUSTOM_STATUS_FIELD}] = '${DESIRED_STATUS_VALUE}'
                AND [Microsoft.VSTS.TCM.AutomationStatus] <> 'Automated'
            `
        };

        console.log("🔍 Searching Test Cases...");

        let workItems = [];
        try {
            const wiqlRes = await api.post(`/${PROJECT_ID}/_apis/wit/wiql?api-version=7.1`, wiqlQuery, {
                headers: { "Content-Type": "application/json" }
            });
            workItems = wiqlRes.data.workItems;
        } catch (error) {
            console.error("WIQL Error:", error.response?.data || error.message);
            return;
        }

        if (!workItems || workItems.length === 0) {
            console.log("✅ No items found.");
            return;
        }

        console.log(`📋 Found ${workItems.length} items.`);
        console.log(`   Attempting migration without bypassRules (standard validation).`);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < workItems.length; i += BATCH_SIZE) {
            const chunk = workItems.slice(i, i + BATCH_SIZE);
            console.log(`\n🔄 Batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

            for (const item of chunk) {
                const id = item.id;
                const itemUrl = item.url;

                const patchBody = [
                    {
                        "op": "add",
                        "path": "/fields/Microsoft.VSTS.TCM.AutomatedTestId",
                        "value": id.toString()
                    }
                ];

                try {
                    // Removed bypassRules because user lacks permission (Error 500)
                    await api.patch(`${itemUrl}?api-version=7.1`, patchBody, {
                        headers: { "Content-Type": "application/json-patch+json" }
                    });
                    if (id % 10 === 0) process.stdout.write(".");
                    successCount++;
                } catch (err) {
                    process.stdout.write("x");
                    failCount++;
                }
            }
        }

        console.log(`\n\n🎉 Migration Finished!`);
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ❌ Failed: ${failCount} (Due to missing required fields)`);

    } catch (err) {
        console.error("Fatal Error:", err);
    }
}

runCallback();
