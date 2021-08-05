
exports.recurrence = (callBack,{year= 0, month= 0, date= 0, hour= 0, minute= 0, sec= 0, miliSec= 0},option = {executeInit: true}) => {
    sec *= 1000;
    minute *= (1000 * 60);
    hour *= (1000 * 60 * 60);
    date *= (1000 * 60 * 60 * 24);
    month *= (1000 * 60 * 60 * 24 * 30);
    year *= (1000 * 60 * 60 * 24 * 365);
    let time = miliSec + sec + minute + hour + date + month + year;
    let timeout;
    return {
        start:() => {
            if(option.executeInit){
                callBack();
            }
            timeout = setInterval(callBack, time)
        },
        stop: () => {
            clearInterval(timeout);
        },
        sleep: ({year= 0, month= 0, date= 0, hour= 0, minute= 0, sec= 0, miliSec= 0}) => {
            clearInterval(timeout);
            sec *= 1000;
            minute *= (1000 * 60);
            hour *= (1000 * 60 * 60);
            date *= (1000 * 60 * 60 * 24);
            month *= (1000 * 60 * 60 * 24 * 30);
            year *= (1000 * 60 * 60 * 24 * 365);
            let sleepTime = miliSec + sec + minute + hour + date + month + year;
            setTimeout(() => {
                timeout = setInterval(callBack, time);
            },sleepTime);
        }
    }
}

exports.stopAll = (...shedules)=> {
    shedules.forEach(s => s.stop());
}

exports.sleepAll = ({year= 0, month= 0, date= 0, hour= 0, minute= 0, sec= 0, miliSec= 0}, ...schedules) =>{
    schedules.forEach(s => s.stop());
    sec *= 1000;
    minute *= (1000 * 60);
    hour *= (1000 * 60 * 60);
    date *= (1000 * 60 * 60 * 24);
    month *= (1000 * 60 * 60 * 24 * 30);
    year *= (1000 * 60 * 60 * 24 * 365);
    let sleepTime = miliSec + sec + minute + hour + date + month + year;
    setTimeout(() => {
        schedules.forEach( s => s.start());
    },sleepTime);
}
