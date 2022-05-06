echo "DEPLOYMENT STARTED";
if [ -d "../idsp2-chat-react" ] 
then
    rm -r ../idsp2-chat-react;
    cd ..;
    git clone git@github.com:kjohnathan/idsp2-chat-react.git;
    cd idsp2-chat-react;
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
    git clone git@github.com:kjohnathan/idsp2-chat-react.git;
    cd idsp2-chat-react;
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