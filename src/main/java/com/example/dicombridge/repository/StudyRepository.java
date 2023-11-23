package com.example.dicombridge.repository;

import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.domain.study.Study;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudyRepository extends JpaRepository<Study, Integer> {

    List<Study> findByStudykey(int studykey);

    @Query("SELECT s FROM Study s " +
            "WHERE (:pid IS NULL OR s.pid LIKE %:pid%) " +
            "AND (:pname IS NULL OR s.pname LIKE %:pname%) " +
            "AND (:reportstatus IS NULL OR s.reportstatus = :reportstatus)")
    List<Study> findByPidAndPnameAndReportstatus(
            @Param("pid") String pid,
            @Param("pname") String pname,
            @Param("reportstatus") Integer reportstatus);

    List<Study> findByModality(String modality);

    @Query(value = "SELECT DISTINCT studyinsuid FROM studytab WHERE modality = :modality", nativeQuery = true)
    List<String> findDistinctStudyinsuidByModality(@Param("modality") String modality);
}

