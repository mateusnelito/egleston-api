import { FastifyReply } from 'fastify';
import HttpStatusCodes from './HttpStatusCodes';

// Interface for ErrorObject
interface ErrorObject {
  [key: string]: string[];
}

// Custom error class representing a BadRequest
class BadRequest extends Error {
  private errors: ErrorObject;
  public statusCode = HttpStatusCodes.BAD_REQUEST;

  constructor(
    message: string,
    errors: ErrorObject,
    statusCode = HttpStatusCodes.BAD_REQUEST
  ) {
    // Call the parent class constructor (Error) with the provided message
    super(message);
    // Set the name of the error class to 'BadRequest'
    this.name = 'BadRequest';
    // Assign the errors object to the 'errors' property of the instance
    this.errors = errors;
    this.statusCode = statusCode;
  }

  // Method to format the response with the BadRequest error details
  sendErrors(reply: FastifyReply) {
    // Return the formatted response object
    return reply.status(this.statusCode).send({
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
    });
  }
}

// Export the BadRequest class as default
export default BadRequest;
