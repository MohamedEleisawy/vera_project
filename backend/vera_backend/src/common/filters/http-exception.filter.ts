// backend/src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Détermine le code statut (ex: 400, 401, 500)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Récupère le message d'erreur
    const exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Erreur interne du serveur' };

    // Gestion propre des erreurs de validation (qui sont des tableaux)
    let message = exceptionResponse.message || exceptionResponse;
    if (Array.isArray(message)) {
      message = message[0]; // On prend la première erreur du tableau pour l'afficher
    }

    // Format JSON standardisé pour tout le projet
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message, // Ce sera toujours une string maintenant !
    });
  }
}
