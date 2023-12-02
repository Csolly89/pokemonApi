const mongoose = require('mongoose')

const PokemonSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    pokemonId: {
        type: Number,
        require: true
    },
    height: Number,
    weight: Number,
    imageSrc: String

})

module.exports = mongoose.model('Pokemon', PokemonSchema)