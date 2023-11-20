package com.example.dicombridge.repository;

import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.domain.series.Series;
import com.example.dicombridge.domain.series.SeriesId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeriesRepository extends JpaRepository<Series, SeriesId> {

    List<Series> findByStudyinsuid(String studyinsuid);
}
