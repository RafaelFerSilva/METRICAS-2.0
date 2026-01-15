export interface TestCase {
    id: number;
    title?: string;
    state?: string;
    // Add other fields as they appear in the API response or are needed
    [key: string]: any;
}
