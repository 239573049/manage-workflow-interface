const config={
    baseURL:"http://124.222.27.83:8889/api",
}
if(process.env.NODE_ENV==='development'){
    config.baseURL="https://localhost:8088/api"
}
export default config;