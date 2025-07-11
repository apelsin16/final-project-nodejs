const userFriendlyMessages = {
    400: 'Invalid data provided. Please check your input and try again.',
    401: 'Authentication required. Please log in and try again.',
    403: "Access denied. You don't have permission for this action.",
    404: 'Resource not found. Please check the URL and try again.',
    409: 'Conflict detected. This resource already exists.',
    500: 'Server error occurred. Please try again later or contact support.',
};

const HttpError = (status, message = userFriendlyMessages[status]) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export default HttpError;
