-- ----------------------------
-- Table structure for `geo_ocurrence_record_denormalized`
-- ----------------------------
DROP TABLE IF EXISTS `geo_ocurrence_record_denormalized`;

CREATE TABLE geo_ocurrence_record_denormalized
AS (SELECT
occurrence_record.id,
taxon_name.canonical,
count(*) AS num_occurrences,
occurrence_record.latitude,
occurrence_record.longitude,
data_provider.`name` AS data_provider_name,
data_resource.`name` AS data_resource_name,
data_resource.rights AS data_resource_rights,
institution_code.`code` AS institution_code,
collection_code.`code` AS collection_code,
catalogue_number.`code` AS catalogue_number,
data_resource.citation,
data_resource.created,
data_resource.modified,
occurrence_record.kingdom_concept_id,
occurrence_record.phylum_concept_id,
occurrence_record.class_concept_id,
occurrence_record.order_concept_id,
occurrence_record.family_concept_id,
occurrence_record.genus_concept_id,
occurrence_record.species_concept_id,
occurrence_record.iso_country_code,
occurrence_record.iso_department_code,
occurrence_record.`year`,
occurrence_record.`month`,
occurrence_record.occurrence_date,
agent.`name` AS registered_by
FROM
occurrence_record
INNER JOIN taxon_name ON occurrence_record.taxon_name_id = taxon_name.id
INNER JOIN data_provider ON occurrence_record.data_provider_id = data_provider.id
INNER JOIN data_resource ON occurrence_record.data_resource_id = data_resource.id
INNER JOIN institution_code ON occurrence_record.institution_code_id = institution_code.id
INNER JOIN collection_code ON occurrence_record.collection_code_id = collection_code.id
INNER JOIN catalogue_number ON occurrence_record.catalogue_number_id = catalogue_number.id
INNER JOIN data_provider_agent ON occurrence_record.data_provider_id = data_provider_agent.data_provider_id
INNER JOIN agent ON data_provider_agent.agent_id = agent.id
WHERE
occurrence_record.latitude IS NOT NULL AND
occurrence_record.longitude IS NOT NULL AND
occurrence_record.deleted IS NULL AND
data_provider_agent.agent_type = 1
GROUP BY
occurrence_record.taxon_name_id,
occurrence_record.latitude,
occurrence_record.longitude,
occurrence_record.kingdom_concept_id,
occurrence_record.phylum_concept_id,
occurrence_record.class_concept_id,
occurrence_record.order_concept_id,
occurrence_record.family_concept_id,
occurrence_record.genus_concept_id,
occurrence_record.species_concept_id
ORDER BY
occurrence_record.id ASC);

alter table geo_ocurrence_record_denormalized add primary key(id);