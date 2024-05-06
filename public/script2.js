function tryAuth(){
  axios.get("getAuth").then((res)=>{
    console.log("res", res)

  }).catch((res)=>{
    console.log("res", res)
    if(res.response.status===401 || res.response.status===403){
      location.href = "/";
    }
  })
}
tryAuth();