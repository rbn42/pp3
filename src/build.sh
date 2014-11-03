echo "\$(function(){" > js/temp.js  
cat js/main.js >> js/temp.js
echo "});" >> js/temp.js
rm build -fr
mkdir ../build
mkdir ../build/js
java -jar ../bin/compiler.jar --js js/temp.js --js_output_file build/js/main.min.js
rm js/temp.js
cp image* build/ -fr
cp main.min* build/ -fr
