package com.example.dicombridge.domain.study;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@NoArgsConstructor
@Table(name = "studytab")
@Entity
public class Studytab {
    @Id
   // @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int studykey;
    private String studyinsuid, studydate, accessnum,  studyid, studydesc, modality;
    private String bodypart, pid,  pname, psex, pbirthdatetime, patage;
    private int seriescnt, imagecnt, delflag;

public Studytab(StudytabRequestDto studytabRequestDto) {
    this.studyinsuid = studytabRequestDto.getStudyinsuid();
    this.studydate = studytabRequestDto.getStudydate();
    this.accessnum = studytabRequestDto.getAccessnum();
    this.studyid = studytabRequestDto.getStudyid();
    this.studydesc = studytabRequestDto.getStudydesc();
    this.modality = studytabRequestDto.getModality();
    this.bodypart = studytabRequestDto.getBodypart();
    this.pid = studytabRequestDto.getPid();
    this.pname = studytabRequestDto.getPname();
    this.psex = studytabRequestDto.getPsex();
    this.pbirthdatetime = studytabRequestDto.getPbirthdatetime();
    this.patage = studytabRequestDto.getPatage();
    this.seriescnt = studytabRequestDto.getSeriescnt();
    this.imagecnt = studytabRequestDto.getImagecnt();
    this.delflag = studytabRequestDto.getDelflag();
}


}
