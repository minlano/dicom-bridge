package com.example.dicombridge.repository;

import com.example.dicombridge.domain.common.ThumbnailDto;
import com.example.dicombridge.domain.image.Image;
import com.example.dicombridge.domain.image.ImageId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, ImageId> {
    List<Image> findByImageIdStudykey(int studykey);

    @Query(
            value = "select " +
                    "new com.example.dicombridge.domain.common.ThumbnailDto(image.imageId.imagekey, image.studyinsuid, image.seriesinsuid, image.sopinstanceuid, image.sopclassuid, image.path, image.fname, image.delflag, series.seriesdesc) " +
                    "from Image image " +
                    "left outer join Series series on image.imageId.studykey = series.seriesId.studykey " +
                    "where image.imageId.studykey = :studykey")
    List<ThumbnailDto> findImageAndSeriesDesc(int studykey);

    List<Image> findByseriesinsuid(String seriesinsuid);//studyinsuid로 imagetab 조회
    //List<Image> findByseriesinsuidAndImageIdImagekey(String seriesinsuid, int imagenum);
    List<Image> findBySeriesinsuidAndInstancenum(String seriesinsuid, String insnum);

    int countByseriesinsuid(String seriesinsuid); // seriesinsuid로 갯수 확인
}
