import { v4 as uuidv4 } from "uuid";

interface JsonAPIError {
    id: string,
    code: string,
    title: string,
    description: string
};

interface JSONAPIResponse {
    data: any,
    error: Array<JsonAPIError>,
    meta: any
}


class JsonAPI {
    private error_instance: ErrorMessages = <ErrorMessages>{};

    setErrorMessageInstance(instance: ErrorMessages): void {
        this.error_instance = instance;
    }

    findErrorMessageByCode(codes: Array<string>): Array<JsonAPIError> {
        const errors: Array<JsonAPIError> = this.error_instance.getMessages().filter(error_message => codes.includes(error_message.code));
        errors.map(error => { error.id = uuidv4(); });
        return errors;
    }

    result(data: any, error_codes: Array<string>): JSONAPIResponse {
        return {
            data,
            error: this.findErrorMessageByCode(error_codes),
            meta: {
                "copyright": "Copyright Web-Glasses",
                "authors": [
                    "Kevin Saiger <saigerkevin4@gmail.com>"
                ]
            }
        }
    }

    public error(...error_code: Array<string>): JSONAPIResponse {
        return this.result(null, error_code);
    }

    data(data: any): JSONAPIResponse {
        return this.result(data, []);
    }
}

class ErrorMessages {
    private messages: Array<JsonAPIError> = [];

    addMessage(code: string, title: string, description?: string): void {
        const error = <JsonAPIError>{};
        error.id = '';
        error.code = code;
        error.title = title;
        error.description = description || "";
        this.messages.push(error);
    }

    getMessages(): Array<JsonAPIError>
    {
        return this.messages;
    }
}

export { ErrorMessages };
export default JsonAPI;