const Ws = function (address, startConnect = true) {

    /**
     * 初始化配置
     *
     */
    this.ws = null;
    this.address = address;
    this.event = {};
    this.lastActiveTime = 0;
    this.heartCheckTimer = null;
    this.forcePing = true;
    this.pingData = '{"type":"ping"}';
    this.pingInterval = 30000;
    this.reconnectTimer = 1000;

    var _this = this;

    /**
     * 创建连接
     *
     * @returns {WebSocket}
     */
    this.createConnect = function () {
        var ws = new WebSocket(_this.address);
        ws.onopen = function () {
            _this.lastActiveTime = _this.timestamp();
            _this.startHeartCheck();
            _this.trigger('onopen', arguments);
        };
        ws.onclose = function () {
            _this.stopHeartCheck();
            _this.trigger('onclose', arguments);
        };
        ws.onerror = function () {
            _this.stopHeartCheck();
            _this.trigger('onerror', arguments);
        };
        ws.onmessage = function (event) {
            _this.lastActiveTime = _this.timestamp();
            if (_this.pingData !== event.data) {
                _this.trigger('onmessage', arguments);
            }
        };

        _this.ws = ws;
        return ws;
    };

    /**
     * 销毁连接
     *
     */
    this.destroyConnect = function () {
        _this.stopHeartCheck();
        _this.event = {};

        if (_this.ws) {
            _this.ws.onopen = null;
            _this.ws.onclose = null;
            _this.ws.onerror = null;
            _this.ws.onmessage = null;
            _this.ws.close();
        }
    };

    /**
     * 获取当前时间戳
     *
     * @returns {number}
     */
    this.timestamp = function () {
        return Date.parse(new Date()) / 1000;
    };

    /**
     * 注册连接打开事件
     *
     * @param fn
     */
    this.onOpen = function (fn) {
        _this.addEvent('onopen', fn);
    };

    /**
     * 删除连接打开事件监听
     *
     * @param fn
     */
    this.unBindOpen = function (fn) {
        _this.delEvent('onopen', fn)
    };

    /**
     * 注册连接关闭事件
     *
     * @param fn
     */
    this.onClose = function (fn) {
        _this.addEvent('onclose', fn);
    };

    /**
     * 删除连接关闭事件监听
     *
     * @param fn
     */
    this.unBindClose = function (fn) {
        _this.delEvent('onclose', fn);
    };

    /**
     * 注册连接出错事件
     *
     * @param fn
     */
    this.onError = function (fn) {
        _this.addEvent('onerror', fn);
    };

    /**
     * 删除错误事件
     *
     * @param fn
     */
    this.unBindError = function (fn) {
        _this.delEvent('onerror', fn);
    };

    /**
     * 注册收到消息事件
     *
     * @param fn
     */
    this.onMessage = function (fn) {
        _this.addEvent('onmessage', fn)
    };

    /**
     * 删除
     *
     * @param fn
     */
    this.unBindMessage = function (fn) {
        _this.delEvent('onmessage', fn)
    };

    /**
     * 添加事件处理函数
     *
     * @param type
     * @param fn
     */
    this.addEvent = function (type, fn) {
        if (_this.event[type]) {
            _this.event[type].push(fn);
        } else {
            _this.event[type] = [fn];
        }
    };

    /**
     * 删除事件处理函数
     *
     * @param type
     * @param fn
     */
    this.delEvent = function (type, fn) {
        if (_this.event[type] !== undefined && _this.event[type].length > 0) {
            for (var i = 0; i < _this.event[type].length; i++) {
                if (_this.event[type][i] === fn) {
                    _this.event[type].splice(i, 1);
                }
            }
        }
    };

    /**
     * 触发事件
     *
     * @param type
     * @param args
     */
    this.trigger = function (type, args) {
        if (_this.event[type]) {
            for (let i = 0; _this.event[type] && i < _this.event[type].length; i++) {
                if (_this.event[type][i]) {
                    _this.event[type][i].apply(_this, args);
                }
            }
        }
    };

    /**
     * 当连接出错时
     *
     */
    this.onError(function (e) {
        _this.ws.close();
    });

    /**
     * 当连接关闭时
     *
     */
    this.onClose(function () {
        setTimeout(function () {
            _this.reconnect();
        }, _this.reconnectTimer);
    });

    /**
     * 断线重连机制
     *
     */
    this.reconnect = function () {
        _this.ws = this.createConnect();
    };

    /**
     * 开始定时发送心跳包
     *
     */
    this.startHeartCheck = function () {
        _this.heartCheckTimer = setInterval(function () {
            if (_this.forcePing || _this.lastActiveTime < _this.timestamp() - _this.pingInterval) {
                _this.ws.send(_this.pingData);
            }
        }, _this.pingInterval);
    };

    /**
     * 停止心跳包
     *
     */
    this.stopHeartCheck = function () {
        clearInterval(_this.heartCheckTimer);
    };

    /**
     * 发送数据
     *
     * @param message
     */
    this.send = function (message) {
        if (_this.isConnect()) {
            _this.ws.send(message);
        }
    };

    /**
     * 是否已经连接
     *
     * @returns {boolean}
     */
    this.isConnect = function () {
        return _this.ws !== null && _this.ws.readyState === 1;
    };

    /**
     * 开始连接
     *
     * @type {WebSocket}
     */
    if (startConnect) {
        this.ws = this.createConnect(this.address);
    }
};

export default Ws;
