SET character_set_client = utf8;

select concat('Adding pointfive_cell_id column in table occurrence_record: ', now()) as debug;
#ALTER TABLE occurrence_record ADD COLUMN pointfive_cell_id TINYINT(3);

select concat('Adding pointtwo_cell_id column in table occurrence_record: ', now()) as debug;
#ALTER TABLE occurrence_record ADD COLUMN pointtwo_cell_id TINYINT(3);

select concat('Creating functions: ', now()) as debug;
DROP FUNCTION IF EXISTS toPointFiveCellId;
DROP FUNCTION IF EXISTS toPointTwoCellId;

DELIMITER //
CREATE FUNCTION toPointFiveCellId(latitude float, longitude float) RETURNS INT DETERMINISTIC
	BEGIN
		DECLARE _output TEXT DEFAULT '';
		DECLARE pointFiveCellId INT;
		DECLARE la FLOAT;
		DECLARE lo FLOAT;

		IF latitude < -90 OR latitude > 90 OR longitude < -180 OR longitude > 180 THEN
			SET _output = "Geolocation cannot be converted to a 0.5 cell id";
		ELSE
			-- get decimal value for up to 4 decimal places
			-- 17.2-> 172000 -> 2000
			SET la = ABS(FLOOR((latitude * 10000) % 10000));
			IF latitude < 0 THEN
				SET la = 10000 - la;
			END IF;
			SET la = FLOOR((la / 1000) % 10);
			IF la >= 0 AND la < 5 THEN
				SET la = 0;
			ELSE
				SET la = 5;
			END IF;

			SET lo = ABS(FLOOR((longitude * 10000) % 10000));
			IF longitude < 0 THEN
				SET lo = 10000 - lo;
			END IF;
			SET lo = FLOOR((lo / 1000) % 10);
			IF lo >= 0 AND lo < 5 THEN
				SET lo = 0;
			ELSE
				SET lo = 5;
			END IF;

			SET pointFiveCellId = (la * 10) + lo;
		END IF;

		RETURN ABS(pointFiveCellId);
	END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION toPointTwoCellId(latitude float, longitude float) RETURNS INT DETERMINISTIC
	BEGIN
		DECLARE _output TEXT DEFAULT '';
		DECLARE pointTwoCellId INT;
		DECLARE la FLOAT;
		DECLARE lo FLOAT;

		IF latitude < -90 OR latitude > 90 OR longitude < -180 OR longitude > 180 THEN
			SET _output = "Geolocation cannot be converted to a 0.5 cell id";
		ELSE
			-- get decimal value for up to 4 decimal places
			-- 17.2-> 172000 -> 2000
			SET la = ABS(FLOOR((latitude * 10000) % 10000));
			IF latitude < 0 THEN
				SET la = 10000 - la;
			END IF;
			SET la = FLOOR((la / 1000) % 10);
			IF la >= 0 AND la < 2 THEN
				SET la = 0;
			ELSEIF la >= 2 AND la < 4 THEN
				SET la = 2;
			ELSEIF la >= 4 AND la < 6 THEN
				SET la = 4;
			ELSEIF la >= 6 AND la < 8 THEN
				SET la = 6;
			ELSEIF la >= 8 THEN
				SET la = 8;
			END IF;

			SET lo = ABS(FLOOR((longitude * 10000) % 10000));
			IF longitude < 0 THEN
				SET lo = 10000 - lo;
			END IF;
			SET lo = FLOOR((lo / 1000) % 10);
			IF lo >= 0 AND lo < 2 THEN
				SET lo = 0;
			ELSEIF lo >= 2 AND lo < 4 THEN
				SET lo = 2;
			ELSEIF lo >= 4 AND lo < 6 THEN
				SET lo = 4;
			ELSEIF lo >= 6 AND lo < 8 THEN
				SET lo = 6;
			ELSEIF lo >= 8 THEN
				SET lo = 8;
			END IF;

			SET pointTwoCellId = (la * 10) + lo;
		END IF;

		RETURN ABS(pointTwoCellId);
	END //
DELIMITER ;

select concat('Creating procedure generate_common_names: ', now()) as debug;
DROP PROCEDURE IF EXISTS generate_new_density_data;

