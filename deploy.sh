echo "DEPLOYMENT STARTED";
if [ -d "../idsp_townsquare" ] 
then
    rm -r ../idsp_townsquare;
    cd ..;
    git clone git@github.com:SeanLuo-FSWD/idsp-townsquare.git;
    cd idsp-townsquare;
    npm install;
    npm run build;

    if [ -d "../idsp2/public" ]
    then 
        rm -r ../idsp2/public;
        mkdir ../idsp2/public;
        mv ./build/* ../idsp2/public;
    else 
        mkdir ../idsp2/public;
        mv ./build/* ../idsp2/public;
    fi 
else 
    cd ..
    git clone git@github.com:SeanLuo-FSWD/idsp-townsquare.git;
    cd idsp-townsquare;
    npm install;
    npm run build;


    if [ -d "../idsp2/public" ]
    then 
        rm -r ../idsp2/public;
        mkdir ../idsp2/public;
        mv ./build/* ../idsp2/public;
    else 
        mkdir ../idsp2/public;
        mv ./build/* ../idsp2/public;
    fi 
fi