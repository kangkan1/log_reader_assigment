const fs = require('fs');
const readline = require('readline');
const input = require("readline-sync");
const printValue = require('./printValue'); // imported funtion to print status code
const printCalls = require('./printCalls')

const log_files_folder = './log_files';  // log files are inside this folder

let log_files = []; // all log files will be stored here
fs.readdirSync(log_files_folder).forEach(file => {
  log_files.push(log_files_folder+'/'+file)
});

let regexPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2}:/;  // regex to match date time in log files
// matches pattern of the types 2023-05-05 20:25 +10:00:



// print funtion ends


let request_methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]; // all request methods that will be parsed in log files
let method_map = new Map(); // map of method will be stored aliong with count
let total_lines = 0;


let line_count = 0;
let url_map_count = new Map();
for(let file in log_files){
  // file reader
  const rl = readline.createInterface({
      input: fs.createReadStream(log_files[file]),
      crlfDelay: Infinity 
    });
    
    // Event listener for each line
    let valid = 0;
    let invalid = 0;
    let prev = ''
    let prev_prev =  ''
    // ling by line reading of files
    rl.on('line', (line) => {
      line_count++;
      // console.log('Line:', line);
      //url_map_count = new Map();
      if (regexPattern.test(line)) {
          //console.log("Valid date format.");
          for(let i in request_methods){
            if(line.includes(request_methods[i]) && line.includes(':ffff')){
              let arr = line.split('HTTP/1.1')
              //console.log(arr[0])
              // let url_string = arr[0]
              // let index_of_method = url_string.lastIndexOf(i);
              // //console.log(index_of_method,url_string.length )
              // url_string = url_string.substring(index_of_method+1, url_string.length);
              // url_string = url_string.substring(url_string.indexOf('/'), url_string.length);
              // console.log(url_string)
              let url = line.split(request_methods[i])
              let url_string  = url[1].substring(1, url[1].indexOf('HTTP/1.1')-1)
              //console.log(url_string)
              if(url_map_count.has(url_string)){
                url_map_count.set(url_string, url_map_count.get(url_string)+1);
              }else{
                url_map_count.set(url_string, 1);
              }

             
              try{
                let link = arr[1].replace('"', '')
                if(link.length >= 3){
                  link = link.trim()
                  let meth = link.substring(0, 3)
                  if(method_map.has(meth)){
                    method_map.set(meth, method_map.get(meth)+1)
                  }else{
                    method_map.set(meth, 1)
                  }
                  valid++;
                  //console.log(meth)
                }
                //console.log(link)
              }catch(e){
                //console.log(e)
              }
            }
          }

        } else {
          invalid++;
          
        }
        prev_prev = prev
        prev = line
    });
    
    // Event listener for the end of file
    rl.on('close', () => {
      
      console.log('Reading file completed for : '+log_files[file]);
      // console.log("valid",valid )
      // console.log("invalid",invalid )
      // console.log(method_map)
      // console.log('total lines'+total_lines);
      printValue(method_map)
      console.log()
      process.stdout.write("Do you want to display which endpoint is called how may times? Y/N ?")
      console.log()
      let shouldPrint = input.question()
      if(shouldPrint === 'Y' || shouldPrint === 'y' ){
        printCalls(url_map_count)
      }
      
    });

  }