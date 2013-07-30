-- ----------------------------
-- Table structure for `geo_occurrence_record_denormalized`
-- ----------------------------
DROP TABLE IF EXISTS `geo_occurrence_record_denormalized`;

CREATE TABLE geo_occurrence_record_denormalized
AS (SELECT
occurrence_record.id,
taxon_name.canonical,
count(*) AS num_occurrences,
occurrence_record.latitude,
occurrence_record.longitude,
occurrence_record.data_provider_id,
data_provider.`name` AS data_provider_name,
occurrence_record.data_resource_id,
data_resource.`name` AS data_resource_name,
data_resource.rights,
occurrence_record.institution_code_id,
institution_code.`code` AS institution_code,
occurrence_record.collection_code_id,
collection_code.`code` AS collection_code,
occurrence_record.catalogue_number_id,
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
occurrence_record.basis_of_record AS basis_of_record_id,
lookup_basis_of_record.`br_value` AS basis_of_record_name,
occurrence_record.`year`,
occurrence_record.`month`,
occurrence_record.occurrence_date,
occurrence_record.altitude_metres,
occurrence_record.depth_centimetres
FROM
occurrence_record
INNER JOIN taxon_name ON occurrence_record.taxon_name_id = taxon_name.id
INNER JOIN data_provider ON occurrence_record.data_provider_id = data_provider.id
INNER JOIN data_resource ON occurrence_record.data_resource_id = data_resource.id
INNER JOIN institution_code ON occurrence_record.institution_code_id = institution_code.id
INNER JOIN collection_code ON occurrence_record.collection_code_id = collection_code.id
INNER JOIN catalogue_number ON occurrence_record.catalogue_number_id = catalogue_number.id
INNER JOIN lookup_basis_of_record ON occurrence_record.basis_of_record = lookup_basis_of_record.br_key
WHERE
occurrence_record.deleted IS NULL AND
occurrence_record.latitude IS NOT NULL AND
occurrence_record.longitude IS NOT NULL
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
occurrence_record.species_concept_id);

alter table geo_occurrence_record_denormalized add primary key(id);
ALTER TABLE geo_occurrence_record_denormalized ADD country_name VARCHAR(255);
ALTER TABLE geo_occurrence_record_denormalized ADD department_name VARCHAR(255);

UPDATE geo_occurrence_record_denormalized 
INNER JOIN country_name 
ON geo_occurrence_record_denormalized.iso_country_code = country_name.iso_country_code 
AND country_name.locale = 'en' 
SET geo_occurrence_record_denormalized.country_name = country_name.name;

UPDATE geo_occurrence_record_denormalized 
INNER JOIN department 
ON geo_occurrence_record_denormalized.iso_department_code = department.iso_department_code
SET geo_occurrence_record_denormalized.department_name = department.department_name;

-- ----------------------------
-- Table structure for `occurrence_record_denormalized`
-- ----------------------------
DROP TABLE IF EXISTS `occurrence_record_denormalized`;

CREATE TABLE occurrence_record_denormalized
AS (SELECT
occurrence_record.id,
taxon_name.canonical,
occurrence_record.latitude,
occurrence_record.longitude,
occurrence_record.data_provider_id,
data_provider.`name` AS data_provider_name,
occurrence_record.data_resource_id,
data_resource.`name` AS data_resource_name,
data_resource.rights,
occurrence_record.institution_code_id,
institution_code.`code` AS institution_code,
occurrence_record.collection_code_id,
collection_code.`code` AS collection_code,
occurrence_record.catalogue_number_id,
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
occurrence_record.basis_of_record AS basis_of_record_id,
lookup_basis_of_record.`br_value` AS basis_of_record_name,
occurrence_record.`year`,
occurrence_record.`month`,
occurrence_record.occurrence_date,
occurrence_record.altitude_metres,
occurrence_record.depth_centimetres
FROM
occurrence_record
INNER JOIN taxon_name ON occurrence_record.taxon_name_id = taxon_name.id
INNER JOIN data_provider ON occurrence_record.data_provider_id = data_provider.id
INNER JOIN data_resource ON occurrence_record.data_resource_id = data_resource.id
INNER JOIN institution_code ON occurrence_record.institution_code_id = institution_code.id
INNER JOIN collection_code ON occurrence_record.collection_code_id = collection_code.id
INNER JOIN catalogue_number ON occurrence_record.catalogue_number_id = catalogue_number.id
INNER JOIN lookup_basis_of_record ON occurrence_record.basis_of_record = lookup_basis_of_record.br_key
WHERE
occurrence_record.deleted IS NULL);

