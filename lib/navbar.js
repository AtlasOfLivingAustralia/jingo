
var NavBar = {
  menuItemRegExp: /^\[(.+)\]\((.*)\)/,
  submenuHeadingRegExp: /^\s*\*\s#\s+(.+)/,
  submenuItemRegExp: /^\s*\*\s\[(.+)]\((.*)\)/,
  submenuDividerRegExp: /^\s*(\s?-)+/
};

NavBar.isMenuItem = function(line) {
  return NavBar.menuItemRegExp.test(line);
};

NavBar.isSubmenuHeading = function(line) {
  return NavBar.submenuHeadingRegExp.test(line);
};

NavBar.isSubmenuItem = function(line) {
  return NavBar.submenuItemRegExp.test(line);
};

NavBar.isSubmenuDivider= function(line) {
  return NavBar.submenuDividerRegExp.test(line);
};

module.exports = NavBar;