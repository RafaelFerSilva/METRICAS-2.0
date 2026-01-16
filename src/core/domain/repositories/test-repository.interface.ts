import { TestCase } from '../entities/test-case.entity';

export interface ITestRepository {
    getAllTestCases(): Promise<TestCase[]>;
    updateTestCase(id: string, fields: Record<string, any>): Promise<void>;
}
