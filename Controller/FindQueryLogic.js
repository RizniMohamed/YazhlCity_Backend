const findQueryLogic = (queryWhere, queryOrder, querySelect) => {
    let order, attributes, where = {}
    /**
     * Pick specific record
     * Format : ?where=<fieldName>-<value>,<fieldName>-<value>
     * note that there is a - between field name and value
     */
    if (queryWhere) {
        queryWhere.split(" ").map(data => {
            temp = data.split('-')
            where = { ...where, [temp[0]]: temp[1] }
        })
    }
    /**
    * Ordering the records
    * Asending order  => Format : ?order=<fieldName>
    * Decending order => Format : ?order=-<fieldName>
    * note that there is a - infront of field name for decending order
    */
    if (queryOrder) {
        order = [[
            queryOrder.startsWith('-') ? queryOrder.substring(1) : queryOrder,
            queryOrder.startsWith('-') ? 'DESC' : "ASC"
        ]]
    }
    /**
    * Select specific fileds of records
    * Format : ?order=<fieldName>+<fieldName>+<fieldName>
    * note that there is a + for join multilple field names
    */
    if (querySelect) attributes = querySelect.split(" ")
    
    return { order, attributes, where }
}

module.exports = findQueryLogic