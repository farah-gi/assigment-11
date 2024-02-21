import db_connection from "../db/connection.js";
import globalResponse from"./middlewares/global-response.middleware.js"
import { roleBackSavedDocuments } from "./middlewares/rolleback.savedDocuments.js";
import {roleBackUploads} from "./middlewares/rolleback.uploads.js"
import * as router from"../src/modules/index.routes.js"
import https from"https"
export const initiateApp=(app,express)=>{
    const port=process.env.PORT
app.use(express.json())
db_connection()
app.use("/auth",router.authRouter)
app.use("/user",router.userRouter)
app.use("/subCategory",router.subCategoryRouter)
app.use("/brands",router.brandRouter)
app.use("/categories",router.categoryRouter)
app.use("/product",router.productRouter)
app.use(globalResponse,roleBackUploads,roleBackSavedDocuments)

const Https = https;


// Ignore SSL certificate errors (for development/testing purposes)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Options for the HTTPS request
const options = {
  hostname: 'your-website.com',
  port: 443,
  path: '/',
  method: 'GET'
};

// Make the HTTPS request
const req = Https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  // Handle response data
  res.on('data', (data) => {
    process.stdout.write(data);
  });
});

// Handle request errors
req.on('error', (error) => {
  console.error(error);
});

// End the request
req.end();

app.listen(port ,()=>console.log("the server is running successfully"))

}