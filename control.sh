#!/bin/sh

if [ $# -ne 1 ]; then
  echo "invalid input"
  exit
fi

for ((;;))
do
  
curl -s -L http://www.huizhongcf.com/toupiao/init.php -o /tmp/init.json 
tasks=`./control.py /tmp/init.json`

echo "tasks is ${tasks}"

if [ ${tasks} -gt 0 ]; then
  task=$(((${tasks} + 3000) / $1 ))
  echo "vote with $1 threads, each thread votes ${task} times"
  
  for (( c=1; c<=$1; c++ ))
  do
    ./vote.sh ${task} &
  done

  wait
fi

sleep 1
done
