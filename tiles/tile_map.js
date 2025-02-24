import { Particle } from "../utils/particle.js"
import { Random } from "../utils/core/random.js"
import { OreData, oresData } from "../data/ore_data.js"

export class TileMap{
    constructor(width, height, scale, offset, selectionBox, playerData){
        this._width = width
        this._height = height
        this._scale = scale
        this._offset = offset
        this._tileMap = []
        this._tileElements = []
        this._tileHealth = []
        this._visualTiles = []
        this._visualTileElements = []
        this._tileElementsChanged = []
        this._visualTileElementsChanged = []
        this._visualAbleToDraw = []
        this._droppingRocks = false
        this._storage = document.body
        this._liftObjects = []
        this._activeMovers = []
        this._liftCarts = []
        this._liftHitbox = []

        this._selectionBox = selectionBox
        this._playerData = playerData
        this._tileMapRenderer = NaN

        this._createEmpty()
    }

    _createEmpty(){
        this._tileMap = []
        this._visualTiles = []
        this._visualTileElements = []
        this._visualAbleToDraw = []

        for (let y = 0; y < this._height; y++){
            let tileMapRow = []
            let tileMapRow2 = []
            let tileMapRow3 = []
            let tileMapRow4 = []

            for (let x = 0; x < this._width; x++){
                tileMapRow.push(0)
                tileMapRow2.push(0)
                tileMapRow3.push(0)
                tileMapRow4.push(0)
            }

            this._tileMap.push(tileMapRow)
            this._visualTiles.push(tileMapRow2)
            this._visualTileElements.push(tileMapRow3)
            this._visualAbleToDraw.push(tileMapRow4)
        }

        this._tileHealth = []

        for (let y = 0; y < this._height; y++){
            let tileHealthRow = []

            for (let x = 0; x < this._width; x++){
                let health = this.getTileMaxHealth(y)

                tileHealthRow.push(health)
            }

            this._tileHealth.push(tileHealthRow)
        }
    }

    _createTile(x, y){
        let tileElement = document.createElement("div")
        tileElement.classList.add("tile")
        tileElement.style.position = "absolute"
                
        let tilePosition = this.getTilePosition(x, y)
        tileElement.style.left = `${tilePosition[0]}px`
        tileElement.style.top = `${tilePosition[1]}px`

        tileElement.style.width = `${this._scale}px`
        tileElement.style.height = `${this._scale}px`

        let tileImage = document.createElement("img")
        tileImage.setAttribute("src", "Images/PixelArt/DefaultTile2.png")
        tileImage.style.zIndex = 1
        tileImage.classList.add("tile-background")
    
        this._storage.append(tileElement)
        tileElement.append(tileImage)

        let tileData = this.getTileData(x, y)
        if (tileData > 1 && tileData !== 100 && tileData !== 101 && tileData != 102){
            let oreData = OreData.getOreData(oresData, tileData)

            let tileOreImage = document.createElement("img")
            tileOreImage.setAttribute("src", `Images/PixelArt/${oreData.oreImageURL}`)
            tileOreImage.style.zIndex = 2

            tileElement.append(tileOreImage)
        }
        else if (tileData === 100){
            let tileRockImage = document.createElement("img")
            tileRockImage.setAttribute("src", "Images/PixelArt/Rock.png")
            tileRockImage.style.zIndex = 2

            if (this._droppingRocks){
                tileElement.classList.add("is-rock")
            }

            tileElement.append(tileRockImage)
        }
        else if (tileData === 101){
            tileImage.style.filter = "brightness(1.075)"
        }
        else if (tileData === 102){
            let tileBedrockImage = document.createElement("img")
            tileBedrockImage.setAttribute("src", "Images/PixelArt/BedrockTile.png")
            tileBedrockImage.style.zIndex = 2

            tileElement.append(tileBedrockImage)
        }

        tileElement.addEventListener("mouseover", () => {
            let gridPosition = this._playerData.getPlayerGridPosition(this)

            let diffX = Math.abs(gridPosition[0] - x)
            let diffY = Math.abs(gridPosition[1] - y)

            let tileDistance = diffX + diffY

            if (tileDistance <= 1 && this._playerData.grounded){
                this._selectionBox.setVisibility(true, tileElement, [x, y])
            }

            this._selectionBox.currentlyHoveredTile = tileElement
            this._selectionBox.currentlyHoveredTileMapCoords = [x, y]
        })
        tileElement.addEventListener("mouseleave", () => {
            this._selectionBox.setVisibility(false, tileElement, [0, 0])

            this._selectionBox.currentlyHoveredTile = "none"
        })

        return tileElement
    }

