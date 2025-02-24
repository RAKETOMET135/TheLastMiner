export class OreAlert{
    constructor(){
        this._oreName = ""
        this._oreImageURL = ""
        this._animCounter = 0
        this._oreInfoElement = document.querySelector("#ore-info")

        this._oreInfoElement.style.visibility = "hidden"
    }

    setInfo(oreName, oreImageURL){
        this._oreName = oreName
        this._oreImageURL = oreImageURL

        const oreInfoText = document.querySelector("#ore-info-text")
        const oreInfoImage = document.querySelector("#ore-info-img")

        oreInfoText.innerText = oreName
        oreInfoImage.setAttribute("src", "Images/PixelArt/" + oreImageURL)

        this._oreInfoElement.style.backgroundImage = 'url("Images/PixelArt/InventoryBackground.png")'
    }

    setAppereance(backgroundImage){
        this._oreInfoElement.style.backgroundImage = backgroundImage
    }

    trigger(){
        this._oreInfoElement.style.visibility = "visible"

        this._animCounter = 0
    }

    handleUpdate(deltaTime){
        if (this._oreInfoElement.style.visibility === "hidden") return

        this._animCounter += deltaTime

        if (this._animCounter > 75){
            this._oreInfoElement.style.opacity = 1 - (this._animCounter - 75)/10
        }
        else if (this._animCounter < 10){
            this._oreInfoElement.style.opacity = 1 - (10 - this._animCounter)/10
        }
        else{
            this._oreInfoElement.style.opacity = 1
        }
        if (this._animCounter > 85){
            this._animCounter = 0
            this._oreInfoElement.style.visibility = "hidden"
        }
    }
}