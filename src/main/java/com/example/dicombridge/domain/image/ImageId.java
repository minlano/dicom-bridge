package com.example.dicombridge.domain.image;

import lombok.Data;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
public class ImageId implements Serializable {
    private Integer studykey;
    private Integer serieskey;
    private Integer imagekey;
}