    updateLiftCarts(){
        let playerPosition = this._playerData.getPlayerPosition()

        for (let i = 0; i < this._liftCarts.length; i++){
            let liftCart = this._liftCarts[i]
            this._liftCarts[i][4] = parseInt(liftCart[2].style.opacity)

            let height = playerPosition[1] - 25

            if (height < liftCart[3] * this._scale){
                height = liftCart[3] * this._scale
            }
            if (height > (liftCart[3] + liftCart[4] - 1) * this._scale){
                height = (liftCart[3] + liftCart[4] - 1) * this._scale
            }

            let gridPositionY = (height + 25) / this.scale
            gridPositionY = Math.round(gridPositionY)
            
            this._liftCarts[i][0] = [this._liftCarts[i][0][0], gridPositionY]

            liftCart[2].style.top = `${height}px`
        }
    }

    updateLifts(){
        let toContinueMovers = []

        for (let i = 0; i < this._activeMovers.length; i++){
            let activeMover = this._activeMovers[i]
            let moverPosition = activeMover[0]
            let moverPossible = activeMover[3]
            let startY = activeMover[4]
            let curY = moverPosition[1]
            let curX = moverPosition[0]

            if (moverPossible <= 0){
                continue
            }

            let tileDataUnder = this.getTileData(moverPosition[0], moverPosition[1] + 1)

            if (Math.abs(moverPosition[1] + 1 - 502) <= 2) continue
            if (Math.abs(moverPosition[1] + 1 - 1002) <= 2) continue

            if (tileDataUnder !== 0 && tileDataUnder !== 1){
                toContinueMovers.push(this._activeMovers[i])

                continue
            }

            let isNotValid = false
            if (tileDataUnder === 0){
                for (let j = 0; j < this._liftHitbox.length; j++){
                    let hitboxPos = this._liftHitbox[j][0]

                    if (curX === hitboxPos[0] && curY + 1 === hitboxPos[1]){
                        isNotValid = true
                    }
                }
            }
            if (isNotValid) continue

            let position = this.getTilePosition(moverPosition[0], moverPosition[1] + 1)

            if (tileDataUnder === 1){
                this.setTile(moverPosition[0], moverPosition[1] + 1, 0)
                this.createVisualTile(moverPosition[0], moverPosition[1])
    
                //Tile appereance change
                let tilePositions = this.getTilesAround([moverPosition[0], moverPosition[1] + 1])
    
                tilePositions.forEach(tilePosition => {
                    this._tileMapRenderer.updateTileConnection(tilePosition[0], tilePosition[1])
                })
    
                //Tile particles
                for (let i = 0; i < 25; i++){
                    let particle = new Particle([10, 10], "Images/PixelArt/DirtParticle.png", [Random.getFloatNumber(-2, 1), Random.getFloatNumber(-5, -3)], Random.getNumber(50, 100), [position[0] + this._scale/2, position[1] + this._scale/2], true)
                }
            }

            this._activeMovers[i][3] -= 1
            this._activeMovers[i][0] = [moverPosition[0], moverPosition[1] + 1]

            let moverElement = activeMover[2]

            moverElement.style.top = `${position[1]}px`

            if (Math.abs(startY - curY) > 0){
                let ropeElement = document.createElement("div")
                ropeElement.classList.add("tile")
                ropeElement.style.position = "absolute"
                ropeElement.style.left = `${position[0]}px`
                ropeElement.style.top = `${position[1] - this._scale}px`
                ropeElement.style.width = `${this._scale}px`
                ropeElement.style.height = `${this._scale}px`
                ropeElement.style.zIndex = "80"

                let ropeImage = document.createElement("img")
                ropeImage.setAttribute("src", "Images/PixelArt/LiftRopes.png")
                ropeImage.style.zIndex = 1

                this._storage.append(ropeElement)
                ropeElement.append(ropeImage)

                let ropeObject = [[curX, curY], 2, ropeElement]
                this._liftObjects.push(ropeObject)
            }

            let c = this._activeMovers[i][5].style
            this._activeMovers[i][5].style.opacity = (parseInt(c.opacity) + 1).toString()

            toContinueMovers.push(this._activeMovers[i])
        }

        delete this._activeMovers
        this._activeMovers = toContinueMovers

        this.updateLiftCarts()
    }

