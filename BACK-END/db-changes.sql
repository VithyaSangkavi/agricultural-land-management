-- 2023-10-27 Rename worker assigned table id 

ALTER TABLE `agri-management`.`work-assigned` 
CHANGE COLUMN `workAssignedId` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
