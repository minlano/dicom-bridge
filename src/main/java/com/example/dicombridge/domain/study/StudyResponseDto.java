package com.example.dicombridge.domain.study;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StudyResponseDto {
    private String pid;
    private String pname;
    private String modality;
    private String studydesc;
    private String studydate;
    private Integer reportstatus;
    private Integer seriescnt;
    private Integer imagecnt;
    private Integer verifyflag;

    public StudyResponseDto(Study study) {
        this.pid = study.getPid();
        this.pname = study.getPname();
        this.modality = study.getModality();
        this.studydesc = study.getStudydesc();
        this.studydate = study.getStudydate();
        this.reportstatus = study.getReportstatus();
        this.seriescnt = study.getSeriescnt();
        this.imagecnt = study.getImagecnt();
        this.verifyflag = study.getVerifyflag();
    }
}
