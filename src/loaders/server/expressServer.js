const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const config = require('../../config');
const logger = require('../logger');

class ExpressServer {

    constructor() {

        this.app = express();
        this.port = config.port;
        this.basePathUser = `${config.api.prefix}/users`;

        this._middlewares();
        
        this._swaggerConfig();

        this._routes();

        this._notFound();
        this._errorHandler();

    }

    _middlewares() {
        this.app.use(express.json());
        this.app.use(morgan('tiny'));
    }

    _routes() {

        this.app.head("/status", (req, res) => {
            res.status(200).end();
        });

        this.app.use(this.basePathUser, require('../../routes/users'));
    }

    _notFound() {
        this.app.use((req, res, next) => {
            const err = new Error("Not Found");
            err.code = 404;
            next(err);
        });
    }

    _errorHandler() {
        this.app.use((err, req, res, next) => {
            const code = err.code || 500;

            logger.error(`${code} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            logger.error(err.stack);

            const body = {
                error: {
                    code,
                    message: err.message
                }
            }
            res.status(code).json(body);
        });
    }

    _swaggerConfig(){
        this.app.use(
            config.swagger.path, 
            swaggerUi.serve, 
            swaggerUi.setup(require('../swagger/swagger.json'))
        );
    }

    async start() {
        this.app.listen(this.port, (error) => {
            if(error) {
                logger.error(err);
                process.exit(1);
                return;
            }
        });
    }

}

module.exports = ExpressServer;