const status_code = require('./status_code');  // all possible http code and code name has be stored here
/**
 * this function will print the http code status vs count
 * it will be printed in table format
 */ 

let printValue = function printValue(map){

  let len1 = 0, len2=0, len3=0;
  let sum = 0;
  for(let  [key, value] of map){
    if(status_code.has(key)){
      len1 = Math.max(len1, status_code.get(key).length)
    }
  }

  len1 = Math.max(len1, ' (index) '.length)


  for(let  [key, value] of map){
      len2 = Math.max(len2, key.length)
      len3 = Math.max(len3, value.toString().length)
  }
  len2 = Math.max(len2, 'statusCode'.length)
  len3 = Math.max(len3, 'count'.length)


  let len_total = len1+3+len2+3+len3+3
  for(let i=0;i<len_total;i++){
      process.stdout.write('-') 
  }
  process.stdout.write('\n') 
  process.stdout.write('| ') 
  for(let i=0;i<len1-'(index)'.length;i++){
    process.stdout.write(' ') 
  }
  process.stdout.write('\x1b[33m (index)\x1b[0m') 
  

  process.stdout.write('|\x1b[33m statusCode\x1b[0m |') 
  process.stdout.write('\x1b[33m count \x1b[0m');
  for(let i=0;i<len3-'count'.length;i++){
      process.stdout.write(' ') 
  }
  process.stdout.write('|\n') 
  for(let i=0;i<len_total;i++){
      process.stdout.write('_') 
  }
  process.stdout.write('\n') 
  try{
      
      for(let  [key, value] of map){
          if(!status_code.has(key)){
            continue;
          }
          sum += value;
          process.stdout.write('| ');
          let index = status_code.get(key)
          for(let i=0;i<len1-index.length;i++){
              process.stdout.write(' ') 
          }
          process.stdout.write(index +' | ') 
          process.stdout.write(key) 
          for(let i=0;i<len2-key.length;i++){
              process.stdout.write(' ')
          }
          process.stdout.write(' | ')

          process.stdout.write(value.toString()) 
          for(let i=0;i<len3-value.toString().length;i++){
              process.stdout.write(' ') 
          }
          process.stdout.write(' |') 
          process.stdout.write('\n') 
      }
  }catch(e){
      // console.log()
      // console.log(e.message)
  }

  for(let i=0;i<len_total;i++){
      process.stdout.write('-') 
  }

  process.stdout.write('\n') 
  process.stdout.write('\n') 
  process.stdout.write('\x1b[33m Total Number of API Calls made \x1b[0m:'+sum) 
      

}

module.exports = printValue;