const config={
    baseURL:"http://124.222.27.83:8081/api",
}
if(process.env.NODE_ENV==='development')
{
    config.baseURL="https://localhost:7019/api"
}
export default config;