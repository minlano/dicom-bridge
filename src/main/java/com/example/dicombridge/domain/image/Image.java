package com.example.dicombridge.domain.image;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "IMAGETAB")
public class Image implements Serializable {
    @Id
    private Integer studykey;
    @Id
    private Integer serieskey;
    @Id
    private Integer imagekey;
    private String studyinsuid;
    private String seriesinsuid;
    private String sopinstanceuid;
    private String sopclassuid;
    private String path;
    private String fname;
    private Integer delflag;
}
