import axios from "axios";

const $host = axios.create(
    {
        baseURL: process.env.REACT_APP_SERVER
    }
);

const $authHost = axios.create(
    {
        baseURL: process.env.REACT_APP_SERVER
    }
);

const $neuronHost = axios.create(
    {
        baseURL : process.env.REACT_APP_NEURON
    }
);

const tokenInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(tokenInterceptor)

export {$host, $neuronHost, $authHost};