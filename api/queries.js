module.exports = {
    categoryWithChildren: `
        WITH RECURSIVE subcategories (id) AS (
            SELECT id FROM categories WHERE id = ?
            UNION ALL
            SELECT c.id FROM subcategories, categories c
                WHERE "parentId" = subcategories.id
        )
        SELECT id FROM subcategories
    `,

    grupoitemWithChildren: `
    WITH RECURSIVE subgrupoitems (id) AS (
        SELECT id FROM grupoitems WHERE id = ?
        UNION ALL
        SELECT c.id FROM subgrupoitems, grupoitems c
            WHERE "parentId" = subgrupoitems.id
    )
    SELECT id FROM subgrupoitems
    `  
    ,
    
    grupoitemAnalitico: `
        SELECT * FROM grupoitems WHERE sintetico = 0
    `,

    stateFill:`
        SELECT * FROM states
    `,
    cityFillState:`
    SELECT * FROM states
    where state_id = ?
`

}