    liftPlaceValid(x, y){
        if (y < 5) return false
        if (y === 504 || y === 503 || y === 502 || y === 501 || y === 500) return false
        if (y === 1004 || y === 1003 || y === 1002 || y === 1001 || y === 1000) return false

        let tileData = this.getTileData(x, y)
        if (tileData !== 0) return false

        for (let i = 0; i < this._liftObjects.length; i++){
            let liftObject = this._liftObjects[i]
            let liftObjectPosition = liftObject[0]

            if (liftObjectPosition[0] === x && liftObjectPosition[1] === y) return false
        }

        return true
    }

    createLift(x, y, type){
        if (!this.liftPlaceValid(x, y)) return

        let spawnPosition = this.getTilePosition(x, y)

        //UPPER
        let liftElement = document.createElement("div")
        liftElement.classList.add("tile")
        liftElement.style.position = "absolute"
        liftElement.style.left = `${spawnPosition[0]}px`
        liftElement.style.top = `${spawnPosition[1]}px`
        liftElement.style.width = `${this._scale}px`
        liftElement.style.height = `${this._scale}px`
        liftElement.style.zIndex = "80"

        let liftImage = document.createElement("img")
        if (type === "metal"){
            liftImage.setAttribute("src", "Images/PixelArt/LiftFundationMetal.png")
        }
        else{
            liftImage.setAttribute("src", "Images/PixelArt/LiftFundation.png")
        }
        liftImage.style.zIndex = 1
        liftImage.style.rotate = "180deg"
    
        this._storage.append(liftElement)
        liftElement.append(liftImage)

        let liftObject = [[x, y], 0, liftElement, type]
        this._liftObjects.push(liftObject)
        this._liftHitbox.push(liftObject)

        //CART
        let liftCart = document.createElement("div")
        liftCart.classList.add("tile")
        liftCart.classList.add("is-cart")
        liftCart.style.position = "absolute"
        liftCart.style.left = `${spawnPosition[0]}px`
        liftCart.style.top = `${spawnPosition[1]}px`
        liftCart.style.width = `${this._scale}px`
        liftCart.style.height = `${this._scale}px`
        liftCart.style.zIndex = "81"
        liftCart.style.opacity = 1

        let cartImage = document.createElement("img")
        if (type === "metal"){
            cartImage.setAttribute("src", "Images/PixelArt/LiftCartMetal.png")
        }
        else{
            cartImage.setAttribute("src", "Images/PixelArt/LiftCart.png")
        }
        cartImage.style.zIndex = 1

        this._storage.append(liftCart)
        liftCart.append(cartImage)

        let liftLength = 30
        if (type === "metal"){
            liftLength = 100
        }
        let cartObject = [[x, y], 3, liftCart, y, 0, liftLength]        
        this._liftObjects.push(cartObject)
        this._liftCarts.push(cartObject)

        //MOVER
        let liftMover = document.createElement("div")
        liftMover.classList.add("tile")
        liftMover.style.position = "absolute"
        liftMover.style.left = `${spawnPosition[0]}px`
        liftMover.style.top = `${spawnPosition[1]}px`
        liftMover.style.width = `${this._scale}px`
        liftMover.style.height = `${this._scale}px`
        liftMover.style.zIndex = "80"

        let moverImage = document.createElement("img")
        if (type === "metal"){
            moverImage.setAttribute("src", "Images/PixelArt/LiftFundationMetal.png")
        }
        else{
            moverImage.setAttribute("src", "Images/PixelArt/LiftFundation.png")
        }
        moverImage.style.zIndex = 1

        this._storage.append(liftMover)
        liftMover.append(moverImage)

        let moverObject = [[x, y], 1, liftMover, liftLength, y, liftCart]         //change 30 to lift max size
        this._liftObjects.push(moverObject)
        this._activeMovers.push(moverObject)
        this._liftHitbox.push(moverObject)
    }

    bombPlaceValid(x, y){
        if (y < 5) return false
        if (y === 504 || y === 503 || y === 502 || y === 501 || y === 500) return false
        if (y === 1004 || y === 1003 || y === 1002 || y === 1001 || y === 1000) return false

        return true
    }

    impactPointValid(x, y, canDamageRocks){
        if (x < 0 || x > this.width - 1) return false
        if (y < 0 || y > this.height -1) return false

        let tileData = this.getTileData(x, y)

        if (tileData === 0) return false

        if (tileData === 100 && !canDamageRocks) return false

        if (tileData === 102) return false

        return true
    }

