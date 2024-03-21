export const errorClientHandler = (res, status, message) => {
    return res.status(status).json({
        status: status,
        message: message
    })
}

export const successHandler = (res, status, message, data) => {
    return res.status(status).json({
        status: status,
        message: message,
        data: data
    })
}

export const errorServerHandler = (res, error) => {
    console.log(error);
    return res.status(500).json({
        status: 500,
        message: "internal server error"
    })
}