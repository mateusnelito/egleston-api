import { FastifyReply } from 'fastify';
import HttpStatusCodes from './HttpStatusCodes';
import { notFoundRequestResponseType } from '../schemas/globalSchema';

// Custom error class representing a NotFoundRequest
class NotFoundRequest extends Error {
  private error: notFoundRequestResponseType;
  constructor(error: notFoundRequestResponseType) {
    // Call the parent class constructor (Error) with the provided message
    super(error.message);
    // Set the name of the error class to 'NotFound'
    this.name = 'NotFound';
    this.error = error;
  }

  // Method to format the response with the NotFoundRequest error details
  sendError(reply: FastifyReply) {
    // Return the formatted response object
    return reply.status(this.error.statusCode).send({
      statusCode: this.error.statusCode,
      message: this.error.message,
    });
  }
}
export default NotFoundRequest;
