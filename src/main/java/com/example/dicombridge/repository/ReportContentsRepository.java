package com.example.dicombridge.repository;

import com.example.dicombridge.domain.reportcontents.ReportContents;

import com.example.dicombridge.domain.reportcontents.ReportContentsId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportContentsRepository extends JpaRepository<ReportContents, ReportContentsId> {

    List<ReportContents> findReportContentsByReportContentsIdStudykey(int studykey);
}
