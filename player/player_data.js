import { StringConverter } from "../utils/core/string_converter.js"
import { Collision } from "../utils/collision.js"

const gameHolderElement = document.querySelector("#game-holder")
const liftStat = document.querySelector("#lift-stat")
const liftStatText = document.querySelector("#lift-stat-text")

export class PlayerData{
    constructor(){
        this._grounded = false,
        this._gravity = 9.81 * 1.75,
        this._gravityForce = 0,
        this._speed = 3.75
        this._horizontal = 0
        this._leftHold = false
        this._rightHold = false
        this._groundTileMap = []
        this._playerElement = NaN
        this._playerImg = NaN
        this._playerTool = NaN
        this._sideCollision = 0
        this._upperCollision = false
        this._mouseHold = false
        this._mineCounter = 0

        this._walkAnimCounter = 0
        this._walkAnimKeyframes = ["Images/PixelArt/PlayerRight0.png", "Images/PixelArt/PlayerRight1.png"]
        this._walkAnimKeyframeIndex = 0

        this._allowMovement = true
        this._movementDebug = 5
        this._groundDebug = 0
        this._inLift = false
        this._upHolded = false
        this._downHolded = false
        this._curLiftMax = 0
        this._curLiftMin = 0
        this._liftRemain = 0
        this._fallDuration = 0
        this._liftTP = false

        this._grapplingHook = false
        this._grapplePoint = [0, 0]
        this._grappleGridPoint = [0, 0]
        this._grappleMaxLength = 4
        this._grappleRope = NaN
        this._grappleImage = "GrapplingHookRope.png"
        this._grapplePointImage = "GrapplingHook.png"
        this._grapplePointDecoration = NaN

        this._tileMap = NaN
        this._gamePlayerStats = NaN
        this._backpack = NaN

        this._loadExit = false
        this._loadExitNum = 0
        
        this._createPlayerElement()
    }

    _createPlayerElement(){
        let playerElement = document.createElement("div")
        playerElement.setAttribute("id", "player")
        playerElement.style.position = "absolute"
        playerElement.style.left = "0px"
        playerElement.style.top = "0px"

        let playerImage = document.createElement("img")
        playerImage.setAttribute("src", "Images/PixelArt/PlayerIdle.png")
        playerImage.setAttribute("id", "player-image")
        playerElement.append(playerImage)

        let playerTool = document.createElement("img")
        playerTool.setAttribute("src", "Images/PixelArt/SilverPickaxe.png")
        playerTool.setAttribute("id", "player-tool")
        playerElement.append(playerTool)

        document.querySelector("#game-holder").append(playerElement)

        this._playerElement = playerElement
        this._playerImg = playerImage
        this._playerTool = playerTool
    }

    _calcHorizontalValue(){
        if (this._leftHold === this._rightHold){
            this._horizontal = 0
        }
        else if (this._leftHold){
            this._horizontal = -1
        }
        else{
            this._horizontal = 1
        }
    }

    _getTileMapCloseTileElements(tileMap){
        if (!tileMap || tileMap.length === 0) return []

        let gridPosition = this.getPlayerGridPosition(tileMap)

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

        tilePositions.forEach(tilePosition => {
            let tile = tileMap.getTileElement(tilePosition[0], tilePosition[1])

            if (tile && tile !== "none"){
                if (tileMap.getTileData(tilePosition[0], tilePosition[1]) !== 101){
                    toCheckTiles.push(tile)
                }
            }
        })

        return toCheckTiles
    }

