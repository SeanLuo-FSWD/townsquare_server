import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({ 
    region: "us-west-1" 
});

export default s3;


