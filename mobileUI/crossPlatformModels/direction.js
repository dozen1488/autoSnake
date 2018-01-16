export class Direction {
    constructor(dir = 0, maxDir = 3) {
        this._dir = dir;
        this._maxDIr = maxDir;
    }

    get direction() {
        return this._dir;
    }

    left() {
        this._dir--;
        if (this._dir < 0) {
            this._dir = this._maxDIr;
        }

        return this;
    }

    right() {
        this._dir++;
        if (this._dir > this._maxDIr) {
            this._dir = 0;
        }

        return this;
    }

    getCoordinateDiff() {
        switch (this._dir) {
            case DIRECTIONS.LEFT:
                return {
                    x: -1,
                    y: 0
                };
            case DIRECTIONS.UP:
                return {
                    x: 0,
                    y: 1
                };
            case DIRECTIONS.RIGHT:
                return {
                    x: 1,
                    y: 0
                };
            case DIRECTIONS.DOWN:
                return {
                    x: 0,
                    y: -1
                };
        }
    }
}

export const DIRECTIONS = {
    UP: 1,
    DOWN: 3,
    LEFT: 0,
    RIGHT: 2
};
