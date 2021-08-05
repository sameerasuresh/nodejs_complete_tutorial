const scheduler = require('../lib/scheduler');


 const task = (taskName) =>{
    console.log('start');
    let count = 0
    const imm = setInterval(() => {
        count += 1;
        console.log(taskName,'::', count);
    },1);
    // setInterval(() => {
    //     console.log(taskName,'::',count)
    //     count += 1;
    // },1000)
 }

module.exports = task;