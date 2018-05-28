'use restrict'

const { Etcd3 } = require("etcd3");
var logger = require("../common/logger.js").logger;

class RegisterService {
    constructor(config) {
        logger.info("register_service_construct, config=", JSON.stringify(config));
        this.etcd_address = config.etcd_address;
        this.etcd_client = new Etcd3({
            "hosts": this.etcd_address
        });
        this.lease_client = this.etcd_client.lease(100);
        logger.info("register_service_construct, lease_id=", this.lease_client.grant());
        if (config && config.service_type === "provider") {
            this.register_service(config.service_rootpath, config.service_name, config.service_ip, config.service_port);
        }
        setInterval(this.keep_alive.bind(this), 80);
    }

    register_service(service_rootpath, service_name, service_ip, service_port) {
        var that = this;
        var register_key = service_rootpath + "/" + service_name + "/" + service_ip + ":" + service_port;
        logger.info("register_service, register_key=", register_key);
        return that.lease_client.put(register_key).value("");
    }

    keep_alive() {
        var that = this;
        return that.lease_client.keepaliveOnce().then((res) => {
            logger.info("register_service, keep_alive, lease_id=", JSON.stringify(res));
        });
    }

    discovery_service(service_rootpath, service_name) {
        var that = this;
        var key = service_rootpath + "/" + service_name;
        var services = [];
        logger.info("discovery_serivce, filter_key=", key);
        return that.etcd_client.getAll(key).exec().then(function(res) {
            logger.info("discovery_service, res=", res);
            if (res && res.kvs && res.kvs.length > 0) {
                res.kvs.forEach((item) => {
                    if(item && item.key) {
                        var key = item.key.toString('utf8');
                        logger.debug("discovery_serivce, service_key=", key);
                        var nPos = key.lastIndexOf("/")
                        if (nPos >= 0) {
                            var service = key.substr(nPos + 1);
                            nPos = service.indexOf(":");
                            if (nPos > 0) {
                                services.push({
                                    "host": service.substr(0, nPos),
                                    "port": service.substr(nPos + 1)
                                });
                            }
                        }
                    }
                });
            }
            return services;
        });

    }
}

module.exports = RegisterService;