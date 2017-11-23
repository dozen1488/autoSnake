import _ from 'lodash';

export default class Snake {
    constructor(startPoint) {
        this._direction = new Direction();
        this._tail = [];
        this._tail.push(startPoint);
    }

    get tail() {
        return this._tail;
    }

    move(withIncrement) {
        const direction = this._getDirection();
        switch (direction) {
            case -1:
                this.direction.left();
                break;
            case 1:
                this.direction.right();
                break;
        }

        const diff = this._direction.getCoordinateDiff();
        const head = _.clone(_.head(this._tail));
        head.x += diff.x;
        head.y += diff.y;
        this._tail.unshift(head);
        
        let deleted;
        if (!withIncrement) {
            deleted = this._tail.pop();
        }

        return (deleted) ? {head, deleted} : {head};
    }

    _getDirection() {
        return 0;
    }
}

class Direction {
    constructor(dir = 0, maxDir = 3) {
        this._dir = dir;
        this._maxDIr = maxDir;
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
            case 0:
                return {
                    x: -1,
                    y: 0
                };
            case 1:
                return {
                    x: 0,
                    y: 1
                };
            case 2:
                return {
                    x: 1,
                    y: 0
                };
            case 3:
                return {
                    x: 0,
                    y: -1
                };
        }
    }
}