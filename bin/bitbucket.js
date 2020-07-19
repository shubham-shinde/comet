"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPR = void 0;

var _bitbucket = require("bitbucket");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createPR = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var workspace, repo_slug, username, password, originBranch, destinationBranch, clientOptions, bitbucket, body, _yield$bitbucket$repo, data, headers;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            workspace = _ref.workspace, repo_slug = _ref.repo_slug, username = _ref.username, password = _ref.password, originBranch = _ref.originBranch, destinationBranch = _ref.destinationBranch;
            _context.prev = 1;
            clientOptions = {
              auth: {
                username: username,
                password: password
              }
            };
            bitbucket = new _bitbucket.Bitbucket(clientOptions);
            body = {
              title: "master to staging",
              source: {
                branch: {
                  name: originBranch
                }
              },
              destination: {
                branch: {
                  name: destinationBranch
                }
              }
            };
            _context.next = 7;
            return bitbucket.repositories.createPullRequest({
              _body: body,
              repo_slug: repo_slug,
              workspace: workspace
            });

          case 7:
            _yield$bitbucket$repo = _context.sent;
            data = _yield$bitbucket$repo.data;
            headers = _yield$bitbucket$repo.headers;
            console.log(data);
            return _context.abrupt("return", {
              id: data.id,
              url: data.links.html.href
            });

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](1);
            console.log("bitbucket error", _context.t0.error);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 14]]);
  }));

  return function createPR(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.createPR = createPR;