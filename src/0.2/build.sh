echo "\$(function(){" > main.min.js
cat lib/*.js >> main.min.js
cat obj/*.js >> main.min.js
cat shader/*.js >> main.min.js
cat main.js >> main.min.js
echo "});" >> main.min.js
mv main.min.js temp.js
java -jar compiler.jar --js temp.js --js_output_file main.min.js
rm temp.js
