import { ErrorMessages } from "./jsonapi";

const errors = new ErrorMessages();
errors.addMessage("api_unknown_error", "Unknown error", "An unknown error occured.");
errors.addMessage("api_core_app_invalid_app", "Invalid app", "The requested app could not be found.");
errors.addMessage("api_core_app_invalid_file", "Invalid filepath", "The requested file could not be found.");
errors.addMessage("api_core_app_insufficient_permission", "Insufficient permissions", "You do not have the required permissions, to perform this action.");
errors.addMessage("api_core_app_invalid_body", "The given body is invalid", "The request body must be a valid JSON.")
errors.addMessage("api_core_app_too_few_parameters", "Too few parameters", "There are parameters missing to perform this action.");
errors.addMessage("api_core_app_error_performing_action", "Error by performing this action", "While performing this action an error occured.");

export default errors;