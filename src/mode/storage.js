//封装操作localstorage本地存储的方法   模块化的文件


// nodejs  基础


var storage={

    set(key,value){

        sessionStorage.setItem(key, JSON.stringify(value));
    },
    get(key){

        return JSON.parse(sessionStorage.getItem(key));
    },
    remove(key){
      sessionStorage.clear();
    },
    setKey(key){
      let obj=this.get('LoginInfo');
      obj.key=key;
      this.set('LoginInfo',obj);
    }

}

export default storage;


