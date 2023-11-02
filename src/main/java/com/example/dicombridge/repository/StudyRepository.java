package com.example.dicombridge.repository;

import com.example.dicombridge.domain.study.Study;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyRepository extends JpaRepository<Study, Integer> {

    public Study findByStudykey(int studykey);
    //public Studytab findByPid(String pid);
}
