package com.example.dicombridge.domain.series;

import lombok.Data;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
public class SeriesId implements Serializable {
    private Integer studykey;
    private Integer serieskey;
}
