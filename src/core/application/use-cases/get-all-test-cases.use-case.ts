import { ITestRepository } from '../../domain/repositories/test-repository.interface';
import { TestCase } from '../../domain/entities/test-case.entity';

export class GetAllTestCasesUseCase {
    constructor(private testRepository: ITestRepository) { }

    async execute(): Promise<TestCase[]> {
        return this.testRepository.getAllTestCases();
    }
}