alter table occurrence_record_denormalized add primary key(id);
ALTER TABLE occurrence_record_denormalized ADD kingdom VARCHAR(255);
ALTER TABLE occurrence_record_denormalized ADD phylum VARCHAR(255);
ALTER TABLE occurrence_record_denormalized ADD class VARCHAR(255);
ALTER TABLE occurrence_record_denormalized ADD order_rank VARCHAR(255);
ALTER TABLE occurrence_record_denormalized ADD family VARCHAR(255);
ALTER TABLE occurrence_record_denormalized ADD genus VARCHAR(255);
ALTER TABLE occurrence_record_denormalized ADD species VARCHAR(255);
ALTER TABLE occurrence_record_denormalized ADD country_name VARCHAR(255);
ALTER TABLE occurrence_record_denormalized ADD department_name VARCHAR(255);
ALTER TABLE occurrence_record_denormalized ADD basis_of_record_name_spanish VARCHAR(255);

UPDATE occurrence_record_denormalized
INNER JOIN taxon_concept 
ON occurrence_record_denormalized.kingdom_concept_id = taxon_concept.id
INNER JOIN taxon_name 
ON taxon_concept.taxon_name_id = taxon_name.id
SET occurrence_record_denormalized.kingdom = taxon_name.canonical;

UPDATE occurrence_record_denormalized
INNER JOIN taxon_concept 
ON occurrence_record_denormalized.phylum_concept_id = taxon_concept.id
INNER JOIN taxon_name 
ON taxon_concept.taxon_name_id = taxon_name.id
SET occurrence_record_denormalized.phylum = taxon_name.canonical;

UPDATE occurrence_record_denormalized
INNER JOIN taxon_concept 
ON occurrence_record_denormalized.class_concept_id = taxon_concept.id
INNER JOIN taxon_name 
ON taxon_concept.taxon_name_id = taxon_name.id
SET occurrence_record_denormalized.class = taxon_name.canonical;

UPDATE occurrence_record_denormalized
INNER JOIN taxon_concept 
ON occurrence_record_denormalized.order_concept_id = taxon_concept.id
INNER JOIN taxon_name 
ON taxon_concept.taxon_name_id = taxon_name.id
SET occurrence_record_denormalized.order_rank = taxon_name.canonical;

UPDATE occurrence_record_denormalized
INNER JOIN taxon_concept 
ON occurrence_record_denormalized.family_concept_id = taxon_concept.id
INNER JOIN taxon_name 
ON taxon_concept.taxon_name_id = taxon_name.id
SET occurrence_record_denormalized.family = taxon_name.canonical;

UPDATE occurrence_record_denormalized
INNER JOIN taxon_concept 
ON occurrence_record_denormalized.genus_concept_id = taxon_concept.id
INNER JOIN taxon_name 
ON taxon_concept.taxon_name_id = taxon_name.id
SET occurrence_record_denormalized.genus = taxon_name.canonical;

UPDATE occurrence_record_denormalized
INNER JOIN taxon_concept 
ON occurrence_record_denormalized.species_concept_id = taxon_concept.id
INNER JOIN taxon_name 
ON taxon_concept.taxon_name_id = taxon_name.id
SET occurrence_record_denormalized.species = taxon_name.canonical;

UPDATE occurrence_record_denormalized 
INNER JOIN country_name 
ON occurrence_record_denormalized.iso_country_code = country_name.iso_country_code 
AND country_name.locale = 'en' 
SET occurrence_record_denormalized.country_name = country_name.name;

UPDATE occurrence_record_denormalized 
INNER JOIN department 
ON occurrence_record_denormalized.iso_department_code = department.iso_department_code
SET occurrence_record_denormalized.department_name = department.department_name;

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Observación" where basis_of_record_name = "observation";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Desconocido" where basis_of_record_name = "unknown";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Espécimen" where basis_of_record_name = "specimen";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Viviendo" where basis_of_record_name = "living";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Germoplasmo" where basis_of_record_name = "germplasm";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Fosil" where basis_of_record_name = "fossil";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Literatura" where basis_of_record_name = "literature";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Nomenclaturador" where basis_of_record_name = "nomenclator";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Taxonomía" where basis_of_record_name = "taxonomy";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Lista regional" where basis_of_record_name = "regional_checklist";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Lista legislativa" where basis_of_record_name = "legislative_list";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Espécimen Preservado" where basis_of_record_name = "preservedspecimen";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Espécimen Fosilizado" where basis_of_record_name = "fossilspecimen";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Espécimen Vivo" where basis_of_record_name = "livingspecimen";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Observación Humana" where basis_of_record_name = "humanobservation";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Observación con Máquina" where basis_of_record_name = "machineobservation";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Imagen Fija" where basis_of_record_name = "stillimage";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Imagen en Movimiento" where basis_of_record_name = "movingimage";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Grabación de Sonido" where basis_of_record_name = "soundrecording";

UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Otro Espécimen" where basis_of_record_name = "otherspecimen";