package com.example.dicombridge.domain.study;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudytabRepository extends JpaRepository<Studytab, Integer> {

    public Studytab findByStudykey(int studykey);
    //public Studytab findByPid(String pid);



}
