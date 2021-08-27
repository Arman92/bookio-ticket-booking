/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  TimeoutError,
  UnAuthorizedError,
  UserInputError,
} from '../logic/api-errors';

export abstract class BaseController {
  protected req: express.Request;
  protected res: express.Response;

  protected abstract executeImpl(): Promise<void | any>;

  public execute(req: express.Request, res: express.Response): void {
    this.req = req;
    this.res = res;

    this.executeImpl();
  }

  public static jsonResponse(
    res: express.Response,
    code: number,
    message: string
  ) {
    return res.status(code).json({ message });
  }

  public ok<T>(res: express.Response, dto?: T) {
    if (dto) {
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created<T>(res: express.Response, dto?: T) {
    if (dto) {
      return res.status(201).json(dto);
    } else {
      return res.sendStatus(201);
    }
  }

  public clientError(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      400,
      message ? message : 'Unauthorized'
    );
  }

  public unauthorized(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      401,
      message ? message : 'Unauthorized'
    );
  }

  public paymentRequired(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      402,
      message ? message : 'Payment required'
    );
  }

  public forbidden(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      403,
      message ? message : 'Forbidden'
    );
  }

  public notFound(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      404,
      message ? message : 'Not found'
    );
  }

  public timeout(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      408,
      message ? message : 'Timeout'
    );
  }

  public conflict(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      409,
      message ? message : 'Conflict'
    );
  }

  public badUserInput(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      422,
      message ? message : 'Bad user input.'
    );
  }

  public tooMany(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      429,
      message ? message : 'Too many requests'
    );
  }

  public fail(error: Error | string) {
    return this.res.status(500).json({
      message: error.toString(),
    });
  }

  public handleError(error: any) {
    switch (error.constructor) {
      case AuthenticationError:
        return this.conflict(error.message);
      case ForbiddenError:
        return this.forbidden(error.message);
      case NotFoundError:
        return this.notFound(error.message);
      case ServerError:
        return this.fail(error.message);
      case TimeoutError:
        return this.timeout(error.message);
      case UnAuthorizedError:
        return this.unauthorized(error.message);
      case UserInputError:
        return this.badUserInput(error.message);

      default:
        return this.fail(error);
    }
  }
}
