
export interface DataObject {
    [key: string]: any;
}

export interface ApiResult {
    status: 'success' | 'failed';
    code: number;
    message: string;
    data: null | DataObject
}

export class ApiResults {

    static OK(data: DataObject, message: string = "success"): ApiResult { return { status: "success", code: 200, message, data}; }

    static PARAM_ERROR(message: string = "parameters not correct", data: null | DataObject = null): ApiResult  {
        return { status: "failed", code: 5001, message, data};
    }

    static SIGNATURE_ERROR(message: string = "signature not match", data: null | DataObject = null): ApiResult {
        return { status: "failed", code: 5002, message, data};
    }

    static DB_ERROR(message: string = "db error", data: null | DataObject = null): ApiResult {
        return { status: "failed", code: 5003, message, data};
    }

    static WALLET_NOT_BIND(message: string = "wallet is not bound", data: null | DataObject = null): ApiResult {
        return { status: "failed", code: 5004, message, data};
    }

    static WALLET_BOUND(message: string = "wallet has been bound", data: null | DataObject = null): ApiResult {
        return { status: "failed", code: 5005, message, data};
    }

    static USR_NOT_EXIST(message: string = "user is not exist", data: null | DataObject = null): ApiResult {
        return { status: "failed", code: 5006, message, data};
    }

    static USR_LINK_REGISTED(message: string = "user.link is registed", data: null | DataObject = null): ApiResult {
        return { status: "failed", code: 5006, message, data};
    }

    static UNKNOWN_ERROR(message: string = "unknown error", data: null | DataObject = null): ApiResult {
        return { status: "failed", code: 5100, message, data};
    }
}
