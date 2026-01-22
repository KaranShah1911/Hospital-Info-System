export const saveToken = (token, res) => {
    res.cookie('token' , token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge:  12 * 60 * 60 * 1000 // 12 hours
    })
}