    applyBomb(impactPoints, canDestroyRocks){
        let toRockCheckPoints = []

        for (let i = 0; i < impactPoints.length; i++){
            let impactPoint = impactPoints[i]

            if (!this.impactPointValid(impactPoint[0], impactPoint[1], canDestroyRocks)) continue

            this.setTile(impactPoint[0], impactPoint[1], 0)
            this.createVisualTile(impactPoint[0], impactPoint[1])

            toRockCheckPoints.push(impactPoint)

            let tilePositions = this.getTilesAround([impactPoint[0], impactPoint[1]])
            tilePositions.forEach(tilePosition => {
                this._tileMapRenderer.updateTileConnection(tilePosition[0], tilePosition[1])
            })

            let position = this.getTilePosition(impactPoint[0], impactPoint[1])
            for (let i = 0; i < 25; i++){
                let particle = new Particle([10, 10], "Images/PixelArt/DirtParticle.png", [Random.getFloatNumber(-2, 1), Random.getFloatNumber(-5, -3)], Random.getNumber(50, 100), [position[0] + this._scale/2, position[1] + this._scale/2], true)
            }
        }

        for (let i = 0; i < toRockCheckPoints.length; i++){
            let impactPoint = toRockCheckPoints[i]

            this.checkRock(impactPoint[0], impactPoint[1])
            setTimeout(this.removeFallingRocks, 100)
        }
    }

    useBomb(x, y, type){
        if (type === "t-bomb"){
            let impactPoints = [
                [x, y], [x, y - 1], [x, y - 2], [x - 1, y - 2], [x + 1, y - 2]
            ]

            this.applyBomb(impactPoints, false)
        }
        else if (type === "line-bomb"){
            let impactPoints = [
                [x, y], [x - 1, y], [x - 2, y], [x + 1, y], [x + 2, y]
            ]

            this.applyBomb(impactPoints, true)
        }
        else if (type === "shaft-bomb"){
            let impactPoints = [
                [x, y], [x, y - 1], [x, y - 2], [x, y + 1], [x, y + 2]
            ]

            this.applyBomb(impactPoints, true)
        }
    }

    createVisualTile(x, y){
        let tileElement = document.createElement("div")
        tileElement.classList.add("tile")
        tileElement.style.position = "absolute"

        let tilePosition = this.getTilePosition(x, y)
        tileElement.style.left = `${tilePosition[0]}px`
        tileElement.style.top = `${tilePosition[1]}px`

        tileElement.style.width = `${this._scale}px`
        tileElement.style.height = `${this._scale}px`
        //tileElement.style.zIndex = "99"

        let tileImage = document.createElement("img")
        tileImage.setAttribute("src", "Images/PixelArt/BackgroundTile.png")
        tileImage.style.zIndex = 1
        tileImage.classList.add("tile-background")
    
        this._storage.append(tileElement)
        tileElement.append(tileImage)

        this._visualTileElements[y][x] = tileElement
        this._visualAbleToDraw[y][x] = 1
    }

    removeAllVisualTiles(){
        let y = 0
        this._visualTileElements.forEach(visualTileElementRow => {
            let x = 0

            visualTileElementRow.forEach(visualTileElement => {
                if (visualTileElement !== 0){
                    visualTileElement.remove()
                    this._visualTileElements[y][x] = 0
                }

                x++
            })

            y++
        })

        this._visualTileElements = []
    }

    setElementStorage(storageElement){
        this._storage = storageElement
    }

    removeTileMapElements(){
        if (this._tileMap === NaN || this._tileMap.length === 0) return
        if (this._tileElements === NaN || this._tileElements.length === 0) return

        for (let y = 0; y < this._tileMap.length; y++){
            const tileMapRow = this._tileMap[y]

            for (let x = 0; x < tileMapRow.length; x++){
                const element = this._tileElements[y][x]

                if (!element || element === "none") continue

                element.remove()
            }
        }

        this._tileElements = []
    }

    createTileMapElements(){
        if (this._tileMap === NaN || this._tileMap.length === 0) return

        if (this._tileElements.length > 0) this.removeTileMapElements()

        for (let y = 0; y < this._tileMap.length; y++){
            const tileMapRow = this._tileMap[y]
            let tileMapElementRow = []

            for (let x = 0; x < tileMapRow.length; x++){
                const tileData = tileMapRow[x]
                if (tileData === 0){
                    tileMapElementRow.push("none")

                    continue
                }

                let tileElement = this._createTile(x, y)
                
                tileMapElementRow.push(tileElement)
            }

            this._tileElements.push(tileMapElementRow)
        }
    }

