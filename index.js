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
    let api_total = 0;
    let first_time = 0;
    let last_time = 0;
    // ling by line reading of files
    rl.on('line', (line) => {
      line_count++;
      if (regexPattern.test(line)) {
          for(let i in request_methods){
            if(line.includes(request_methods[i]) && line.includes(':ffff') && line.includes('HTTP/1.1')){
              valid++;
             
              try{
                // 2023-04-03 23:18 +10:00: ::ffff:49.36.88.202 - - [03/Apr/2023:13:18:49 +0000] "GET /master/job_templates_kHfMGI_1644343835794.png HTTP/1.1" 200 1247981 "-" "webapp/1 CFNetwork/1402.0.8 Darwin/22.3.0"
                let arr = line.split('HTTP/1.1'); // splitting the string by HTTP/1.1, on the right side you will get HTTP status code
                let link = arr[1].replace('"', '')
                if(link.length >= 3){
                  link = link.trim()
                  let meth = link.substring(0, 3)
                  // we are creating a map for http request method and storing it's count
                  if(method_map.has(meth)){
                    method_map.set(meth, method_map.get(meth)+1)
                  }else{
                    method_map.set(meth, 1)
                  }
                  api_total++;
                  
                  //console.log(meth)
                }
                //console.log(link)
              }catch(e){
                //console.log(e)
              }

              try{
                //2023-04-04 15:42 +10:00: ::ffff:49.36.65.32 - - [04/Apr/2023:05:42:03 +0000] "GET /api/member/recommended?rowsPerPage=25&page=1&keyname=company& HTTP/1.1" 200 34155 "-" "okhttp/4.9.1"
                let url = line.split(request_methods[i]); // splitting on the "GET" keyword. On the right side you will get url
                let url_string  = url[1].substring(1, url[1].indexOf('HTTP/1.1')-1); // you will get string of "/api/member/recommended?rowsPerPage=25&page=1&keyname=company&"
                
                // now wee need to store url string along with count
                if(url_map_count.has(url_string)){
                  url_map_count.set(url_string, url_map_count.get(url_string)+1);
                }else{
                  url_map_count.set(url_string, 1);
                }
                
              }catch(e){

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
    // Display the result
    rl.on('close', () => {
      
      console.log('Reading file completed for : '+log_files[file]);
      printValue(method_map)
      console.log()
      process.stdout.write("Do you want to display which endpoint is called how may times? Y/N ?")
      console.log()
      
      let shouldPrint = input.question()
      // if user input is 'Y' or  'y' display API endpoints along with count
      if(shouldPrint === 'Y' || shouldPrint === 'y' ){
        printCalls(url_map_count)
      }
      
    });

  }