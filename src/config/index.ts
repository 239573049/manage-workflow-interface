const config={
    baseURL:"http://tokengo.top:8088/api",
}
if(process.env.NODE_ENV==='development')
{
    config.baseURL="https://localhost:7019/api"
}
export default config;