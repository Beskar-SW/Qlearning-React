import Laberinto from './Laberinto.js'
import Personaje from './Personaje.js'

const Game = ({data}) => {


    return (
        <>
            <Laberinto data={data} />
            <Personaje data={data} />
        </>
    )

}

export default Game;