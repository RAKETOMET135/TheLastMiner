export class SelectionBox{
    constructor(){
        this._targetTile = "none"
        this._targetTileGrid = [0, 0]
        this._visible = false
        this._size = [0, 0]
        this._element = this._createSelectionBoxElement()
        this._currentlyHoveredTile = "none"
        this._currentlyHoveredTileMapCoords = [0, 0]
    }

    _createSelectionBoxElement(){
        let selectionBoxElement = document.createElement("img")
        selectionBoxElement.classList.add("selection-box")
        selectionBoxElement.setAttribute("src", "Images/PixelArt/SelectionBox.png")
        selectionBoxElement.style.visibility = "hidden"
        document.body.append(selectionBoxElement)

        return selectionBoxElement
    }

    updateTileDistance(mainTileMap, playerData){
        if (this._currentlyHoveredTile !== "none"){
            let gridPosition = playerData.getPlayerGridPosition(mainTileMap)

            let diffX = Math.abs(gridPosition[0] - this._currentlyHoveredTileMapCoords[0])
            let diffY = Math.abs(gridPosition[1] - this._currentlyHoveredTileMapCoords[1])

            let tileDistance = diffX + diffY

            if (tileDistance <= 1 && playerData.grounded || tileDistance <= 1 && playerData._inLift || tileDistance <= 1 && playerData._grapplingHook){
                this.setVisibility(true, this._currentlyHoveredTile, this._currentlyHoveredTileMapCoords)
            }
        }

        if (this._targetTile === "none") return

        let gridPosition = playerData.getPlayerGridPosition(mainTileMap)

        let diffX = Math.abs(gridPosition[0] - this._targetTileGrid[0])
        let diffY = Math.abs(gridPosition[1] - this._targetTileGrid[1])

        let tileDistance = diffX + diffY

        if (tileDistance > 1){
            this.setVisibility(false, this._targetTile, [0, 0])
        }
        else{
            if (!playerData.grounded){
                if (!playerData._inLift && !playerData._grapplingHook){
                    this.setVisibility(false, this._targetTile, [0, 0])
                }
            }
        }
    }

    setVisibility(visibility, element, gridPosition){
        if (visibility){
            this._element.style.visibility = "visible"
            element.append(this._element)
            this._targetTile = element
            this._targetTileGrid = gridPosition
        }
        else{
            document.body.append(this._element)
            this._element.style.visibility = "hidden"
            this._targetTile = "none"
        }
    }

    get currentlyHoveredTile(){
        return this._currentlyHoveredTile
    }

    set currentlyHoveredTile(newCurrentlyHoveredTile){
        this._currentlyHoveredTile = newCurrentlyHoveredTile
    }

    get currentlyHoveredTileMapCoords(){
        return this._currentlyHoveredTileMapCoords
    }

    set currentlyHoveredTileMapCoords(newCurrentlyHoveredTileMapCoords){
        this._currentlyHoveredTileMapCoords = newCurrentlyHoveredTileMapCoords
    }
}