    _calcGrounded(tileMap){
        if (!tileMap || tileMap.length === 0) return false

        let toCheckTiles = this._getTileMapCloseTileElements(tileMap)
        let position = this.getPlayerPosition()
        let plrGridPosition = this.getPlayerGridPosition(tileMap)
        
        const playerElementComputedStyle = window.getComputedStyle(this._playerElement)

        let isGrounded = false
        let inCart = false
        let curCartMax = 0
        let curCartMin = 0
        let cartRemain = 0

        let playerLeft = StringConverter.floatFromPixelString(playerElementComputedStyle.left)
        let playerRight = playerLeft + StringConverter.floatFromPixelString(playerElementComputedStyle.width)
        let playerTop = StringConverter.floatFromPixelString(playerElementComputedStyle.top)
        let playerBottom = playerTop + StringConverter.floatFromPixelString(playerElementComputedStyle.height)

        toCheckTiles.forEach(tile => {
            const tileCollision = Collision.checkCollision(this._playerElement, tile)
            const tileComputedStyle = window.getComputedStyle(tile)
            let tileLeft = StringConverter.floatFromPixelString(tileComputedStyle.left)
            let tileRight = tileLeft + StringConverter.floatFromPixelString(tileComputedStyle.width)
            let tileTop = StringConverter.floatFromPixelString(tileComputedStyle.top)
            let tileBottom = tileTop + StringConverter.floatFromPixelString(tileComputedStyle.height)

            if (!isGrounded){
                if (playerBottom >= tileTop && tileCollision && playerTop < tileTop - 20){
                    if (playerLeft > tileLeft + this._movementDebug && playerLeft < tileRight - this._movementDebug || playerRight > tileLeft + this._movementDebug && playerRight < tileRight - this._movementDebug){
                        isGrounded = true

                        this.setPlayerPosition([position[0], StringConverter.floatFromPixelString(tileComputedStyle.top) - StringConverter.floatFromPixelString(playerElementComputedStyle.height)])
                    }
                }
            }

            if (tileCollision){
                if (playerLeft >= tileLeft + 10 && playerLeft <= tileRight - 10 || playerRight <= tileRight - 10 && playerRight >= tileLeft + 10){
                    if (playerTop + StringConverter.floatFromPixelString(playerElementComputedStyle.height)/2 >= tileTop){
                        if (tile.classList.contains("is-rock")){
                            this.rockHit()   
                        }
                    } 
                }
            }
        })

        for (let i = 0; i < tileMap._liftCarts.length; i++){
            let pos = tileMap._liftCarts[i][0]

            if (plrGridPosition[0] === pos[0] && plrGridPosition[1] === pos[1]){
                inCart = true

                curCartMax = tileMap._liftCarts[i][3] * tileMap._scale
                curCartMin = (tileMap._liftCarts[i][3] + tileMap._liftCarts[i][4]) * tileMap._scale

                cartRemain = tileMap._liftCarts[i][5] - tileMap._liftCarts[i][4] + 1
            }
        }

        if (playerTop <= 325 && playerTop >= 324 || this._groundDebug < 325 && playerTop > 325){
            if (!this._loadExit){
                isGrounded = true
                this.setPlayerPosition([position[0], 324])
            }
        }

        let outpostAlphaMod = 500 * tileMap._scale
        if (playerTop <= outpostAlphaMod + 325 && playerTop >= outpostAlphaMod + 324 || this._groundDebug < outpostAlphaMod + 325 && playerTop > outpostAlphaMod + 325){
            if (!this._loadExit){
                isGrounded = true
                this.setPlayerPosition([position[0], outpostAlphaMod + 324])
            }
        }

        let outpostBetaMod = 1000 * tileMap._scale
        if (playerTop <= outpostBetaMod + 325 && playerTop >= outpostBetaMod + 324 || this._groundDebug < outpostBetaMod + 325 && playerTop > outpostBetaMod + 325){
            if (!this._loadExit){
                isGrounded = true
                this.setPlayerPosition([position[0], outpostBetaMod + 324])
            }
        }

        this._groundDebug = playerTop
        this._inLift = inCart
        this._curLiftMax = curCartMax
        this._curLiftMin = curCartMin
        this._liftRemain = cartRemain

        return isGrounded
    }

