package com.example.dicombridge.service.series;

import com.example.dicombridge.domain.series.Series;
import com.example.dicombridge.repository.SeriesRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeriesService {
    private final SeriesRepository seriesRepository;

    public List<Series> getSeriesInsUids(String studyInsUid) {
        return seriesRepository.findByStudyinsuid(studyInsUid);
    }
}
