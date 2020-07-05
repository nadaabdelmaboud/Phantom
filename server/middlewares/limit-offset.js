function limitOffset(limit, offset, specificAlbums) {
    let start = 0;
    let end = specificAlbums.length;
    if (offset != undefined) {
        if (offset >= 0 && offset <= specificAlbums.length) {
            start = offset;


        }
    }
    if (limit != undefined) {
        if ((start + limit) > 0 && (start + limit) <= specificAlbums.length) {
            end = start + limit;

        }
    } else {
        limit = Number(process.env.LIMIT) ? Number(process.env.LIMIT) : 20;
        if ((start + limit) > 0 && (start + limit) <= specificAlbums.length) {
            end = start + limit;
        }
    }

    return specificAlbums.slice(start, end);
}
module.exports=limitOffset;