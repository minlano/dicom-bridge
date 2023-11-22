package com.example.dicombridge.domain.reportcontents;

import com.example.dicombridge.domain.dto.report.ReportContentsRequestDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;

import javax.persistence.Table;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "REPORTTAB_CONTENTS")
public class ReportContents {
    @EmbeddedId
    private ReportContentsId reportContentsId;
    private String interpretation;
    private String conclusion;
    private Integer hospitalid;

    public ReportContents(ReportContentsRequestDto reportContentsRequestDto){
        this.reportContentsId.setStudykey(reportContentsRequestDto.getStudykey());
        this.reportContentsId.setHistno(reportContentsRequestDto.getHistno());
        this.reportContentsId.setRecno(reportContentsRequestDto.getRecno());
        this.interpretation = reportContentsRequestDto.getInterpretation();
        this.conclusion = reportContentsRequestDto.getConclusion();
        this.hospitalid = reportContentsRequestDto.getHospitalid();
    }
}