DELIMITER //
CREATE PROCEDURE generate_new_density_data ()
	BLOCK1: begin
		DECLARE occurrenceID INT;
		DECLARE pointFiveCellData INT;
		DECLARE pointTwoCellData INT;
		DECLARE recordLatitude FLOAT;
		DECLARE recordLongitude FLOAT;
		DECLARE no_more_rows1 BOOL;
		DECLARE cursor1 CURSOR FOR SELECT id, latitude, longitude FROM occurrence_record WHERE latitude IS NOT NULL;
		DECLARE CONTINUE HANDLER FOR NOT FOUND SET no_more_rows1 := TRUE;

		SET no_more_rows1 := FALSE;

		OPEN cursor1;
		LOOP1: loop
			fetch cursor1 INTO occurrenceID, recordLatitude, recordLongitude;
			IF no_more_rows1 THEN
				CLOSE cursor1;
				LEAVE LOOP1;
			END IF;
			IF recordLatitude IS NOT NULL THEN
				SET pointFiveCellData = toPointFiveCellId(recordLatitude, recordLongitude);
				SET pointTwoCellData = toPointTwoCellId(recordLatitude, recordLongitude);
				UPDATE occurrence_record SET pointfive_cell_id = pointFiveCellData, pointtwo_cell_id = pointTwoCellData WHERE id = occurrenceID;
			END IF;
		end loop LOOP1;
	end BLOCK1 //
DELIMITER ;

select concat('Filling pointfive and pointtwo cell data: ', now()) as debug;
CALL generate_new_density_data();

UPDATE marine_zone set description="Cayo Bajo Nuevo, 15° 51' 0'' N, 78° 38' 0'' W" where description="Cayo Bajo Nuevo";
UPDATE marine_zone set description="Cayo Serranilla, 15° 47' 50'' N, 79° 51' 20'' W" where description="Cayo Serranilla";
UPDATE marine_zone set description="Revisar límites" where description="Revisar limites";
UPDATE marine_zone set description="Mar Caribe" where description="Mar Caibe";
UPDATE marine_zone set description="Océano Pacífico" where description="Oceano Pacifico";
UPDATE marine_zone set description="Área de régimen común" where description="Area de regimen comun";

-- ----------------------------
-- Table structure for `occurrence_record_denormalized`
-- ----------------------------
select concat('Deleting occurrence_record_denormalized table: ', now()) as debug;
DROP TABLE IF EXISTS `occurrence_record_denormalized`;