    createTileMapElementsStructure(){
        if (this._tileMap === NaN || this._tileMap.length === 0) return

        for (let y = 0; y < this._tileMap.length; y++){
            const tileMapRow = this._tileMap[y]
            let tileMapElementRow = []
            let tileMapElementChangedRow = []
            let tileMapVisualElementChangedRow = []

            for (let x = 0; x< tileMapRow.length; x++){
                tileMapElementRow.push("none")
                tileMapElementChangedRow.push("none")
                tileMapVisualElementChangedRow.push("none")
            }

            this._tileElements.push(tileMapElementRow)
            this._tileElementsChanged.push(tileMapElementChangedRow)
            this._visualTileElementsChanged.push(tileMapVisualElementChangedRow)
        }
    }

    getTileElement(x, y){
        if (this._tileMap === NaN || this._tileMap.length === 0) return
        if (this._tileElements === NaN || this._tileElements.length === 0) return
        if (x < 0 || y < 0) return
        if (this._tileMap.length <= y) return
        if (this._tileMap[y].length <= x) return

        return this._tileElements[y][x]
    }

    getTileData(x, y){
        if (this._tileMap === NaN || this._tileMap.length === 0) return
        if (this._tileMap.length <= y) return
        if (this._tileMap[y].length <= x) return

        return this._tileMap[y][x]
    }

    getTilePosition(x, y){
        if (this._tileMap === NaN || this._tileMap.length === 0) return
        if (this._tileMap.length <= y) return
        if (this._tileMap[y].length <= x) return

        return [x * this._scale + this._offset[0], y * this._scale + this._offset[1]]
    }

    getTileMaxHealth(y){
        if (y < 5) return 0
        if (y < 105) return 3
        if (y < 205) return 5
        if (y < 305) return 8
        if (y < 405) return 15
        if (y < 505) return 25
        if (y < 605) return 40
        if (y < 705) return 80
        if (y < 805) return 160
        if (y < 905) return 320
        if (y < 1005) return 640
        if (y < 1105) return 960
        if (y < 1205) return 1920
        if (y < 1305) return 3840
        if (y < 1405) return 7680
        if (y < 1500) return 15360

        return 30720
    }

    getTileHealth(x, y){
        return this._tileHealth[y][x]
    }

    setTileHealth(x, y, health){
        this._tileHealth[y][x] = health
    }

    setTile(x, y, tileData){
        if (this._tileMap === NaN || this._tileMap.length === 0) return
        if (this._tileMap.length <= y) return
        if (this._tileMap[y].length <= x) return

        const prevTileData = this._tileMap[y][x]

        this._tileMap[y][x] = tileData

        if (prevTileData === 0 || tileData === -1 || prevTileData === -1) return

        if (prevTileData === 0 && tileData !== 0){
            let tileElement = this._createTile(x, y)

            this._tileElements[y][x] = tileElement
        }
        else if (prevTileData !== 0){
            if (tileData === 0){
                let tileElement = this._tileElements[y][x]

                if (tileElement !== "none"){
                    this._tileElements[y][x] = "none"
                    tileElement.remove()
                }
            }
            else{
                let tileElement = this._tileElements[y][x]

                if (tileElement !== "none"){
                    this._tileElements[y][x] = "none"
                    tileElement.remove()
                }

                tileElement = this._createTile(x, y)

                this._tileElements[y][x] = tileElement
            }
        }
    }

    getTilesAround(tileMapPosition){
        let gridPosition = [tileMapPosition[0], tileMapPosition[1]]

        let tilePositions = [
            [gridPosition[0], gridPosition[1]],
            [gridPosition[0] + 1, gridPosition[1]],
            [gridPosition[0] - 1, gridPosition[1]],
            [gridPosition[0] + 1, gridPosition[1] + 1],
            [gridPosition[0] + 1, gridPosition[1] - 1],
            [gridPosition[0] - 1, gridPosition[1] + 1],
            [gridPosition[0] - 1, gridPosition[1] - 1],
            [gridPosition[0], gridPosition[1] + 1],
            [gridPosition[0], gridPosition[1] - 1]
        ]

        return tilePositions
    }

    removeFallingRocks(){
        this._droppingRocks = false

        let droppedRocks = document.querySelectorAll(".is-rock")
        droppedRocks.forEach(droppedRock => {
            droppedRock.classList.remove("is-rock")
        })
    }

