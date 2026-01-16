import { ITestRepository } from '../../domain/repositories/test-repository.interface';

export class UpdateTestCaseUseCase {
    constructor(private readonly testRepository: ITestRepository) { }

    async execute(id: string, fields: Record<string, any>): Promise<void> {
        return this.testRepository.updateTestCase(id, fields);
    }
}