select concat('Creating occurrence records denormalized, table occurrence_record_denormalized: ', now()) as debug;
CREATE TABLE occurrence_record_denormalized
AS (SELECT
occurrence_record.id AS id,
occurrence_record.latitude AS latitude,
occurrence_record.longitude AS longitude,
occurrence_record.cell_id AS cell_id,
occurrence_record.centi_cell_id AS centi_cell_id,
occurrence_record.pointfive_cell_id AS pointfive_cell_id,
occurrence_record.pointtwo_cell_id AS pointtwo_cell_id,
occurrence_record.mod360_cell_id AS mod360_cell_id,
occurrence_record.geospatial_issue AS geospatial_issue,
occurrence_record.taxon_concept_id AS taxon_concept_id,
occurrence_record.data_provider_id AS data_provider_id,
data_provider.`name` AS data_provider_name,
taxon_name.canonical AS taxon_name_canonical,
taxon_name.rank AS taxon_rank_id,
rank.name AS taxon_rank,
occurrence_record.data_resource_id AS data_resource_id,
data_resource.`name` AS data_resource_name,
data_resource.rights AS data_resource_rights,
occurrence_record.institution_code_id AS institution_code_id,
institution_code.`code` AS institution_code,
occurrence_record.collection_code_id AS collection_code_id,
collection_code.`code` AS collection_code,
occurrence_record.catalogue_number_id AS catalogue_number_id,
catalogue_number.`code` AS catalogue_number,
data_resource.citation AS data_resource_citation,
data_resource.created AS data_resource_created,
data_resource.modified AS data_resource_modified,
department.department_name AS department_name,
county.county_name AS county_name,
raw_occurrence_record.locality AS locality,
paramo.complex AS paramo_name,
marine_zone.description AS marine_zone_name,
taxon_concept_phylum.partner_concept_id AS phylum_concept_id,
taxon_name_phylum.canonical AS phylum,
taxon_name_phylum.author AS phylum_author,
taxon_concept_kingdom.partner_concept_id AS kingdom_concept_id,
taxon_name_kingdom.canonical AS kingdom,
taxon_name_kingdom.author AS kingdom_author,
taxon_concept_class.partner_concept_id AS class_concept_id,
taxon_name_class.canonical AS class,
taxon_name_class.author AS class_author,
taxon_concept_order.partner_concept_id AS order_concept_id,
taxon_name_order.canonical AS order_rank,
taxon_name_order.author AS order_rank_autor,
taxon_concept_family.partner_concept_id AS family_concept_id,
taxon_name_family.canonical AS family,
taxon_name_family.author AS family_author,
taxon_concept_genus.partner_concept_id AS genus_concept_id,
taxon_name_genus.canonical AS genus,
taxon_name_genus.author AS genus_author,
taxon_concept_species.partner_concept_id AS species_concept_id,
taxon_name_species.canonical AS species,
taxon_name_species.author AS species_author,
occurrence_record.iso_country_code AS iso_country_code,
occurrence_record.iso_department_code AS iso_department_code,
occurrence_record.iso_county_code AS iso_county_code,
occurrence_record.paramo AS paramo_code,
occurrence_record.marine_zone AS marine_zone_code,
occurrence_record.basis_of_record AS basis_of_record_id,
lookup_basis_of_record.`br_value` AS basis_of_record_name,
occurrence_record.`year` AS year,
occurrence_record.`month` AS month,
occurrence_record.occurrence_date AS occurrence_date,
occurrence_record.altitude_metres AS altitude_metres,
occurrence_record.depth_centimetres AS depth_centimetres,
occurrence_record.taxonomic_issue AS taxonomic_issue,
occurrence_record.other_issue AS other_issue,
occurrence_record.deleted AS deleted,
occurrence_record.modified AS modified,
occurrence_record.protected_area AS protected_area,
occurrence_record.zonificacion AS zonificacion,
occurrence_record.dry_forest AS dry_forest,
occurrence_record.iso_country_code_calculated AS iso_country_code_calculated,
occurrence_record.iso_department_code_calculated AS iso_department_code_calculated,
data_resource.display_name AS data_resource_display_name,
data_resource.description AS data_resource_description,
data_resource.logo_url AS data_resource_logo_url,
data_resource.deleted AS data_resource_deleted,
data_resource.website_url AS data_resource_website_url,
data_resource.gbif_registry_uuid AS data_resource_gbif_registry_uuid,
data_provider.description AS data_provider_description,
data_provider.address AS data_provider_address,
data_provider.city AS data_provider_city,
data_provider.website_url AS data_provider_website_url,
data_provider.logo_url AS data_provider_logo_url,
data_provider.email AS data_provider_email,
data_provider.telephone AS data_provider_telephone,
data_provider.uuid AS data_provider_uuid,
data_provider.created AS data_provider_created,
data_provider.modified AS data_provider_modified,
data_provider.deleted AS data_provider_deleted,
data_provider.iso_country_code AS data_provider_iso_country_code,
data_provider.gbif_approver AS data_provider_gbif_approver,
data_provider.type AS data_provider_type,
taxon_name.author AS taxon_name_author,
paramo.sector AS paramo_sector,
paramo.district AS paramo_district
FROM
occurrence_record
INNER JOIN taxon_name ON occurrence_record.taxon_name_id = taxon_name.id
INNER JOIN data_provider ON occurrence_record.data_provider_id = data_provider.id
INNER JOIN data_resource ON occurrence_record.data_resource_id = data_resource.id
INNER JOIN institution_code ON occurrence_record.institution_code_id = institution_code.id
INNER JOIN collection_code ON occurrence_record.collection_code_id = collection_code.id
INNER JOIN catalogue_number ON occurrence_record.catalogue_number_id = catalogue_number.id
LEFT JOIN raw_occurrence_record ON occurrence_record.id = raw_occurrence_record.id
LEFT JOIN lookup_basis_of_record ON occurrence_record.basis_of_record = lookup_basis_of_record.br_key
LEFT JOIN department ON occurrence_record.iso_department_code = department.iso_department_code
LEFT JOIN county ON occurrence_record.iso_county_code = county.iso_county_code
LEFT JOIN paramo ON occurrence_record.paramo = paramo.complex_id
LEFT JOIN marine_zone ON occurrence_record.marine_zone = marine_zone.mask
LEFT JOIN rank on taxon_name.rank = rank.id
LEFT JOIN taxon_concept ON occurrence_record.taxon_concept_id = taxon_concept.id
LEFT JOIN taxon_concept AS taxon_concept_phylum ON taxon_concept.phylum_concept_id = taxon_concept_phylum.id
LEFT JOIN taxon_name AS taxon_name_phylum ON taxon_concept_phylum.taxon_name_id = taxon_name_phylum.id
LEFT JOIN taxon_concept AS taxon_concept_kingdom ON taxon_concept.kingdom_concept_id = taxon_concept_kingdom.id
LEFT JOIN taxon_name AS taxon_name_kingdom ON taxon_concept_kingdom.taxon_name_id = taxon_name_kingdom.id
LEFT JOIN taxon_concept AS taxon_concept_class ON taxon_concept.class_concept_id = taxon_concept_class.id
LEFT JOIN taxon_name AS taxon_name_class ON taxon_concept_class.taxon_name_id = taxon_name_class.id
LEFT JOIN taxon_concept AS taxon_concept_order ON taxon_concept.order_concept_id = taxon_concept_order.id
LEFT JOIN taxon_name AS taxon_name_order ON taxon_concept_order.taxon_name_id = taxon_name_order.id
LEFT JOIN taxon_concept AS taxon_concept_family ON taxon_concept.family_concept_id = taxon_concept_family.id
LEFT JOIN taxon_name AS taxon_name_family ON taxon_concept_family.taxon_name_id = taxon_name_family.id
LEFT JOIN taxon_concept AS taxon_concept_genus ON taxon_concept.genus_concept_id = taxon_concept_genus.id
LEFT JOIN taxon_name AS taxon_name_genus ON taxon_concept_genus.taxon_name_id = taxon_name_genus.id
LEFT JOIN taxon_concept AS taxon_concept_species ON taxon_concept.species_concept_id = taxon_concept_species.id
LEFT JOIN taxon_name AS taxon_name_species ON taxon_concept_species.taxon_name_id = taxon_name_species.id);

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

