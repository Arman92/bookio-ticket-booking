import { BaseController } from '@shypple/core/infra/BaseController';
import { BookDTO } from '../use-cases/book/book-dto';

export class BookController extends BaseController {
  private useCase: BookUseCase;

  constructor(useCase: BookUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<unknown> {
    const dto: BookDTO = this.req.body as BookDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateUserErrors.AccountAlreadyExists:
            return this.conflict(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        return this.ok(this.res);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
