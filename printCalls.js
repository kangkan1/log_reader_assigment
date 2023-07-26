let minCallsToPrint = 500; // API calls count more than 500 will be printed

let printCalls = function printCalls(map){
//    
    console.log('Endpoints above '+minCallsToPrint+'+ calls will be printed below')        
    for (const [key, value] of map) {
        if(value > minCallsToPrint){
            //console.log(`${key} = ${value}`);
            process.stdout.write('\x1b[33m Endpoints: \x1b[0m'+key+", \x1b[33m Count: \x1b[0m"+value)
            process.stdout.write('\n')
        }
    }
}
console.log()
module.exports = printCalls;