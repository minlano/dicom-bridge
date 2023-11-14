package com.example.dicombridge.repository;

import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.domain.study.Study;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyRepository extends JpaRepository<Study, Integer> {

    List<Study> findByStudykey(int studykey);
}