    checkRock(x, y){
        let tilesToCheckPositions = this.getTilesAround([x, y])
        let rockPos = NaN

        for (let i = 0; i < tilesToCheckPositions.length; i++){
            let toCheckPos = tilesToCheckPositions[i]

            if (toCheckPos[0] < 0 || toCheckPos[0] > this.width - 1) continue
            if (toCheckPos[1] < 0 || toCheckPos[1] > this.height - 1) continue
            
            let tileData = this.getTileData(toCheckPos[0], toCheckPos[1])

            if (tileData !== 100) continue

            let underPos = [toCheckPos[0], toCheckPos[1] + 1]

            if (underPos[1] < 0 || underPos[1] > this.height - 1) continue

            let underTileData = this.getTileData(underPos[0], underPos[1])

            if (underTileData !== 0) continue

            this.setTile(toCheckPos[0], toCheckPos[1], 0)
            this.createVisualTile(toCheckPos[0], toCheckPos[1])
            this.setTile(underPos[0], underPos[1], 100)
            
            this._droppingRocks = true

            this._visualTileElements[underPos[1]][underPos[0]] = 0
            this._visualAbleToDraw[underPos[1]][underPos[0]] = 0

            let rockAroundTiles = this.getTilesAround([underPos[0], underPos[1] - 1])
            let rockAroundTiles2 = this.getTilesAround([underPos[0], underPos[1] + 1])

            tilesToCheckPositions.forEach(tilePosition => {
                this._tileMapRenderer.updateTileConnection(tilePosition[0], tilePosition[1])
            })
            rockAroundTiles.forEach(tilePosition => {
                this._tileMapRenderer.updateTileConnection(tilePosition[0], tilePosition[1])
            })
            rockAroundTiles2.forEach(tilePosition => {
                this._tileMapRenderer.updateTileConnection(tilePosition[0], tilePosition[1])
            })

            this._tileMapRenderer.renderTiles()

            rockPos = underPos
            this.checkRock(underPos[0], underPos[1])
            this.checkRock(underPos[0], underPos[1] - 2)
        }

        if (rockPos){
            let a = this.getTilesAround(rockPos)
            a.forEach(tilePosition => {
                this._tileMapRenderer.updateTileConnection(tilePosition[0], tilePosition[1])
            })
        }
    }

    get width(){
        return this._width
    }

    get height(){
        return this._height
    }

    get scale(){
        return this._scale
    }

    get offset(){
        return this._offset
    }

    get tileMap(){
        return this._tileMap
    }
}

export class TileMapRenderer{
    constructor(tileMap, playerData){
        this._tileMap = tileMap
        this._renderedTiles = []
        this._renderDistance = 20
        this._rowsLoaded = []
        
        this._playerData = playerData
    }

    _removeAllTiles(){
        for (let y = 0; y < this._tileMap._tileElements.length; y++){
            this._removeTileRow(y)
        }
    }

    _removeTileRow(y){
        let tileRow = this._tileMap._tileElements[y]

        for (let x = 0; x < tileRow.length; x++){
            let rowElement = tileRow[x]

            if (rowElement !== "none" && rowElement){
                //if (rowElement.style.zIndex !== "50"){
                rowElement.remove()
                this._tileMap._tileElements[y][x] = "none"
                //}
            }
        }

        let visualTileRow = this._tileMap._visualTileElements[y]

        for (let x = 0; x < visualTileRow.length; x++){
            let visualRowElement = visualTileRow[x]

            if (visualRowElement && visualRowElement !== 0){
                visualRowElement.remove()
                this._tileMap._visualTileElements[y][x] = 0
            }
        }
    }

    _createTileRow(y){
        let tileRow = this._tileMap._tileElements[y]

        for (let x = 0; x < tileRow.length; x++){
            let rowElement = tileRow[x]

            if (rowElement === "none" || !rowElement){
                let tileData = this._tileMap.getTileData(x, y)

                if (tileData !== 0){
                    let tileElement = this._tileMap._createTile(x, y)

                    this.changeTileBackground(tileElement, this._tileMap._tileElementsChanged[y][x], x, y, false)

                    this._tileMap._tileElements[y][x] = tileElement

                    let maxHealth = this._tileMap.getTileMaxHealth(y)
                    let health = this._tileMap.getTileHealth(x, y)

                    if (health < maxHealth && tileData !== 100 && tileData !== 102){
                        let s = (1 / maxHealth) * health
                        s = 1 - s
                        let imageURL = "Images/PixelArt/Broken1.png"
                        
                        let c = document.createElement("img")
                        c.classList.add("damage-image")
                        c.setAttribute("src", imageURL)
                        c.style.opacity = s
                        tileElement.append(c)
                    }
                }
            }
        }

        let visualTileRow = this._tileMap._visualTileElements[y]

        for (let x = 0; x < visualTileRow.length; x++){
            let visualRowElement = visualTileRow[x]

            if (visualRowElement === 0 || !visualRowElement){
                let canDraw = this._tileMap._visualAbleToDraw[y][x]

                if (canDraw === 1){
                    this._tileMap.createVisualTile(x, y)

                    this.changeTileBackground(this._tileMap._visualTileElements[y][x], this._tileMap._visualTileElementsChanged[y][x], x, y, true)
                }
            }
        }
    }

