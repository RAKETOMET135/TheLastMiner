import { StringConverter } from "../utils/core/string_converter.js"

const grapplingHookInfo = document.querySelector("#grappling-hook-info")

//Things to save:
/*
    1) gamePlayerStats
    2) darknessEffect (maxSize, curSize)
    3) ores in backpack
    4) player position
    5) tile map tiles
    6) tile map tile healths
*/


export class SavingSystem{
    static saveData(gamePlayerStats, darknessEffect, backpack, playerData, tileMap){
        let plrData = {
            money: gamePlayerStats._money,
            pickaxeIndex: gamePlayerStats._pickaxeIndex,
            oilLampIndex: gamePlayerStats._oilLampIndex,
            backpackIndex: gamePlayerStats._backpackIndex,
            liftCount: gamePlayerStats._liftCount,
            totalLifts: gamePlayerStats._totalLifts,
            liftCountMetal: gamePlayerStats._liftCountMetal,
            totalLiftsMetal: gamePlayerStats._totalLiftsMetal,
            tBombs: gamePlayerStats._tBombs,
            totalTBombs: gamePlayerStats._totalTBombs,
            lineBombs: gamePlayerStats._lineBombs,
            totalLineBombs: gamePlayerStats._totalLineBombs,
            shaftBombs: gamePlayerStats._shaftBombs,
            totalShaftBombs: gamePlayerStats._totalShaftBombs,
            grapplingHookIndex: gamePlayerStats._grapplingHookIndex,
            drillIndex: gamePlayerStats._drillIndex,
            drillCapacity: gamePlayerStats._drillCapacity,
            drillFuel: gamePlayerStats._drillFuel,
            drillFuelTankIndex: gamePlayerStats._drillFuelTankIndex,
            equippedToolType: gamePlayerStats._equippedToolType,
            darknessEffectCurSize: darknessEffect._curSize,
            darknessEffectMaxSize: darknessEffect._maxSize,
            backpackItemNames: backpack.getAllItemsNames(),
            playerLeft: playerData._playerElement.style.left,
            playerTop: playerData._playerElement.style.top
        }
        let plrDataJSON = JSON.stringify(plrData)

        window.localStorage.setItem("miner_plr", plrDataJSON)
        
        let tileMapStrings = this.tileMapStringify(tileMap)

        let liftObjects = []
        tileMap._liftObjects.forEach(liftObject => {
            if (liftObject[1] === 0){
                let object = {
                    position: liftObject[0],
                    typeId: liftObject[1],
                    type: liftObject[3]
                }
    
                liftObjects.push(object)
            }
        })

        let worldData = {
            tileMapData: tileMapStrings[0],
            tileMapVisualData: tileMapStrings[1],
            tileHealth: tileMapStrings[2],
            liftObjects: liftObjects
        }
        let worldDataJSON = JSON.stringify(worldData)
        
        window.localStorage.setItem("miner_world", worldDataJSON)
    }

    static tileMapStringify(tileMap){
        let tilesData = tileMap._tileMap
        let tilesDataVisual = tileMap._visualAbleToDraw
        let tilesHealth = tileMap._tileHealth
        let width = tileMap.width
        let height = tileMap.height

        let tileMapString = `${width}:${height};`
        let tileMapStringVisual = `${width}:${height};`
        let tileHealthString = `${width}:${height};`

        for (let y = 0; y < height; y++){
            for (let x = 0; x < width; x++){
                tileMapString += tilesData[y][x].toString() + "."
            }
        }

        for (let y = 0; y < height; y++){
            for (let x = 0; x < width; x++){
                let e = tilesDataVisual[y][x]

                if (e && e !== 0){
                    e = 1
                }

                tileMapStringVisual += e.toString() + "."
            }
        }

        for (let y = 0; y < height; y++){
            for (let x = 0; x < width; x++){
                tileHealthString += tilesHealth[y][x].toString() + "."
            }
        }

        return [tileMapString, tileMapStringVisual, tileHealthString]   
    }

    static tileMapFromString(tileMapStrings){
        let startIndex = 0
        let char = tileMapStrings[0][startIndex]
        while (char !== ":"){
            startIndex++
            char = tileMapStrings[0][startIndex]
        }
        let width = parseInt(tileMapStrings[0].slice(0, startIndex))
        let prevStartIndex = startIndex
        while (char !== ";"){
            startIndex++
            char = tileMapStrings[0][startIndex]
        }
        let height = parseInt(prevStartIndex + 1, startIndex)
        startIndex++

        let tileDataMap = tileMapStrings[0]
        let number = ""
        let array = []
        let tileDataMapFinal = []
        for (let i = startIndex; i < tileDataMap.length; i++){
            let c = tileDataMap[i]

            if (c === "."){
                array.push(parseInt(number))
                number = ""

                if (array.length === width){
                    let fArray = []
                    array.forEach(a => {
                        fArray.push(a)
                    })

                    tileDataMapFinal.push(fArray)

                    array = []
                }
            }
            else{
                number += c
            }
        }

        let tileDataVisualMap = tileMapStrings[1]
        number = ""
        array = []
        let tileDataVisualMapFinal = []
        for (let i = startIndex; i < tileDataVisualMap.length; i++){
            let c = tileDataVisualMap[i]

            if (c === "."){
                array.push(parseInt(number))
                number = ""

                if (array.length === width){
                    let fArray = []
                    array.forEach(a => {
                        fArray.push(a)
                    })

                    tileDataVisualMapFinal.push(fArray)

                    array = []
                }
            }
            else{
                number += c
            }
        }

        let tileHealthMap = tileMapStrings[2]
        number = ""
        array = []
        let tileHealthFinal = []
        for (let i = startIndex; i < tileHealthMap.length; i++){
            let c = tileHealthMap[i]

            if (c === "."){
                array.push(parseInt(number))
                number = ""

                if (array.length === width){
                    let fArray = []
                    array.forEach(a => {
                        fArray.push(a)
                    })

                    tileHealthFinal.push(fArray)

                    array = []
                }
            }
            else{
                number += c
            }
        }

        return [tileDataMapFinal, tileDataVisualMapFinal, tileHealthFinal]
    }

