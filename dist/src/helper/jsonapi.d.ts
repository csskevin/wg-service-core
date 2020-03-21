interface JsonAPIError {
    id: string;
    code: string;
    title: string;
    description: string;
}
interface JSONAPIResponse {
    data: any;
    error: Array<JsonAPIError>;
    meta: any;
}
declare class JsonAPI {
    private error_instance;
    setErrorMessageInstance(instance: ErrorMessages): void;
    findErrorMessageByCode(codes: Array<string>): Array<JsonAPIError>;
    result(data: any, error_codes: Array<string>): JSONAPIResponse;
    error(...error_code: Array<string>): JSONAPIResponse;
    data(data: any): JSONAPIResponse;
}
declare class ErrorMessages {
    private messages;
    addMessage(code: string, title: string, description?: string): void;
    getMessages(): Array<JsonAPIError>;
}
export { ErrorMessages };
export default JsonAPI;