    renderTiles(){
        let playerGridPosition = this._playerData.getPlayerGridPosition(this._tileMap)
        let currentLoadedRows = []

        for (let y = 0; y < this._tileMap._tileMap.length; y++){
            if (y < playerGridPosition[1] - this._renderDistance || y > playerGridPosition[1] + this._renderDistance) continue

            currentLoadedRows.push(y)
            this._createTileRow(y)
        }

        for (let i = 0; i < this._rowsLoaded.length; i++){
            let y = this._rowsLoaded[i]

            if (currentLoadedRows.includes(y)) continue

            this._removeTileRow(y)
        }

        /*
        for (let i = 0; i < currentLoadedRows.length; i++){
            let y = currentLoadedRows[i]

            for (let x = 0; x < this._tileMap._tileMap[0].length; x++){
                this.updateTileConnection(x, y)
            }
        }
        */

        this._rowsLoaded = currentLoadedRows
    }

    getTileBackground(tileElement){
        if (!tileElement || tileElement === 0 || tileElement === "none") return

        for (let i = 0; i < tileElement.children.length; i++){
            let child = tileElement.children[i]

            if (!child.classList.contains("tile-background")) continue

            return child.getAttribute("src")
        }
    }

    changeTileBackground(tileElement, backgroundImageURL, x, y, isVisual){
        if (!tileElement || tileElement === 0 || tileElement === "none" || backgroundImageURL === "none"){
            if (this._tileMap.getTileData(x, y) !== 0 && backgroundImageURL !== "none"){
                if (y < this._tileMap.height && x < this._tileMap.width){
                    this._tileMap._tileElementsChanged[y][x] = backgroundImageURL
                }
            }

            if (tileElement === 0 && backgroundImageURL !== "none"){
                if (y < this._tileMap.height && x < this._tileMap.width){
                    if (this._tileMap._visualAbleToDraw[y][x] === 1){
                        this._tileMap._visualTileElementsChanged[y][x] = backgroundImageURL
                    }
                }
            }

            return
        }

        for (let i = 0; i < tileElement.children.length; i++){
            let child = tileElement.children[i]

            if (!child.classList.contains("tile-background")) continue

            child.setAttribute("src", backgroundImageURL)

            break
        }

        if (!isVisual){
            this._tileMap._tileElementsChanged[y][x] = backgroundImageURL
        }
        else{
            this._tileMap._visualTileElementsChanged[y][x] = backgroundImageURL
        }
    }

