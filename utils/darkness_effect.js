import { StringConverter } from "./core/string_converter.js"

export class DarknessEffect{
    constructor(){
        this._maxSize = 5
        this._curSize = 5
        this._element = this._createElement()
        this._offsetY = 0
        this._size = 16000
    }

    _createElement(){
        let element = document.createElement("div")
        element.style.backgroundImage = "url('Images/PixelArt/DefaultTile3.png')"
        element.style.pointerEvents = "none"
        element.style.backgroundSize = "75px 75px"
        element.style.zIndex = "90"
        element.style.width = "200%"
        element.style.height = "250%"
        element.style.position = "absolute"
        element.style.left = "-75px"
        element.style.top = "0"
        element.style.maskImage = `radial-gradient(circle, rgba(0, 0, 0, 0) ${this._curSize}%, rgba(0, 0, 0, 1) ${this._curSize}%)`
        //element.style.maskImage = 'url("Images/PixelArt/LightMask.png")'
        element.style.imageRendering = "pixelated"
        element.style.maskRepeat = "no-repeat"
        element.style.maskComposite = "exclude"
        element.style.maskSize = "4000px 4000px"
        //element.style.maskSize = "16000px 16000px"

        document.querySelector("#light-mask").append(element)

        return element
    }

    _changeSize(){
        let newSize = this._maxSize

        if (this._curSize < this._maxSize / 2){
            newSize = (this._maxSize / (this._maxSize / 2)) * this._curSize
        }

        this._element.style.maskImage = `radial-gradient(circle, rgba(0, 0, 0, 0) ${newSize}%, rgba(0, 0, 0, 1) ${newSize}%)`

        //let oilLampData = playerData.getOilLampData(playerData.oilLampIndex)
        /*
        this._element.maskImage = `url("Images/PixelArt/${oilLampData[4]}")`

        this._size = (newSize / this._maxSize) * 16000 * (gamePlayerStats.oilLampIndex + 1)

        this._element.style.maskSize = `${this._size}px ${this._size}px`
        */
    }

    trackPlayer(mainTileMap, playerData){
        let playerPosition = playerData.getPlayerPosition()
        const playerStyle = window.getComputedStyle(playerData._playerElement)
        let playerWidth = StringConverter.floatFromPixelString(playerStyle.width)
        let playerHeight = StringConverter.floatFromPixelString(playerStyle.height)

        let playerGridPosition = playerData.getPlayerGridPosition(mainTileMap)
        this._element.style.top = (playerGridPosition[1] * 75 - 750).toString() + "px"
        this._offsetY = playerGridPosition[1] * 75 - 750

        this._element.style.maskPosition = `${playerPosition[0] - 2000 + playerWidth/2 + 75}px ${playerPosition[1] - 2000 + playerHeight/2 - this._offsetY}px`
        //this._element.style.maskPosition = `${playerPosition[0] - this._size/2 + playerWidth/2 + 75}px ${playerPosition[1] - this._size/2 + playerHeight/2 - this._offsetY}px`
    }

    get maxSize(){
        return this._maxSize
    }

    set maxSize(newMaxSize){
        this._maxSize = newMaxSize
    }

    get curSize(){
        return this._curSize
    }

    set curSize(newSize){
        this._curSize = newSize
        this._changeSize(newSize)
    }
}