    _calcUpperCollision(tileMap){
        if (!tileMap || tileMap.length === 0) return false

        let toCheckTiles = this._getTileMapCloseTileElements(tileMap)
        let position = this.getPlayerPosition()
        
        const playerElementComputedStyle = window.getComputedStyle(this._playerElement)

        let upperCollision = false

        toCheckTiles.forEach(tile => {
            if (!upperCollision){
                const tileCollision = Collision.checkCollision(this._playerElement, tile)
                const tileComputedStyle = window.getComputedStyle(tile)
    
                let playerLeft = StringConverter.floatFromPixelString(playerElementComputedStyle.left)
                let playerRight = playerLeft + StringConverter.floatFromPixelString(playerElementComputedStyle.width)
                let playerTop = StringConverter.floatFromPixelString(playerElementComputedStyle.top)
                let playerBottom = playerTop + StringConverter.floatFromPixelString(playerElementComputedStyle.height)
                let tileLeft = StringConverter.floatFromPixelString(tileComputedStyle.left)
                let tileRight = tileLeft + StringConverter.floatFromPixelString(tileComputedStyle.width)
                let tileTop = StringConverter.floatFromPixelString(tileComputedStyle.top)
                let tileBottom = tileTop + StringConverter.floatFromPixelString(tileComputedStyle.height)
    
                if (playerTop <= tileBottom + 5 && playerBottom > tileBottom + 50){
                    if (playerLeft > tileLeft && playerLeft < tileRight || playerRight > tileLeft && playerRight < tileRight){
                        upperCollision = true

                        this._gravityForce = this._gravity
                        this.setPlayerPosition([position[0], StringConverter.floatFromPixelString(tileComputedStyle.top) + StringConverter.floatFromPixelString(tileComputedStyle.height) + 5])
                    }
                }
            }
        })

        return upperCollision
    }

    _calcSideMovementCollisions(tileMap){
        let sideCollision = 0

        let toCheckTiles = this._getTileMapCloseTileElements(tileMap)
        let position = this.getPlayerPosition()

        const playerElementComputedStyle = window.getComputedStyle(this._playerElement)

        let isCollision = false
        toCheckTiles.forEach(tile => {
            if (!isCollision){
                const tileCollision = Collision.checkCollision(this._playerElement, tile)
                const tileComputedStyle = window.getComputedStyle(tile)

                let playerLeft = StringConverter.floatFromPixelString(playerElementComputedStyle.left)
                let playerRight = playerLeft + StringConverter.floatFromPixelString(playerElementComputedStyle.width)
                let playerTop = StringConverter.floatFromPixelString(playerElementComputedStyle.top)
                let playerBottom = playerTop + StringConverter.floatFromPixelString(playerElementComputedStyle.height)
                let tileLeft = StringConverter.floatFromPixelString(tileComputedStyle.left)
                let tileRight = tileLeft + StringConverter.floatFromPixelString(tileComputedStyle.width)
                let tileTop = StringConverter.floatFromPixelString(tileComputedStyle.top)
                let tileBottom = tileTop + StringConverter.floatFromPixelString(tileComputedStyle.height)

                if (playerRight >= tileLeft && playerLeft < tileLeft){
                    if (playerTop > tileTop && playerTop < tileBottom || playerBottom < tileBottom && playerBottom > tileTop){
                        isCollision = true
                        sideCollision = 1

                        this.setPlayerPosition([tileLeft - StringConverter.floatFromPixelString(playerElementComputedStyle.width), position[1]])
                    }
                }
                else if (playerLeft <= tileRight && playerRight > tileLeft){
                    if (playerTop > tileTop && playerTop < tileBottom || playerBottom < tileBottom && playerBottom > tileTop){
                        isCollision = true
                        sideCollision = -1

                        this.setPlayerPosition([tileRight, position[1]])
                    }
                }
            }
        })

        let playerWidth = StringConverter.floatFromPixelString(playerElementComputedStyle.width)

        if (position[0] <= 0){
            this.setPlayerPosition([0, position[1]])
        }
        else if (position[0] + playerWidth >= 1910){
            this.setPlayerPosition([1910 - playerWidth, position[1]])
        }

        return sideCollision
    }

