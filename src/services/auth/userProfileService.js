import { tokenService } from "./tokenService";
import axios from "axios";

export const userProfileService = {
    /**
     * Fetches the current user's information from Azure DevOps Connection Data
     * This endpoint works with standard PAT tokens and doesn't require special OAuth scopes
     * @returns {Promise<{displayName: string, emailAddress: string, id: string, imageUrl: string}>}
     */
    async getUserProfile() {
        const token = tokenService.getToken();
        const organization = tokenService.getOrganization();

        if (!token || !organization) {
            throw new Error("No authentication token or organization found");
        }

        try {
            // Use Connection Data API - works with standard PAT tokens
            // https://learn.microsoft.com/en-us/rest/api/azure/devops/core/connection-data/get-connection-data

            // Create headers with client-side compatible base64 encoding
            const authHeader = `Basic ${btoa(`PAT:${token}`)}`;

            const response = await axios.get(
                `https://dev.azure.com/${organization}/_apis/connectionData?api-version=7.1-preview`,
                {
                    headers: {
                        "Authorization": authHeader,
                        "X-TFS-FedAuthRedirect": "Suppress"
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch user profile");
            }

            const connectionData = response.data;
            const authenticatedUser = connectionData.authenticatedUser;

            // Extract user information from connection data
            return {
                displayName: authenticatedUser.providerDisplayName || authenticatedUser.displayName || "User",
                emailAddress: authenticatedUser.properties?.Account?.$value || "",
                id: authenticatedUser.id || "",
                imageUrl: authenticatedUser.imageUrl || `https://dev.azure.com/${organization}/_api/_common/identityImage?id=${authenticatedUser.id}`,
                descriptor: authenticatedUser.descriptor || ""
            };
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Return default user data if API fails
            return {
                displayName: "Azure User",
                emailAddress: "",
                id: "",
                imageUrl: "",
                descriptor: ""
            };
        }
    }
};
