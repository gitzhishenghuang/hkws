/*function F() {

}

console.log(F.__proto__===Function.prototype);
console.log(Object.getPrototypeOf(Function.prototype)===Object.prototype);
console.log(Object.prototype.isPrototypeOf(Function.prototype));
F.prototype.space=function () {
  return this.split('').join(' ')
}
var f=new F()
console.log(f.__proto__);
console.log(Object.getPrototypeOf(f)==F.prototype);
console.log(f instanceof F);
console.log(F.prototype.isPrototypeOf(f));
console.log(Object.prototype.toString.call(F));
Object.setPrototypeOf(String.prototype,F.prototype)*/
//String.prototype.__proto__=F.prototype
//console.log('nihao'.space())
//console.log(Object.getOwnPropertyNames(Object.prototype));
//console.log(Object.getOwnPropertyNames(Function.prototype));
//console.log(Object.getOwnPropertyNames(String.prototype));


/*function * fn(){
  var qq=yield
  console.log(qq)
}

var g=fn()
g.next()
g.next('1234')*/


/*
function test(time){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve(time);
        },3000)
    })
}

async function as(){
    console.log(1)
    var a=await test(12)
  console.log(a);
  console.log(2)
}
as()
*/