    _handleGravity(deltaTime){
        if (!this._playerElement) return

        if (this._grounded){
            this._gravityForce = 0
        }
        else{
            this._gravityForce += this._gravity * deltaTime
        }

        if (this._gravityForce > 2000){
            this._gravityForce = 2000
        }
    
        let position = this.getPlayerPosition()
        const playerElementComputedStyle = window.getComputedStyle(this._playerElement)
    
        if (this._inLift){
            this._gravityForce = 0
            this.checkFallHeight(this._fallDuration)
            if (this._liftTP){
                this._liftTP = false
                return
            }
            this._fallDuration = 0

            let newHeightPos = position[1]

            if (this._upHolded && !this._downHolded){
                newHeightPos = position[1] - 300 * deltaTime / 100
            }
            else if (this._downHolded && !this._upHolded){
                newHeightPos = position[1] + 300 * deltaTime / 100
            }
            
            if (newHeightPos < this._curLiftMax + 25){
                newHeightPos = this._curLiftMax + 25
            }

            if (this._curLiftMin + 25 - this._tileMap._scale <= this._curLiftMax){
                this._curLiftMin = this._curLiftMax + this._tileMap._scale
            }
            if (newHeightPos > this._curLiftMin + 25 - this._tileMap._scale){
                newHeightPos = this._curLiftMin + 25 - this._tileMap._scale
            }

            this._playerElement.style.top = `${newHeightPos}px`

            this._tileMap.updateLiftCarts()

            if (this._liftRemain > 0){
                liftStatText.innerText = "Length remaining: " + this._liftRemain.toString()
                liftStat.style.visibility = "visible"
            }
            else{
                liftStat.style.visibility = "hidden"
            }
        }
        else{
            liftStat.style.visibility = "hidden"

            if (this._grapplingHook){
                this._fallDuration = 0
                this._gravityForce = 0

                let goalHeight = this._grapplePoint[1] + 15
                let newHeight = position[1] - 500 * deltaTime / 100
                if (newHeight < goalHeight) newHeight = goalHeight

                this._playerElement.style.top = `${newHeight}px`

                this._handleGrapplingHookRope()

                let upperTileData = this._tileMap.getTileData(this._grappleGridPoint[0], this._grappleGridPoint[1])
                if (upperTileData === 0){
                    this.grapplingHookEnd()
                }
                this._tileMap.updateLiftCarts()
            }
            else{
                if (!this._grounded){
                    this._fallDuration++
                }
                else{
                    this.checkFallHeight(this._fallDuration)
                    this._fallDuration = 0
                }
            }
        }

        if (this._gravityForce !== 0){
            this._playerElement.style.top = `${position[1] + this._gravityForce * deltaTime / 100}px`
        }
        else{
            //let playerStyleTop = Math.round(StringConverter.floatFromPixelString(playerElementComputedStyle.top) / 100) * 100 + 25
            //this._playerElement.style.top = `${playerStyleTop}px`
        }  

        if (this._gravityForce !== 0){
            this._tileMap.updateLiftCarts()
        }
    }

    _handleMovement(deltaTime){
        let playerPosition = this.getPlayerPosition()

        const playerElementComputedStyle = window.getComputedStyle(this._playerElement)
    
        let playerMove = this._speed * deltaTime * this._horizontal
        if (this._sideCollision === 1 && playerMove > 0){
            playerMove = 0
        }
        else if (this._sideCollision === -1 && playerMove < 0){
            playerMove = 0
        }

        let move = playerPosition[0] + playerMove

        if (this._grapplingHook){
            if (move < this._grapplePoint[0] - 35){
                move = this._grapplePoint[0] - 35
            }
            if (move > this._grapplePoint[0] - 15){
                move = this._grapplePoint[0] - 15
            }
        }
        
        if (!this._allowMovement) return

        this._playerElement.style.left = `${move}px`
    }

