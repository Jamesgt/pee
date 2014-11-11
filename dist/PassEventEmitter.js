(function() {
  var EventEmitter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  EventEmitter = require('events').EventEmitter;

  exports.PassEventEmitter = (function(_super) {
    __extends(PassEventEmitter, _super);

    PassEventEmitter._PassEventEmitter_routes = {};

    function PassEventEmitter() {
      var name, routes, targets;
      PassEventEmitter.__super__.constructor.call(this);
      routes = PassEventEmitter._PassEventEmitter_routes[this.constructor];
      if (routes) {
        for (name in routes) {
          if (!__hasProp.call(routes, name)) continue;
          targets = routes[name];
          PassEventEmitter._PassEventEmitter_doPass({
            func: (function(_this) {
              return function(name, target) {
                return _this.on(name, function(e) {
                  return target.emit(name, e);
                });
              };
            })(this)
          }, name, targets);
        }
      }
    }

    PassEventEmitter.prototype.emit = function(event, data) {
      PassEventEmitter.__super__.emit.call(this, event, data);
      return typeof PassEventEmitter.postEmitHook === "function" ? PassEventEmitter.postEmitHook(this.constructor, event, data) : void 0;
    };

    PassEventEmitter.prototype.emitLater = function() {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!(args.length < 2)) {
        args.unshift(null);
      }
      return setTimeout(((function(_this) {
        return function() {
          return _this.emit(name, args[0]);
        };
      })(this)), args[1]);
    };

    PassEventEmitter.prototype.emitEvery = function() {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!(args.length < 2)) {
        args.unshift(null);
      }
      return setInterval(((function(_this) {
        return function() {
          return _this.emit(name, args[0]);
        };
      })(this)), args[1]);
    };

    PassEventEmitter.prototype.pass = function() {
      var name, names, t, targets;
      names = arguments[0], targets = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (names === Object(names) && !Array.isArray(names)) {
        for (name in names) {
          if (!__hasProp.call(names, name)) continue;
          t = names[name];
          this.pass(name, t);
        }
        return;
      }
      PassEventEmitter._PassEventEmitter_doPass({
        func: (function(_this) {
          return function(name, target) {
            return _this.on(name, function(e) {
              return target.emit(name, e);
            });
          };
        })(this)
      }, names, targets);
    };

    PassEventEmitter._PassEventEmitter_doPass = function(action, names, targets) {
      var args, name, t, target, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      if (targets.length === 0) {
        return;
      }
      args = {
        names: names,
        targets: []
      };
      if (!Array.isArray(names)) {
        args.names = names.split(/\s|,/g);
      }
      for (_i = 0, _len = targets.length; _i < _len; _i++) {
        t = targets[_i];
        args.targets = args.targets.concat(t);
      }
      _ref = args.names;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        name = _ref[_j];
        if (name !== '') {
          _ref1 = args.targets;
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            target = _ref1[_k];
            if ((target != null ? target.on : void 0) != null) {
              (function(_this) {
                return (function(name, target) {
                  return action.func(name, target, action.meta);
                });
              })(this)(name, target);
            }
          }
        }
      }
    };

    PassEventEmitter.pass = function() {
      var names, sourceType, targets;
      sourceType = arguments[0], names = arguments[1], targets = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return PassEventEmitter._PassEventEmitter_doPass({
        func: (function(_this) {
          return function(name, target, sourceType) {
            var _base, _base1;
            if ((_base = PassEventEmitter._PassEventEmitter_routes)[sourceType] == null) {
              _base[sourceType] = {};
            }
            if ((_base1 = PassEventEmitter._PassEventEmitter_routes[sourceType])[name] == null) {
              _base1[name] = [];
            }
            return PassEventEmitter._PassEventEmitter_routes[sourceType][name].push(target);
          };
        })(this),
        meta: sourceType
      }, names, targets);
    };

    PassEventEmitter.removeAllRoutes = function() {
      return PassEventEmitter._PassEventEmitter_routes = {};
    };

    return PassEventEmitter;

  })(EventEmitter);

}).call(this);
