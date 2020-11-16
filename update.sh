#!
cp ../clasitronicos/listado.html .;
cp listado.html index.html;
rm listado.html;
cp ../clasitronicos/assets/css/listado.css ./assets/css/listado.css;
cp ../clasitronicos/assets/js/script-listado.js ./assets/js/script-listado.js;

git add --all;
git commit -m "new";
git push origin master;


