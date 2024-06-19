import { FastifyReply } from 'fastify';
import HttpStatusCodes from './HttpStatusCodes';

// Interface type for ErrorArrayObject
interface ErrorArrayObject {
  [key: string]: { [key: number]: { [key: string]: string[] } };
}

// Custom error class representing a NotFoundRequest
class NotFoundRequest extends Error {
  public statusCode = HttpStatusCodes.NOT_FOUND;
  private error: ErrorArrayObject | undefined;

  constructor(message: string, error?: ErrorArrayObject) {
    // Call the parent class constructor (Error) with the provided message
    super(message);
    // Set the name of the error class to 'NotFound'
    this.name = 'NotFound';
    this.error = error;
  }

  // Method to format the response with the NotFoundRequest error details
  sendError(reply: FastifyReply) {
    if (this.error) {
      // Return the formatted response object with errors
      return reply.status(this.statusCode).send({
        statusCode: this.statusCode,
        errors: this.error,
      });
    }

    // Return the formatted response object
    return reply.status(this.statusCode).send({
      statusCode: this.statusCode,
      message: this.message,
    });
  }
}
export default NotFoundRequest;
