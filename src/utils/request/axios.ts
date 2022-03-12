import instance from "./request";

class Axios{
    post(url:string,data:any){
        return new Promise((resolve,reject)=>{
            instance.post(url,data)
                .then(res=>{
                    resolve(res.data)
                })
                .catch((err)=>{
                    reject(err)
                })
        
        })
    }
    put(url:string,data:any){
        return new Promise((resolve,reject)=>{
            instance.put(url,data)
                .then(res=>{
                    resolve(res.data)
                })
                .catch((err)=>{
                    reject(err)
                })
        
        })
    }
    get(url:string){
        return new Promise((resolve,reject)=>{
            instance.get(url)
                .then(res=>{
                    resolve(res.data)
                })
                .catch((err)=>{
                    reject(err)
                })
        
        })
    }
    del(url:string){
        return new Promise((resolve,reject)=>{
            instance.delete(url)
                .then(res=>{
                    resolve(res.data)
                })
                .catch((err)=>{
                    reject(err)
                })
        
        })
    }
}
export default  Axios