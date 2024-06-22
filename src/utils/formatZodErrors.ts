import { ZodError } from 'zod';

// Function to format validation errors in detail
export default function formatZodErrors(errors: ZodError) {
  // Initialize an object to store formatted errors
  const formattedErrors: Record<string, any> = {};

  // Iterate over each error in the ZodError object
  for (const issue of errors.issues) {
    // Join the error path into a dot-separated string
    const path = issue.path.join('.');

    // Checks if the error path is nested (contains a dot)
    if (path.includes('.')) {
      // Separates the path into its individual parts
      const paths = path.split('.');

      // Use reduce to create or access the structure nested in the errors object
      paths.reduce((acc, key, idx) => {
        // If we are in the last part of the path, we add the error message
        if (idx === paths.length - 1) {
          // Initialize the current key as an array if it doesn't already exist
          acc[key] = acc[key] || [];
          // Add the error message to the array
          acc[key].push(issue.message);
        } else {
          // Initialize the current key as an object if it does not already exist
          acc[key] = acc[key] || {};
        }
        // Returns the updated accumulator for the next iteration
        return acc[key];
      }, formattedErrors); // Pass the formatted errors object as the initial accumulator
    } else {
      // If the path is not nested, add the error message directly
      formattedErrors[path] = formattedErrors[path] || [];
      formattedErrors[path].push(issue.message);
    }
  }

  // Returns the formatted error object
  return formattedErrors;
}
