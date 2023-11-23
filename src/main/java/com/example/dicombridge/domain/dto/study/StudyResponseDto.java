package com.example.dicombridge.domain.dto.study;

import com.example.dicombridge.domain.study.Study;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StudyResponseDto {
    private int studykey;
    private String studyinsuid;
    private String pid;
    private String pname;
    private String modality;
    private String studydesc;
    private String studydate;
    private Integer reportstatus;
    private Integer seriescnt;
    private Integer imagecnt;
    private Integer verifyflag;
    private String pbirthdatetime;
    private String studytime;

    public StudyResponseDto(Study study) {
        this.studykey = study.getStudykey();
        this.studyinsuid = study.getStudyinsuid();
        this.pid = study.getPid();
        this.pname = study.getPname();
        this.modality = study.getModality();
        this.studydesc = study.getStudydesc();
        this.studydate = study.getStudydate();
        this.reportstatus = study.getReportstatus();
        this.seriescnt = study.getSeriescnt();
        this.imagecnt = study.getImagecnt();
        this.verifyflag = study.getVerifyflag();
        this.pbirthdatetime = study.getPbirthdatetime();
        this.studytime = study.getStudytime();
    }
}
