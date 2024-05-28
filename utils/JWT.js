const sendToken = (user, statusCode, res) => {

    const token = user.getJwtToken();

    user.password = undefined;

    res.status(statusCode).json({
        status: true,
        message: user,
        token
    })
}

module.exports = sendToken;