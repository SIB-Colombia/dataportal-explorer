-- ----------------------------
SET character_set_client = utf8;

-- Table structure for `geo_occurrence_record_denormalized`
-- ----------------------------
select concat('Deleting geo_occurrence_record_denormalized table: ', now()) as debug;
DROP TABLE IF EXISTS `geo_occurrence_record_denormalized`;

select concat('Creating geo occurrence records denormalized, table geo_occurrence_record_denormalized: ', now()) as debug;
CREATE TABLE geo_occurrence_record_denormalized
AS (SELECT
occurrence_record.id,
taxon_name.canonical,
Count(*) AS num_occurrences,
occurrence_record.latitude,
occurrence_record.longitude,
occurrence_record.cell_id,
occurrence_record.centi_cell_id,
occurrence_record.mod360_cell_id,
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
country_name.`name` AS country_name,
occurrence_record.iso_department_code,
department.department_name AS department_name,
occurrence_record.basis_of_record AS basis_of_record_id,
lookup_basis_of_record.br_value AS basis_of_record_name,
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
LEFT JOIN country_name ON occurrence_record.iso_country_code = country_name.iso_country_code
LEFT JOIN department ON occurrence_record.iso_department_code = department.iso_department_code
WHERE
occurrence_record.centi_cell_id is not null AND
occurrence_record.geospatial_issue=0 AND
occurrence_record.deleted IS NULL
GROUP BY
occurrence_record.taxon_name_id,
occurrence_record.latitude,
occurrence_record.longitude,
occurrence_record.cell_id,
occurrence_record.centi_cell_id,
occurrence_record.mod360_cell_id,
occurrence_record.kingdom_concept_id,
occurrence_record.phylum_concept_id,
occurrence_record.class_concept_id,
occurrence_record.order_concept_id,
occurrence_record.family_concept_id,
occurrence_record.genus_concept_id,
occurrence_record.species_concept_id);

select concat('Including primary key in table geo_occurrence_record_denormalized: ', now()) as debug;
alter table geo_occurrence_record_denormalized add primary key(id);

-- ----------------------------
-- Table structure for `occurrence_record_denormalized`
-- ----------------------------
select concat('Deleting occurrence_record_denormalized table: ', now()) as debug;
DROP TABLE IF EXISTS `occurrence_record_denormalized`;

select concat('Creating occurrence records denormalized, table occurrence_record_denormalized: ', now()) as debug;
CREATE TABLE occurrence_record_denormalized
AS (SELECT
occurrence_record.id,
taxon_name.canonical,
occurrence_record.latitude,
occurrence_record.longitude,
occurrence_record.cell_id,
occurrence_record.centi_cell_id,
occurrence_record.mod360_cell_id,
occurrence_record.geospatial_issue,
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
taxon_name_kingdom.canonical AS kingdom,
occurrence_record.phylum_concept_id,
taxon_name_phylum.canonical AS phylum,
occurrence_record.class_concept_id,
taxon_name_class.canonical AS class,
occurrence_record.order_concept_id,
taxon_name_order.canonical AS order_rank,
occurrence_record.family_concept_id,
taxon_name_family.canonical AS family,
occurrence_record.genus_concept_id,
taxon_name_genus.canonical AS genus,
occurrence_record.species_concept_id,
taxon_name_species.canonical AS species,
occurrence_record.iso_country_code,
occurrence_record.iso_department_code,
department.department_name AS department_name,
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
LEFT JOIN department ON occurrence_record.iso_department_code = department.iso_department_code
LEFT JOIN taxon_concept AS taxon_concept_kingdom ON occurrence_record.kingdom_concept_id = taxon_concept_kingdom.id
LEFT JOIN taxon_name AS taxon_name_kingdom ON taxon_concept_kingdom.taxon_name_id = taxon_name_kingdom.id
LEFT JOIN taxon_concept AS taxon_concept_phylum ON occurrence_record.phylum_concept_id = taxon_concept_phylum.id
LEFT JOIN taxon_name AS taxon_name_phylum ON taxon_concept_phylum.taxon_name_id = taxon_name_phylum.id
LEFT JOIN taxon_concept AS taxon_concept_class ON occurrence_record.class_concept_id = taxon_concept_class.id
LEFT JOIN taxon_name AS taxon_name_class ON taxon_concept_class.taxon_name_id = taxon_name_class.id
LEFT JOIN taxon_concept AS taxon_concept_order ON occurrence_record.order_concept_id = taxon_concept_order.id
LEFT JOIN taxon_name AS taxon_name_order ON taxon_concept_order.taxon_name_id = taxon_name_order.id
LEFT JOIN taxon_concept AS taxon_concept_family ON occurrence_record.family_concept_id = taxon_concept_family.id
LEFT JOIN taxon_name AS taxon_name_family ON taxon_concept_family.taxon_name_id = taxon_name_family.id
LEFT JOIN taxon_concept AS taxon_concept_genus ON occurrence_record.genus_concept_id = taxon_concept_genus.id
LEFT JOIN taxon_name AS taxon_name_genus ON taxon_concept_genus.taxon_name_id = taxon_name_genus.id
LEFT JOIN taxon_concept AS taxon_concept_species ON occurrence_record.species_concept_id = taxon_concept_species.id
LEFT JOIN taxon_name AS taxon_name_species ON taxon_concept_species.taxon_name_id = taxon_name_species.id
WHERE
occurrence_record.deleted IS NULL);

