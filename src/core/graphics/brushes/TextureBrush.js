

var Brush = require('./Brush'),
    Matrix = require('../../math/Matrix');

/**
 * A Brush that uses a texture for filling or outlining a shape.
 *
 * @class
 * @extends Brush
 * @param texture {Texture} The texture of the brush
 * @param transformMatrix {Matrix} The transformation matrix of the brush
 * @param repeat {bool} Whether the texture should be repeated or not
 * @memberof PIXI
 */
function TextureBrush(texture, transformMatrix, repeat)
{
    Brush.call(this, 0, 1);

    /**
     * @member texture {Texture} The texture of the brush
     */
    this.texture = texture;

    /**
     * @member transformMatrix {Matrix} The transformation matrix of the brush
     */
    this.transformMatrix = transformMatrix || Matrix.IDENTITY;

    /**
     * @member repeat {bool} Whether the texture should be repeated or not
     */
    this.repeat = (repeat === undefined) ? true : repeat;

    /**
     * @member {CanvasPattern} the value that can be assigned to a context.fillStyle of StrokeStyle
     * @private
     */
    this._canvasBrush = null;

}

TextureBrush.prototype = Object.create(Brush.prototype);
TextureBrush.prototype.constructor = TextureBrush;

/**
 * Returns the value that can be assigned to a context.fillStyle of StrokeStyle
 *
 * @return {CanvasPattern}
 */
TextureBrush.prototype.getCanvasBrush = function (context)
{
    if (!this._canvasBrush)
    {
        this._canvasBrush = context.createPattern(this.texture.baseTexture.source, this.repeat ? 'repeat' : 'no-repeat');
    }
    return this._canvasBrush;
};

/**
 * Sets the brush as a fill style for the given canvas context
 *
 * @param context {CanvasRenderingContext2D}
 * @param worldAlpha {number}
 */
TextureBrush.prototype.fillCanvas = function (context, worldAlpha)
{
    if (this.transformMatrix !== Matrix.IDENTITY)
    {
        context.restore();
    }

    context.globalAlpha = this.alpha * worldAlpha;
    context.fillStyle = this.getCanvasBrush(context);
    context.fill();

    if (this.transformMatrix !== Matrix.IDENTITY)
    {
        context.restore();
    }
};


/**
 * Sets the brush as a stroke style for the given canvas context
 *
 * @param context {CanvasRenderingContext2D}
 * @param worldAlpha {number}
 */
TextureBrush.prototype.strokeCanvas = function (context, worldAlpha)
{
    if (this.transformMatrix !== Matrix.IDENTITY)
    {
        context.save();
        context.transform(
            this.transformMatrix.a, this.transformMatrix.b, this.transformMatrix.c,
            this.transformMatrix.d, this.transformMatrix.tx, this.transformMatrix.ty
        );
    }

    context.globalAlpha = this.alpha * worldAlpha;
    context.strokeStyle = this.getCanvasBrush(context);
    context.stroke();

    if (this.transformMatrix !== Matrix.IDENTITY)
    {
        context.restore();
    }
};



module.exports = TextureBrush;