select concat('Adding country name calculated column in table occurrence_record_denormalized: ', now()) as debug;
ALTER TABLE occurrence_record_denormalized ADD country_name_calculated VARCHAR(255);

select concat('Filling country names in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized
INNER JOIN country_name
ON occurrence_record_denormalized.iso_country_code_calculated = country_name.iso_country_code
AND country_name.locale = 'en'
SET occurrence_record_denormalized.country_name_calculated = country_name.name;

select concat('Adding dataprovider country name column in table occurrence_record_denormalized: ', now()) as debug;
ALTER TABLE occurrence_record_denormalized ADD data_provider_country_name VARCHAR(255);

select concat('Filling country names in table occurrence_record_denormalized: ', now()) as debug;
UPDATE occurrence_record_denormalized
INNER JOIN country_name
ON occurrence_record_denormalized.data_provider_iso_country_code = country_name.iso_country_code
AND country_name.locale = 'en'
SET occurrence_record_denormalized.data_provider_country_name = country_name.name;

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

--
-- Table structure for table `pointfive_cell_density`
--
select concat('Deleting pointfive_cell_density table: ', now()) as debug;
DROP TABLE IF EXISTS `pointfive_cell_density`;

select concat('Creating pointfive_cell_density table: ', now()) as debug;
CREATE TABLE `pointfive_cell_density` (
  `type` smallint(5) unsigned NOT NULL,
  `entity_id` int(10) unsigned NOT NULL,
  `cell_id` smallint(5) unsigned NOT NULL,
  `pointfive_cell_id` tinyint(3) unsigned NOT NULL,
  `count` int(10) unsigned default NULL,
  PRIMARY KEY  (`type`,`entity_id`,`cell_id`,`pointfive_cell_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Table structure for table `pointfive_cell_density`
--
select concat('Deleting pointtwo_cell_density table: ', now()) as debug;
DROP TABLE IF EXISTS `pointtwo_cell_density`;

select concat('Creating pointtwo_cell_density table: ', now()) as debug;
CREATE TABLE `pointtwo_cell_density` (
  `type` smallint(5) unsigned NOT NULL,
  `entity_id` int(10) unsigned NOT NULL,
  `cell_id` smallint(5) unsigned NOT NULL,
  `pointtwo_cell_id` tinyint(3) unsigned NOT NULL,
  `count` int(10) unsigned default NULL,
  PRIMARY KEY  (`type`,`entity_id`,`cell_id`,`pointtwo_cell_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- populate the pointfive_cell_density for country
select concat('Building pointfive cells for country: ', now()) as debug;
insert into pointfive_cell_density
select 2, c.id, cell_id, pointfive_cell_id, count(oc.id)
from occurrence_record oc
inner join country c on oc.iso_country_code=c.iso_country_code
where oc.centi_cell_id is not null and oc.geospatial_issue=0 and oc.deleted is null
group by 1,2,3,4;

-- populate the pointfive_cell_density for home country
select concat('Building pointfive cells for home country: ', now()) as debug;
insert into pointfive_cell_density
select 6, c.id, cell_id, pointfive_cell_id, count(oc.id)
from occurrence_record oc
inner join data_provider dp on oc.data_provider_id=dp.id
inner join country c on dp.iso_country_code=c.iso_country_code
where oc.pointfive_cell_id is not null and oc.geospatial_issue=0 and oc.deleted is null
group by 1,2,3,4;

-- populate the pointfive_cell_density home country for international networks
select concat('Building pointfive cells for international networks: ', now()) as debug;
insert into pointfive_cell_density
select 6, 0, cell_id, pointfive_cell_id, count(oc.id)
from occurrence_record oc
inner join data_provider dp on oc.data_provider_id=dp.id
where dp.iso_country_code is null and oc.pointfive_cell_id is not null and oc.geospatial_issue=0 and oc. deleted is null
group by 3,4;

-- populate the pointfive_cell_density for provider
select concat('Building pointfive cells for provider: ', now()) as debug;
insert into pointfive_cell_density
select 3,data_provider_id,cell_id,pointfive_cell_id,count(id)
from occurrence_record
where pointfive_cell_id is not null and geospatial_issue=0 and deleted is null
group by 1,2,3,4;

-- populate the pointfive_cell_density for resource
select concat('Building pointfive cells for resource: ', now()) as debug;
insert into pointfive_cell_density
select 4,data_resource_id,cell_id,pointfive_cell_id,count(id)
from occurrence_record
where pointfive_cell_id is not null and geospatial_issue=0 and deleted is null
group by 1,2,3,4;

-- populate the pointfive_cell_density for resource_network
select concat('Building pointfive cells for network: ', now()) as debug;
insert into pointfive_cell_density
select 5,nm.resource_network_id,cell_id,pointfive_cell_id,count(oc.id)
from occurrence_record oc
inner join network_membership nm on oc.data_resource_id=nm.data_resource_id
where pointfive_cell_id is not null and oc.geospatial_issue=0 and oc.deleted is null
group by nm.resource_network_id, oc.cell_id, oc.pointfive_cell_id;

-- populate the pointfive_cell_density for department
select concat('Building pointfive cells for department: ', now()) as debug;
insert into pointfive_cell_density
select 8, d.id, cell_id, pointfive_cell_id, count(oc.id)
from occurrence_record oc
inner join department d on oc.iso_department_code=d.iso_department_code
where oc.pointfive_cell_id is not null and oc.geospatial_issue=0 and oc.deleted is null
group by 1,2,3,4;

-- populate pointfive_cell_density for all ORs on the denormalised nub id
select concat('Building pointfive cells for kingdom: ', now()) as debug;
insert ignore into pointfive_cell_density
select 1, ore.kingdom_concept_id, ore.cell_id, ore.pointfive_cell_id, count(ore.id)
from occurrence_record ore
where ore.kingdom_concept_id is not null
and ore.pointfive_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointfive_cell_density for all ORs on the denormalised nub id
select concat('Building pointfive cells for phylum: ', now()) as debug;
insert ignore into pointfive_cell_density
select 1, ore.phylum_concept_id, ore.cell_id, ore.pointfive_cell_id, count(ore.id)
from occurrence_record ore
where ore.phylum_concept_id is not null
and ore.pointfive_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointfive_cell_density for all ORs on the denormalised nub id
select concat('Building pointfive cells for class: ', now()) as debug;
insert ignore into pointfive_cell_density
select 1, ore.class_concept_id, ore.cell_id, ore.pointfive_cell_id, count(ore.id)
from occurrence_record ore
where ore.class_concept_id is not null
and ore.pointfive_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointfive_cell_density for all ORs on the denormalised nub id
select concat('Building pointfive cells for order: ', now()) as debug;
insert ignore into pointfive_cell_density
select 1, ore.order_concept_id, ore.cell_id, ore.pointfive_cell_id, count(ore.id)
from occurrence_record ore
where ore.order_concept_id is not null
and ore.pointfive_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointfive_cell_density for all ORs on the denormalised nub id
select concat('Building pointfive cells for family: ', now()) as debug;
insert ignore into pointfive_cell_density
select 1, ore.family_concept_id, ore.cell_id, ore.pointfive_cell_id, count(ore.id)
from occurrence_record ore
where ore.family_concept_id is not null
and ore.pointfive_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointfive_cell_density for all ORs on the denormalised nub id
select concat('Building pointfive cells for genus: ', now()) as debug;
insert ignore into pointfive_cell_density
select 1, ore.genus_concept_id, ore.cell_id, ore.pointfive_cell_id, count(ore.id)
from occurrence_record ore
where ore.genus_concept_id is not null
and ore.pointfive_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointfive_cell_density for all ORs on the denormalised nub id
select concat('Building pointfive cells for species: ', now()) as debug;
insert ignore into pointfive_cell_density
select 1, ore.species_concept_id, ore.cell_id, ore.pointfive_cell_id, count(ore.id)
from occurrence_record ore
where ore.species_concept_id is not null
and ore.pointfive_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointfive_cell_density for taxonomy RUN THIS AFTER THE DENORMALISED!!!
select concat('Building pointfive cells for nub concept: ', now()) as debug;
insert ignore into pointfive_cell_density
select 1, nub_concept_id,cell_id,pointfive_cell_id,count(id)
from occurrence_record ore
where ore.pointfive_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate for all things
select concat('Building pointfive cells for all things: ', now()) as debug;
insert ignore into pointfive_cell_density
select 0, 0,cell_id,pointfive_cell_id,count(id)
from occurrence_record ore
where ore.pointfive_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;


-- populate the pointtwo_cell_density for country
select concat('Building pointtwo cells for country: ', now()) as debug;
insert into pointtwo_cell_density
select 2, c.id, cell_id, pointtwo_cell_id, count(oc.id)
from occurrence_record oc
inner join country c on oc.iso_country_code=c.iso_country_code
where oc.centi_cell_id is not null and oc.geospatial_issue=0 and oc.deleted is null
group by 1,2,3,4;

-- populate the pointtwo_cell_density for home country
select concat('Building pointtwo cells for home country: ', now()) as debug;
insert into pointtwo_cell_density
select 6, c.id, cell_id, pointtwo_cell_id, count(oc.id)
from occurrence_record oc
inner join data_provider dp on oc.data_provider_id=dp.id
inner join country c on dp.iso_country_code=c.iso_country_code
where oc.pointtwo_cell_id is not null and oc.geospatial_issue=0 and oc.deleted is null
group by 1,2,3,4;

-- populate the pointtwo_cell_density home country for international networks
select concat('Building pointtwo cells for international networks: ', now()) as debug;
insert into pointtwo_cell_density
select 6, 0, cell_id, pointtwo_cell_id, count(oc.id)
from occurrence_record oc
inner join data_provider dp on oc.data_provider_id=dp.id
where dp.iso_country_code is null and oc.pointtwo_cell_id is not null and oc.geospatial_issue=0 and oc. deleted is null
group by 3,4;

-- populate the pointtwo_cell_density for provider
select concat('Building pointtwo cells for provider: ', now()) as debug;
insert into pointtwo_cell_density
select 3,data_provider_id,cell_id,pointtwo_cell_id,count(id)
from occurrence_record
where pointtwo_cell_id is not null and geospatial_issue=0 and deleted is null
group by 1,2,3,4;

-- populate the pointtwo_cell_density for resource
select concat('Building pointtwo cells for resource: ', now()) as debug;
insert into pointtwo_cell_density
select 4,data_resource_id,cell_id,pointtwo_cell_id,count(id)
from occurrence_record
where pointtwo_cell_id is not null and geospatial_issue=0 and deleted is null
group by 1,2,3,4;

-- populate the pointtwo_cell_density for resource_network
select concat('Building pointtwo cells for network: ', now()) as debug;
insert into pointtwo_cell_density
select 5,nm.resource_network_id,cell_id,pointtwo_cell_id,count(oc.id)
from occurrence_record oc
inner join network_membership nm on oc.data_resource_id=nm.data_resource_id
where pointtwo_cell_id is not null and oc.geospatial_issue=0 and oc.deleted is null
group by nm.resource_network_id, oc.cell_id, oc.pointtwo_cell_id;

-- populate the pointtwo_cell_density for department
select concat('Building pointtwo cells for department: ', now()) as debug;
insert into pointtwo_cell_density
select 8, d.id, cell_id, pointtwo_cell_id, count(oc.id)
from occurrence_record oc
inner join department d on oc.iso_department_code=d.iso_department_code
where oc.pointtwo_cell_id is not null and oc.geospatial_issue=0 and oc.deleted is null
group by 1,2,3,4;

-- populate pointtwo_cell_density for all ORs on the denormalised nub id
select concat('Building pointtwo cells for kingdom: ', now()) as debug;
insert ignore into pointtwo_cell_density
select 1, ore.kingdom_concept_id, ore.cell_id, ore.pointtwo_cell_id, count(ore.id)
from occurrence_record ore
where ore.kingdom_concept_id is not null
and ore.pointtwo_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointtwo_cell_density for all ORs on the denormalised nub id
select concat('Building pointtwo cells for phylum: ', now()) as debug;
insert ignore into pointtwo_cell_density
select 1, ore.phylum_concept_id, ore.cell_id, ore.pointtwo_cell_id, count(ore.id)
from occurrence_record ore
where ore.phylum_concept_id is not null
and ore.pointtwo_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointtwo_cell_density for all ORs on the denormalised nub id
select concat('Building pointtwo cells for class: ', now()) as debug;
insert ignore into pointtwo_cell_density
select 1, ore.class_concept_id, ore.cell_id, ore.pointtwo_cell_id, count(ore.id)
from occurrence_record ore
where ore.class_concept_id is not null
and ore.pointtwo_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointtwo_cell_density for all ORs on the denormalised nub id
select concat('Building pointtwo cells for order: ', now()) as debug;
insert ignore into pointtwo_cell_density
select 1, ore.order_concept_id, ore.cell_id, ore.pointtwo_cell_id, count(ore.id)
from occurrence_record ore
where ore.order_concept_id is not null
and ore.pointtwo_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointtwo_cell_density for all ORs on the denormalised nub id
select concat('Building pointtwo cells for family: ', now()) as debug;
insert ignore into pointtwo_cell_density
select 1, ore.family_concept_id, ore.cell_id, ore.pointtwo_cell_id, count(ore.id)
from occurrence_record ore
where ore.family_concept_id is not null
and ore.pointtwo_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointtwo_cell_density for all ORs on the denormalised nub id
select concat('Building pointtwo cells for genus: ', now()) as debug;
insert ignore into pointtwo_cell_density
select 1, ore.genus_concept_id, ore.cell_id, ore.pointtwo_cell_id, count(ore.id)
from occurrence_record ore
where ore.genus_concept_id is not null
and ore.pointtwo_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointtwo_cell_density for all ORs on the denormalised nub id
select concat('Building pointtwo cells for species: ', now()) as debug;
insert ignore into pointtwo_cell_density
select 1, ore.species_concept_id, ore.cell_id, ore.pointtwo_cell_id, count(ore.id)
from occurrence_record ore
where ore.species_concept_id is not null
and ore.pointtwo_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate pointtwo_cell_density for taxonomy RUN THIS AFTER THE DENORMALISED!!!
select concat('Building pointtwo cells for nub concept: ', now()) as debug;
insert ignore into pointtwo_cell_density
select 1, nub_concept_id,cell_id,pointtwo_cell_id,count(id)
from occurrence_record ore
where ore.pointtwo_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;

-- populate for all things
select concat('Building pointtwo cells for all things: ', now()) as debug;
insert ignore into pointtwo_cell_density
select 0, 0,cell_id,pointtwo_cell_id,count(id)
from occurrence_record ore
where ore.pointtwo_cell_id is not null and ore.geospatial_issue=0 and ore.deleted is null
group by 1,2,3,4;
