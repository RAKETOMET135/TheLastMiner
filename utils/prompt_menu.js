const inventoryElement = document.querySelector("#inventory")
const inventoryHintElement = document.querySelector("#inventory-hint")

export class PromptMenu{
    constructor(){
        this._prompt = document.querySelector("#prompt")
        this._execMethod = NaN
    }

    setConfirmExecMethod(confirmExecMethod){
        this._execMethod = confirmExecMethod
    }

    setContent(promptHeader, promptMessage){
        const promptHeaderText = document.querySelector("#prompt-header")
        const promptMsgText = document.querySelector("#prompt-msg")

        promptHeaderText.innerText = promptHeader
        promptMsgText.innerText = promptMessage
    }

    handleConfirm(){
        if (!this.isActive()) return

        this._execMethod()
        this.setActive(false)
        inventoryHintElement.style.visibility = "visible"
    }

    isActive(){
        if (this._prompt.style.visibility === "visible"){
            return true
        }

        return false
    }

    setActive(state){
        if (state){
            this._prompt.style.visibility = "visible"
            inventoryElement.style.visibility = "hidden"
            inventoryHintElement.style.visibility = "hidden"
        }
        else{
            this._prompt.style.visibility = "hidden"
        }
    }
}