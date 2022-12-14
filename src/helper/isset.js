const { Model } = require("sequelize");

function checkArr(element,arr){
    let count = 0;
    for (let i = 0; i < arr.length; i ++){
        if (arr[i] === element)  {
            count ++;
            break
        }
    }
    return (count >0) ? true : false
}

module.exports = {checkArr}