    updateTileConnection(x, y){
        let mainTile = this._tileMap.getTileElement(x, y)
        let gridPosition = [x, y]

        let tilePositions = [
            [gridPosition[0], gridPosition[1]],
            [gridPosition[0] + 1, gridPosition[1]],
            [gridPosition[0] - 1, gridPosition[1]],
            [gridPosition[0] + 1, gridPosition[1] + 1],
            [gridPosition[0] + 1, gridPosition[1] - 1],
            [gridPosition[0] - 1, gridPosition[1] + 1],
            [gridPosition[0] - 1, gridPosition[1] - 1],
            [gridPosition[0], gridPosition[1] + 1],
            [gridPosition[0], gridPosition[1] - 1]
        ]
        let toCheckTiles = []

        let i = 0
        tilePositions.forEach(tilePosition => {
            let tile = this._tileMap.getTileElement(tilePosition[0], tilePosition[1])

            if (tile && tile !== "none"){
                toCheckTiles.push(i)
            }

            let tileData = this._tileMap.getTileData(tilePosition[0], tilePosition[1])

            if (tileData !== 0){
                toCheckTiles.push(i)
            }

            i++
        })

        if (mainTile && mainTile !== "none" || this._tileMap.getTileData(x, y) !== 0){
            let rightCorner = !toCheckTiles.includes(8) && !toCheckTiles.includes(4) && !toCheckTiles.includes(1)
            let leftCorner = !toCheckTiles.includes(2) && !toCheckTiles.includes(6) && !toCheckTiles.includes(8)
            let bRightCorner = !toCheckTiles.includes(1) && !toCheckTiles.includes(7) && !toCheckTiles.includes(3)
            let bLeftCorner = !toCheckTiles.includes(2) && !toCheckTiles.includes(7) && !toCheckTiles.includes(5)

            if (rightCorner && leftCorner && bRightCorner && bLeftCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeAllCorners.png", x, y, false)
            }
            else if (rightCorner && leftCorner && bRightCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeULRDR.png", x, y, false)
            }
            else if (rightCorner && leftCorner && bLeftCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeULRDL.png", x, y, false)
            }
            else if (bLeftCorner && bRightCorner && leftCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeULDLR.png", x, y, false)
            }
            else if (bLeftCorner && bRightCorner && rightCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeURDLR.png", x, y, false)
            }
            else if (rightCorner && leftCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeULR.png", x, y, false)
            }
            else if (bRightCorner && bLeftCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeDLR.png", x, y, false)
            }
            else if (leftCorner && bLeftCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeULDL.png", x, y, false)
            }
            else if (rightCorner && bRightCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeURDR.png", x, y, false)
            }
            else if (leftCorner && bRightCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeULDR.png", x, y, false)
            }
            else if (rightCorner && bLeftCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeURDL.png", x, y, false)
            }   
            else if (leftCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeUL.png", x, y, false)
            }
            else if (rightCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeUR.png", x, y, false)
            }
            else if (bLeftCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeDL.png", x, y, false)
            }
            else if (bRightCorner){
                this.changeTileBackground(mainTile, "Images/PixelArt/TileEdgeDR.png", x, y, false)
            }
            else{
                this.changeTileBackground(mainTile, "Images/PixelArt/DefaultTile2.png", x, y, false)
            }

            if (mainTile && mainTile !== "none"){
                mainTile.style.zIndex = 50
            }
        }
        else {
            /*
            let rightCorner = toCheckTiles.includes(8) && toCheckTiles.includes(4) && toCheckTiles.includes(1)
            let leftCorner = toCheckTiles.includes(2) && toCheckTiles.includes(6) && toCheckTiles.includes(8)
            let bRightCorner = toCheckTiles.includes(1) && toCheckTiles.includes(7) && toCheckTiles.includes(3)
            let bLeftCorner = toCheckTiles.includes(2) && toCheckTiles.includes(7) && toCheckTiles.includes(5)
            */
            let rightCorner = toCheckTiles.includes(8) && toCheckTiles.includes(1)
            let leftCorner = toCheckTiles.includes(2) && toCheckTiles.includes(8)
            let bRightCorner = toCheckTiles.includes(1) && toCheckTiles.includes(7)
            let bLeftCorner = toCheckTiles.includes(2) && toCheckTiles.includes(7)

            let visualTile = this._tileMap._visualTileElements[y][x]

            if (rightCorner && leftCorner && bRightCorner && bLeftCorner){
                this.changeTileBackground(visualTile, "Images/PixelArt/EmptyEdgeAll.png", x, y, true)
            }
            else if (rightCorner && leftCorner){
                this.changeTileBackground(visualTile, "Images/PixelArt/EmptyEdgeULR.png", x, y, true)
            }
            else if (bRightCorner && bLeftCorner){
                this.changeTileBackground(visualTile, "Images/PixelArt/EmptyEdgeDLR.png", x, y, true)
            }
            else if (rightCorner && bRightCorner){
                this.changeTileBackground(visualTile, "Images/PixelArt/EmptyEdgeURDR.png", x, y, true)
            }
            else if (leftCorner && bLeftCorner){
                this.changeTileBackground(visualTile, "Images/PixelArt/EmptyEdgeULDL.png", x, y, true)
            }
            else if (leftCorner){
                this.changeTileBackground(visualTile, "Images/PixelArt/EmptyEdgeUL.png", x, y, true)
            }
            else if (rightCorner){
                this.changeTileBackground(visualTile, "Images/PixelArt/EmptyEdgeUR.png", x, y, true)
            }
            else if (bLeftCorner){
                this.changeTileBackground(visualTile, "Images/PixelArt/EmptyEdgeDL.png", x, y, true)
            }
            else if (bRightCorner){
                this.changeTileBackground(visualTile, "Images/PixelArt/EmptyEdgeDR.png", x, y, true)
            }
            else{
                this.changeTileBackground(visualTile, "Images/PixelArt/BackgroundTile.png", x, y, true)
            }
        }
    }
}