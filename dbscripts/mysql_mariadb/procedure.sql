-- Table structure for `geo_occurrence_record_denormalized`
-- ----------------------------
select concat('Creating procedure generate_common_names: ', now()) as debug;
DROP PROCEDURE IF EXISTS generate_common_names;

DELIMITER //

CREATE PROCEDURE generate_common_names ()
	BLOCK1: begin
		DECLARE dataTaxonConcept INT(10);
		DECLARE dataCanonical VARCHAR(255);
		DECLARE no_more_rows1 BOOL;
		DECLARE cursor1 CURSOR FOR SELECT taxon_name.canonical, occurrence_record.taxon_concept_id FROM occurrence_record INNER JOIN taxon_name ON occurrence_record.taxon_name_id = taxon_name.id GROUP BY occurrence_record.taxon_concept_id;
		DECLARE CONTINUE HANDLER FOR NOT FOUND SET no_more_rows1 := TRUE;

		SET no_more_rows1 := FALSE;
	
		OPEN cursor1;
		LOOP1: loop
			fetch cursor1 INTO dataCanonical, dataTaxonConcept;
			if no_more_rows1 THEN
				close cursor1;
				leave LOOP1;
			end if;
			BLOCK2: begin
				DECLARE no_more_rows2 BOOL;
				DECLARE countTaxon INT;
				DECLARE dataCommonName VARCHAR(255);
				DECLARE dataLanguageIso char(3);
				DECLARE cursor2 CURSOR FOR SELECT catalogue_of_life_common_name.common_name, catalogue_of_life_common_name.language_iso FROM catalogue_of_life_common_name WHERE catalogue_of_life_common_name.canonical LIKE CONCAT("%", dataCanonical, "%");
				DECLARE CONTINUE HANDLER FOR NOT FOUND SET no_more_rows2 := TRUE;

				SET no_more_rows2 := FALSE;
				SET countTaxon = 0;

				OPEN cursor2;
				LOOP2: loop
					fetch cursor2 INTO dataCommonName, dataLanguageIso;
					if no_more_rows2 THEN
						close cursor2;
						leave LOOP2;
					end if;
					SET countTaxon = 0;
					if dataLanguageIso = 'spa' THEN
						SELECT count(*) INTO countTaxon FROM common_name WHERE taxon_concept_id = dataTaxonConcept AND name = dataCommonName AND iso_language_code = 'es';
						if countTaxon = 0 THEN
							insert ignore into common_name (id, taxon_concept_id, name, iso_language_code, language) VALUES (NULL, dataTaxonConcept, dataCommonName, 'es', 'Spanish');
							UPDATE taxon_concept SET is_nub_concept = 1 WHERE id = dataTaxonConcept;
						end if;
					end if;
					#if dataLanguageIso = 'eng' THEN
					#	SELECT count(*) INTO countTaxon FROM common_name WHERE taxon_concept_id = dataTaxonConcept AND name = dataCommonName AND iso_language_code = 'en';
					#	if countTaxon = 0 THEN
					#		insert ignore into common_name (id, taxon_concept_id, name, iso_language_code, language) VALUES (NULL, dataTaxonConcept, dataCommonName, 'en', 'English');
					#		UPDATE taxon_concept SET is_nub_concept = 1 WHERE id = dataTaxonConcept;
					#	end if;
					#end if;
				end loop LOOP2;
			end BLOCK2;
		end loop LOOP1;
	
	end BLOCK1
//