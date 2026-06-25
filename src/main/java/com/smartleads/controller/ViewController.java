package com.smartleads.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @RequestMapping(value = { "/", "/login", "/register", "/dashboard" })
    public String forward() {
        return "forward:/index.html";
    }
}