    _handleGrapplingHookRope(){
        if (!this._grappleRope){
            let grappleRope = document.createElement("div")
            grappleRope.style.position = "absolute"
            grappleRope.style.width = "75px"
            grappleRope.style.height = "75px"
            grappleRope.style.backgroundImage = `url("Images/PixelArt/${this._grappleImage}")`
            grappleRope.style.backgroundSize = "75px auto"
            grappleRope.style.backgroundPosition = "top center"
            grappleRope.style.zIndex = "97"
            grappleRope.style.imageRendering = "pixelated"
            gameHolderElement.append(grappleRope)
            this._grappleRope = grappleRope

            let grapplePointDecoration = document.createElement("img")
            grapplePointDecoration.setAttribute("src", `Images/PixelArt/${this._grapplePointImage}`)
            grapplePointDecoration.style.width = "50px"
            grapplePointDecoration.style.height = "50px"
            grapplePointDecoration.style.zIndex = "98"
            grapplePointDecoration.style.imageRendering = "pixelated"
            grapplePointDecoration.style.position = "absolute"
            grapplePointDecoration.style.left = `${this._grapplePoint[0] - 22.5}px`
            grapplePointDecoration.style.top = `${this._grapplePoint[1] - 25}px`
            gameHolderElement.append(grapplePointDecoration)
            this._grapplePointDecoration = grapplePointDecoration
        }

        let playerPosition = this.getPlayerPosition()
        playerPosition = [playerPosition[0] + 25, playerPosition[1] + 25]

        let centerPoint = [
            (this._grapplePoint[0] + playerPosition[0]) / 2,
            (this._grapplePoint[1] + playerPosition[1]) / 2
        ]

        let distance = Math.sqrt(Math.pow(Math.abs(this._grapplePoint[0] - playerPosition[0]), 2) + Math.pow(Math.abs(this._grapplePoint[1] - playerPosition[1]), 2))

        let angle = Math.atan2(playerPosition[1] - this._grapplePoint[1], playerPosition[0] - this._grapplePoint[0])
        angle *= (180/Math.PI)
        angle += 90

        this._grappleRope.style.height = distance + "px"
        this._grappleRope.style.left = `${centerPoint[0] - 75/2}px`
        this._grappleRope.style.top = `${centerPoint[1] - distance/2}px`
        this._grappleRope.style.rotate = angle + "deg"

        this._grapplePointDecoration.style.rotate = (angle + 45 + 180).toString() + "deg"
    }

    grapplingHookEnd(){
        if (!this._grapplingHook) return

        this._grapplingHook = false
        
        if (this._grappleRope){
            this._grappleRope.remove()
            this._grappleRope = NaN
        }
        if (this._grapplePointDecoration){
            this._grapplePointDecoration.remove()
            this._grapplePointDecoration = NaN
        }
    }

    grapplingHookStart(){
        let playerGridPosition = this.getPlayerGridPosition(this._tileMap)

        if (playerGridPosition[1] < 5) return
        if (Math.abs(playerGridPosition[1] - 502) <= 2) return
        if (Math.abs(playerGridPosition[1] - 1002) <= 2) return
        if (this._inLift) return

        if (this._gamePlayerStats.grapplingHookIndex <= 0) return
        let grapplingHookData = this._gamePlayerStats.getGrapplingHookData(this._gamePlayerStats.grapplingHookIndex)
        
        this._grappleMaxLength = grapplingHookData[0]
        this._grappleImage = grapplingHookData[2]
        this._grapplePointImage = grapplingHookData[1]

        let checkHeight = 0
        let grapplePointFound = false
        while (checkHeight < this._grappleMaxLength){
            checkHeight++

            let height = playerGridPosition[1] - checkHeight
            if (height < 5) continue
            if (Math.abs(height - 500) <= 2) continue
            if (Math.abs(height - 1000) <= 2) continue

            let tileData = this._tileMap.getTileData(playerGridPosition[0], height)
            if (tileData === 0 || tileData === 101) continue

            grapplePointFound = true
            let tilePosition = this._tileMap.getTilePosition(playerGridPosition[0], height)
            this._grapplePoint = [tilePosition[0] + this._tileMap.scale/2, tilePosition[1] + this._tileMap.scale]
            this._grappleGridPoint = [playerGridPosition[0], height]
            break
        }
        if (!grapplePointFound) return

        this._grapplingHook = true
    }