select concat('Including primary key in table occurrence_record_denormalized: ', now()) as debug;
alter table occurrence_record_denormalized add primary key(id);

select concat('Adding country name column in table occurrence_record_denormalized: ', now()) as debug;
ALTER TABLE occurrence_record_denormalized ADD country_name VARCHAR(255);

select concat('Filling country names in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized 
INNER JOIN country_name 
ON occurrence_record_denormalized.iso_country_code = country_name.iso_country_code 
AND country_name.locale = 'en'
SET occurrence_record_denormalized.country_name = country_name.name;

select concat('Adding basis of record name column in table occurrence_record_denormalized: ', now()) as debug;
ALTER TABLE occurrence_record_denormalized ADD basis_of_record_name_spanish VARCHAR(255);

select concat('Filling name Observación for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Observación" where basis_of_record_name = "observation";

select concat('Filling name Desconocido for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Desconocido" where basis_of_record_name = "unknown";

select concat('Filling name Espécimen for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Espécimen" where basis_of_record_name = "specimen";

select concat('Filling name Viviendo for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Viviendo" where basis_of_record_name = "living";

select concat('Filling name Germoplasmo for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Germoplasmo" where basis_of_record_name = "germplasm";

select concat('Filling name Fosil for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Fosil" where basis_of_record_name = "fossil";

select concat('Filling name Literatura for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Literatura" where basis_of_record_name = "literature";

select concat('Filling name Nomenclaturador for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Nomenclaturador" where basis_of_record_name = "nomenclator";

select concat('Filling name Taxonomía for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Taxonomía" where basis_of_record_name = "taxonomy";

select concat('Filling name Lista regional for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Lista regional" where basis_of_record_name = "regional_checklist";

select concat('Filling name Lista legislativa for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Lista legislativa" where basis_of_record_name = "legislative_list";

select concat('Filling name Espécimen Preservado for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Espécimen Preservado" where basis_of_record_name = "preservedspecimen";

select concat('Filling name Espécimen Fosilizado for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Espécimen Fosilizado" where basis_of_record_name = "fossilspecimen";

select concat('Filling name Espécimen Vivo for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Espécimen Vivo" where basis_of_record_name = "livingspecimen";

select concat('Filling name Observación Humana for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Observación Humana" where basis_of_record_name = "humanobservation";

select concat('Filling name Observación con Máquina for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Observación con Máquina" where basis_of_record_name = "machineobservation";

select concat('Filling name Imagen Fija for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Imagen Fija" where basis_of_record_name = "stillimage";

select concat('Filling name Imagen en Movimiento for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Imagen en Movimiento" where basis_of_record_name = "movingimage";

select concat('Filling name Grabación de Sonido for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Grabación de Sonido" where basis_of_record_name = "soundrecording";

select concat('Filling name Otro Espécimen for basis_of_record in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized SET basis_of_record_name_spanish = "Otro Espécimen" where basis_of_record_name = "otherspecimen";