package com.example.dicombridge.service.image;

import com.example.dicombridge.domain.study.Study;
import com.example.dicombridge.domain.study.StudyResponseDto;
import com.example.dicombridge.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyService {

//    private StudyRepository studyRepository;
//    public List<StudyResponseDto> getStudies() {
//        List<Study> studyList = studyRepository.findAll();
//
//        List<StudyResponseDto> responseDtos = studyList.stream().forEach(study -> {
//            new StudyResponseDto(study);
//        });
//
//
//        return ;
//    }
}
