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
occurrence_record.pointfive_cell_id,
occurrence_record.pointtwo_cell_id,
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
taxon_concept_kingdom.kingdom_concept_id AS kingdom_concept_id,
taxon_concept_phylum.phylum_concept_id AS phylum_concept_id,
taxon_concept_class.class_concept_id AS class_concept_id,
taxon_concept_order.order_concept_id AS order_concept_id,
taxon_concept_family.family_concept_id AS family_concept_id,
taxon_concept_genus.genus_concept_id AS genus_concept_id,
taxon_concept_species.species_concept_id AS species_concept_id,
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
LEFT JOIN taxon_concept AS taxon_concept_kingdom_concept_id ON occurrence_record.taxon_concept_id = taxon_concept_kingdom_concept_id.id
LEFT JOIN taxon_concept AS taxon_concept_kingdom ON taxon_concept_kingdom_concept_id.kingdom_concept_id = taxon_concept_kingdom.id
LEFT JOIN taxon_concept AS taxon_concept_phylum ON taxon_concept_kingdom_concept_id.phylum_concept_id = taxon_concept_phylum.id
LEFT JOIN taxon_concept AS taxon_concept_class ON taxon_concept_kingdom_concept_id.class_concept_id = taxon_concept_class.id
LEFT JOIN taxon_concept AS taxon_concept_order ON taxon_concept_kingdom_concept_id.order_concept_id = taxon_concept_order.id
LEFT JOIN taxon_concept AS taxon_concept_family ON taxon_concept_kingdom_concept_id.family_concept_id = taxon_concept_family.id
LEFT JOIN taxon_concept AS taxon_concept_genus ON taxon_concept_kingdom_concept_id.genus_concept_id = taxon_concept_genus.id
LEFT JOIN taxon_concept AS taxon_concept_species ON taxon_concept_kingdom_concept_id.species_concept_id = taxon_concept_species.id
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
occurrence_record.pointfive_cell_id,
occurrence_record.pointtwo_cell_id,
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
occurrence_record.pointfive_cell_id,
occurrence_record.pointtwo_cell_id,
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
taxon_concept_kingdom.kingdom_concept_id AS kingdom_concept_id,
taxon_name_kingdom.canonical AS kingdom,
taxon_concept_phylum.phylum_concept_id AS phylum_concept_id,
taxon_name_phylum.canonical AS phylum,
taxon_concept_class.class_concept_id AS class_concept_id,
taxon_name_class.canonical AS class,
taxon_concept_order.order_concept_id AS order_concept_id,
taxon_name_order.canonical AS order_rank,
taxon_concept_family.family_concept_id AS family_concept_id,
taxon_name_family.canonical AS family,
taxon_concept_genus.genus_concept_id AS genus_concept_id,
taxon_name_genus.canonical AS genus,
taxon_concept_species.species_concept_id AS species_concept_id,
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
LEFT JOIN taxon_concept AS taxon_concept_kingdom_concept_id ON occurrence_record.taxon_concept_id = taxon_concept_kingdom_concept_id.id
LEFT JOIN taxon_concept AS taxon_concept_kingdom ON taxon_concept_kingdom_concept_id.kingdom_concept_id = taxon_concept_kingdom.id
LEFT JOIN taxon_name AS taxon_name_kingdom ON taxon_concept_kingdom.taxon_name_id = taxon_name_kingdom.id
LEFT JOIN taxon_concept AS taxon_concept_phylum ON taxon_concept_kingdom_concept_id.phylum_concept_id = taxon_concept_phylum.id
LEFT JOIN taxon_name AS taxon_name_phylum ON taxon_concept_phylum.taxon_name_id = taxon_name_phylum.id
LEFT JOIN taxon_concept AS taxon_concept_class ON taxon_concept_kingdom_concept_id.class_concept_id = taxon_concept_class.id
LEFT JOIN taxon_name AS taxon_name_class ON taxon_concept_class.taxon_name_id = taxon_name_class.id
LEFT JOIN taxon_concept AS taxon_concept_order ON taxon_concept_kingdom_concept_id.order_concept_id = taxon_concept_order.id
LEFT JOIN taxon_name AS taxon_name_order ON taxon_concept_order.taxon_name_id = taxon_name_order.id
LEFT JOIN taxon_concept AS taxon_concept_family ON taxon_concept_kingdom_concept_id.family_concept_id = taxon_concept_family.id
LEFT JOIN taxon_name AS taxon_name_family ON taxon_concept_family.taxon_name_id = taxon_name_family.id
LEFT JOIN taxon_concept AS taxon_concept_genus ON taxon_concept_kingdom_concept_id.genus_concept_id = taxon_concept_genus.id
LEFT JOIN taxon_name AS taxon_name_genus ON taxon_concept_genus.taxon_name_id = taxon_name_genus.id
LEFT JOIN taxon_concept AS taxon_concept_species ON taxon_concept_kingdom_concept_id.species_concept_id = taxon_concept_species.id
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