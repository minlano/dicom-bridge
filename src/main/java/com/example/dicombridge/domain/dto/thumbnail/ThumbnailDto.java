package com.example.dicombridge.domain.dto.thumbnail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.File;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThumbnailDto {
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
}
