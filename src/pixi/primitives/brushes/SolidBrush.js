/**
 * A Simple single-color brush.
 *
 * @class
 * @extends Brush
 * @param color {Number} The color of the brush
 * @param alpha {Number} The alpha of the brush
 * @memberof PIXI
 */
PIXI.SolidBrush = function (color, alpha)
{
    PIXI.Brush.call(this, color, alpha);

    /**
     * @member {String} the value that can be assigned to a context.fillStyle of StrokeStyle
     * @private
     */
    this._canvasBrush = null;
};

PIXI.SolidBrush.prototype = Object.create(PIXI.Brush.prototype);
PIXI.SolidBrush.prototype.constructor = PIXI.SolidBrush;

Object.defineProperties(PIXI.SolidBrush.prototype, {
    tint: {
        set: function (value)
        {
            this._canvasBrush = '#' + ('00000' + (value | 0).toString(16)).substr(-6);
        }
    }
});

/**
 * Sets the brush as a fill style for the given canvas context
 *
 * @param context {CanvasRenderingContext2D}
 * @param worldAlpha {number}
 */
PIXI.SolidBrush.prototype.fillCanvas = function (context, worldAlpha) {
    context.globalAlpha = this.alpha * worldAlpha;
    context.fillStyle = this._canvasBrush;
    context.fill();
};


/**
 * Sets the brush as a stroke style for the given canvas context
 *
 * @param context {CanvasRenderingContext2D}
 * @param worldAlpha {number}
 */
PIXI.SolidBrush.prototype.strokeCanvas = function (context, worldAlpha) {
    context.globalAlpha = this.alpha * worldAlpha;
    context.strokeStyle = this._canvasBrush;
    context.stroke();
};