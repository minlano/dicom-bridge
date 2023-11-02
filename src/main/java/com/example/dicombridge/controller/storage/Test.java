package com.example.dicombridge.controller.storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

@Controller
@Component
public class Test {

    @Autowired
    private TestController testController;

    @Autowired
    public Test(TestController testController) {
        this.testController = testController;
    }

}
