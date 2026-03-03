package com.arpet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ArPetApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArPetApplication.class, args);
        System.out.println("========================================");
        System.out.println("    AR宠物卡通后端服务启动成功！");
        System.out.println("    访问地址: http://localhost:8080/api");
        System.out.println("    健康检查: http://localhost:8080/api/health");
        System.out.println("========================================");
    }
}
