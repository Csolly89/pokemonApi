const mongoose = require('mongoose')
require('dotenv').config()
const Pokemon = require('./Models/Pokemon')

console.log('start')

async function getPokemon(url) {
    const response = await fetch(url)
    const data = await response.json()

    return{ 
        name: data.name,
        pokemonID: data.id,
        height: data.height,
        weight: data.weight,
        imageSrc: data.sprites.front_default
    }
}

async function savePokemon(pokemon){
    try{
        await Pokemon.insertMany(pokemon)
    } catch {
        comsole.log('Error saving pokemon')
    }
}

async function main () {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connected')
        // process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(0)
    }

    await Pokemon.deleteMany()

    let baseUrl = "https://pokeapi.co/api/v2/pokemon"
    let pokemonToSearch = true
    const pokemonPromises = []
    
    while (pokemonToSearch) {
        const response = await fetch(baseUrl)
        const data = await response.json()

        data.results.forEach(result => {
            pokemonPromises.push(getPokemon(result.url))
        })
        if(!data.next) {
            pokemonToSearch= false
        } else {
            baseUrl = data.next   
        }
    }
    const data = await Promise.all(pokemonPromises)

    const size = 50;
    const pokemonToSave = [];
    for (let i=0; i < data.length; i += size) {
        pokemonToSave.push(savePokemon(data.slice(i, i + size)));
    }
    await Promise.all(pokemonToSave)

    process.exit(0)
}

main ()