    static loadData(gamePlayerStats, darknessEffect, backpack, playerData, tileMap, tileMapRenderer){
        let plrDataJSON = window.localStorage.getItem("miner_plr")
        let worldDataJSON = window.localStorage.getItem("miner_world")

        if (plrDataJSON === null || worldDataJSON === null) return

        let plrData = JSON.parse(plrDataJSON)
        let worldData = JSON.parse(worldDataJSON)

        gamePlayerStats._money = plrData.money
        gamePlayerStats._pickaxeIndex = plrData.pickaxeIndex
        gamePlayerStats._oilLampIndex = plrData.oilLampIndex
        gamePlayerStats._backpackIndex = plrData.backpackIndex
        gamePlayerStats._liftCount = plrData.liftCount
        gamePlayerStats._totalLifts = plrData.totalLifts
        gamePlayerStats._liftCountMetal = plrData.liftCountMetal
        gamePlayerStats._totalLiftsMetal = plrData.totalLiftsMetal
        gamePlayerStats._tBombs = plrData.tBombs
        gamePlayerStats._totalTBombs = plrData.totalTBombs
        gamePlayerStats._lineBombs = plrData.lineBombs
        gamePlayerStats._totalLineBombs = plrData.totalLineBombs
        gamePlayerStats._shaftBombs = plrData.shaftBombs
        gamePlayerStats._totalShaftBombs = plrData.totalShaftBombs
        gamePlayerStats._grapplingHookIndex = plrData.grapplingHookIndex
        gamePlayerStats._drillIndex = plrData.drillIndex
        gamePlayerStats._drillCapacity = plrData.drillCapacity
        gamePlayerStats._drillFuel = plrData.drillFuel
        gamePlayerStats._drillFuelTankIndex = plrData.drillFuelTankIndex
        if (plrData.equippedToolType === "pickaxe"){
            gamePlayerStats._equipPickaxe()
        }
        else if (plrData.equippedToolType === "drill"){
            gamePlayerStats._equipDrill()
        }
        gamePlayerStats._equipBackpack()
        gamePlayerStats._updateStatToolFuelBar()
        if (gamePlayerStats._grapplingHookIndex > 0){
            let buyGrapplingHookData = gamePlayerStats.getGrapplingHookData(gamePlayerStats.grapplingHookIndex)
            grapplingHookInfo.style.visibility = "visible"
            document.querySelector("#grappling-hook-info-img").setAttribute("src", "Images/PixelArt/" + buyGrapplingHookData[1])
        }

        darknessEffect.maxSize = plrData.darknessEffectMaxSize
        darknessEffect.curSize = plrData.darknessEffectCurSize

        backpack.addItemsFromNames(plrData.backpackItemNames)


        let tileMaps = this.tileMapFromString([worldData.tileMapData, worldData.tileMapVisualData, worldData.tileHealth])
        tileMap._tileMap = tileMaps[0]
        tileMap._visualAbleToDraw = tileMaps[1]
        tileMap._tileHealth = tileMaps[2]

        tileMapRenderer._removeAllTiles()
        tileMapRenderer.renderTiles()

        for (let y = 0; y < tileMap._visualAbleToDraw.length; y++){
            let row = tileMap._visualAbleToDraw[y]

            for (let x = 0; x < row.length; x++){
                let e = row[x]

                if (e !== 1) continue

                tileMapRenderer.updateTileConnection(x, y)

                let tilesAround = tileMap.getTilesAround([x, y])
                tilesAround.forEach(tileAround => {
                    if (tileAround[0] > 0 && tileAround[0] < row.length && tileAround[1] > 0 && tileAround[1] < tileMap._visualAbleToDraw.length){
                        tileMapRenderer.updateTileConnection(tileAround[0], tileAround[1])
                    }
                })
            }
        }

        worldData.liftObjects.forEach(liftObject => {
            let typeId = liftObject.typeId

            if (typeId === 0){
                tileMap.createLift(liftObject.position[0], liftObject.position[1], liftObject.type)
            }
        })
        for (let i = 0; i < 100; i++){
            tileMap.updateLifts()
        }

        playerData._loadExit = true
        playerData.loadPlayerPosition(plrData.playerLeft, plrData.playerTop)
    }
}