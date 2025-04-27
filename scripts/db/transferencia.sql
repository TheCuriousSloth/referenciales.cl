-- 1. Crear backup de seguridad
-- El usuario con ID 'cm5bhz0tt000emn03sxdv8cc8' corresponde a monacaniqueo@gmail.com
CREATE TABLE referenciales_backup AS
SELECT * FROM referenciales
WHERE "userId" = 'cm5bhz0tt000emn03sxdv8cc8';

-- 2. Transferir referenciales al nuevo usuario
-- Este paso actualiza el campo "userId" en la tabla "referenciales" para cambiar el valor del usuario antiguo 'cm5bhz0tt000emn03sxdv8cc8' al nuevo usuario 'cm5q4sff800004lvonjerxxc3'.
-- El nuevo usuario con ID 'cm5q4sff800004lvonjerxxc3' corresponde a gabrielpantojarivera@gmail.com.
UPDATE referenciales
SET "userId" = 'cm5q4sff800004lvonjerxxc3'
WHERE "userId" = 'cm5bhz0tt000emn03sxdv8cc8';

-- 3. Verificar la transferencia
SELECT COUNT(*) as registros_transferidos 
FROM referenciales 
WHERE "userId" = 'cm5q4sff800004lvonjerxxc3';