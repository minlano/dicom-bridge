package com.example.dicombridge.domain.image;

import com.example.dicombridge.domain.PathAndName;
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
@Table(name = "IMAGETAB")
public class Image implements PathAndName {
    @EmbeddedId
    private ImageId imageId;
    private String studyinsuid;
    private String seriesinsuid;
    private String sopinstanceuid;
    private String sopclassuid;
    private String path;
    private String fname;
    private Integer delflag;

    private String instancenum;

    public Image(String seriesinsuid) {
        this.seriesinsuid = seriesinsuid;
    }
}
