//父-获取列表(分页)
async function getList({currPage=1,requestUrl,params={},callback,format=0}) {
    try {
    let info={list:[],total:""}
    currPage = currPage > 0 ? Number(currPage) : this.currPageIndex;
    const response = await requestUrl({...params,pageNum: currPage})
    if (response.code == 1) {
        if(format==0){
            info.list = response.data.list; 
        }else{
            info.list = response.data; 
        }
        info.total = response.data.totalRow || 1;
        callback && callback();
    }
    return info
  } catch (error) { 
    console.log(error);
  }
}

//父-获取列表(不分页)
async function getListPage({requestUrl,params={},callback}) {
    try {
    let info=[]
    const response = await requestUrl(params)
    if (response.code == 1) {
        info.list = response.data;  
        callback && callback();
    }
    return info
  } catch (error) { 
    console.log(error);
  }
}

//查看弹窗
async function getDetailById({requestUrl,params={}}) {
    try {
      let list=[];
      const response = await requestUrl({...params});
      if (response.code == 1) {
        list = response.data;
      }
      return list;
    } catch (error) {
      console.log(error);
    }
}

//修改弹窗
async function editData({requestUrl,params={}}){
    try {
        const response=await requestUrl({...params})
        return response.code
    } catch (error) {
        console.log(error);
    }
}

//增加弹窗 
async function addData({requestUrl,paramsType=0,params={},preData,returnType=0}){
    try {
        if(paramsType==0){
            const response=await requestUrl({...params})
            return response.code
        }else if(paramsType==2){
            const response=await requestUrl({...params})
            return response
        }else{
            let valStr=JSON.stringify(preData);
            let obj={
                [valStr]:""
            }
            const response=await requestUrl(obj)
            if(returnType==0){
                return response.code
            }else{
                return response
            }
        }
        
    } catch (error) {
        console.log(error)
    }
}

//停用、启用
async function stopInfo({requestUrl,params={}}){
    try {
        const response=await requestUrl({...params});
        return response.code
    } catch (error) {
        console.log(error)
    }
}

export {
  getList,getDetailById,editData,addData,stopInfo,getListPage
}
