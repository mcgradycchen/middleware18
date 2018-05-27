var expect = require("chai").expect;
var RegisterService = require("../../etcd-register/register.js");
var logger = require("../../common/logger.js").logger;

describe("register_service", () => {
    it("should register service correct", (done) => {
        var register_service = new RegisterService({
            "etcd_address": "127.0.0.1:2379",
            "service_rootpath": "dubbomesh",
            "service_name": "com.alibaba.dubbo.performance.demo.provider.IHelloService",
            "service_ip": "172.17.0.2",
            "service_port": "2379"       
        });
        register_service.register_service("dubbomesh", "com.alibaba.dubbo.performance.demo.provider.IHelloService", "172.17.0.2", "2379").
            then((response, error) => {
                logger.info("register_service", response, error);
                done();
            })
    }).timeout(1000 * 35);
});