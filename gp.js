/**
 * gp.js
 *
 * Author: Wilberto Morales
 * Contact: wilbertomorales777@gmail.com
 * About: A graphing app.
 * License: MIT
 */

// TODO: user can pick padding between grid

// TODO: document
function coordinateFormat(x, y) {

    return {x: x - originX, y: originY - y};
}

/**
 * Adds a new point(Kinetic circle) to the layer
 * at the (x, y) coordinates. The layer is obtional
 * since this function returns the new point
 * you can always add it later using point.addTo(layer). 
 * Just pass in null as the layer.
 * 
 * @param l - layer to add the new point
 * @param x - x co-ordinate
 * @param y - y co-ordinate
 */
function Point(x, y, l) {

    var self = this;
    self.x = x;
    self.y = y;

    // a new Kinetic Circle to visualize
    // the point
    self._point = new Kinetic.Circle({
        x: self.x, y: self.y, 
        radius: 5,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 4
    });

    self.textViz = function() {
        var c = coordinateFormat(self.x, self.y);

        return new Kinetic.Text({x: self.x + 10, y: self.y, 
            text: "(" + c.x + "," + c.y + ")",
            fontSize: 15, fontFamily: 'Monospace', fill: 'black'
        });
    }
    /**
     * Adds the Kinetic Circle object
     * to the layer
     * @param l - the layer to add the circle
     */
    self.addTo = function (l) {
        l.add(self._point);
        l.add(self.textViz());
        l.draw();
    }

    if (l) {
        self.addTo(l);
    }

    return self;
}

/**
* The center point between two points
* @param p1 - point 1
* @param p2 - point 2
* @return - a new Point instance
*/
Point.center = function (p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

/**
 * Returns a point representing the 
 * center in a line
 * @param line - Kinetic.Line instance
 */
Point.lineCenter = function (line) {
    // points elements
    var pointsEls = line.points();
    var nPoints = pointsEls.length;

    // A lines center is is the center between
    // its first and last points
    return Point.center({x: pointsEls[0], y: pointsEls[1]},
                        {x: pointsEls[nPoints - 2], y: pointsEls[nPoints - 1]});


}

/**
 * Draws a grid around the layer. By the end of this
 * method the layer will have w / 10 many lines vetically
 * and h / 10 many lines horizontally. Or is it (w-10) / 10
 * and (h-10) / 10?
 *
 * @param l - the layer
 * @param w - the width to draw up to
 * @param h - the height to draw up to
 * @param p - the space between each line, defaults to 10
 */
function drawGrid(l, w, h, p) {
    /**
     * Draws lines across a layer,
     * If vertical is truthy then the
     * lines will go up down, if not then
     * from left to right
     * @param l - the layer
     * @param limx - how far to draw in the x-axis
     * @param limy - how far to draw in the y-axis
     * @param vertical - draw vertically boolean
     */
    function draw(l, limx, limy, vertical) {
        
        var lim = vertical ? limx : limy;
        lines = [];

        for (var c = 10; c <= lim; c += p || 10) {

            // TODO: obtimize the points creation
            //       points switch and Line creation
            //       to be outside the for loop
            var points = [0, c, limx, c];
            
            if (vertical) {
                points = [c, 0, c, limy];
            }
            
            // a new thin bluish line
            var line = new Kinetic.Line({
                points: points,
                stroke: 'cyan',
                strokeWidth: 1,
            });

            lines.push(line);
            l.add(line);
        }

        // center lines should be red, or atleast
        // one of the the closest center
        var centerLine = lines[parseInt(lines.length / 2)];
        centerLine.setAttr('stroke', 'red');
        centers[vertical ? 'x' : 'y'] = centerLine;
    }

    // the lines at the center
    // of the x axis and y axis
    var centers = {};

    // draw to the layer lines all the way
    // to the height
    draw(l, w, h);

    // draw to the layer lines all the way to the
    // width vertically
    draw(l, w, h, true);

    return centers;
}

var clearButton = document.getElementById("clear-btn");

// width and height of the app. Not constant
// because it can be resized
var w = window.innerWidth, h = window.innerHeight;

// app's width and height
// the canvas w and h plus some padding
var aw = w - 20, ah = h - 20;

var stage = new Kinetic.Stage({
    container: 'container',
    width: w,
    height: h
});

layer = new Kinetic.Layer();

// have to use the html element because
// stage.on event not working tear tear
// TODO: do this with stage.on
stage.getContainer().addEventListener('click', function(e){
    var pos = stage.getPointerPosition();
    var p = new Point(pos.x, pos.y, points);

});

clearButton.addEventListener('click', function(e){
    points.destroyChildren();
    layer.draw();
});

var axisLines = drawGrid(layer, aw, ah, 20);

// TODO: document
var originX = Point.lineCenter(axisLines.x).x;
var originY = Point.lineCenter(axisLines.y).y;

var points = new Kinetic.Group();

layer.add(points);
stage.add(layer);


