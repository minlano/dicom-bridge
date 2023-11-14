package com.example.dicombridge.service.image;

import com.example.dicombridge.domain.study.Study;
import com.example.dicombridge.domain.study.StudyResponseDto;
import com.example.dicombridge.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyService {
    private final StudyRepository studyRepository;

//    public StudyService(StudyRepository studyRepository) { this.studyRepository = studyRepository; }

    public List<StudyResponseDto> getStudies() {
        List<Study> studyList = studyRepository.findAll();
        return studyList.stream()
                        .map(StudyResponseDto::new)
                        .collect(Collectors.toList());
    }
    public List<Integer> getReportStatusByStudyKey(int studykey) {
        // 이미지 레포지토리를 이용하여 studykey에 해당하는 reportstatus 값을 가져옴
        List<Study> studies = studyRepository.findByStudykey(studykey);
        return studies.stream().map(Study::getReportstatus).collect(Collectors.toList());
    }

    public List<StudyResponseDto> getSearch() {
        List<Study> studyList = studyRepository.findAll();
        return studyList.stream()
                .map(StudyResponseDto::new)
                .collect(Collectors.toList());
    }

}
