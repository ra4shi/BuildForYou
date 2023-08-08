import axios from "axios";
const client = axios.create({ baseURL: "http://localhost:5000" })
export const request = ({ ...options }) => {
    client.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('localtoken')}`
    const onSuccess = (response) => response
    const onError = (error) => {
        return error
    }

    return client(options).then(onSuccess).catch(onError)
}

// import axios from "axios";
const local = axios.create({ baseURL: "http://localhost:5000" })
export const localRequest = ({ ...options }) => {
    local.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('localtoken')}`
    const onSuccess = (response) => response
    const onError = (error) => {
        return error
    }

    return local(options).then(onSuccess).catch(onError)
}

const admin = axios.create({ baseURL: "http://localhost:5000" })
export const adminRequest = ({ ...options }) => {
    admin.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('admintoken')}`
    const onSuccess = (response) => response
    const onError = (error) => {
        return error
    }

    return admin(options).then(onSuccess).catch(onError)
}   