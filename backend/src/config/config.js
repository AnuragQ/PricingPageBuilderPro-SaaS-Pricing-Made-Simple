const dotenv = require('dotenv');

dotenv.config();

const config = {
    app_name: process.env.APP_NAME,
    port: process.env.PORT,
    db_url: process.env.MONGODB_URL,
    db_options: {   
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

module.exports = config;