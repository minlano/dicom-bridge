package com.example.dicombridge.domain.series;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@NoArgsConstructor
@Table(name = "SERIESTAB")
public class Series {
    @EmbeddedId
    private SeriesId seriesId;
    private String studyinsuid;
    private String seriesdesc;
}
