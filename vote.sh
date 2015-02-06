#!/bin/bash

if [ $# -ne 1 ]; then
  echo "invalid input"
  exit
fi

echo "loop from 1 to $1"

for (( c=0; c<$1; c++ ))
do
    prelist=(13 15 17 18)    
    mp=${prelist[$RANDOM % 4]}
    mp0=`echo $(( RANDOM % 10))`
    mp1=`echo $(( RANDOM % (9000) + 1000))`
    mp2=`echo $(( RANDOM % (9000) + 1000))`
    
    mobile=${mp}${mp0}${mp1}${mp2}
    
    CURL=curl
    
    OUTPUT=`${CURL} -s --data "mobile=${mobile}&votePeose=79&state=3" \
-A "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)" \
-H "Host:www.huizhongcf.com" -H "Origin:http://www.huizhongcf.com" \
-H "Content-Type:application/x-www-form-urlencoded; charset=UTF-8" \
-H "DNT:1" \
-H "Referer:http://www.huizhongcf.com/toupiao/index.html" \
http://www.huizhongcf.com/toupiao/vote.php | grep suc`
    
#echo "result is ${OUTPUT}"
    
    if [ -z "${OUTPUT}" ]; then
        echo "failed"
    fi
  
done
