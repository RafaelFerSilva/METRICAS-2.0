import { TestCase } from '../entities/test-case.entity';

export interface ITestRepository {
    getAllTestCases(): Promise<TestCase[]>;
}
