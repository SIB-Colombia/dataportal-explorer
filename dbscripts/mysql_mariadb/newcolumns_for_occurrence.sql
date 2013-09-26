select concat('Adding pointfive_cell_id column in table occurrence_record: ', now()) as debug;
ALTER TABLE occurrence_record ADD pointfive_cell_id TINYINT(3);

select concat('Adding pointtwo_cell_id column in table occurrence_record: ', now()) as debug;
ALTER TABLE occurrence_record ADD pointtwo_cell_id TINYINT(3);