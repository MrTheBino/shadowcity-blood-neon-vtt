export class ShadowCityDialog extends foundry.applications.api.DialogV2 {
    constructor(options = {}) {
        super(options);
    }

    _onRender(context, options) {
        super._onRender(context, options);

        const buttonDifficultyPlus = this.element.querySelector("#button-difficulty-plus");
        if(buttonDifficultyPlus){
            buttonDifficultyPlus.addEventListener("click", event => this._handleButtonDifficultyPlus(event));
        }
        

        const buttonDifficultyMinus = this.element.querySelector("#button-difficulty-minus");
        if(buttonDifficultyMinus){
            buttonDifficultyMinus.addEventListener("click", event => this._handleButtonDifficultyMinus(event));
        }
        
    }

    _handleButtonDifficultyPlus(event) {
        const input = this.element.querySelector("#difficultyInput");
        input.stepUp();
    }

    _handleButtonDifficultyMinus(event) {
        const input = this.element.querySelector("#difficultyInput");
        input.stepDown();
    }
}