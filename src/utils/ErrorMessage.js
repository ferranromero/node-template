
export const errorMessage = (code, msg) =>{
    let payload = {
        code : code,
        msg : msg
    }
    return payload;
}