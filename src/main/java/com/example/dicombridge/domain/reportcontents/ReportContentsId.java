package com.example.dicombridge.domain.reportcontents;

import lombok.Data;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
public class ReportContentsId implements Serializable {
    private Integer studykey;
    private Integer histno;
    private Integer recno;
}
