package com.example.dicombridge.repository;

import com.example.dicombridge.domain.dto.thumbnail.ThumbnailDto;
import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.domain.image.ImageId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, ImageId> {

    List<Image> findByImageIdStudykey(int studykey);

    List<Image> findByseriesinsuid(String seriesinsuid);

    int countByseriesinsuid(String seriesinsuid);

    @Query(
            value = "SELECT new com.example.dicombridge.domain.dto.thumbnail.ThumbnailDto(image.imageId.imagekey, image.imageId.serieskey, image.studyinsuid, image.seriesinsuid, image.sopinstanceuid, image.sopclassuid, image.path, image.fname, image.delflag, series.seriesdesc) " +
                    "FROM Image image, Series series " +
                    "WHERE image.seriesinsuid = series.seriesId.seriesinsuid " +
                    "  AND image.imageId.studykey = :studykey " +
                    "  AND series.seriesId.studykey = :studykey")
    List<ThumbnailDto> findImageAndSeriesDesc(@Param("studykey") int studykey);

    @Query("SELECT i " +
           "FROM Image i " +
           "WHERE i.seriesinsuid = :seriesinsuid " +
           "ORDER BY to_number(i.instancenum) ASC")
    List<Image> findNthImageBySeriesinsuid(@Param("seriesinsuid") String seriesinsuid, Pageable pageable);

    @Query("SELECT COUNT(DISTINCT i.seriesinsuid) " +
           "FROM Image i " +
           "WHERE i.studyinsuid = :studyInsUid")
    Long countDistinctSeries(@Param("studyInsUid") String studyInsUid);

    @Query("SELECT DISTINCT(i.seriesinsuid) " +
           "FROM Image i " +
           "WHERE i.studyinsuid = :studyinsuid")
    List<String> findDistinctSeriesInsUidByStudyinsuid(@Param("studyinsuid") String studyinsuid);

    @Query(value = "SELECT * FROM imagetab WHERE seriesinsuid = :seriesinsuid ORDER BY to_number(instancenum) ASC", nativeQuery = true)
    List<Image> findImagesBySeriesinsuidOrderedByInstancenum(@Param("seriesinsuid") String seriesinsuid);
}
