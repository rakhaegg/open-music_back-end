


const mapDBtoModelbyID = ({
    id , 
    title ,
    year , 
    performer ,
    genre,
    duration ,
    inserted_at , 
    updated_at, 
}) => ({
    id , 
    title ,
    year ,
    performer ,
    genre,
    duration ,
    insertedAt : inserted_at,
    updatedAt  : updated_at
})

const mapDBtoModel = ({
    id ,
    title , 
    performer
}) => ({
    id ,
    title , 
    performer
})

const mapDBtoMode_playlsits = ({
    id , 
    name , 
    username
}) => ({
    id ,
    name ,
    username
})


module.exports = { mapDBtoModelbyID , mapDBtoModel ,  mapDBtoMode_playlsits};