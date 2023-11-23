package com.example.dicombridge.controller.image;

import com.example.dicombridge.domain.series.Series;
import com.example.dicombridge.service.series.SeriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/series")
@RequiredArgsConstructor
public class SeriesRestController {

    private final SeriesService seriesService;

    @GetMapping("/getSeriesInsUids/{studyInsUid}")
    public List<String> getSeriesInsUids(@PathVariable String studyInsUid) {
        List<Series> serieses = seriesService.getSeriesInsUids(studyInsUid);
        return serieses.stream()
                .map(series -> series.getSeriesId().getSeriesinsuid())
                .collect(Collectors.toList());
    }

    @GetMapping("/getComparisonTest/{studyInsUid}")
    public List<String> getComparisonTest(@PathVariable String studyInsUid) {

        return null;
    }

}
