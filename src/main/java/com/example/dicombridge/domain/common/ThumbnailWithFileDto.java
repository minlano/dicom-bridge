package com.example.dicombridge.domain.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.File;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThumbnailWithFileDto {
    private Integer imagekey;
    private Integer serieskey;
    private String studyinsuid;
    private String seriesinsuid;
    private String sopinstanceuid;
    private String sopclassuid;
    private String path;
    private String fname;
    private Integer delflag;
    private String seriesdesc;
    private String image;

    public ThumbnailWithFileDto(ThumbnailDto thumbnailDto) {
        this.imagekey = thumbnailDto.getImagekey();
        this.serieskey = thumbnailDto.getSerieskey();
        this.studyinsuid = thumbnailDto.getStudyinsuid();
        this.seriesinsuid = thumbnailDto.getSeriesinsuid();
        this.sopinstanceuid = thumbnailDto.getSopinstanceuid();
        this.sopclassuid = thumbnailDto.getSopclassuid();
        this.path = thumbnailDto.getPath();
        this.fname = thumbnailDto.getFname();
        this.delflag = thumbnailDto.getDelflag();
        this.seriesdesc = thumbnailDto.getSeriesdesc();
    }
}
