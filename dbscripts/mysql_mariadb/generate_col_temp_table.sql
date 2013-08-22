-- ----------------------------
SET character_set_client = utf8;

-- Table structure for `geo_occurrence_record_denormalized`
-- ----------------------------
select concat('Deleting  table: ', now()) as debug;
DROP TABLE IF EXISTS `catalogue_of_life_common_name`;

select concat('Creating table catalogue_of_life_common_name: ', now()) as debug;
CREATE TABLE `catalogue_of_life_common_name` (
`id`  bigint NOT NULL AUTO_INCREMENT ,
`canonical`  varchar(255) NOT NULL ,
`common_name`  varchar(255) NOT NULL ,
`language_iso`  char(3) NULL ,
`country_iso`  char(3) NULL ,
`country`  varchar(100) NULL ,
`region_free_text_id`  int(10) NULL ,
`free_text`  varchar(12500) NULL ,
`occurrence_id`  int(10) NULL,
PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

select concat('Extracting table data from database col2012 (catalogue of life) to table catalogue_of_life_common_name: ', now()) as debug;
insert into catalogue_of_life_common_name (id, canonical, common_name, language_iso, country_iso, country, region_free_text_id, free_text)
SELECT null,
CoL2012._search_all.`name`,
CoL2012.common_name_element.`name`,
CoL2012.common_name.language_iso,
CoL2012.common_name.country_iso,
CoL2012.country.`name` AS country,
CoL2012.common_name.region_free_text_id,
CoL2012.region_free_text.free_text
FROM
CoL2012._search_all
LEFT JOIN CoL2012.common_name ON CoL2012._search_all.id = CoL2012.common_name.taxon_id
LEFT JOIN CoL2012.common_name_element ON CoL2012.common_name.common_name_element_id = CoL2012.common_name_element.id
LEFT JOIN CoL2012.country ON CoL2012.common_name.country_iso = CoL2012.country.iso
LEFT JOIN CoL2012.region_free_text ON CoL2012.common_name.region_free_text_id = CoL2012.region_free_text.id
WHERE
CoL2012.common_name.language_iso = "spa"
GROUP BY
CoL2012._search_all.id;

insert into catalogue_of_life_common_name (id, canonical, common_name, language_iso, country_iso, country, region_free_text_id, free_text)
SELECT null,
CoL2012._search_all.`name`,
CoL2012.common_name_element.`name`,
CoL2012.common_name.language_iso,
CoL2012.common_name.country_iso,
CoL2012.country.`name` AS country,
CoL2012.common_name.region_free_text_id,
CoL2012.region_free_text.free_text
FROM
CoL2012._search_all
LEFT JOIN CoL2012.common_name ON CoL2012._search_all.id = CoL2012.common_name.taxon_id
LEFT JOIN CoL2012.common_name_element ON CoL2012.common_name.common_name_element_id = CoL2012.common_name_element.id
LEFT JOIN CoL2012.country ON CoL2012.common_name.country_iso = CoL2012.country.iso
LEFT JOIN CoL2012.region_free_text ON CoL2012.common_name.region_free_text_id = CoL2012.region_free_text.id
WHERE
CoL2012.common_name.language_iso = "eng"
GROUP BY
CoL2012._search_all.id;
