
/**
 * @function array_to_string_list
 *
 * @param   array     An array of any type
 * @returns The concatenation of the string form of all the elements in the array,
 *          separated by commas, and each wrapped with single quotes
 */
CREATE FUNCTION retina.array_to_string_list("array" anyarray) RETURNS character varying
AS $$
BEGIN
  RETURN '(''' || array_to_string("array", ''',''') || ''')';
END;
$$
LANGUAGE plpgsql;
