
var default_logger = function(...options) {
    console.log('default_log', new Date(), JSON.stringify(options));
};

var default_logger_level = function(level, option) {
    console.log('default_log', new Date(), level, JSON.stringify(option));
};

var default_debug_logger = function(...options) {
    default_logger_level('debug', options);
};

var default_info_logger = function(...options) {
    default_logger_level('info', options);
};

var default_error_logger = function(...options) {
    default_logger_level('error', options);
};

var logger_imp =  {
    "log": default_logger,
    "debug": default_debug_logger,
    "info": default_info_logger,
    "error": default_error_logger           
};

var set_logger = function(logger) {
    if (logger) {
        if (logger.log && logger.log instanceof Function) {
            logger_imp.log = logger.log.bind(logger);
            logger_imp.log("info", "es_cas_logger.set_logger", "log");
        }
        if (logger.debug && logger.debug instanceof Function) {
            logger_imp.debug = logger.debug.bind(logger);
            logger_imp.debug("es_cas_logger.set_logger", "debug");
        }
        if (logger.info && logger.info instanceof Function) {
            logger_imp.info = logger.info.bind(logger);
            logger_imp.info("es_cas_logger.set_logger", "info");
        }
        if (logger.error && logger.error instanceof Function) {
            logger_imp.error = logger.error.bind(logger);
            logger_imp.error("es_cas_logger.set_logger", "error");
        }
    }
};

module.exports = {
    "set_logger": set_logger,
    "logger": logger_imp
};
