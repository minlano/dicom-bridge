package com.example.dicombridge.domain.reportcontents;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReportContentsRequestDto {
    private int studykey, histno, recno, hospitalid;
    private String interpretation, conclusion;

}