    rescueToSurface(){
        let playerGridPosition = this.getPlayerGridPosition(this._tileMap)
        let playerDepth = playerGridPosition[1] - 4
        if (playerDepth < 0) playerDepth = 0
    
        if (playerDepth > 500){
            if (playerDepth > 1000){
                this.setPlayerPosition([0, 1004 * this._tileMap._scale])
            }
            else{
                this.setPlayerPosition([0, 504 * this._tileMap._scale])
            }
        }
        else{
            this.setPlayerPosition([0, 4 * this._tileMap._scale])
        }
    
        this._backpack.clearBackpack()
    }

    checkFallHeight(height){
        if (height > 70){
            if (this._inLift){
                this._liftTP = true
            }

            this.rescueToSurface()
        }
    }

    rockHit(){
        this.rescueToSurface()
    }

    dropDown(){
        const playerElementComputedStyle = window.getComputedStyle(this._playerElement)
        let position = this.getPlayerPosition()
        let gridPosition = this.getPlayerGridPosition(this._tileMap)
        let playerTop = StringConverter.floatFromPixelString(playerElementComputedStyle.top)
        let playerLeft = StringConverter.floatFromPixelString(playerElementComputedStyle.left)

        let outpostAlphaMod = 500 * this._tileMap._scale
        let outpostBetaMod = 1000 * this._tileMap._scale

        if (playerTop <= 325 && playerTop >= 324 || playerTop <= outpostAlphaMod + 325 && playerTop >= outpostAlphaMod + 324 || playerTop <= outpostBetaMod + 325 && playerTop >= outpostBetaMod + 324){
            let tileData = this._tileMap.getTileData(gridPosition[0], gridPosition[1] + 1)

            let left = playerLeft - (this._tileMap._scale * gridPosition[0])

            let alpha = left < -44 || this._tileMap.getTileData(gridPosition[0] + 1, gridPosition[1] + 1) == 0
            let beta = left > -80 || this._tileMap.getTileData(gridPosition[0] - 1, gridPosition[1] + 1) == 0

            if (tileData === 0 && alpha && beta){
                if (playerTop <= 325 && playerTop >= 324){
                    this._groundDebug = 328
                    this.setPlayerPosition([position[0], 328])
                }
                else if (playerTop <= outpostAlphaMod + 325 && playerTop >= outpostAlphaMod + 324){
                    this._groundDebug = outpostAlphaMod + 328
                    this.setPlayerPosition([position[0], outpostAlphaMod + 328])
                }
                else{
                    this._groundDebug = outpostBetaMod + 328
                    this.setPlayerPosition([position[0], outpostBetaMod + 328])
                }
            }
        }
    }

