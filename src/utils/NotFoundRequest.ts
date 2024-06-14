import { FastifyReply } from 'fastify';
import HttpStatusCodes from './HttpStatusCodes';
// Custom error class representing a NotFoundRequest
class NotFoundRequest extends Error {
  public statusCode = HttpStatusCodes.NOT_FOUND;

  constructor(message: string) {
    // Call the parent class constructor (Error) with the provided message
    super(message);
    // Set the name of the error class to 'BadRequest'
    this.name = 'NotFound';
  }

  // Method to format the response with the NotFoundRequest error details
  sendError(reply: FastifyReply) {
    // Return the formatted response object
    return reply.status(this.statusCode).send({
      statusCode: this.statusCode,
      message: this.message,
    });
  }
}
export default NotFoundRequest;
