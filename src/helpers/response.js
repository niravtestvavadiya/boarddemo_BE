export function success(res, code = 200, message = 'OK', data = null) {
    return res.status(code).json({ success: true, code, message, data });
}

export function error(res, code = 500, message = 'Internal Server Error', details = null) {
    return res.status(code).json({ success: false, code, message, details });
}