    animateElement(deltaTime, isPickaxeAnim){
        if (!this._playerElement) return

        if (this.horizontal !== 0 && this._allowMovement){
            if (this._walkAnimCounter <= 0){
                this._playerImg.setAttribute("src", this._walkAnimKeyframes[this._walkAnimKeyframeIndex])

                if (this._walkAnimKeyframeIndex + 1 > this._walkAnimKeyframes.length - 1){
                    this._walkAnimKeyframeIndex = 0
                }
                else{
                    this._walkAnimKeyframeIndex += 1
                }

                this._walkAnimCounter = 20
            }

            if (this.horizontal < 0){
                this._playerImg.style.transform = "scaleX(-1)"
            }
            else{
                this._playerImg.style.transform = "scaleX(1)"
            }

            this._walkAnimCounter -= deltaTime
            this._playerTool.style.visibility = "hidden"
        }
        else{
            this._walkAnimCounter = 0
            this._walkAnimKeyframeIndex = 0

            this._playerImg.setAttribute("src", "Images/PixelArt/PlayerRight0.png")
            this._playerTool.style.visibility = "visible"

            if (this._playerImg.style.transform === "scaleX(-1)"){
                this._playerTool.style.transform = "scaleY(-1)"
                this._playerTool.style.left = "40%"

                if (!isPickaxeAnim){
                    this._playerTool.style.rotate = "105deg"
                }
            }
            else{
                this._playerTool.style.transform = "scaleY(1)"
                this._playerTool.style.left = "60%"

                if (!isPickaxeAnim){
                    this._playerTool.style.rotate = "75deg"
                }
            }
        }
    }

    jump(){
        if (!this._grounded || !this._allowMovement) return

        this._grounded = false
        this._gravityForce = -720
    
        let playerPosition = this.getPlayerPosition()
        const playerElementComputedStyle = window.getComputedStyle(this._playerElement)
    
        this._playerElement.style.top = `${playerPosition[1] - 5}px`
    }

    handleUpdate(deltaTime){
        this._grounded = this._calcGrounded(this._groundTileMap)
        this._sideCollision = this._calcSideMovementCollisions(this._groundTileMap)
        this._upperCollision = this._calcUpperCollision(this._groundTileMap)

        if (this._loadExitNum > 0){
            this._loadExitNum--
        }
        else{
            this._loadExit = false
        }

        this._handleGravity(deltaTime)
        this._handleMovement(deltaTime)
    }

    getPlayerGridPosition(tileMap){
        let position = this.getPlayerPosition()
        let gridPosition = [(position[0] - tileMap.offset[0]) / tileMap.scale, (position[1] - tileMap.offset[1]) / tileMap.scale]
        gridPosition = [Math.round(gridPosition[0]), Math.round(gridPosition[1])]

        return gridPosition
    }

    getPlayerPosition(){
        if (!this._playerElement) return [0, 0]

        const playerElementComputedStyle = window.getComputedStyle(this._playerElement)

        let leftPlayerPosition = StringConverter.floatFromPixelString(playerElementComputedStyle.left)
        let topPlayerPosition = StringConverter.floatFromPixelString(playerElementComputedStyle.top)

        return [leftPlayerPosition, topPlayerPosition]
    }

    setPlayerPosition(position){
        if (!this._playerElement) return

        this._playerElement.style.left = `${position[0]}px`
        this._playerElement.style.top = `${position[1]}px`
    }

    loadPlayerPosition(left, top){
        this._playerElement.style.left = left
        this._playerElement.style.top = (StringConverter.floatFromPixelString(top) + 1).toString() + "px"

        this._loadExitNum = 5
    }

    setGroundTileMap(tileMap){
        this._groundTileMap = tileMap
    }

    set grounded(isGrounded){
        this._grounded = isGrounded
    }

    set gravityForce(newGravityForce){
        this._gravityForce = newGravityForce
    }

    set leftHold(holdState){
        this._leftHold = holdState
        this._calcHorizontalValue()
    }

    set rightHold(holdState){
        this._rightHold = holdState
        this._calcHorizontalValue()
    }

    get grounded(){
        return this._grounded
    }
    
    get gravityForce(){
        return this._gravityForce
    }

    get gravity(){
        return this._gravity
    }

    get speed(){
        return this._speed
    }

    get horizontal(){
        return this._horizontal
    }

    get mouseHold(){
        return this._mouseHold
    }

    set mouseHold(holdState){
        this._mouseHold = holdState
    }

    get mineCounter(){
        return this._mineCounter
    }

    set mineCounter(counter){
        this._mineCounter = counter
    }

    get allowMovement(){
        return this._allowMovement
    }

    set allowMovement(state){
        this._allowMovement = state
    }
}