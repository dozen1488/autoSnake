export class Direction {
    constructor(dir = 0, maxDir = 3) {
        this._dir = dir;
        this._maxDIr = maxDir;
    }

    get direction() {
        return this._dir;
    }

    up() {
        if (this._dir !== DIRECTIONS.DOWN) {
            this._dir = DIRECTIONS.UP;
        }

        return this;
    }

    down() {
        if (this._dir !== DIRECTIONS.UP) {
            this._dir = DIRECTIONS.DOWN;
        }

        return this;
    }

    left() {
        if (this._dir !== DIRECTIONS.RIGHT) {
            this._dir = DIRECTIONS.LEFT;
        }

        return this;
    }

    right() {
        if (this._dir !== DIRECTIONS.LEFT) {
            this._dir = DIRECTIONS.RIGHT;
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

export const TURNS = DIRECTIONS;
