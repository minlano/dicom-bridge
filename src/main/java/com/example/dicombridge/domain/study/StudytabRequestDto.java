package com.example.dicombridge.domain.study;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StudytabRequestDto {
    private int studykey;
    private String studyinsuid, studydate, accessnum,  studyid, studydesc, modality;
    private String bodypart, pid,  pname, psex, pbirthdatetime, patage;
    private int seriescnt, imagecnt, delflag;
}
