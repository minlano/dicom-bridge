package com.example.dicombridge.repository;

import com.example.dicombridge.domain.common.ThumbnailDto;
import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.domain.image.ImageId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, ImageId> {
    List<Image> findByImageIdStudykey(int studykey);

    List<Image> findByStudyinsuid(String studyInsUid);

    @Query("SELECT DISTINCT i.seriesinsuid " +
           "FROM Image i " +
           "WHERE i.studyinsuid = :studyInsUid")
    List<String> findDistinctSeriesinsuidByStudyinsuid(@Param("studyInsUid") String studyInsUid);

    @Query(
            value = "SELECT new com.example.dicombridge.domain.common.ThumbnailDto(image.imageId.imagekey, image.imageId.serieskey, image.studyinsuid, image.seriesinsuid, image.sopinstanceuid, image.sopclassuid, image.path, image.fname, image.delflag, series.seriesdesc) " +
                    "FROM Image image, Series series " +
                    "WHERE image.seriesinsuid = series.seriesId.seriesinsuid " +
                    "  AND image.imageId.studykey = :studykey " +
                    "  AND series.seriesId.studykey = :studykey")
    List<ThumbnailDto> findImageAndSeriesDesc(@Param("studykey") int studykey);

    List<Image> findByseriesinsuid(String seriesinsuid);//studyinsuid로 imagetab 조회

    //List<Image> findByseriesinsuidAndImageIdImagekey(String seriesinsuid, int imagenum);

    List<Image> findBySeriesinsuidAndInstancenum(String seriesinsuid, String insnum);

    @Query("SELECT i " +
           "FROM Image i " +
           "WHERE i.seriesinsuid = :seriesinsuid " +
           "ORDER BY to_number(i.instancenum) ASC")
    List<Image> findNthImageBySeriesinsuid(@Param("seriesinsuid") String seriesinsuid, Pageable pageable);

    @Query("SELECT MAX(i.imageId.serieskey) FROM Image i WHERE i.studyinsuid = :studyinsuid")
    Integer findMaxStudyKeyByStudyKey(@Param("studyinsuid") String studyinsuid); // serieskey의 최댓값을 구하지만 1부터 숫자가 늘어나기에 count와 같다.

    int countByseriesinsuid(String seriesinsuid); // seriesinsuid로 갯수 확인
}
