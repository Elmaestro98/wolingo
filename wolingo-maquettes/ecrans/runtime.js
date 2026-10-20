/* Wolingo — mini moteur de rendu des maquettes (aucune dépendance).
   Lit le gabarit <template id="tpl">, remplace les {{valeurs}}, gère <sc-if>, <sc-for>
   et les événements (onClick, onChange), puis redessine à chaque setState(). */
(function () {
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  var ANY = /\{\{\s*([^}]+?)\s*\}\}/g;
  var BOOL = ['checked', 'disabled', 'selected', 'hidden', 'readonly', 'required'];
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) {
    var p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = Object.assign({}, this.state, p);
    WL.render();
  };
  DCLogic.prototype.forceUpdate = function () { WL.render(); };
  window.DCLogic = DCLogic;

  function literal(p) {
    if (p === 'true') return true;
    if (p === 'false') return false;
    if (p === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(p)) return +p;
    if (/^'.*'$|^".*"$/.test(p)) return p.slice(1, -1);
    return undefined;
  }

  function lookup(path, scopes) {
    var l = literal(path);
    if (l !== undefined) return l;
    var parts = path.split('.');
    var v, found = false;
    for (var i = scopes.length - 1; i >= 0; i--) {
      if (scopes[i] && parts[0] in scopes[i]) { v = scopes[i][parts[0]]; found = true; break; }
    }
    if (!found) return undefined;
    for (var k = 1; k < parts.length; k++) { if (v == null) return undefined; v = v[parts[k]]; }
    return v;
  }

  function interp(str, scopes) {
    return str.replace(ANY, function (m, p) { var v = lookup(p, scopes); return v == null ? '' : String(v); });
  }

  function proc(node, scopes, out) {
    if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.nodeValue, scopes))); return; }
    if (node.nodeType !== 1) return;
    var tag = node.tagName.toLowerCase();

    if (tag === 'sc-if') {
      var mi = (node.getAttribute('value') || '').match(WHOLE);
      if (mi && lookup(mi[1], scopes)) node.childNodes.forEach(function (c) { proc(c, scopes, out); });
      return;
    }
    if (tag === 'sc-for') {
      var mf = (node.getAttribute('list') || '').match(WHOLE);
      var list = (mf && lookup(mf[1], scopes)) || [];
      var as = node.getAttribute('as') || 'item';
      list.forEach(function (it, idx) {
        var s = { $index: idx }; s[as] = it;
        var sc = scopes.concat([s]);
        node.childNodes.forEach(function (c) { proc(c, sc, out); });
      });
      return;
    }

    var el = node.namespaceURI === SVG_NS ? document.createElementNS(SVG_NS, node.tagName) : document.createElement(node.tagName);
    Array.prototype.forEach.call(node.attributes, function (a) {
      var name = a.name, val = a.value, low = name.toLowerCase();
      if (low.indexOf('hint-') === 0) return;
      var m = val.match(WHOLE);
      if (/^on[a-z]+$/.test(low)) {
        if (m) {
          var fn = lookup(m[1], scopes);
          if (typeof fn === 'function') el.addEventListener(low.slice(2), function (e) { fn(e); });
        }
        return;
      }
      if (m) {
        var v = lookup(m[1], scopes);
        if (BOOL.indexOf(low) >= 0) { if (v) el.setAttribute(name, ''); el[low] = !!v; return; }
        if (v == null || v === false) return;
        el.setAttribute(name, String(v));
        return;
      }
      el.setAttribute(name, interp(val, scopes));
    });
    node.childNodes.forEach(function (c) { proc(c, scopes, el); });
    out.appendChild(el);
  }

  var WL = {
    inst: null,
    mount: function (Comp, props) {
      WL.inst = new Comp(props || {});
      WL.render();
      if (typeof WL.inst.componentDidMount === 'function') WL.inst.componentDidMount();
    },
    render: function () {
      if (!WL.inst) return;
      var vals = typeof WL.inst.renderVals === 'function' ? WL.inst.renderVals() : {};
      var tpl = document.getElementById('tpl').content;
      var frag = document.createDocumentFragment();
      tpl.childNodes.forEach(function (c) { proc(c, [vals], frag); });
      document.getElementById('app').replaceChildren(frag);
    }
  };
  window.WL = WL;
})();
