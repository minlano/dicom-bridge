package com.example.dicombridge.service.image;

import com.example.dicombridge.domain.reportcontents.ReportContents;

import com.example.dicombridge.repository.ReportContentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportContentsService {

    private final ReportContentsRepository reportContentsRepository;

    public List<String> getInterpretationByStudyKey(int studykey) {
        // 이미지 레포지토리를 이용하여 studykey에 해당하는 reportcontents 값을 가져옴
        List<ReportContents> reportContents = reportContentsRepository.findReportContentsByReportContentsIdStudykey(studykey);
        return reportContents.stream().map(ReportContents::getInterpretation).collect(Collectors.toList());
    }
}
